import { Injectable } from '@nestjs/common';
import { AcroformPdfEditorService, AcroformPdfFillData } from '@velptec/acroform-pdf-editor';
import { ZohoInternalConnectorService } from '@velptec/zoho-connector';
import {
  Absence,
  Deal,
  ContactRole,
  AbsenceNotification,
  AbsenceNotificationStatus,
  Contact,
} from '@velptec/zoho-types';

type DealAbsenceSummary = {
  deal: Deal;
  absences: Absence[] | null;
  absenceNotification: AbsenceNotification | null;
};
@Injectable()
export class AppService {
  constructor(
    private readonly zohoConnectionService: ZohoInternalConnectorService,
    private readonly acroformService: AcroformPdfEditorService
  ) {}

  async getDeals(absences: Absence[]) {
    // Get the deals from the absencesByDealId
    // TO check what is the limit of the ids in the params
    const deals = await this.zohoConnectionService.get<Deal>({
      module: 'Deals',
      params: {
        ids: absences.map((absence) => absence.deal?.id!).join(','),
        fields: ['id', 'startDate', 'endDate', 'Contact_Name', 'Ma_nahmenummer1'],
      },
    });
    // console.log('deals:::::',absences.map((absence) => absence.deal?.id!), 'absences2',  deals);
    return deals;
  }

  getLastDayOfXMonthsAgo(numberOfMonths: number): Date {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() - numberOfMonths + 1;
    const lastDay = new Date(year, month, 0);
    return lastDay;
  }

  getFirstDayOfXMonthsAgo(numberOfMonths: number): Date {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() - numberOfMonths;
    // We want the time to reflect Berlin time as closely as possible,
    // so calculate the UTC value for local time at midnight in Berlin.
    const berlinOffsetMinutes = -new Date(Date.UTC(year, month, 1)).getTimezoneOffset();
    const firstDay = new Date(Date.UTC(year, month, 1, 0, berlinOffsetMinutes));
    return firstDay;
  }

  /**
   * Fetch relevent absences for the current perios
   */
  async getRelevantAbsences(
    startDateString: string,
    endDateString: string
  ) {
    console.log('startDateString', startDateString, 'endDateString', endDateString);
    const absences = await this.zohoConnectionService.search<Absence>({
      module: 'absences',
      params: {
        criteria: `(end_date:between:${startDateString},${endDateString})or(start_date:between:${startDateString},${endDateString})`,
      },
    });
    console.log('absences::criteria', `(end_date:between:${startDateString},${endDateString})or(start_date:between:${startDateString},${endDateString})`);
    return this.removeDuplicateAbsences(absences);
  }

  /**
   * Removes duplicate absences that share the same start and end date.
   * TODO: make it more robust, and check if it is working as expected
   * & Create tests for it
   */
  removeDuplicateAbsences(absences: Absence[]): Absence[] {
    return absences.filter(
      (absence, index, self) =>
        index ===
        self.findIndex(
          (element) =>
            element.deal &&
            absence.deal &&
            element.deal.id === absence.deal.id &&
            element.start_date === absence.start_date &&
            element.end_date === absence.end_date
        )
    );
  }

  /**
   * TODO: this function is really costly as it traverses all deals one by one,
   * okay for now, but should find a better place to put the BA responsible
   */
  async getDealResponsibleId(dealId: string): Promise<string | null> {
    //Need to make sure there is no other way to get the decision maker, because this is very costly and should be avoided
    // Get contact roles for the deal
    const contactsWithRoles = await this.zohoConnectionService.related<
      Deal,
      ContactRole
    >({
      module: 'Deals',
      id: dealId,
      relatedModule: 'Contact_Roles',
      params: { fields: ['id', 'Contact_Role', 'Email'] },
    });

    // console.log(contactsWithRoles, 'contactsWithRoles');
    // Find the decision maker role and get its id
    const decisionMakerRole = contactsWithRoles.find(
      (role) => role.Contact_Role?.name === 'Decision Maker'
    );

    if (!decisionMakerRole) return null;
    return decisionMakerRole.id;
  }

  /**
   * Links absences list to the correspondingabsence notification
   */
  async linkAbsencesToAbsenceNotification(
    absenceNotificationId: string,
    absences: Absence[]
  ): Promise<void> {
    if (absences.length === 0) return;
    const res = await this.zohoConnectionService.update<AbsenceNotification>({
      module: 'Absence_Notifications',
      data: [
        {
          id: absenceNotificationId,
          Absences: absences.map((absence) => ({
            Absences: { id: absence.id },
          })),
        },
      ],
    });
    // console.log(res, 'res of update');
  }

