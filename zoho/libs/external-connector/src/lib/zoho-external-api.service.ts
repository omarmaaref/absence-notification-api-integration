import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import Bottleneck from 'bottleneck';
import * as process from 'node:process';
import {
  catchError,
  expand,
  firstValueFrom,
  from,
  lastValueFrom,
  map,
  Observable,
  of,
  reduce,
  switchMap,
  takeWhile,
} from 'rxjs';
import latinize from 'latinize';
import { AxiosError, AxiosResponse } from 'axios';
import {
  // ZohoAPI,
  ZohoChangeRequest,
  ZohoUpdateRequest,
  ZohoUpsertRequest,
  ZohoGetByIdRequest,
  ZohoGeneralGetRequest,
  ZohoCreateRequest,
  ZohoChangeRequestBody,
  ZohoChangeBaseRequestBody,
  ZohoGetRelatedRequest,
  ZohoGetRequest,
  ZohoDeleteIdsRequest,
  ZohoIdRequest,
  ZohoDeleteAttachmentRequest,
  ZohoSearchRequest,
  ZohoDeleteAttachmentByNameRequest,
  ZohoUploadAttachmentRequest,
  ZohoCreateResponse,
  ZohoRequestParameters,
} from '@company/zoho-types';
import { ZohoModules } from '@company/zoho-types';
import {
  ZohoResponse,
  ZohoAccessTokenResponse,
  ZohoAccessTokenErrorResponse,
} from '@company/zoho-types';
import { Attachment } from '@company/zoho-types';
import FormData from 'form-data';
import { UtilsService } from '@company/utils-lib';

@Injectable()
export class ZohoExternalApiService {
  private DOCUMENT_ENV_PREFIX = '';
  private readonly logger = new Logger(ZohoExternalApiService.name);
  // to limit the maximum of concurrent requests
  private readonly limiter: Bottleneck;
  // cache for the token
  private _accessToken: string | null =
    // may use a preset token given from .env.local for development
    process.env['ZOHO_CRM_ACCESS_TOKEN'] || null;

  constructor(
    private readonly httpService: HttpService,
    private readonly utilsService: UtilsService
  ) {
    this.DOCUMENT_ENV_PREFIX = process.env['ENV'] === 'DEV' ? 'DEV_' : '';
    this.limiter = new Bottleneck({
      maxConcurrent:
        (process.env['MAX_CONCURRENT'] &&
          parseInt(process.env['MAX_CONCURRENT'], 10)) ||
        15, // default set to 15
    });
  }

  /****
   *  3 public GET for specific types
   **/
  /*
  // get all elements from a module
  public requestAll$<T extends ZohoModules>(config: {
    module: ModuleName<T>;
    params: ZohoInternalRequestParameters<T>;
    validate?: ClassConstructor<T>;
  }) {
    return this.request$<T, T>(config).pipe(
      reduce((acc, response) => [...acc, ...response.data], [] as T[]),
      map((response) => {
        if (config.validate === undefined) return response;
        // validate all
        return response.map((e) =>
          this.validate<T>(e, config.validate!, config.module)
        );
      })
    );
  }*/
  /*
  // get all related from a modules element
  public requestRelated$<
    T extends ZohoModules,
    U extends RelatedModule<T>
  >(config: {
    module: ModuleName<T>;
    id: string;
    related: ModuleName<U>;
    params: ZohoInternalRequestParameters<U>;
    validate?: ClassConstructor<U>;
  }) {
    return this.request$<T, U>(config).pipe(
      reduce(
        // Hint: request$() allways returns an observable of type <T> so we use "any" here
        (acc, response: ZohoResponse<any>) => [...acc, ...response.data],
        [] as U[]
      ),
      map((response: U[]) => {
        if (config.validate === undefined) return response;
        // validate all
        return response.map((e) =>
          this.validate<U>(
            e,
            config.validate as ClassConstructor<U>,
            config.module
          )
        );
      })
    );
  }*/

