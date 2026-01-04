import { Absence } from './absence/absence.type';
import { ActionSheet } from './action-sheet/action-sheet.type';
import { Deal } from './deal/deal.type';
import { KTNEnrolment } from './enrolment/KTNEnrolment.type';
import { Product } from './product/product.type';
import { QualificationPlan } from './qualification-plan/qualification-plan.type';
import { Account } from './account/account.type';
import { AccountsReceivable } from './accounts-receivable/accounts-receivable.type';
import { Attachment } from './attachment/attachment.type';
import { Contact } from './contact/contact.type';
import { Lead } from './lead/lead.type';
import { Quote } from './quote/quote.type';
import { Course } from './course/course.type';
import { Debtor } from './debtor/debtor.type';
import { Hardware } from './hardware/hardware.type';
import { HardwareRental } from './hardware-rental/hardware-rental.type';
import { MeasureSheetEntry } from './measure-sheet-entry/measure-sheet-entry.type';
import { QualificationPlanEntry } from './qualification-plan-entry/qualification-plan-entry.type';
import { Transaction } from './transaction/transaction.type';
import { WelcomeEvent } from './welcome-event/welcome-event.type';
import { Note } from './note/note.type';
import { SheetExtendRequest } from './sheet-extend-request/sheet-extend-request.type';
import { Location } from './location/location.type';
import { DegreeDesignation } from './degree-designation/degree-designation.types';
import { CourseEnrollment } from './course-enrollment/course-enrollment.type';
import { InfoEvent } from './demoveranstaltungen/info-event.type';
import { AbsenceNotification } from './absence-notification/absence-notification.type';
import { ContactRole } from '@company/zoho-types';

/****************************************
 *
 *  Module (Types)
 * ...to be continued...
 */
// prettier-ignore
export type ZohoModules =  InfoEvent|CourseEnrollment|DegreeDesignation|Lead|Account|AccountsReceivable|ActionSheet|Contact|Course|Deal|Quote|Debtor|KTNEnrolment|Hardware|HardwareRental|Location|MeasureSheetEntry|Product|QualificationPlan|QualificationPlanEntry|Transaction|WelcomeEvent|Note|Attachment|Absence|AbsenceNotification|ContactRole|SheetExtendRequest

/****************************************
 *
 * Mapping of Module Types to Module Names (strings for the api url)
 * ...to be continued...
 *
 **/
// prettier-ignore
export type ModuleName<T extends ZohoModules> =
  T extends InfoEvent ? 'Demoveranstaltungen' :
  T extends Lead ? 'Leads' :
    T extends Account ? 'Accounts' :
      T extends AccountsReceivable ? 'accounts_receivables' :
        T extends ActionSheet ? 'ActionSheet' :
          T extends Contact ? 'Contacts' :
            T extends Course ? 'Kurse' :
              T extends Deal ? 'Deals' :
                T extends Quote ? 'Quotes' :
                  T extends Debtor ? 'Erwartete_Zahlungen' :
                    T extends CourseEnrollment ? 'course_enrollments' :
                    T extends KTNEnrolment ? 'Kursteilnahmen' :
                      T extends Hardware ? 'Hardware' :
                        T extends HardwareRental ? 'hardware_rentals' :
                          T extends Location ? 'Locations' :
                            T extends MeasureSheetEntry ? 'measure_sheet_entries' :
                              T extends Product ? 'Products' :
                                T extends QualificationPlan ? 'qualificationPlans' :
                                  T extends QualificationPlanEntry ? 'qualificationPlanEntries' :
                                    T extends Transaction ? 'transactions' :
                                      T extends WelcomeEvent ? 'welcome_events' :
                                        T extends DegreeDesignation ? 'degree_designations' :
                                        T extends Note ? 'Notes' :
                                          T extends Attachment ? 'Attachments' :
                                            T extends Absence ? 'absences' :
                                              T extends AbsenceNotification ? 'Absence_Notifications' :
                                                T extends SheetExtendRequest ? 'sheet_extend_requests' :
                                                  never;
