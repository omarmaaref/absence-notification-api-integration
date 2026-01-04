export type DefaultRelatedModuleNames =
  | 'Notes'
  | 'Attachments'
  | 'Tasks'
  | 'Events'
  | 'Calls'
  | 'Tasks_History'
  | 'Calls_History'
  | 'Emails'
  | 'CheckLists'
  | 'Locking_Information__s';

export type ZohoLeadsRelatedModuleNames =
  | DefaultRelatedModuleNames
  | 'Entity_Cadences_leads'
  | 'Products'
  | 'Events_History'
  | 'Suitability_Assessments'
  | 'Invited_Events'
  | 'Campaigns'
  | 'Ma_nahmen6'
  | 'Zoho_Survey'
  | 'Zoho_Support'
  | 'Voice_of_the_Customer__s';
export type ZohoContactsRelatedModuleNames =
  | DefaultRelatedModuleNames
  | 'Deals'
  | 'Kurse19'
  | 'Lizenzen'
  | 'Voucher15'
  | 'Abwesenheiten'
  | 'Zoho_Support'
  | 'ZohoSign_Documents'
  | 'Open_Appointments__s'
  | 'Appointments_History__s'
  | 'Events_History'
  | 'Erwarteter_Zahlungseingang'
  | 'Invoices'
  | 'Products'
  | 'Zoho_Survey'
  | 'reference_Contact'
  | 'Verliehene_Hardware'
  | 'Qualifizierungspl_ne'
  | 'Entity_Cadences_contacts'
  | 'nl_course_states'
  | 'Assignment_evaluations'
  | 'expected_payments'
  | 'Absences'
  | 'Voice_of_the_Customer__s';
export type ZohoDealsRelatedModuleNames =
  | DefaultRelatedModuleNames
  | 'Contact_Roles'
  | 'Quotes'
  | 'Entity_Cadences_Potentials'
  | 'Events_History'
  | 'Products'
  | 'Kursteilnahme'
  | 'ZohoSign_Documents'
  | 'Stage_History'
  | 'Erwarteter_Zahlungseingang'
  | 'rented_hardware'
  | 'Zoho_Survey'
  | 'Qualifizierungsplan'
  | 'Course_States'
  | 'Zoho_Support'
  | 'expected_payments'
  | 'Absences';

export type ZohoQuotesRelatedModuleNames =
  | DefaultRelatedModuleNames
  | 'Qualifizierungsplan'
  | 'Followup_Quotes';

export type ZohoProductsRelatedModuleNames =
  | DefaultRelatedModuleNames
  | 'Deals'
  | 'Contacts'
  | 'Leads16'
  | 'Kursteilnahme'
  | 'Qualiplan_Eintr_ge'
  | 'Leads'
  | 'Course_States'
  | 'Zoho_Support'
  | 'measures_sheet_entires';

export type ZohoSalesOrdersRelatedModuleNames =
  | DefaultRelatedModuleNames
  | 'Invoices'
  | 'Events_History'
  | 'Zoho_Sign_Documents';

export type InvoicesRelatedModuleNames =
  | DefaultRelatedModuleNames
  | 'Events_History'
  | 'Zoho_Sign_Documents';

export type EnrolmentsRelatedModuleNames =
  | DefaultRelatedModuleNames
  | 'Events_History';

export type AbsenceRelatedModuleNames =
  | DefaultRelatedModuleNames
  | 'Entity_Cadences_CustomModule8'
  | 'Events_History';

export type LicenseRelatedModuleNames =
  | DefaultRelatedModuleNames
  | 'StatusVerlauf'
  | 'Events_History'
  | 'Entity_Cadences_CustomModule10';

export type CallsRelatedModuleNames = DefaultRelatedModuleNames;
export type FaceToFaceEventRelatedModuleNames =
  | DefaultRelatedModuleNames
  | 'Entity_Cadences_CustomModule7'
  | 'Kursteilnahme_Methodenkompetenz'
  | 'Pr_sensteilnahmen'
  | 'Events_History';

export type VoucherRelatedModuleNames =
  | DefaultRelatedModuleNames
  | 'Events_History';

export type LocationRelatedModuleNames =
  | DefaultRelatedModuleNames
  | 'Events_History'
  | 'Entity_Cadences_CustomModule4'
  | 'Standort1'
  | 'Standorte_Abschl_sse'
  | 'Pr_senzveranstaltungen'
  | 'Ma_nahmeb_gen'
  | 'Erwartete_Hardware';

export type CurseRelatedModuleNames =
  | DefaultRelatedModuleNames
  | 'Zoho_Survey'
  | 'Contacts9'
  | 'Software_Lizenz1'
  | 'Qualiplan_Eintr_ge'
  | 'Entity_Cadences_CustomModule1'
  | 'Hardwareverleihe';

export type ZohoMeasureSheetRelatedModuleNames =
  | DefaultRelatedModuleNames
  | 'Events_History'
  | 'Abschl_sse_Ma_nahmenummer'
  | 'Angebote'
  | 'sheet_entries'
  | 'extend_requests';

export type AccountsMeasureSheetRelatedModuleNames =
  | DefaultRelatedModuleNames
  | 'Deals'
  | 'Contacts'
  | 'Events_History'
  | 'Products'
  | 'Quotes'
  | 'SalesOrders'
  | 'Invoices'
  | 'Child_Accounts'
  | 'Social'
  | 'Related_List_Name_1'
  | 'Agentur_Leads'
  | 'Berater_bei_TN'
  | 'ZohoSign_Documents'
  | 'Zoho_Support'
  | 'partners16';