  async createAbsenceNotification(
    dealId: string,
    responsibleContactId: string,
    startDate: Date,
    endDate: Date
  ): Promise<string> {
    // Build the absence notification payload
    const data = {
      Name: `Absence Notification for ${dealId}`,
      deal: { id: dealId },
      Start_Date: startDate.toISOString().split('T')[0],
      End_Date: endDate.toISOString().split('T')[0],
      BA_Responsible: responsibleContactId,
      status: AbsenceNotificationStatus.CREATED,
    };

    // Create the absence notification in Zoho and return its ID
    const response =
      await this.zohoConnectionService.create<AbsenceNotification>({
        module: 'Absence_Notifications',
        data: [data],
      });
    // console.log(response, 'response of create');
    return response?.[0]?.details.id;
  }

  async updateAbsenceNotification(
    absenceNotificationId: string,
    updateFields: Partial<AbsenceNotification>
  ): Promise<void> {
    // console.log('updateFields  updateAbsenceNotification', updateFields);
    await this.zohoConnectionService.update<AbsenceNotification>({
      module: 'Absence_Notifications',
      data: [
        {
          id: absenceNotificationId,
          ...updateFields,
        },
      ],
    });
  }

  async getLastestAbsenceNotificationsForEachDeal(
    deals: Deal[]
  ): Promise<AbsenceNotification[]> {
    return this.zohoConnectionService.search<AbsenceNotification>({
      module: 'Absence_Notifications',
      params: {
        criteria: `(deal:in:${deals
          .map((deal) => deal.id)
          .join(',')})and(End_Date:greater_equal:${this.getLastDayOfXMonthsAgo(
          2
        ).toISOString().split('T')[0]})and(End_Date:less_than:${this.getFirstDayOfXMonthsAgo(1).toISOString().split('T')[0]})`,
      },
    });
  }


