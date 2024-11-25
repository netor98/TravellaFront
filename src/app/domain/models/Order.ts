import {Status} from "./Status";

export interface Order {
  id: string;
  purchaseTime: string;
  userId: string | null;
  contactInfo: string | null;
  statusId: string;
  status: Status | null;
}
