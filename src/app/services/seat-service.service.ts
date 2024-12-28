import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class SeatServiceService {


  private hubConnection!: signalR.HubConnection;
  startConnection(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5289/seatHub')
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('SignalR connection started'))
      .catch(err => console.error('Error starting SignalR connection: ', err));
  }

  addSeatStatusListener(callback: (tripId: string, seatNumber: number, status: string) => void): void {
    this.hubConnection.on('SeatStatusChanged', callback);
  }

}
