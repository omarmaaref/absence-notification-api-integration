import { Injectable, Logger } from '@nestjs/common';
import {
  ZohoModules,
  ZohoCreateRequest,
  ZohoInternalGetRequest,
  ZohoUpdateRequest,
  ZohoUpsertRequest,
  ZohoSearchRequest,
  ZohoUploadAttachmentRequest,
  ZohoDeleteAttachmentByNameRequest,
  ZohoCreateResponse,
  ZohoDeleteByIdRequest,
  ZohoInternalGetRelatedRequest,
  ZohoInternalGetByIdRequest,
} from '@company/zoho-types';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import FormData from 'form-data';
import * as process from 'node:process';
@Injectable()
export class ZohoInternalConnectorService /* implements ZohoAPI */ {
  private readonly baseURL: string;
  private readonly logger = new Logger(ZohoInternalConnectorService.name);
  //private readonly httpService: HttpService
  constructor(
    private readonly httpService: HttpService //private readonly zohoExternalApiService: ZohoExternalApiService
  ) {
    this.baseURL = process.env['MS_ZOHO_URL']! + '/';
  }

  /**
   * delete record by id
   * @param module api module name
   * @param ids record ids
   */
  async deleteByIds<T extends ZohoModules>({
    module,
    ids,
  }: ZohoDeleteByIdRequest<T>) {
    const url = this.baseURL + module;
    this.logger.debug('Deleting records from ' + url);
    const { data } = await firstValueFrom(
      this.httpService.delete(url, { params: { ids: ids } })
    );

    return data;
  }

  /**
   * delete attachment base on the given name
   * @param config
   */
  async deleteAttachmentByName<T extends ZohoModules>(
    config: ZohoDeleteAttachmentByNameRequest<T>
  ) {
    ///return this.zohoExternalApiService.deleteAttachmentByName(config);
  }

  /**
   * upload attachment to module
   * @param config
   */
  async uploadAttachment<T extends ZohoModules>(
    config: ZohoUploadAttachmentRequest<T>
  ) {
    const url =
      process.env['MS_ZOHO_URL']! +
      '/' +
      config.module +
      '/' +
      config.id +
      '/attachments';
    this.logger.debug(`Uploading ${url}`);
    const formData = new FormData();

    formData.append('file', config.rawBody, {
      filename: config.fileName,
    });
    formData.append('fileName', config.fileName);
    formData.append('deleteExisting', config.deleteExisting.toString());
    const { data } = await firstValueFrom(
      this.httpService.post(url, formData, {
        headers: { ...formData.getHeaders() },
      })
    );
    this.logger.debug(`Uploading ${url} success`);
    return data;
  }

  /**
   * search record by specific criteria
   * @param module
   * @param params
   * @param options
   */
  async search<T extends ZohoModules>({
    module,
    params,
    options,
  }: ZohoSearchRequest<T>) {
    //return this.zohoExternalApiService.search({ module, params, options });

    const { data } = await firstValueFrom(
      this.httpService.get(this.baseURL + module + '/search', {
        params: params,
        headers: options?.headers,
      })
    );
    return data as T[];
  }

  async get<T extends ZohoModules>(
    config: ZohoInternalGetRequest<T>
  ): Promise<T[]> {
    //return this.zohoExternalApiService.get(config);

    const { data } = await firstValueFrom(
      this.httpService.get(this.baseURL + config.module, {
        params: { ...config.params, fields: config.params?.fields?.join(',') },
        headers: config.options?.headers,
      })
    );
    return data as T[];
  }

  async getById<T extends ZohoModules>(
    config: ZohoInternalGetByIdRequest<T>
  ): Promise<T> {
    //return this.zohoExternalApiService.getById(config);

    const url = this.baseURL + config.module + '/' + config.id;
    this.logger.log('get record from: ' + url);
    const { data } = await firstValueFrom(
      this.httpService.get(url, {
        params: { ...config.params, fields: config.params?.fields?.join(',') },
        headers: config.options?.headers,
      })
    );
    return data;
  }

  async related<U extends ZohoModules, T extends ZohoModules>({
    module,
    id,
    relatedModule,
    params,
    options,
  }: ZohoInternalGetRelatedRequest<T, U>): Promise<T[]> {
    this.logger.debug(
      'Get related records from: ' + module + '/' + id + '/' + relatedModule
    );
    const { data: respData } = await firstValueFrom(
      this.httpService.get<T[]>(
        process.env['MS_ZOHO_URL']! +
          '/' +
          module +
          '/' +
          id +
          '/' +
          relatedModule,
        {
          params: { ...params, fields: params?.fields?.join(',') },
          headers: options?.headers,
        }
      )
    );
    return respData;
  }

  async create<T extends ZohoModules>({
    module,
    data,
    options,
  }: ZohoCreateRequest<T>): Promise<ZohoCreateResponse[]> {
    const url = this.baseURL + module;

    //this.logger.debug(options?.headers);
    this.logger.debug('creating records in ' + url);

    const { data: respData } = await firstValueFrom(
      this.httpService.post<ZohoCreateResponse[]>(
        url,
        {
          data: data,
          trigger: options?.trigger,
        },
        {
          headers: options?.headers,
        }
      )
    );
    return respData;
  }

  async update<T extends ZohoModules>({
    module,
    data,
    options,
  }: ZohoUpdateRequest<T>): Promise<T[]> {
    //return this.zohoExternalApiService.update({ module, data, options });

    const url = this.baseURL + module;
    this.logger.debug('updating records in ' + url);
    this.logger.debug(options?.headers);
    const { data: respData } = await firstValueFrom(
      this.httpService.put<T[]>(
        url,
        {
          data: data,
          trigger: options?.trigger,
        },
        {
          headers: options?.headers,
        }
      )
    );
    return respData;
  }

  async upsert<T extends ZohoModules>({
    module,
    data,
    options,
  }: ZohoUpsertRequest<T>): Promise<T[]> {
    //return this.zohoExternalApiService.update({ module, data, options });

    const url = this.baseURL + module + '/upsert';

    this.logger.debug('updating records in ' + url);

    const { data: respData } = await firstValueFrom(
      this.httpService.post<T[]>(url, {
        data: data,
        trigger: options?.trigger,
        duplicate_check_fields: options?.duplicate_check_fields,
      })
    );
    return respData;
  }
}
