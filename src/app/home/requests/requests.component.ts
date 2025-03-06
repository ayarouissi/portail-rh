import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RequestsService, Request } from './requests.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-requests',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss']
})
export class RequestsComponent implements OnInit {
  requests: Request[] = [];
  filteredRequests: Request[] = [];
  selectedStatus: string = 'all';

  statusOptions = [
    { value: 'all', label: 'Toutes les demandes' },
    { value: 'En attente', label: 'En attente' },
    { value: 'Approuvée', label: 'Approuvées' },
    { value: 'Rejetée', label: 'Rejetées' }
  ];

  constructor(
    private router: Router,
    private requestsService: RequestsService
  ) {}

  ngOnInit() {
    this.requestsService.getRequests().subscribe(requests => {
      this.requests = requests;
      this.filterRequests();
    });
  }

  filterRequests() {
    if (this.selectedStatus === 'all') {
      this.filteredRequests = this.requests;
    } else {
      this.filteredRequests = this.requests.filter(request => request.status === this.selectedStatus);
    }
  }

  onStatusChange() {
    this.filterRequests();
  }

  createNewRequest() {
    this.router.navigate(['/home/requests/new']);
  }

  viewDetails(id: string) {
    this.router.navigate(['/home/requests', id]);
  }

  editRequest(id: string, type: string) {
    switch (type) {
      case 'Congé annuel':
        this.router.navigate(['/home/requests/leave/edit', id]);
        break;
      case 'Formation':
        this.router.navigate(['/home/requests/training/edit', id]);
        break;
      case 'Attestation de travail':
        this.router.navigate(['/home/requests/certificate/edit', id]);
        break;
      case 'Prêt':
        this.router.navigate(['/home/requests/loan/edit', id]);
        break;
      case 'Avance':
        this.router.navigate(['/home/requests/advance/edit', id]);
        break;
      case 'Document':
        this.router.navigate(['/home/requests/document/edit', id]);
        break;
    }
  }
}
