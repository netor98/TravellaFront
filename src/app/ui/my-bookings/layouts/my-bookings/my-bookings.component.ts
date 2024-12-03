import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AuthService} from "../../../../services/auth.service";
import {Ticket} from "../../../../domain/models/Ticket";
import Swal from "sweetalert2";
import {Router} from "@angular/router";
import {Order} from "../../../../domain/models/Order";
import {OrdersService} from "../../../../services/orders.service";
import {MenuItem} from "primeng/api";
import {Complaint} from "../../../../domain/models/Complaint";
import {ComplaintsService} from "../../../../services/complaints.service";

@Component({
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.component.html',
  styleUrl: './my-bookings.component.css'
})

export class MyBookingsComponent implements OnInit {
  orders: Order[] = [];
  paginatedOrders: any[] = [];
  loading: boolean = true;
  error: string | null = null;
  dateRange: Date[] = [];
  filteredOrders: any[] = [];
  first: number = 0;
  rows: number = 5;
  sort: boolean = false;
  minDate: Date;
  maxDate: Date;
  ticketInfo: Ticket | null = null;
  @ViewChild('ticketInfo', {static: false}) ticketInfoRef!: ElementRef;
  items: MenuItem[] = [];
  complaints: Complaint[] = [];

  constructor(
    private orderService: OrdersService,
    private authService: AuthService,
    private router: Router,
    private complaintsService: ComplaintsService,
  ) {

    this.maxDate = new Date();
    this.minDate = new Date();
    this.minDate.setMonth(this.minDate.getMonth() - 3);
  }

  ngOnInit(): void {
    const userId = this.authService.currentUser()()?.id;
    if (userId) {
      this.fetchOrders(userId);
      this.fetchUserComplaints(userId);
    } else {
      this.error = 'User not logged in.';
      this.loading = false;
    }

  }

  fetchUserComplaints(userId: string): void {
    this.complaintsService.getComplaintsByUser(userId).subscribe((data: Complaint[]) => {
      console.log(data);
      this.complaints = data;
    });
  }

  hasComplaintForOrder(orderId: string): boolean {
    console.log(orderId)
    return this.complaints.some(complaint => complaint.order.id === orderId);
  }


  fetchOrders(userId: string): void {
    this.orderService.getOrdersByUserId(userId).subscribe({
      next: (data: Order[]) => {
        this.orders = data;
        this.filteredOrders = data;
        this.filterOrdersByDate();
        this.updatePaginatedOrders();
        setTimeout(() => {
          this.loading = false;
        }, 1500);
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to load tickets.';
        this.loading = false;
      }
    });
  }

  updatePaginatedOrders(): void {
    const start = this.first;
    const end = this.first + this.rows;
    this.paginatedOrders = this.filteredOrders.slice(start, end);
  }

  onPageChange(event: any): void {
    window.scrollTo({top: 0, behavior: 'smooth'});
    this.first = event.first;
    this.rows = event.rows;
    this.updatePaginatedOrders();
  }

  getOrderMenu(order: Order): MenuItem[] {
    const currentDate = new Date();
    return [
      {
        label: 'View Details',
        icon: 'pi pi-eye',
        command: () => this.viewOrderDetails(order)
      },
      {
        label: 'Make complainment',
        icon: 'pi pi-exclamation-triangle',
        disabled: this.hasComplaintForOrder(order.id),
        command: () => this.navigateToComplaint(order.id)
      },
      {

        label: 'Cancel Order',
        icon: 'pi pi-times'}
       /* disabled: order.tickets?.some(ticket => {
          const departureTime = new Date(ticket.trip.departureTime).getTime();
          return departureTime <= currentDate.getTime();
        }),
        command: () => this.cancelOrder(order)
      }*/
    ];
  }


  public navigateToComplaint(orderId: string): void {
    this.router.navigate(['/complaints', orderId]);
  }

  viewOrderDetails(order: any): void {
    console.log(order);
    const ticketDetails = order.tickets.map(
      (ticket: any, index: number) =>
        `<strong>Ticket ${index + 1}</strong>:<br>
      <b>Route:</b> ${ticket.trip.route.origin.name} to ${ticket.trip.route.destination.name}<br>
      <b>Seat Number:</b> ${ticket.seatNumber}<br>
      <b>Departure:</b> ${new Date(ticket.trip.departureTime).toLocaleString()}<br>
      <b>Price:</b> ${ticket.trip.price}<br><br>`
    );

    Swal.fire({
      title: `Order Details (#${order.id})`,
      html: `<div style="text-align: left">${ticketDetails.join('')}</div>`,
      icon: 'info',
      confirmButtonText: 'Close',
      width: '600px'
    });
  }

  cancelOrder(order: any): void {
    console.log('Canceling order:', order);
    // Implement cancel order functionality
  }

  onMenuToggle(menu: any, order: any, $event: any) {
    console.log("A");
    menu.model = this.getOrderMenu(order); // Dynamically assign the menu model
    menu.toggle(event);
  }

  filterOrdersByDate() {
    if (this.dateRange && this.dateRange.length === 2) {
      const [startDate, endDate] = this.dateRange;

      this.filteredOrders = this.orders.filter(order => {
        const orderDate = new Date(order.purchaseTime);
        return orderDate >= startDate && orderDate <= endDate;
      });
    } else {
      this.filteredOrders = [...this.orders];
    }

    // Sort by purchase time
    this.filteredOrders.sort((a, b) => {
      const dateA = new Date(a.purchaseTime).getTime();
      const dateB = new Date(b.purchaseTime).getTime();
      return this.sort ? dateA - dateB : dateB - dateA;
    });

    this.updatePaginatedOrders();
  }

  isValidDate(date: any): boolean {
    console.log(date);
    return date instanceof Date && !isNaN(date.getTime());
  }

}
