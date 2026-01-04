import { Injectable } from '@nestjs/common';
import { readFile, writeFile } from 'fs/promises';
import {
  PDFCheckBox,
  PDFDocument,
  PDFTextField,
} from 'pdf-lib';

// Data type representing the fillExamplePdf input (from lines 75-105)
export type AcroformPdfFillData = {
  monatJahr: string;
  nameVorname: string;
  strasseHausnummer: string;
  plzOrt: string;
  kundenNummer: string;
  massnahmenummer: string;
  massnahmebezeichnung: string;
  begruendung: string;
  datum1: string;
  days: { day: number; value: string }[];
  trotzErreicht: boolean;
  aufgrundNichtErreicht: boolean;
  tagenseitTeilnahmebeginnvoraussichtlnocherreicht: number;
  tagenseitTeilnahmebeginnvoraussichtlnichtmehrerreicht: number;

  wiederholungOption0: boolean;
  wiederholungOption1: boolean;
  wiederholungAbDatum: string;
  beendigungAbDatum: string;
};

@Injectable()
export class AcroformPdfEditorService {
  /**
   * Fill the AA_Abwesenheitsmeldung_Vorlage.pdf (AcroForm/XFA-hybrid) and write a generated PDF.
   * Adjust the `data` object or pass it in from your controller/service layer as needed.
   * 
   * Seite 2 (page 2) is ignored in this version!
   */
  async fillAbsenceNotificationPdf(data: AcroformPdfFillData) {
    const templatePath =
      'projects/absences-notification/notification-process/src/assets/AA_Abwesenheitsmeldung_Vorlage.pdf';

    const templateBytes = await readFile(templatePath);
    const pdfDoc = await PDFDocument.load(templateBytes);
    const form = pdfDoc.getForm();

    // Optional: print field names once for debugging
    // console.log('Fields:');
    // for (const f of form.getFields()) console.log(' -', f.getName());

    // -------------------------
    // Helpers
    // -------------------------
    const dayFieldName = (day: number) =>
      `SGBIII-BescheinigungFehlzeitenfuerMonat-Jahr[0].Seite1[0].Teilformular-Monatsleiste[0].Tabelle-Monatsleiste[0].Zeile1-Monat[0].Tag-${day}[0]`;

    // Use 'any' for value type to fix missing PdfValue type error
    const setField = (name: string, value: any) => {
      if (value === undefined || value === null) return;

      const field = form.getField(name);

      // Text fields
      if (field instanceof PDFTextField) {
        field.setText(String(value));
        return;
      }

      // Checkboxes
      if (field instanceof PDFCheckBox) {
        const boolVal =
          typeof value === 'boolean'
            ? value
            : ['1', 'true', 'yes', 'on', 'checked', 'x'].includes(
                String(value).toLowerCase().trim(),
              );

        if (boolVal) field.check();
        else field.uncheck();
        return;
      }

      // If you later discover dropdown/radio fields, you can extend here.
      // Example:
      // if (field instanceof PDFDropdown) { field.select(String(value)); return; }
      // if (field instanceof PDFRadioGroup) { field.select(String(value)); return; }

      throw new Error(
        `Unsupported field type for "${name}": ${field?.constructor?.name}`,
      );
    };

    // -------------------------
    // Fill Page 1 (exact field names from your list)
    // -------------------------
    setField(
      'SGBIII-BescheinigungFehlzeitenfuerMonat-Jahr[0].Seite1[0].MonatJahr[0]',
      data.monatJahr,
    );

    setField(
      'SGBIII-BescheinigungFehlzeitenfuerMonat-Jahr[0].Seite1[0].NameVorname[0]',
      data.nameVorname,
    );

    setField(
      'SGBIII-BescheinigungFehlzeitenfuerMonat-Jahr[0].Seite1[0].StrasseHausnummer[0]',
      data.strasseHausnummer,
    );

    setField(
      'SGBIII-BescheinigungFehlzeitenfuerMonat-Jahr[0].Seite1[0].PLZOrt[0]',
      data.plzOrt,
    );

    setField(
      'SGBIII-BescheinigungFehlzeitenfuerMonat-Jahr[0].Seite1[0].Kunden-Nummer[0]',
      data.kundenNummer,
    );

    setField(
      'SGBIII-BescheinigungFehlzeitenfuerMonat-Jahr[0].Seite1[0].Maßnahmenummer[0]',
      data.massnahmenummer,
    );

    setField(
      'SGBIII-BescheinigungFehlzeitenfuerMonat-Jahr[0].Seite1[0].Maßnahmebezeichnung[0]',
      data.massnahmebezeichnung,
    );

    setField(
      'SGBIII-BescheinigungFehlzeitenfuerMonat-Jahr[0].Seite1[0].Teilformular-Fehlzeiten[0].Begruendung[0]',
      data.begruendung,
    );

    // Days 1..31 (only set provided ones)
    for (const absencesInDays of data.days) {
      const day = absencesInDays.day;
      if (!Number.isFinite(day) || day < 1 || day > 31) continue;
      setField(dayFieldName(day), absencesInDays.value as any);
    }

    // Stellungnahme: trotz/aufgrund group (usually pick one) checkbox
    //trotzaufgrundbisherigerFehltage 0:: trotz der bisherigen Fehltage von insgesamt
    setField(
      'SGBIII-BescheinigungFehlzeitenfuerMonat-Jahr[0].Seite1[0].Teilformular-Stellungnahme[0].trotzaufgrundbisherigerFehltage[0]',
      data.trotzErreicht,
    );
    //trotzaufgrundbisherigerFehltage 1:: aufgrund der bisherigen Fehltage checkbox
    setField(
      'SGBIII-BescheinigungFehlzeitenfuerMonat-Jahr[0].Seite1[0].Teilformular-Stellungnahme[0].trotzaufgrundbisherigerFehltage[1]',
      data.aufgrundNichtErreicht,
    );

    // TagenseitTeilnahmebeginnvoraussichtlnocherreicht 0:: number
    setField(
      'SGBIII-BescheinigungFehlzeitenfuerMonat-Jahr[0].Seite1[0].Teilformular-Stellungnahme[0].TagenseitTeilnahmebeginnvoraussichtlnocherreicht[0]',
      data.tagenseitTeilnahmebeginnvoraussichtlnocherreicht,
    );
    // TagenseitTeilnahmebeginnvoraussichtlnichtmehrerreicht 0:: number
    setField(
      'SGBIII-BescheinigungFehlzeitenfuerMonat-Jahr[0].Seite1[0].Teilformular-Stellungnahme[0].TagenseitTeilnahmebeginnvoraussichtlnichtmehrerreicht[0]',
      data.tagenseitTeilnahmebeginnvoraussichtlnichtmehrerreicht,
    );

    // Wiederholung / Beendigung (checkboxes + dates)
    setField(
      'SGBIII-BescheinigungFehlzeitenfuerMonat-Jahr[0].Seite1[0].Teilformular-Stellungnahme[0].WiederholungMassnahmeteilBegruendung[0]',
      data.wiederholungOption0,
    );
    setField(
      'SGBIII-BescheinigungFehlzeitenfuerMonat-Jahr[0].Seite1[0].Teilformular-Stellungnahme[0].WiederholungMassnahmeabDatum[0]',
      data.wiederholungAbDatum,
    );

    setField(
      'SGBIII-BescheinigungFehlzeitenfuerMonat-Jahr[0].Seite1[0].Teilformular-Stellungnahme[0].WiederholungMassnahmeteilBegruendung[1]',
      data.wiederholungOption1,
    );
    setField(
      'SGBIII-BescheinigungFehlzeitenfuerMonat-Jahr[0].Seite1[0].Teilformular-Stellungnahme[0].BeendigungMassnahmeabDatum[0]',
      data.beendigungAbDatum,
    );

    setField(
      'SGBIII-BescheinigungFehlzeitenfuerMonat-Jahr[0].Seite1[0].Datum-1[0]',
      data.datum1,
    );

    // ----- Seite 2 (page 2) is NOT filled in this version -----

    // Make sure values render in most viewers
    form.updateFieldAppearances();

    // Optional: flatten to make it non-editable
    // form.flatten();

    const outBytes = await pdfDoc.save();

    // Save output (adjust path as desired)
    await writeFile('filled.pdf', outBytes);
  }
}
