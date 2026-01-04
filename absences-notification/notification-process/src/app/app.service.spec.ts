import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { ZohoInternalConnectorService } from '@velptec/zoho-connector';
import { AcroformPdfEditorService } from '@velptec/acroform-pdf-editor';

describe('AppService', () => {
  let service: AppService;
  let zohoConnectionService: Partial<Record<string, jest.Mock>>;
  let acroformService: Partial<Record<string, jest.Mock>>;

  beforeEach(async () => {
    zohoConnectionService = {
      get: jest.fn(),
      search: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
      getById: jest.fn(),
    };
    acroformService = {
      fillAbsenceNotificationPdf: jest.fn()
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        { provide: ZohoInternalConnectorService, useValue: zohoConnectionService },
        { provide: AcroformPdfEditorService, useValue: acroformService },
      ],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('removeDuplicateAbsences', () => {
    it('removes absences with same deal, start_date and end_date', () => {
      const absences = [
        { deal: { id: '1' }, start_date: '2023-01-01', end_date: '2023-01-02' },
        { deal: { id: '1' }, start_date: '2023-01-01', end_date: '2023-01-02' },
        { deal: { id: '1' }, start_date: '2023-01-03', end_date: '2023-01-03' },
        { deal: { id: '2' }, start_date: '2023-01-01', end_date: '2023-01-02' },
      ] as any;
      const result = service.removeDuplicateAbsences(absences);
      expect(result.length).toBe(3);
      expect(result).toContainEqual(absences[0]);
      expect(result).toContainEqual(absences[2]);
      expect(result).toContainEqual(absences[3]);
    });
  });

  describe('getLastDayOfXMonthsAgo', () => {
    it('should get the correct last day of previous months', () => {
      const now = new Date();
      const result = service.getLastDayOfXMonthsAgo(1);
      // Should match last day of previous month
      const expected = new Date(now.getFullYear(), now.getMonth(), 0);
      expect(result.getFullYear()).toBe(expected.getFullYear());
      expect(result.getMonth()).toBe(expected.getMonth());
      expect(result.getDate()).toBe(expected.getDate());
    });
  });

  describe('getFirstDayOfXMonthsAgo', () => {
    it('should get the correct first day of previous months', () => {
      const now = new Date();
      const x = 1;
      const result = service.getFirstDayOfXMonthsAgo(x);
      const expected = new Date(Date.UTC(now.getFullYear(), now.getMonth() - x, 1, 0, -new Date(Date.UTC(now.getFullYear(), now.getMonth() - x, 1)).getTimezoneOffset()));
      expect(result.getUTCFullYear()).toBe(expected.getUTCFullYear());
      expect(result.getUTCMonth()).toBe(expected.getUTCMonth());
      expect(result.getUTCDate()).toBe(expected.getUTCDate());
    });
  });

  describe('getDeals', () => {
    it('should call zohoConnectionService.get with correct params', async () => {
      const absences = [
        { deal: { id: '1' } },
        { deal: { id: '2' } }
      ] as any;
      (zohoConnectionService.get as jest.Mock).mockResolvedValue([{ id: '1' }, { id: '2' }]);
      const deals = await service.getDeals(absences);
      expect(zohoConnectionService.get).toHaveBeenCalledWith({
        module: 'Deals',
        params: expect.objectContaining({
          ids: '1,2',
          fields: expect.any(Array)
        }),
      });
      expect(deals.length).toBe(2);
    });
  });

  describe('getRelevantAbsences', () => {
    it('should fetch and deduplicate absences', async () => {
      const fakeAbsences = [
        { deal: { id: '1' }, start_date: '2023-01-01', end_date: '2023-01-02' },
        { deal: { id: '1' }, start_date: '2023-01-01', end_date: '2023-01-02' },
      ] as any;
      (zohoConnectionService.search as jest.Mock).mockResolvedValue(fakeAbsences);
      const res = await service.getRelevantAbsences('2023-01-01', '2023-02-01');
      expect(zohoConnectionService.search).toHaveBeenCalled();
      expect(res.length).toBe(1);
      expect(res[0]).toEqual(fakeAbsences[0]);
    });
  });

  describe('getContactDetails', () => {
    it('should fetch contact details for a given contactId', async () => {
      (zohoConnectionService.getById as jest.Mock).mockResolvedValue({ id: 'contactId' });
      const contact = await service.getContactDetails('contactId');
      expect(zohoConnectionService.getById).toHaveBeenCalledWith({
        module: 'Contacts',
        id: 'contactId',
        params: { fields: ['Full_Name', 'Mailing_Street', 'Mailing_Zip', 'Mailing_City', 'Account_Nummer', 'Account_Name'] }
      });
      expect(contact).toEqual({ id: 'contactId' });
    });
  });

  describe('getNumberOfDays', () => {
    it('returns a total of days of absences within the given period', () => {
      const absences = [
        { start_date: '2024-06-01', end_date: '2024-06-03' },
        { start_date: '2024-06-10', end_date: '2024-06-12' }
      ] as any;
      const start = new Date('2024-06-01');
      const end = new Date('2024-06-30');
      expect(service.getNumberOfDays(absences, start, end)).toBe(6);
    });
    it('ignores absences outside of the period', () => {
      const absences = [
        { start_date: '2024-05-01', end_date: '2024-05-03' }
      ] as any;
      const start = new Date('2024-06-01');
      const end = new Date('2024-06-30');
      expect(service.getNumberOfDays(absences, start, end)).toBe(0);
    });
  });

  describe('prepareAndSaveNotificationPdf', () => {
    it('calls acroformService.fillAbsenceNotificationPdf with correct data', async () => {
      const deal = { Contact_Name: { name: 'Test', id: 'contactId' }, Ma_nahmenummer1: '123' } as any;
      const absences = [
        { start_date: '2024-06-01', end_date: '2024-06-15', reason: 'Urlaub' }
      ] as any;
      const contact = {
        Mailing_Street: 'Street 1',
        Mailing_Zip: '12345',
        Mailing_City: 'Town',
        Account_Nummer: 'ACC1'
      } as any;
      await service.prepareAndSaveNotificationPdf(
        deal, absences, 10,
        new Date('2024-06-01'), new Date('2024-06-30'), contact
      );
      expect(acroformService.fillAbsenceNotificationPdf).toHaveBeenCalled();
      const call = (acroformService.fillAbsenceNotificationPdf as jest.Mock).mock.calls[0][0];
      expect(call.nameVorname).toBe('Test');
      expect(call.kundenNummer).toBe('ACC1');
      expect(call.plzOrt).toBe('12345, Town');
      expect(call.tagenseitTeilnahmebeginnvoraussichtlnocherreicht).toBe(10);
      expect(call.days.length).toBe(31);
    });
  });
});
