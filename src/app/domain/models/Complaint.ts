import {Status} from "./Status";
import {Order} from "./Order";

export interface Complaint {
  id: string;
  userId: string;
  description: string;
  status: Status;
  order: Order;
  complaintType: {
    id: string;
    name: string;
    description: string;
  }
  dateSubmitted: Date;
  dateResolved: Date;
  resolutionDetails: string;
}
