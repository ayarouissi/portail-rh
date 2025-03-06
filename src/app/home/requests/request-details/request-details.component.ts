import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestsService } from '../requests.service';
import { Request as RequestModel } from '../request.model';
import { Request as ServiceRequest } from '../requests.service';

@Component({
  selector: 'app-request-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './request-details.component.html',
  styleUrls: ['./request-details.component.scss']
})
export class RequestDetailsComponent implements OnInit {
  request?: RequestModel;
  requestTypes = {
    LOAN: 'Prêt',
    DOCUMENT: 'Document',
    TRAINING: 'Formation',
    ADVANCE: 'Avance'
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private requestsService: RequestsService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const foundRequest = this.requestsService.getRequestById(id);
      if (foundRequest) {
        // Convert the service request to model request
        this.request = this.convertServiceRequestToModel(foundRequest);
      } else {
        this.router.navigate(['/home/requests']);
      }
    } else {
      this.router.navigate(['/home/requests']);
    }
  }

  private convertServiceRequestToModel(serviceRequest: ServiceRequest): RequestModel {
    return {
      ...serviceRequest,
      details: {
        ...serviceRequest.details,
        // Convert boolean urgency to string if it exists
        urgency: typeof serviceRequest.details?.urgency === 'boolean' 
          ? serviceRequest.details.urgency ? 'high' : 'normal'
          : serviceRequest.details?.urgency
      }
    };
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'en attente':
        return 'status-pending';
      case 'approuvée':
        return 'status-approved';
      case 'rejetée':
        return 'status-rejected';
      default:
        return '';
    }
  }

  formatDate(date: string | undefined): string {
    if (!date) return '';
    try {
      return new Date(date).toLocaleDateString('fr-FR');
    } catch {
      return '';
    }
  }

  onBack() {
    this.router.navigate(['/home/requests']);
  }

  onEdit() {
    if (this.request) {
      const type = this.request.type.toLowerCase();
      this.router.navigate([`/home/requests/${type}/edit/${this.request.id}`]);
    }
  }

  onDelete() {
    if (this.request && confirm('Êtes-vous sûr de vouloir supprimer cette demande ?')) {
      this.requestsService.deleteRequest(this.request.id);
      this.router.navigate(['/home/requests']);
    }
  }

  approveRequest() {
    if (this.request) {
      this.requestsService.updateRequestStatus(this.request.id, 'Approuvée');
      this.request.status = 'Approuvée';
    }
  }

  rejectRequest() {
    if (this.request) {
      this.requestsService.updateRequestStatus(this.request.id, 'Rejetée');
      this.request.status = 'Rejetée';
    }
  }

  getRequestTypeLabel(type: string): string {
    const typeKey = Object.keys(this.requestTypes).find(
      key => this.requestTypes[key as keyof typeof this.requestTypes].toLowerCase() === type.toLowerCase()
    );
    return typeKey ? this.requestTypes[typeKey as keyof typeof this.requestTypes] : type;
  }
}