  //TODO: this is not working as expected, need to fix it
  //it should only count active days, and only of the current month
  getNumberOfDays(absences: Absence[], periodStartDate: Date, periodEndDate: Date): number {
    return absences.reduce((total, absence) => {
      if (absence.start_date && absence.end_date) {
        // X date is assumed to be the first day of the current month:
        const start = new Date(
          Math.max(new Date(absence.start_date).getTime(), periodStartDate.getTime())
        );
        const end = new Date(
          Math.min(new Date(absence.end_date).getTime(), periodEndDate.getTime())
        );
        console.log('start', start, 'end', end);
        const days =
          Math.floor(
            (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
          ) + 1;
        // console.log('days', days);
        return total + (days > 0 ? days : 0);
      }
      return total;
    }, 0);
  }

  mapDealsToAbsencesAndPreviousNotification(
    deals: Deal[],
    absences: Absence[],
    absenceNotifications: AbsenceNotification[]
  ): DealAbsenceSummary[] {
    return deals.map((deal) => ({
      deal,
      absences: absences.filter(
        (absence: Absence) => absence.deal && absence.deal.id === deal.id
      ),
      absenceNotification:
        absenceNotifications.find(
          (notif: AbsenceNotification) =>
            notif.deal && notif.deal.id === deal.id
        ) || null,
    }));
  }

  /**
   * Handles the creation, linking, and updating of absence notifications for a deal.
   */
  async handleDealAbsenceNotificationGeneration(
    dealWithAbsences: DealAbsenceSummary,
    periodStartDate: Date,
    periodEndDate: Date,
  ): Promise<void> {
    const deal = dealWithAbsences.deal;
    const absences = dealWithAbsences.absences;
    const latestAbsenceNotification = dealWithAbsences.absenceNotification;

    // Get the decision maker for this deal (this is the BA responsible)
    const dealResponsibleContactId = await this.getDealResponsibleId(deal.id);

    // If no absences, there nothing to do
    if (!absences) {
      console.log(`Deal ${deal.id} has no absences`);
    }
    // If no Deal Responsible, notify support
    else if (!dealResponsibleContactId) {
      console.log(`Deal ${deal.id} has no decision Maker`);
    } else {
      // Create the absence notification and get its record ID
      const absenceNotificationRecordId = await this.createAbsenceNotification(
        deal.id,
        dealResponsibleContactId,
        periodStartDate,
        periodEndDate,
      );
      console.log('Created AbsenceNotification with ID:', absenceNotificationRecordId, 'for deal:', deal.id, 'and BA:', dealResponsibleContactId);

      // Link absences to the created notification
      await this.linkAbsencesToAbsenceNotification(
        absenceNotificationRecordId,
        absences
      );
      console.log('Linked absences:', absences.map(a => a.id), 'to AbsenceNotification:', absenceNotificationRecordId);

      // Update the absence notification with counts and status
      const periodAbsencesCount = this.getNumberOfDays(absences, periodStartDate, periodEndDate);
      const previousTotal = latestAbsenceNotification?.Total_Absences_Count_in_days || 0;
      const totalAbsences = periodAbsencesCount + previousTotal;

      await this.updateAbsenceNotification(absenceNotificationRecordId, {
        Period_Absences_count_in_days: periodAbsencesCount,
        Total_Absences_Count_in_days: totalAbsences,
        Status: AbsenceNotificationStatus.LINKED_WITH_Absences,
      });
      
      const contact = await this.getContactDetails(deal.Contact_Name?.id || '');
      if (!contact) {
        throw new Error('Contact not found');
      }
      this.prepareAndSaveNotificationPdf(deal, absences, totalAbsences, periodStartDate, periodEndDate, contact)
      //TODO: send email to the BA responsible

    }
  }

  async prepareAndSaveNotificationPdf(deal: Deal, absences: Absence[], totalAbsences: number, periodStartDate: Date, periodEndDate: Date, contact: Contact){
    // Helper to normalize date string (YYYY-MM-DD)
    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    // For each day, find the first matching absence or null
    const month: (typeof absences[0] | null)[] = [];
    for (let day = 1; day <= 31; day++) {
      // Fix timezone problem: ensure we use date as string (YYYY-MM-DD) in local Berlin time
      const date = new Date(Date.UTC(periodStartDate.getFullYear(), periodStartDate.getMonth(), day));
      const foundAbsence = absences.find(abs =>{
        console.log('abs', abs.start_date, abs.end_date, date);
        return new Date(abs.start_date || '') <= date && new Date(abs.end_date || '') >= date
      }
      );
      console.log('foundAbsence', foundAbsence);
      month.push(foundAbsence ?? null);
    }
    console.log('month', month);

    const pdfData: AcroformPdfFillData = {
      monatJahr: `${(periodStartDate.getMonth() + 1).toString().padStart(2, '0')}/${periodStartDate.getFullYear()}`, // "MM/YYYY" format
      nameVorname: deal.Contact_Name?.name || '',
      strasseHausnummer: contact.Mailing_Street || '',
      plzOrt:  `${contact.Mailing_Zip || ''}, ${contact.Mailing_City || ''}`,
      kundenNummer: contact.Account_Nummer?.toString() || '',
      massnahmenummer: deal.Ma_nahmenummer1 || '',
      massnahmebezeichnung: 'idk',
      begruendung: 'test',
      datum1: 'datum1',
      days: month.map((absence, index) => ({
        day: index + 1,
        value: absence?.reason ? absence.reason.charAt(0) : 'C',
      })),
      trotzErreicht: true,
      aufgrundNichtErreicht: false,
      wiederholungOption0: false,
      wiederholungOption1: false,
      wiederholungAbDatum: 'wieder',
      beendigungAbDatum: 'beendi',
      tagenseitTeilnahmebeginnvoraussichtlnocherreicht: totalAbsences,
      tagenseitTeilnahmebeginnvoraussichtlnichtmehrerreicht: 22
    };
    await this.acroformService.fillAbsenceNotificationPdf(pdfData)

  }

  async fetchDealsWithAbsencesAndAbsenceNotification(
    startDate: Date,
    endDate: Date
  ) {
    // Fetch absences for the period
    let absences = await this.getRelevantAbsences(
      startDate.toISOString().split('T')[0],
      endDate.toISOString().split('T')[0]
    );
    console.log('absences:', absences.length);
    const deals = await this.getDeals(absences);

    // Get the latest absence notifications for each deal
    const lastestAbsenceNotificationsForEachDealList =
      await this.getLastestAbsenceNotificationsForEachDeal(deals);

    const dealsWithAbsencesAndAbsenceNotification: DealAbsenceSummary[] =
      this.mapDealsToAbsencesAndPreviousNotification(
        deals,
        absences,
        lastestAbsenceNotificationsForEachDealList
      );

    return dealsWithAbsencesAndAbsenceNotification;
  }

  async absenceNotificationWorkflow() {
    // Call the function to get the start and end date of the previous month
    const periodStartDate = this.getFirstDayOfXMonthsAgo(1);
    const periodEndDate = this.getLastDayOfXMonthsAgo(1);
    console.log('periodStartDate:', periodStartDate, 'periodEndDate:', periodEndDate);
    const dealsWithAbsencesAndAbsenceNotificationList =
      await this.fetchDealsWithAbsencesAndAbsenceNotification(
        periodStartDate,
        periodEndDate
      );
      console.log('dealsWithAbsencesAndAbsenceNotificationList:', dealsWithAbsencesAndAbsenceNotificationList);
      
    //handles the absence notification for each deal in parallel, to speed up the process
    await Promise.all(
      dealsWithAbsencesAndAbsenceNotificationList.map((dealWithAbsences) =>
        this.handleDealAbsenceNotificationGeneration(
          dealWithAbsences,
          periodStartDate,
          periodEndDate
        )
      )
    );
  }

  async getContactDetails(contactId: string): Promise<Contact> {
    const contact = await this.zohoConnectionService.getById<Contact>({
      module: 'Contacts',
      id: contactId,
      params: {
        fields: ['Full_Name', 'Mailing_Street', 'Mailing_Zip', 'Mailing_City', 'Account_Nummer', 'Account_Name'],
      },
    });
    return contact;
  }
}
