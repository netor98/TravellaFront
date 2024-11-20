export interface TripsResponse {
  id: string;
  vehicleId: string;
  driverId: string;
  routeId: string;
  departureTime: string;
  arrivalTime: string;
  route: {
    origin: { name: string };
    destination: { name: string };
  };
  vehicle: { name: string };
  driver: { username: string };
  price: number;
}