export type TasksMeasureSheetRelatedModuleNames = DefaultRelatedModuleNames;
export type Abwesenheiten2MeasureSheetRelatedModuleNames =
  | DefaultRelatedModuleNames
  | 'Events_History'
  | 'Entity_Cadences_CustomModule9'
  | 'Contacts5';

export type LizenztypenMeasureSheetRelatedModuleNames =
  | DefaultRelatedModuleNames
  | 'Events_History'
  | 'Entity_Cadences_CustomModule12'
  | 'Lizenzen_verbunden1'
  | 'Kurse_verbunden';

export type Erwartete_ZahlungenMeasureSheetRelatedModuleNames =
  | DefaultRelatedModuleNames
  | 'Zahlungseing_nge'
  | 'account_receivables'
  | 'Events_History'
  | 'Entity_Cadences_CustomModule11';

export type CampaignsMeasureSheetRelatedModuleNames =
  | DefaultRelatedModuleNames
  | 'Child_Campaigns'
  | 'Leads'
  | 'Contacts'
  | 'Deals'
  | 'Events_History';

export type Services__sMeasureSheetRelatedModuleNames =
  | DefaultRelatedModuleNames
  | 'Appointments__s';

export type Appointments__sMeasureSheetRelatedModuleNames =
  | DefaultRelatedModuleNames
  | 'Appointments_Rescheduled_History__s';

export type zohosign__ZohoSign_DocumentsMeasureSheetRelatedModuleNames =
  | DefaultRelatedModuleNames
  | 'ZohoSign_Recipients'
  | 'ZohoSign_Document_Events'
  | 'Events_History';

export type zohosign__ZohoSign_RecipientsMeasureSheetRelatedModuleNames =
  | DefaultRelatedModuleNames
  | 'Events_History';

export type zohosign__ZohoSign_Document_EventsMeasureSheetRelatedModuleNames =
  | DefaultRelatedModuleNames
  | 'Events_History';

export type Lead_Ma_nahmen_Kombi = DefaultRelatedModuleNames | 'Events_History';

export type DemonstrationEventRelatedMoudleNames =
  | DefaultRelatedModuleNames
  | 'Teilnahme_geplant'
  | 'Leads';

export type SoftwarelizenzenRelatedMoudleNames =
  | DefaultRelatedModuleNames
  | 'Events_History'
  | 'Entity_Cadences_CustomModule26';

export type HardwareRelatedMoudleNames =
  | DefaultRelatedModuleNames
  | 'Events_History'
  | 'Verleihe'
  | 'Entity_Cadences_CustomModule29';

export type StudentHardwareRentalsRelatedMoudleNames =
  | DefaultRelatedModuleNames
  | 'Status_Verlauf'
  | 'Events_History'
  | 'Entity_Cadences_CustomModule30';

export type QualificationPlansRelatedMoudleNames =
  | DefaultRelatedModuleNames
  | 'Eintrag'
  | 'Entity_Cadences_CustomModule31';

export type QualificationPlanEntriesRelatedMoudleNames =
  | DefaultRelatedModuleNames
  | 'Events_History'
  | 'Entity_Cadences_CustomModule28';

export type nl_course_states = DefaultRelatedModuleNames | 'Events_History';

export type ProductPackagesRelatedMoudleNames =
  | DefaultRelatedModuleNames
  | 'Events_History'
  | 'Leads'
  | 'Deals'
  | 'Quotes'
  | 'Suitability_Assessments';

export type ZohoSuitabilityAssessmentRelatedModuleNames =
  | DefaultRelatedModuleNames
  | 'Work_Experiences'
  | 'Quotes';

export type WorkExperiencesRelatedMoudleNames =
  | DefaultRelatedModuleNames
  | 'Interests';

export type WorkInterestsRelatedMoudleNames = DefaultRelatedModuleNames;
export type PartnersRelatedMoudleNames =
  | DefaultRelatedModuleNames
  | 'Events_History'
  | 'Accounts16'
  | 'leads'
  | 'contacts'
  | 'Deals';

export type Events = DefaultRelatedModuleNames | 'Invitees';

export type Services_X_Users__s = DefaultRelatedModuleNames;
export type partners_X_Accounts = DefaultRelatedModuleNames | 'Events_History';

export type AssignmentEvaluationsRelatedMoudleNames =
  | DefaultRelatedModuleNames
  | 'Events_History';

export type AccountsReceivablesRelatedMoudleNames =
  | DefaultRelatedModuleNames
  | 'Events_History'
  | 'Zoho_Survey';

export type TransactionsRelatedMoudleNames =
  | DefaultRelatedModuleNames
  | 'Events_History'
  | 'Zoho_Survey';

export type MeasureSheetEntriesRelatedMoudleNames = DefaultRelatedModuleNames;
export type ZohoMeasureSheetExtendRequestRelatedModuleNames =
  | DefaultRelatedModuleNames
  | 'attachment_two';

export type WelcomeEventsRelatedMoudleNames =
  | DefaultRelatedModuleNames
  | 'Events_History'
  | 'Zoho_Survey'
  | 'Deals';

export type AbsencesRelatedMoudleNames =
  | DefaultRelatedModuleNames
  | 'Events_History'
  | 'Zoho_Survey'
  | 'Entity_Cadences_CustomModule47';
