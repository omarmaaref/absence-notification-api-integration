import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { AcroformPdfEditorService } from '@velptec/acroform-pdf-editor';
@Controller('absences-notification')
export class AppController {
  constructor(private readonly acroformPdfEditorService: AcroformPdfEditorService,
    private readonly service: AppService
  ) {}

  @Get()
  getData() {
    // return this.acroformPdfEditorService.fillExamplePdf();
  }
  @Post('')
  async absenceNotificationWorkflow() {
    await this.service.absenceNotificationWorkflow()
    return { message: 'Absence notification workflow received.' };
  }
}
