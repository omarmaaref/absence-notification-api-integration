import { Module } from '@nestjs/common';
import { ZohoInternalApiModule } from '@company/zoho-api';

@Module({
  imports: [ZohoInternalApiModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
