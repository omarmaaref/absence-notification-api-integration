import { Module } from '@nestjs/common';
import { AcroformPdfEditorService } from './acroform-pdf-editor.service';

@Module({
  providers: [AcroformPdfEditorService],
  exports: [AcroformPdfEditorService],
})
export class AcroformPdfEditorModule {}
