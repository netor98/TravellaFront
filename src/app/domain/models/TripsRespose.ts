export interface TripsResponse {
  id: string;
  vehicleId: string;
  driverId: string;
  routeId: string;
  departureTime: string;
  arrivalTime: string;
  route: {
    origin: {
      name: string;
      code: string;
      state: string;
    };
    destination: {
      name: string;
      code: string;
      state: string;
    };
  };
  vehicle: { name: string };
  driver: { username: string };
  price: number;
}
