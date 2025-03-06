import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

export interface RequestDetails {
  startDate?: string;
  endDate?: string;
  leaveType?: string;
  reason?: string;
  title?: string;
  organization?: string;
  trainingType?: string;
  objectives?: string;
  cost?: number;
  purpose?: string;
  language?: string;
  copies?: number;
  comments?: string;
  workingDays?: number;
  loanAmount?: number;
  loanReason?: string;
  monthlyPayment?: number;
  duration?: number;
  advanceAmount?: number;
  advanceReason?: string;
  repaymentDate?: string;
  documentType?: string;
  urgency?: boolean;
  additionalInfo?: string;
}

export interface Request {
  id: string;
  userId: string;
  type: string;
  description: string;
  status: 'En attente' | 'Approuvée' | 'Rejetée';
  date: string;
  details: RequestDetails;
}

@Injectable({
  providedIn: 'root'
})
export class RequestsService {
  private requestsSubject = new BehaviorSubject<Request[]>([]);
  private requests: Request[] = [];

  constructor(private authService: AuthService) {
    // Charger les demandes depuis le localStorage
    const storedRequests = localStorage.getItem('requests');
    if (storedRequests) {
      this.requests = JSON.parse(storedRequests);
      this.requestsSubject.next(this.requests);
    }
  }

