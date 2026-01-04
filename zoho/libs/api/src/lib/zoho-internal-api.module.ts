import { Module } from '@nestjs/common';
import { ZohoInternalApiController } from './zoho-internal-api.controller';
import { ZohoExternalConnectorModule } from '@company/zoho-external-connector';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule, ZohoExternalConnectorModule],
  controllers: [ZohoInternalApiController],
  providers: [],
  exports: [],
})
export class ZohoInternalApiModule {}
