import {CitiesModel} from "./cities.model";

export interface RouteModel {
  id: string;
  originId: string;
  destinationId: string;
  distance: number;
  duration: number;
  origin: CitiesModel | null;
  destination: CitiesModel | null;
}
