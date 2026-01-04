import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AcroformPdfEditorModule } from '@velptec/acroform-pdf-editor';
import { ZohoInternalConnectorModule } from '@velptec/zoho-connector';
@Module({
  imports: [AcroformPdfEditorModule, ZohoInternalConnectorModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
