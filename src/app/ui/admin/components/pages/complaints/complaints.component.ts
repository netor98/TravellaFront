import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ComplaintsService} from "../../../../../services/complaints.service";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-complaints',
  templateUrl: './complaints.component.html',
  styleUrl: './complaints.component.css'
})
export class ComplaintsComponent implements OnInit {
  complaints: any[] = [];
  displayResponseModal: boolean = false;
  form: FormGroup;
  selectedComplaintId: string | null = null;
  displayViewModal: boolean = false; // For viewing resolved details
  selectedComplaint: any = null; // Stores the selected complaint for viewing or responding
  globalFilter: string = '';

  constructor(
    private complaintsService: ComplaintsService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    this.form = this.fb.group({
      resolutionDetails: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.fetchComplaints();
  }

  fetchComplaints(): void {
    this.complaintsService.getComplaints().subscribe({
      next: (data) => {this.complaints = data; console.log(data);},
      error: () =>
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load complaints.',
        }),
    });
  }

  openResponseModal(complaintId: string): void {
    this.selectedComplaint = this.complaints.find((c) => c.id === complaintId);
    console.log(this.selectedComplaint);
    if (!this.selectedComplaint) {
      console.error(`Complaint with ID ${complaintId} not found.`);
      return;
    }

    this.displayResponseModal = true;
  }

  submitResponse(): void {
    if (this.form.valid && this.selectedComplaint) {
      const resolutionDetails = this.form.value.resolutionDetails;

      this.complaintsService
        .respondToComplaint(this.selectedComplaint.id, resolutionDetails)
        .subscribe({
          next: () => {
            this.fetchComplaints();
            this.displayResponseModal = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Resolved',
              detail: 'Complaint resolved successfully.',
            });
          },
          error: () =>
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to resolve complaint.',
            }),
        });
    }
  }

  openViewModal(complaintId: string): void {
    this.selectedComplaint = this.complaints.find((c) => c.id === complaintId);
    if (!this.selectedComplaint) {
      console.error(`Complaint with ID ${complaintId} not found.`);
      return;
    }

    this.displayViewModal = true;
  }

  closeModals(): void {
    this.displayResponseModal = false;
    this.displayViewModal = false;
    this.selectedComplaint = null;
  }

  applyGlobalFilter(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.globalFilter = input.value;
  }
}
