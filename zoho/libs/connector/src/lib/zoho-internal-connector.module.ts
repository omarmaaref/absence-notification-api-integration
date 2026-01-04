import { Module } from '@nestjs/common';
// import { ZohoExternalConnectorModule } from '@company/zoho-external-connector';
import { ZohoInternalConnectorService } from './zoho-internal-connector.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [ZohoInternalConnectorService],
  exports: [ZohoInternalConnectorService],
})
export class ZohoInternalConnectorModule {}
