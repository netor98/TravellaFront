import {Order} from "./Order";
import {User} from "./user.model";
import {TripDetails} from "./TripDetails.interface";
import {Status} from "./Status";

export interface Ticket {
  id: string;
  orderId: string;
  userId: string | null;
  contactInfo: string | null;
  tripId: string;
  purchaseTime: string;
  seatNumber: number;
  statusId: string;
  status: Status | null;
  trip: TripDetails;
  user: User | null;
  order: Order | null;
}