  /**********
   *
   *  RX: Request Zoho Data
   *    - spanning multiple "pages"
   *    - implemented as recursive Observable
   *
   *
  private request$<T extends ZohoModules, U extends ZohoModules>(config: {
    module: ModuleName<T>;
    params: ZohoInternalRequestParameters<T> | ZohoInternalRequestParameters<U>;
    id?: string;
    related?: string;
    // validate?: ClassConstructor<U>;
  }) {
    // define the url
    let url = `https://www.zohoapis.eu/crm/v7/${config.module}`;
    if (config.id) url += `/` + config.id; // add the id if provided
    if (config.related) url += '/' + config.related; // add the id if provided
    this.logger.verbose('requesting url: ', url);

    // 1) generator function:
    // - for a single request to Zoho
    // - for this specific request
    // - will be reused to request all individual pages one after another
    const request$ = (page_token?: string) =>
      // 1) get an access-token
      this.accessToken$().pipe(
        // 2) then... with the token
        switchMap((token) => {
          // create the observable request stream
          const response$ = this.httpService
            .get<ZohoResponse<T>>(url, {
              headers: {
                Authorization: `Zoho-oauthtoken ${token}`,
              },
              params: {
                // re-use everything from incoming config
                ...config.params,
                // but convert arrays to csv
                fields: config.params.fields,
                ids: config.params.ids?.join(),

                // set the current page_token (MAY be undefined!)
                page_token: page_token,
              },
            })
            .pipe(
              catchError((error: AxiosError) => {
                throw new HttpException(
                  `failed to get data from zoho with: ${error.message}`,
                  HttpStatus.INTERNAL_SERVER_ERROR
                );
              }),
              // return only the axios response data
              map((e) => e.data)
            );

          // return as concurrency limited Observable
          // using bottleneck (converting to/from promise)
          return from(this.limiter.schedule(() => lastValueFrom(response$)));
        })
      );

    // 2) initiate the recursive walk
    //    - return the (observable) result of it
    return request$().pipe(
      // 1) expand the event to new events
      //    docs: https://rxjs.dev/api/operators/expand
      expand((response) => {
        // a) no info at all? (i.e: single element request)
        // - then emit the stop condition
        if (response.info === undefined) return of(null);

        // b) no more records?
        // - then emit the stop condition
        if (response.info.more_records === false) return of(null);

        // c) otherwise: initiate the next request
        return request$(response.info.next_page_token);
      }),
      // unsubscribe when stop condition is emited
      takeWhile((response) => response !== null)

      // 2) reduce all incoming events to one (until complete)
      // reduce((acc, response) => [...acc, ...response.data], [] as T[] ),

      // map( e => { return e as unknown as U extends RelatedModule<T>? U[]:T[] } )

      // 3) validate - test
      // map((response) => {
      //   if( config.validate === undefined ) return response;
      //   return response.map( e => this.validate<U>(e, config.validate  );
      // }),
    );
  }

  // --------------------------------------------
  // transform and validate an unknown object
  // against a dto class
  // and return the typed object on success
  // or throw an error
  // Hint: Linked by ClassConstructor<T> to given Type T
  private validate<T>(
    element: any,
    dto: ClassConstructor<T>,
    moduleName: string
  ): T {
    // set Brand
    element._type = moduleName;

    // transform (dates, etc)
    const object = plainToInstance(dto, element);
    // validate
    const error = validateSync(object as any, {
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    });
    if (error.length > 0) {
      this.logger.error(error);
      throw new Error('validation failed!');
    }
    return object;
  }*/

  /****
   * RX: get a valid access-Token
   *  - get an observable that will
   *    - emit a valid Access-Token
   *    - and then complete
   **/
  private accessToken$ = () => {
    if (this._accessToken !== null) {
      this.logger.verbose('using token from cache');
      return of(this._accessToken);
    }

    this.logger.debug(
      'Requesting a new token using refresh-token: ' +
        process.env['ZOHO_CRM_REFRESH_TOKEN']
    );

    // otherwise get a new one from Zoho
    return this.httpService
      .post<ZohoAccessTokenResponse | ZohoAccessTokenErrorResponse>(
        'https://accounts.zoho.eu/oauth/v2/token',
        null,
        {
          // send as parameters?
          params: {
            client_id: process.env['ZOHO_CRM_CLIENT_ID'],
            client_secret: process.env['ZOHO_CRM_CLIENT_SECRET'],
            refresh_token: process.env['ZOHO_CRM_REFRESH_TOKEN'],
            grant_type: 'refresh_token',
          },
        }
      )
      .pipe(
        // catch Errors from Axios
        catchError((error: AxiosError) => {
          this.logger.error(
            `failed to request a new accessToken from zoho`,
            error
          );
          this.logger.error(error.response?.data);
          // Test
          throw new HttpException(
            error.response?.data as object,
            HttpStatus.INTERNAL_SERVER_ERROR
          );
        }),

        // validate
        map((e) => {
          // there are cases where Zoho returns an http 200 with an error object!
          if (e && 'error' in e) {
            throw new HttpException(
              'Failed to get a token from Zoho: ' + e.error,
              HttpStatus.BAD_REQUEST
            );
          }
          // general fail? No Data?
          if (!e || !e.data) {
            throw new HttpException(
              'Failed to get a token from Zoho: ',
              HttpStatus.INTERNAL_SERVER_ERROR
            );
          }
          return e as unknown as AxiosResponse<ZohoAccessTokenResponse>;
        }),

        // get the data
        map((e) => {
          // cache the token
          this._accessToken = e.data.access_token;
          this.logger.verbose('received new AccessToken: ', this._accessToken);
          // return it
          return this._accessToken;
        })
      );
  };

