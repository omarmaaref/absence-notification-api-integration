import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Injectable,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ZohoExternalApiService } from '@company/zoho-external-connector';
import { ZohoCreateResponse, ZohoModules } from '@company/zoho-types';
import {
  ZohoCreateTriggerBody,
  ZohoDeleteAttachmentPathParam,
  ZohoDeleteIdsQuery,
  ZohoGetParams,
  ZohoModuleIdPathParam,
  ZohoModulePathParam,
  ZohoModuleRelatedParam,
  ZohoSearchQuery,
  ZohoUpsertRequest,
} from './type/zoho-internal-api.dto';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles, UserGuard } from '@company/user-lib';

@Injectable()
@UseGuards(UserGuard)
@Controller('zoho')
export class ZohoInternalApiController {
  private readonly logger = new Logger(ZohoInternalApiController.name);
  constructor(
    private readonly zohoExternalApiService: ZohoExternalApiService
  ) {}

  @Post(':module/:id/attachments')
  @Roles(['zoho-service'])
  @UseInterceptors(FileInterceptor('file'))
  async uploadAttachment<T extends ZohoModules>(
    @Param() { module, id }: ZohoModuleIdPathParam<T>,
    @Body('fileName') fileName: string,
    @Body('deleteExisting') deleteExisting: boolean,
    // @ts-expect-error multer
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.zohoExternalApiService.uploadAttachment({
      module,
      id,
      fileName: fileName,
      rawBody: file.buffer,
      deleteExisting: deleteExisting,
    });
  }

  @Delete(':module/:id/attachments/:attachmentId')
  @Roles(['zoho-service'])
  async deleteAttachments<T extends ZohoModules>(
    @Param() { module, id, attachmentId }: ZohoDeleteAttachmentPathParam<T>
  ) {
    return this.zohoExternalApiService.deleteAttachmentById<T>({
      module: module,
      id: id,
      attachmentId: attachmentId,
    });
  }

  @Get(':module/:id/attachments')
  @Roles(['zoho-service'])
  async getAttachments<T extends ZohoModules>(
    @Param() { module, id }: ZohoModuleIdPathParam<T>
  ) {
    return this.zohoExternalApiService.getAttachments<T>({
      module: module,
      id: id,
    });
  }

  @Get(':module/search')
  @Roles(['zoho-service'])
  async search<T extends ZohoModules>(
    @Param() { module }: ZohoModulePathParam<T>,
    @Query() query: ZohoSearchQuery
  ) {
    return this.zohoExternalApiService.search<T>({
      module: module,
      params: query,
    });
  }

  @Get(':module')
  @Roles(['zoho-service'])
  async get<T extends ZohoModules>(
    @Param() { module }: ZohoModulePathParam<T>,
    @Query() query: ZohoGetParams,
    @Headers() headers: Record<string, string>
  ) {
    const fields = query.fields.split(',') as (keyof T)[];

    return this.zohoExternalApiService.get<T>({
      module: module,
      params: { ...query },
      options: {
        headers: this.getHeaders(headers),
      },
    });
  }

  @Get(':module/:id')
  @Roles(['zoho-service'])
  async getById<T extends ZohoModules>(
    @Param() { id, module }: ZohoModuleIdPathParam<T>,
    @Query() query: ZohoGetParams,
    @Headers() headers: Record<string, string>
  ) {
    return this.zohoExternalApiService.getById<T>({
      module: module,
      id: id,
      params: { ...query },
      options: {
        headers: this.getHeaders(headers),
      },
    });
  }

  @Get(':module/:id/:relatedModule')
  @Roles(['zoho-service'])
  related<T extends ZohoModules, U extends ZohoModules>(
    @Param() { id, module, relatedModule }: ZohoModuleRelatedParam<U, T>,
    @Query() query: ZohoGetParams,
    @Headers() headers: Record<string, string>
  ) {
    return this.zohoExternalApiService.related<U, T>({
      module: module,
      relatedModule: relatedModule,
      id: id,
      params: { ...query },
      options: {
        headers: this.getHeaders(headers),
      },
    });
  }

  @Post(':module')
  @Roles(['zoho-service'])
  create<T extends ZohoModules>(
    @Param() { module }: ZohoModulePathParam<T>,
    @Body() { data, trigger }: ZohoCreateTriggerBody<T>,
    @Headers() headers: Record<string, string>
  ): Promise<ZohoCreateResponse[]> {
    this.logger.debug(headers);
    return this.zohoExternalApiService.create({
      module: module,
      data: data,
      options: {
        trigger: trigger,
        headers: {
          'X-EXTERNAL': headers['x-external'],
        },
      },
    });
  }

  @Put(':module')
  @Roles(['zoho-service'])
  update<T extends ZohoModules>(
    @Param() { module }: ZohoModulePathParam<T>,
    @Body() body: ZohoCreateTriggerBody<T>,
    @Headers() headers: Record<string, string>
  ): Promise<ZohoCreateResponse[]> {
    this.logger.debug(headers);
    const importantHeaders = this.getHeaders(headers);
    this.logger.debug('heads', importantHeaders);
    return this.zohoExternalApiService.update({
      module: module,
      data: body.data,
      options: { trigger: body.trigger, headers: importantHeaders },
    });
  }

  @Post(':module/upsert')
  @Roles(['zoho-service'])
  upsert<T extends ZohoModules>(
    @Param() { module }: ZohoModulePathParam<T>,
    @Body() body: ZohoUpsertRequest<T>,
    @Headers() headers: Record<string, string>
  ): Promise<ZohoCreateResponse[]> {
    this.logger.debug(body);
    return this.zohoExternalApiService.upsert({
      module: module,
      data: body.data,
      options: {
        duplicate_check_fields: body.duplicate_check_fields,
        trigger: body.trigger,
        headers: this.getHeaders(headers),
      },
    });
  }

  @Delete(':module')
  @Roles(['zoho-service'])
  delete<T extends ZohoModules>(
    @Param() { module }: ZohoModulePathParam<T>,
    @Query() query: ZohoDeleteIdsQuery,
    @Headers() headers: Record<string, string>
  ): Promise<any> {
    this.logger.debug(query);
    return this.zohoExternalApiService.delete<T>({
      module: module,
      ids: query.ids,
      options: {
        headers: this.getHeaders(headers),
      },
    });
  }

  private getHeaders(headers: Record<string, string>) {
    const zohoHeaders: Record<string, string> = {};

    if (headers['x-external']) {
      zohoHeaders['X-EXTERNAL'] = headers['x-external'];
    }

    if (headers['If-Unmodified-Since']) {
      zohoHeaders['If-Unmodified-Since'] = headers['If-Unmodified-Since'];
    }

    if (headers['If-modified-Since']) {
      zohoHeaders['If-modified-Since'] = headers['If-modified-Since'];
    }

    return zohoHeaders;
  }
}
