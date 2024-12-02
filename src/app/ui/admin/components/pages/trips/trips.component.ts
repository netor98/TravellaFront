import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-trips',
  templateUrl: './trips.component.html',
  styleUrl: './trips.component.css'
})
export class TripsComponent {
  products = [
    {
      code: 'f230fh0g3',
      name: 'Bamboo Watch',
      image: 'https://via.placeholder.com/50',
      price: 65.0,
      category: 'Accessories',
      reviews: 5,
      status: 'IN',
    },
    {
      code: 'nvklal433',
      name: 'Black Watch',
      image: 'https://via.placeholder.com/50',
      price: 72.0,
      category: 'Accessories',
      reviews: 4,
      status: 'OUT',
    },
    {
      code: 'zz21cz3c1',
      name: 'Blue Band',
      image: 'https://via.placeholder.com/50',
      price: 79.0,
      category: 'Fitness',
      reviews: 3,
      status: 'LOW',
    },
    {
      code: '244wgerg2',
      name: 'Blue T-Shirt',
      image: 'https://via.placeholder.com/50',
      price: 29.0,
      category: 'Clothing',
      reviews: 5,
      status: 'IN',
    },
  ];

  displayModal: boolean = false;
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  openModal(): void {
    this.displayModal = true;
  }

  closeModal(): void {
    this.displayModal = false;
    this.form.reset();
  }

  onSubmit(): void {
    if (this.form.valid) {
      console.log('Form submitted:', this.form.value);
      this.closeModal();
    } else {
      console.error('Form is invalid');
    }
  }



}