  getRequests(): Observable<Request[]> {
    // Ne retourner que les demandes de l'utilisateur connecté
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      const userRequests = this.requests.filter(r => r.userId === currentUser.id);
      this.requestsSubject.next(userRequests);
    }
    return this.requestsSubject.asObservable();
  }

  getAllRequests(): Observable<Request[]> {
    // Pour les administrateurs et les managers
    return new BehaviorSubject<Request[]>(this.requests).asObservable();
  }

  addLeaveRequest(data: any): void {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) return;

    const workingDays = this.calculateWorkingDays(data.startDate, data.endDate);
    const newRequest: Request = {
      type: 'Congé annuel',
      description: `Congé du ${data.startDate} au ${data.endDate} (${workingDays} jours ouvrables)`,
      details: {
        startDate: data.startDate,
        endDate: data.endDate,
        leaveType: data.leaveType,
        reason: data.reason,
        workingDays: workingDays
      },
      id: Date.now().toString(),
      userId: currentUser.id,
      status: 'En attente',
      date: new Date().toISOString()
    };

    this.requests.push(newRequest);
    this.saveRequests();
    this.getRequests(); // Mettre à jour la liste des demandes
  }

  addTrainingRequest(data: any): void {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) return;

    const newRequest: Request = {
      type: 'Formation',
      description: data.title,
      details: {
        title: data.title,
        organization: data.organization,
        startDate: data.startDate,
        endDate: data.endDate,
        trainingType: data.trainingType,
        objectives: data.objectives,
        cost: data.cost
      },
      id: Date.now().toString(),
      userId: currentUser.id,
      status: 'En attente',
      date: new Date().toISOString()
    };

    this.requests.push(newRequest);
    this.saveRequests();
    this.getRequests(); // Mettre à jour la liste des demandes
  }

  addCertificateRequest(data: any): void {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) return;

    const newRequest: Request = {
      type: 'Attestation de travail',
      description: `Attestation de travail - ${data.purpose === 'other' ? data.otherPurpose : data.purpose}`,
      details: {
        purpose: data.purpose === 'other' ? data.otherPurpose : data.purpose,
        language: data.language,
        copies: data.copies,
        comments: data.comments
      },
      id: Date.now().toString(),
      userId: currentUser.id,
      status: 'En attente',
      date: new Date().toISOString()
    };

    this.requests.push(newRequest);
    this.saveRequests();
    this.getRequests(); // Mettre à jour la liste des demandes
  }

  addLoanRequest(data: any): void {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) return;

    const newRequest: Request = {
      type: 'Prêt',
      description: `Demande de prêt de ${data.loanAmount}€ sur ${data.duration} mois`,
      details: {
        loanAmount: data.loanAmount,
        loanReason: data.loanReason,
        monthlyPayment: data.monthlyPayment,
        duration: data.duration,
        comments: data.comments
      },
      id: Date.now().toString(),
      userId: currentUser.id,
      status: 'En attente',
      date: new Date().toISOString()
    };

    this.requests.push(newRequest);
    this.saveRequests();
    this.getRequests(); // Mettre à jour la liste des demandes
  }

  addAdvanceRequest(data: any): void {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) return;

    const newRequest: Request = {
      type: 'Avance',
      description: `Demande d'avance de ${data.advanceAmount}€ à rembourser le ${data.repaymentDate}`,
      details: {
        advanceAmount: data.advanceAmount,
        advanceReason: data.advanceReason,
        repaymentDate: data.repaymentDate
      },
      id: Date.now().toString(),
      userId: currentUser.id,
      status: 'En attente',
      date: new Date().toISOString()
    };

    this.requests.push(newRequest);
    this.saveRequests();
    this.getRequests(); // Mettre à jour la liste des demandes
  }

  addDocumentRequest(data: any): void {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) return;

    const newRequest: Request = {
      type: 'Document',
      description: `Demande de document - ${data.documentType}`,
      details: {
        documentType: data.documentType,
        urgency: data.urgency,
        additionalInfo: data.additionalInfo
      },
      id: Date.now().toString(),
      userId: currentUser.id,
      status: 'En attente',
      date: new Date().toISOString()
    };

    this.requests.push(newRequest);
    this.saveRequests();
    this.getRequests(); // Mettre à jour la liste des demandes
  }

  updateLeaveRequest(requestId: string, data: any): boolean {
    const index = this.requests.findIndex(r => r.id === requestId);
    if (index === -1) return false;

    // Vérifier que l'utilisateur a le droit de modifier cette demande
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) return false;

    const request = this.requests[index];
    if (request.userId !== currentUser.id && currentUser.role !== 'admin' && currentUser.role !== 'manager') {
      return false;
    }

    const workingDays = this.calculateWorkingDays(data.startDate, data.endDate);
    this.requests[index] = {
      ...this.requests[index],
      description: `Congé du ${data.startDate} au ${data.endDate} (${workingDays} jours ouvrables)`,
      details: {
        startDate: data.startDate,
        endDate: data.endDate,
        leaveType: data.leaveType,
        reason: data.reason,
        workingDays: workingDays
      }
    };
    this.saveRequests();
    this.getRequests(); // Mettre à jour la liste des demandes
    return true;
  }

  updateTrainingRequest(requestId: string, data: any): boolean {
    const index = this.requests.findIndex(r => r.id === requestId);
    if (index === -1) return false;

    // Vérifier que l'utilisateur a le droit de modifier cette demande
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) return false;

    const request = this.requests[index];
    if (request.userId !== currentUser.id && currentUser.role !== 'admin' && currentUser.role !== 'manager') {
      return false;
    }

    this.requests[index] = {
      ...this.requests[index],
      description: data.title,
      details: {
        title: data.title,
        organization: data.organization,
        startDate: data.startDate,
        endDate: data.endDate,
        trainingType: data.trainingType,
        objectives: data.objectives,
        cost: data.cost
      }
    };
    this.saveRequests();
    this.getRequests(); // Mettre à jour la liste des demandes
    return true;
  }

  updateCertificateRequest(requestId: string, data: any): boolean {
    const index = this.requests.findIndex(r => r.id === requestId);
    if (index === -1) return false;

    // Vérifier que l'utilisateur a le droit de modifier cette demande
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) return false;

    const request = this.requests[index];
    if (request.userId !== currentUser.id && currentUser.role !== 'admin' && currentUser.role !== 'manager') {
      return false;
    }

    this.requests[index] = {
      ...this.requests[index],
      description: `Attestation de travail - ${data.purpose === 'other' ? data.otherPurpose : data.purpose}`,
      details: {
        purpose: data.purpose === 'other' ? data.otherPurpose : data.purpose,
        language: data.language,
        copies: data.copies,
        comments: data.comments
      }
    };
    this.saveRequests();
    this.getRequests(); // Mettre à jour la liste des demandes
    return true;
  }

  updateLoanRequest(requestId: string, data: any): boolean {
    const index = this.requests.findIndex(r => r.id === requestId);
    if (index === -1) return false;

    // Vérifier que l'utilisateur a le droit de modifier cette demande
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) return false;

    const request = this.requests[index];
    if (request.userId !== currentUser.id && currentUser.role !== 'admin' && currentUser.role !== 'manager') {
      return false;
    }

    this.requests[index] = {
      ...this.requests[index],
      description: `Demande de prêt de ${data.loanAmount}€ sur ${data.duration} mois`,
      details: {
        loanAmount: data.loanAmount,
        loanReason: data.loanReason,
        monthlyPayment: data.monthlyPayment,
        duration: data.duration,
        comments: data.comments
      }
    };
    this.saveRequests();
    this.getRequests(); // Mettre à jour la liste des demandes
    return true;
  }

  updateAdvanceRequest(requestId: string, data: any): boolean {
    const index = this.requests.findIndex(r => r.id === requestId);
    if (index === -1) return false;

    // Vérifier que l'utilisateur a le droit de modifier cette demande
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) return false;

    const request = this.requests[index];
    if (request.userId !== currentUser.id && currentUser.role !== 'admin' && currentUser.role !== 'manager') {
      return false;
    }

    this.requests[index] = {
      ...this.requests[index],
      description: `Demande d'avance de ${data.advanceAmount}€ à rembourser le ${data.repaymentDate}`,
      details: {
        advanceAmount: data.advanceAmount,
        advanceReason: data.advanceReason,
        repaymentDate: data.repaymentDate
      }
    };
    this.saveRequests();
    this.getRequests(); // Mettre à jour la liste des demandes
    return true;
  }

  updateDocumentRequest(requestId: string, data: any): boolean {
    const index = this.requests.findIndex(r => r.id === requestId);
    if (index === -1) return false;

    // Vérifier que l'utilisateur a le droit de modifier cette demande
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) return false;

    const request = this.requests[index];
    if (request.userId !== currentUser.id && currentUser.role !== 'admin' && currentUser.role !== 'manager') {
      return false;
    }

    this.requests[index] = {
      ...this.requests[index],
      description: `Demande de document - ${data.documentType}`,
      details: {
        documentType: data.documentType,
        urgency: data.urgency,
        additionalInfo: data.additionalInfo
      }
    };
    this.saveRequests();
    this.getRequests(); // Mettre à jour la liste des demandes
    return true;
  }

  updateRequestStatus(requestId: string, status: 'En attente' | 'Approuvée' | 'Rejetée'): void {
    const index = this.requests.findIndex(r => r.id === requestId);
    if (index !== -1) {
      this.requests[index].status = status;
      this.saveRequests();
      this.getRequests(); // Mettre à jour la liste des demandes
    }
  }

  deleteRequest(requestId: string): boolean {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) return false;

    const request = this.requests.find(r => r.id === requestId);
    if (!request || (request.userId !== currentUser.id && currentUser.role !== 'admin')) {
      return false;
    }

    this.requests = this.requests.filter(r => r.id !== requestId);
    this.saveRequests();
    this.getRequests(); // Mettre à jour la liste des demandes
    return true;
  }

  getRequestById(requestId: string): Request | null {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) return null;

    const request = this.requests.find(r => r.id === requestId);
    if (!request || (request.userId !== currentUser.id && currentUser.role !== 'admin' && currentUser.role !== 'manager')) {
      return null;
    }

    return request;
  }

  private calculateWorkingDays(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    let workingDays = 0;
    
    // Clone la date de début pour ne pas la modifier
    const current = new Date(start);
    
    // Boucle sur chaque jour entre les dates
    while (current <= end) {
      // 0 = Dimanche, 6 = Samedi
      const dayOfWeek = current.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        workingDays++;
      }
      // Passe au jour suivant
      current.setDate(current.getDate() + 1);
    }
    
    return workingDays;
  }

  private saveRequests(): void {
    localStorage.setItem('requests', JSON.stringify(this.requests));
  }
}
