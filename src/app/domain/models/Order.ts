import {Status} from "./Status";
import {Ticket} from "./Ticket";

export interface Order {
  id: string;
  purchaseTime: string;
  userId: string | null;
  contactInfo: string | null | undefined;
  statusId: string;
  tickets: Ticket[];
  status: Status | null;
}
