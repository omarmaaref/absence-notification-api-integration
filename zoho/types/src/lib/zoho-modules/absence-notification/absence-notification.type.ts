// AbsenceNotification
import { Absence } from '../absence/absence.type';
import { Deal } from '../deal/deal.type';

export enum AbsenceNotificationStatus {
  CREATED = 'CREATED',
  LINKED_WITH_Absences = 'LINKED_WITH_Absences',
  PDF_GENERATED = 'PDF_GENERATED',
  REPORTED = 'REPORTED',
}

export type AbsenceNotification = {
  _type: 'AbsenceNotification';
  Name: string; // Single Line
  absence_notification_owner: string; // User (could be a string or a User type if defined elsewhere)
  id: string;
  deal: Deal | { id: string }; // Lookup
  created_by: string; // Single Line
  modified_by: string; // Single Line
  start_date?: string; // Date
  end_date?: string; // Date
  BA_Responsible?: string; // Single Line
  Absences: Absence[] | { Absences: { id: string } }[]; // Multi-Select Lookup
  Status?: AbsenceNotificationStatus;
  Period_Absences_count_in_days?: number; // Number
  Total_Absences_Count_in_days?: number; // Number
};
