import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BusService} from "../../../../services/bus.service";
import {Router} from "@angular/router";
import Swal from "sweetalert2";
import mapboxgl from 'mapbox-gl';
import {environment} from "../../../../../environments/environment.development";

@Component({
  selector: 'app-search-details',
  templateUrl: './search-details.component.html',
  styleUrl: './search-details.component.css'
})
export class SearchDetailsComponent implements OnInit {
  @Input() originCity: string = '';
  @Input() codeOrigin: string = '';
  @Input() stateOrigin: string = '';
  @Input() stateDestination: string = '';
  @Input() destinationCity: string = '';
  @Input() codeDestination: string = '';
  @Input() departureTime: string = '';
  @Input() arrivalTime: string = '';
  @Input() duration: string = '';
  @Input() price: string = '';
  @Input() tripType: string = '';
  @Input() trip: any;
  @Output() book = new EventEmitter<any>();
  @Input() tripId!: string;
  availableSeats: number[] = [];
  totalSeats: number = 0;
  reservedSeats: number = 0;
  public items: any[] = []
  trips: any[] = [];
  isRoundTrip: boolean = false; // Indica si es un viaje redondo
  selectedOutboundTrip: any = null;
  statusActive: string = 'abcd223d-0bb6-4867-9185-07bb4b661048';


  private readonly mapBoxToken: string = environment.MAPBOX_KEY;
  constructor(private busService: BusService, private router: Router) {
  }

  ngOnInit() {

    this.fetchAvailableSeats();
    this.items = [
      {
        label: 'Save',
        icon: 'pi pi-save',
      },
      {
        label: 'See Details',
        icon: 'pi pi-info-circle',
        command: () => this.viewOrderDetails(this.trip),
      },
      {
        label: 'Search',
        icon: 'pi pi-search'
      },
      {
        separator: true
      },
    ]
  }

  bookTrip(trip: any) {
    const state = JSON.parse(localStorage.getItem('searchTripState') || '{}');
    if (state.isRoundTrip && !state.selectedOutboundTrip) {

      state.selectedOutboundTrip = trip;
      localStorage.setItem('searchTripState', JSON.stringify(state));
      // Guardar el viaje de ida seleccionado
      const origin = state.originCity;
      const destination = state.destinationCity;


      // Realizar búsqueda para el viaje de vuelta
      const searchParams = {
        originCity: state.selectedTo.name,
        destinationCity: state.selectedFrom.name,
        departureTime: state.returnDate,
        sortBy: 'departureTime',
        isAscending: true,
        pageNumber: 1,
        pageSize: 500,
        statusId: this.statusActive
      };

      this.router.navigate(['/search'], {queryParams: searchParams});


      this.busService
        .getFilteredTrips(
          searchParams.originCity!,
          searchParams.destinationCity!,
          searchParams.departureTime!,
          searchParams.sortBy,
          searchParams.isAscending,
          searchParams.pageNumber,
          searchParams.pageSize
        )
        .subscribe((trips) => {
          this.trips = trips;
        });
    } else {
      // Confirmar viaje redondo o sencillo
      const bookingDetails = {
        outboundTrip: state.selectedOutboundTrip || trip, // Viaje de ida
        returnTrip: state.isRoundTrip ? trip : null,      // Viaje de vuelta, si aplica
      };
      localStorage.setItem('bookingDetails', JSON.stringify(bookingDetails));


      // Redirigir a la página de confirmación de reserva
      this.router.navigate(['/booking'], {state: {bookingDetails}});

      this.book.emit(trip);
    }
  }

  fetchAvailableSeats(): void {
    this.busService.getAvailableSeats(this.tripId).subscribe({
      next: (data) => {
        this.availableSeats = data.availableSeats;
        this.totalSeats = data.totalCapacity;
        this.reservedSeats = data.reservedCount;
      },
      error: (err) => {
        console.error('Error fetching available seats:', err);
      },
    });
  }


  viewOrderDetails(trip: any): void {

    const tripDetails = `
      <strong>Route:</strong> ${trip.route.origin.name} to ${trip.route.destination.name}<br>
      <strong>Departure:</strong> ${new Date(trip.departureTime).toLocaleString()}<br>
      <strong>Arrival:</strong> ${new Date(trip.arrivalTime).toLocaleString()}<br>
      <strong>Price:</strong> ${trip.price}<br>
      <strong>Available Seats:</strong> ${this.totalSeats - this.reservedSeats}<br>
      <div id="map" style="width: 100%; height: 300px; margin-top: 20px;"></div>
    `;

    Swal.fire({
      title: `Trip Details`,
      html: `<div style="text-align: left">${tripDetails}</div>`,
      icon: 'info',
      confirmButtonText: 'Close',
      width: '600px',
      didOpen: async () => {
        (mapboxgl as any).accessToken = this.mapBoxToken;

        // Geocode origin and destination
        const originCoords = await this.geocodeCity(trip.route.origin.name, this.mapBoxToken);
        const destinationCoords = await this.geocodeCity(trip.route.destination.name, this.mapBoxToken);

        // Initialize the map
        const map = new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://styles/mapbox/streets-v11',
          center: originCoords,
          zoom: 6,
          dragPan: false,
         interactive: false
        });

        new mapboxgl.Marker().setLngLat(originCoords).addTo(map);
        new mapboxgl.Marker().setLngLat(destinationCoords).addTo(map);

        // Fit bounds
        const bounds = new mapboxgl.LngLatBounds();
        bounds.extend(originCoords).extend(destinationCoords);
        map.fitBounds(bounds, { padding: 50 });
      }
    });
  }

  private async geocodeCity(city: string, accessToken: string): Promise<mapboxgl.LngLatLike> {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(city)}.json?access_token=${this.mapBoxToken}`
    );
    const data = await response.json();
    const [lng, lat] = data.features[0].center;
    return [lng, lat];
  }
}
