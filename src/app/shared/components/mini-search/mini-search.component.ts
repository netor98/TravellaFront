import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-mini-search',
  templateUrl: './mini-search.component.html',
  styleUrl: './mini-search.component.css'
})
export class MiniSearchComponent implements OnInit {
  ngOnInit(): void {
    this.searchTicket();
  }

  from: string = '';
  to: string = '';
  departDate: Date | null = null;
  returnTrip: boolean = false;
  passengers: string = '1 adult';
  seatClass: string = 'Economy';

  searchTicket() {
    const searchParams = {
      from: this.from,
      to: this.to,
      departDate: this.departDate,
      returnTrip: this.returnTrip,
      passengers: this.passengers,
      seatClass: this.seatClass
    };
    console.log('Search Parameters:', searchParams);
    // Add API call or navigation logic here
  }

}
