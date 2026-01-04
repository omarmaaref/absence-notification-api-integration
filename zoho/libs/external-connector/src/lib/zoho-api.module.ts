import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ZohoExternalApiService } from './zoho-external-api.service';
import { UtilsModule } from '@company/utils-lib';

@Module({
  imports: [HttpModule, UtilsModule],
  controllers: [],
  providers: [ZohoExternalApiService],
  exports: [ZohoExternalApiService],
})
export class ZohoExternalConnectorModule {}
