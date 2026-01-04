import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AcroformPdfEditorModule } from '@company/acroform-pdf-editor';
import { ZohoInternalConnectorModule } from '@company/zoho-connector';
@Module({
  imports: [AcroformPdfEditorModule, ZohoInternalConnectorModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