  // -------------------------------------------------------
  //
  //      OLD VERSION
  //

  // request a new access token ( using the refresh-token )
  private async accessToken(): Promise<string> {
    // use cached one if availabe
    if (this._accessToken !== null) {
      this.logger.verbose('using token from cache');
      return this._accessToken;
    }

    this.logger.debug(
      'Requesting a new token using client crendentails: ' +
        process.env['ZOHO_CRM_CLIENT_ID'] +
        ' and ' +
        process.env['ZOHO_CRM_CLIENT_SECRET'] +
        ' for ' +
        process.env['ZOHO_CRM_SOID']
    );
    // otherwise get a new one from Zoho
    const response = await firstValueFrom(
      this.httpService
        .post<ZohoAccessTokenResponse | ZohoAccessTokenErrorResponse>(
          'https://accounts.zoho.eu/oauth/v2/token',
          null,
          {
            // send as parameters?
            params: {
              client_id: process.env['ZOHO_CRM_CLIENT_ID'],
              client_secret: process.env['ZOHO_CRM_CLIENT_SECRET'],
              grant_type: 'client_credentials',
              scope: 'ZohoCRM.modules.ALL',
              soid: process.env['ZOHO_CRM_SOID'],
            },
          }
        )
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(
              `failed to request a new accessToken from zoho`,
              error
            );
            this.logger.error(error.response?.data);
            // Test
            throw new HttpException(
              error.response?.data as object,
              HttpStatus.INTERNAL_SERVER_ERROR
            );

            // console.log("------------")
            // console.log(error.response?.data)
            return of(null);
          }),
          map((e) => (e && e.data ? e.data : null))
        )
    );

    this.logger.debug(response);

    // expected response example:
    // {
    //   access_token: '1000.3b1230df7bc772932d2c9f28015a19db.91fb6e10b572198ac1b44a0284d72430',
    //   scope: 'ZohoCRM.modules.ALL ZohoCRM.settings.modules.READ ZohoCRM.org.READ',
    //   api_domain: 'https://www.zohoapis.eu',
    //   token_type: 'Bearer',
    //   expires_in: 3600
    // }
    //
    // OR: i.e: in case of invalid data sent:
    // { error: 'invalid_code' }

    // check for axios error
    if (response === null) {
      throw new HttpException(
        'Failed to get a token from Zoho',
        HttpStatus.BAD_REQUEST
      );
    }
    // check type of response
    if (response && 'error' in response) {
      throw new HttpException(
        'Failed to get a token from Zoho: ' + response.error,
        HttpStatus.BAD_REQUEST
      );
    }

    this.logger.debug('token: ' + response.access_token);
    // cache it
    this._accessToken = response.access_token;

    // set timer
    setTimeout(
      () => {
        this._accessToken = null;
      },
      // be 2 minutes early
      (response.expires_in - 120) * 1000
    );

    this.logger.debug('Received new access-token: ' + this._accessToken);

    return this._accessToken;
  }

  // ---------------------------
  async get<T extends ZohoModules>(config: ZohoGetRequest<T>): Promise<T[]> {
    return this.zohoRecordGetRequest<T>(config);
  }

  async getById<T extends ZohoModules>(
    config: ZohoGetByIdRequest<T>
  ): Promise<T> {
    const records = await this.zohoRecordGetRequest<T>(config);
    return records[0];
  }

  async related<U extends ZohoModules, T extends ZohoModules>({
    module,
    id,
    relatedModule,
    params,
    options,
  }: ZohoGetRelatedRequest<T, U>): Promise<T[]> {
    return await this.zohoRecordGetRequest<T, U>({
      module,
      id,
      relatedModule,
      params,
      options,
    });
  }

  private async zohoRecordGetRequest<
    T extends ZohoModules,
    U extends ZohoModules = T
  >({
    module,
    params,
    id,
    relatedModule,
    options,
  }: ZohoGeneralGetRequest<T, U>): Promise<T[]> {
    let url = `https://www.zohoapis.eu/crm/v7/${module}`;

    if (id) {
      url += `/${id}`;
    }

    if (relatedModule) {
      url += `/${relatedModule}`;
    }

    this.logger.log(`get request to: ${url}`);
    const accessToken = await this.accessToken();
    const data: T[] = [];
    let next_page_token: string | undefined;
    let response: ZohoResponse<T>;
    let baseHeaders: Record<string, string> = {};

    if (options) {
      if (options.headers) {
        baseHeaders = { ...options.headers };
      }
    }

    do {
      // fetch loop
      response = (
        await firstValueFrom(
          this.httpService
            .get<ZohoResponse<T>>(url, {
              params: {
                ...params,
                fields: params?.fields,
                page_token: next_page_token,
              },
              headers: {
                Authorization: `Zoho-oauthtoken ${accessToken}`,
                ...baseHeaders,
              },
            })
            .pipe(this.defaultHttpErrorHandler<T>())
        )
      ).data;
      console.log('externalzoho response', (
        await firstValueFrom(
          this.httpService
            .get<ZohoResponse<T>>(url, {
              params: {
                ...params,
                fields: params?.fields,
                page_token: next_page_token,
              },
              headers: {
                Authorization: `Zoho-oauthtoken ${accessToken}`,
                ...baseHeaders,
              },
            })
            .pipe(this.defaultHttpErrorHandler<T>())
        )
      ));
      if (response) {
        data.push(...response.data);
        // there is only an info object if not a single entry was requested
        if (response.info) {
          next_page_token = response.info.next_page_token;
          // this.logger.debug(
          //   `more records: ${zohoResponse.info.more_records}, length of data: ${zohoResponse.data.length} (+${response.data.length})`
          // );
        }
      }
    } while (response.info && response.info.more_records);
    return data;
  }

  async create<T extends ZohoModules>({
    module,
    data,
    options,
  }: ZohoCreateRequest<T>): Promise<ZohoCreateResponse[]> {
    return this.zohoRecordChangeRequest({ module, data, options }, 'create');
  }

  async update<T extends ZohoModules>({
    module,
    options,
    data,
  }: ZohoUpdateRequest<T>): Promise<ZohoCreateResponse[]> {
    return this.zohoRecordChangeRequest({ module, data, options }, 'update');
  }

  async upsert<T extends ZohoModules>({
    module,
    data,
    options,
  }: ZohoUpsertRequest<T>): Promise<ZohoCreateResponse[]> {
    return this.zohoRecordChangeRequest({ module, data, options }, 'upsert');
  }

  private async zohoRecordChangeRequest<T extends ZohoModules>(
    { module, data, options }: ZohoChangeRequest<T>,
    action: 'create' | 'update' | 'upsert'
  ): Promise<ZohoCreateResponse[]> {
    let url = `https://www.zohoapis.eu/crm/v7/${module}`;
    if (action === 'upsert') {
      url += '/upsert';
    }

    let method = '';

    switch (action) {
      case 'create':
        method = 'post';
        break;
      case 'update':
        method = 'put';
        break;
      case 'upsert':
        method = 'post';
        break;
      default:
        throw new HttpException('Invalid action', HttpStatus.BAD_REQUEST);
    }

    this.logger.log(`${action} request to: ${url}`);

    const groupRecords = this.utilsService.groupRecords<Partial<T>>(data);
    const resp: ZohoResponse<ZohoCreateResponse> = {
      data: [],
      info: {
        count: 0,
        per_page: 0,
        sort_by: '',
        sort_order: 'desc',
        page: 0,
        page_token_expiry: undefined,
        previous_page_token: undefined,
        next_page_token: undefined,
        more_records: false,
      },
    };

    const baseBody: ZohoChangeBaseRequestBody<T> = {};
    let baseHeaders: Record<string, string> = {};

    if (options) {
      if (options.duplicate_check_fields) {
        baseBody.duplicate_check_fields = options.duplicate_check_fields;
      }
      if (options.trigger) {
        baseBody.trigger = options.trigger;
      }
      if (options.headers) {
        baseHeaders = { ...options.headers };
      }
    }

    //get a token
    const accessToken = await this.accessToken();
    this.logger.debug('token: ' + accessToken);
    while (groupRecords.length > 0) {
      const sliceRecords = groupRecords.splice(-1);
      const body: ZohoChangeRequestBody<T> = {
        data: sliceRecords[0],
        ...baseBody,
      };
      const { data } = await this.limiter.schedule(
        async () =>
          await firstValueFrom(
            this.httpService
              .request<ZohoResponse<ZohoCreateResponse>>({
                method: method,
                url: url,
                data: body,
                headers: {
                  Authorization: `Zoho-oauthtoken ${accessToken}`,
                  ...baseHeaders,
                },
              })
              .pipe(this.defaultHttpErrorHandler())
          )
      );
      resp.data.push(...data.data);
    }

    return resp.data;
  }

  async deleteAttachmentByName<T extends ZohoModules>({
    module,
    id,
    fileName,
  }: ZohoDeleteAttachmentByNameRequest<T>) {
    try {
      const attachments = await this.getAttachments<T>({
        module: module,
        id: id,
      });

      this.logger.debug(this.DOCUMENT_ENV_PREFIX + fileName);
      this.logger.debug(attachments.map((e) => e.File_Name));

      const attachment = attachments.find((attachment) =>
        attachment.File_Name.startsWith(
          this.DOCUMENT_ENV_PREFIX + latinize(fileName)
        )
      );
      if (attachment) {
        this.logger.log(
          'DELETE attachment at module ' + module + ' with the id ' + id
        );
        await this.deleteAttachmentById({
          module: module,
          id: id,
          attachmentId: attachment.id,
        });
      }
    } catch (e) {
      this.logger.log('No attachments found');
    }
  }

  async search<T extends ZohoModules>({
    module,
    params,
    options,
  }: ZohoSearchRequest<T>) {
    const requestURL = `https://www.zohoapis.eu/crm/v7/${module}/search`;
    this.logger.log(`search request to: ${requestURL}`);
    const zohoResponse: ZohoResponse<T> = {
      data: [],
      info: {
        count: 0,
        per_page: 0,
        sort_by: '',
        sort_order: 'desc',
        page: 0,
        page_token_expiry: undefined,
        previous_page_token: undefined,
        next_page_token: undefined,
        more_records: false,
      },
    };
    const accessToken = await this.accessToken();
    let page = 1;
    do {
      const { data: resp } = await firstValueFrom(
        this.httpService
          .get<ZohoResponse<T>>(requestURL, {
            params: { ...params, page: page },
            headers: {
              Authorization: 'Bearer ' + accessToken,
              ...options?.headers,
            },
          })
          .pipe(this.defaultHttpErrorHandler<T>())
      );

      if (resp?.data) {
        zohoResponse.data.push(...resp.data);
      }
      zohoResponse.info = resp.info;
      if (zohoResponse.info?.more_records) {
        this.logger.debug(
          `more records: ${zohoResponse.info?.more_records} length of data: ${zohoResponse.data?.length}`
        );
      }

      page++;
    } while (zohoResponse.info?.more_records);
    return zohoResponse.data;
  }

  async uploadAttachment<T extends ZohoModules>({
    module,
    id,
    fileName,
    rawBody,
    deleteExisting,
  }: ZohoUploadAttachmentRequest<T>) {
    this.logger.log(
      'upload new PDF to Zoho with the to the module ' +
        module +
        ' with the id ' +
        id
    );

    if (deleteExisting) {
      await this.deleteAttachmentByName<T>({
        module: module,
        id: id,
        fileName,
      });
    }

    const fileData = new FormData();
    fileData.append('file', rawBody, {
      filename: this.DOCUMENT_ENV_PREFIX + latinize(fileName) + '.pdf',
    });

    const url =
      'https://www.zohoapis.eu/crm/v4/' + module + '/' + id + '/Attachments';

    this.logger.log(`upload attachment request to: ${url}`);

    const token = `Zoho-oauthtoken ${await this.accessToken()}`;

    return this.httpService
      .post(url, fileData, {
        headers: {
          Authorization: token,
          ...fileData.getHeaders(),
        },
      })
      .pipe(
        catchError((err: AxiosError, c) => {
          this.logger.error(err?.message);
          this.logger.error(err?.response?.data);
          throw new HttpException(
            err?.response?.data || {
              code: 'unknown_error',
              details: {},
              message: 'unable to upload the file to zoho',
              status: 'error',
            },
            err?.response?.status || HttpStatus.BAD_GATEWAY
          );
          return c;
        }),
        map((resp) => resp.data)
      );
  }

  async deleteAttachmentById<T extends ZohoModules>({
    module,
    id,
    attachmentId,
  }: ZohoDeleteAttachmentRequest<T>) {
    const requestURL =
      'https://www.zohoapis.eu/crm/v7' +
      '/' +
      module +
      '/' +
      id +
      '/Attachments/' +
      attachmentId;
    const accessToken = await this.accessToken();
    this.logger.debug('delete attachment request to: ' + requestURL);
    return await this.limiter.schedule(async () => {
      return await firstValueFrom(
        this.httpService
          .delete(requestURL, {
            headers: {
              Authorization: `Zoho-oauthtoken ${accessToken}`,
            },
          })
          .pipe(this.defaultHttpErrorHandler())
      );
    });
  }

  async getAttachments<T extends ZohoModules>({
    module,
    id,
  }: ZohoIdRequest<T>) {
    const url =
      'https://www.zohoapis.eu/crm/v7' +
      '/' +
      module +
      '/' +
      id +
      '/Attachments';

    this.logger.debug('get attachment request to: ' + url);

    const params: ZohoRequestParameters = {
      fields: 'id,Owner,File_Name,Created_Time',
    };
    const accessToken = await this.accessToken();
    // Create a new instance of Bottleneck with a maxConcurrent setting of 20
    const { data } = await firstValueFrom(
      this.httpService
        .request<ZohoResponse<Attachment>>({
          method: 'GET',
          baseURL: url,
          params: {
            ...params,
            fields: params?.fields,
          },
          headers: {
            Authorization: `Zoho-oauthtoken ${accessToken}`,
          },
        })
        .pipe(this.defaultHttpErrorHandler())
    );

    return data.data;
  }

  async delete<T extends ZohoModules>({
    module,
    ids,
    options,
  }: ZohoDeleteIdsRequest<T>): Promise<any> {
    const accessToken = await this.accessToken();
    const requestURL = `https://www.zohoapis.eu/crm/v7/${module}`;
    this.logger.debug(
      'delete record request to: ' + requestURL + ' with ids: ' + ids.join(',')
    );
    const { data } = await firstValueFrom(
      this.httpService
        .delete(requestURL, {
          params: { ids: ids.join(','), ...options?.params },
          headers: {
            Authorization: `Zoho-oauthtoken ${accessToken}`,
            ...options?.headers,
          },
        })
        .pipe(this.defaultHttpErrorHandler())
    );
    return data;
  }

  private defaultHttpErrorHandler<T>() {
    return catchError<
      AxiosResponse<ZohoResponse<T>, any>,
      Observable<AxiosResponse<ZohoResponse<T>, any>>
    >((e, T) => {
      this.logger.error(e?.response?.data || e);
      this.logger.error(e?.response?.status);
      if (e instanceof AxiosError) {
        throw new HttpException(
          e?.response?.data as Record<string, any>,
          e?.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
          {
            cause: e,
          }
        );
      }
      return T;
    });
  }

  // Tests: ---------------------------------------------------------
  // public async getSomeTestData() {
  //   const token = await this.requestToken();

  //   const { data: response } = await firstValueFrom(
  //     this.httpService.get<ZohoResponse<{
  //       id: string,
  //       reason: string,
  //       Owner: object,
  //       type: string,
  //     }>>('https://www.zohoapis.eu/crm/v7/absences', {
  //       // this.httpService.get<any>('https://www.zohoapis.eu/crm/v7/Contacts', {
  //       // TODO try to inject that into axios
  //       headers: {
  //         Authorization: 'Zoho-oauthtoken ' + token,
  //       },

  //       // really send as parameters? works but feels wrong
  //       params: {
  //         fields: 'reason,type,Owner',
  //         // converted: true,
  //         per_page: 5,
  //       },
  //     })
  //   );

  //   console.log(response);

  //   return response;
  // }

  // pickProperties<Type extends object, Keys extends keyof Type>(
  //   obj: Type,
  //   keys: Keys[]
  // ): Pick<Type, Keys> {
  //   let result = {} as Pick<Type, Keys>;

  //   for (const key of keys) {
  //     if (key in obj) {
  //       result = { ...result, key: obj[key] };
  //     }
  //   }

  //   return result;
  // }
}
