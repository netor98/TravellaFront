import {Component, OnInit} from '@angular/core';
import {BarcodeFormat} from "@zxing/library";
import {HttpClient} from "@angular/common/http";
import {MessageService} from "primeng/api";
import {TicketsService} from "../../../../../services/tickets.service";

@Component({
  selector: 'app-ticket-scanner',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css']
})
export class SalesComponent implements OnInit {
  tickets: any[] = [];
  totalTickets: number = 0;
  currentPage: number = 1;
  pageSize: number = 50;
  filters: any = {
    startDate: null,
    endDate: null,
    statusId: null,
    userId: null,
  };

  constructor(private ticketService: TicketsService, private messageService: MessageService) {
  }
  ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets(): void {
    this.ticketService
      .getTickets(
        this.currentPage,
        this.pageSize,
        this.filters.startDate,
        this.filters.endDate,
        this.filters.statusId,
        this.filters.userId
      )
      .subscribe({
        next: (response) => {
          this.tickets = response;
          this.totalTickets = response.length; // Adjust if your backend returns `totalTickets`
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load tickets.',
          });
        },
      });
  }


  scanResult: string | null = null;

  isScannerVisible: boolean = false;
  scannedResult: string | null = null;
  isRequestInProgress: boolean = false;
  lastScannedResult: string | null = null;

  // Open the scanner modal
  openScanner(): void {
    this.isScannerVisible = true;
  }

  // Handle successful QR code scanning
  onScanSuccess(qrCode: string): void {

    if (this.isRequestInProgress || this.lastScannedResult === qrCode) {
      return;
    }
    this.scannedResult = qrCode;
    this.lastScannedResult = qrCode;
    this.isScannerVisible = false;
    this.isRequestInProgress = true;

    this.ticketService.validateAndBoard(this.scannedResult).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Boarding Successful',
          detail: `Ticket ${response.ticketId} successfully marked as boarded.`,
        });
        this.isRequestInProgress = false;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Boarding Failed',
          detail: err.error.message || 'Could not validate ticket.',
        });

        this.isRequestInProgress = false;
      },
    });
  }

  // Close the scanner modal
  closeScanner(): void {
    this.isScannerVisible = false;
    this.isRequestInProgress = false;
    this.scannedResult = null;
    this.lastScannedResult = null;
  }

  applyFilters(): void {
    this.currentPage = 1; // Reset to first page when filters are applied
    this.loadTickets();
  }

  onPageChange(event: any): void {
    this.currentPage = event.page + 1;
    this.pageSize = event.rows;
    this.loadTickets();
  }

  protected readonly BarcodeFormat = BarcodeFormat;
}
