import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {TicketsService} from "../../../../services/tickets.service";
import {OrdersService} from "../../../../services/orders.service";

@Component({
  selector: 'app-complaint',
  templateUrl: './complaint.component.html',
  styleUrl: './complaint.component.css'
})
export class ComplaintComponent implements OnInit {
  orderId: string | null = null;
  order: any;
  complaintForm: FormGroup;
  loading: boolean = true;
  totalAmount: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private ordersService: OrdersService
  ) {
    this.complaintForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(5)]],
      lastName: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.email]],
      complaint: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('orderId');
    if (!this.orderId) {
      this.router.navigate(['/my-orders']);
    }

    // Fetch order details
    this.ordersService.getOrderById(this.orderId!).subscribe((order) => {
      this.order = order;
      console.log('Order:', this.order);
      this.totalAmount = order.tickets.reduce((acc: number, ticket: any) => acc + ticket.trip.price, 0);
      setTimeout(() => {
        this.loading = false;
      }, 1500)
    });
  }

  submitComplaint(): void {
    if (this.complaintForm.valid) {
      const complaint = {
        orderId: this.orderId,
        ...this.complaintForm.value,
      };

      // Submit the complaint to the backend
      console.log('Complaint submitted:', complaint);
      alert('Complaint submitted successfully!');
    }
  }

}
