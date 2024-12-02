import {Status} from "./Status";
import {Ticket} from "./Ticket";

export interface OrderDto {
  contactInfo: string | null | undefined;
  purchaseTime: string;
  statusId: string;
  tickets: Ticket[];
  userId: string | null;
}
