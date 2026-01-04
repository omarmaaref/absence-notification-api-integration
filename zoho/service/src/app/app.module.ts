import { Module } from '@nestjs/common';
import { ZohoInternalApiModule } from '@velptec/zoho-api';

@Module({
  imports: [ZohoInternalApiModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
