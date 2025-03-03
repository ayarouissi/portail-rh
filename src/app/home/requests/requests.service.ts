import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

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
  id: number;
  type: string;
  status: string;
  date: string;
  description: string;
  details: RequestDetails;
}

@Injectable({
  providedIn: 'root'
})
export class RequestsService {
  private requests: Request[] = [
    {
      id: 1,
      type: 'Congé annuel',
      status: 'En attente',
      date: '2025-02-20',
      description: 'Demande de congé pour 2 jours ouvrables',
      details: {
        startDate: '2025-02-20',
        endDate: '2025-02-25',
        leaveType: 'paid',
        reason: 'Vacances',
        workingDays: 2
      }
    },
    {
      id: 2,
      type: 'Formation',
      status: 'Approuvée',
      date: '2025-02-15',
      description: 'Formation Angular avancé',
      details: {
        title: 'Formation Angular',
        organization: 'Formation Pro',
        startDate: '2025-03-01',
        endDate: '2025-03-05',
        trainingType: 'technical',
        objectives: 'Maîtriser Angular',
        cost: 2000
      }
    },
    {
      id: 3,
      type: 'Attestation de travail',
      status: 'Rejetée',
      date: '2025-02-10',
      description: 'Demande d\'attestation de travail',
      details: {
        purpose: 'other',
        language: 'français',
        copies: 2,
        comments: 'Demande d\'attestation de travail'
      }
    }
  ];

  private requestsSubject = new BehaviorSubject<Request[]>(this.requests);

  constructor() {}

  getRequests() {
    return this.requestsSubject.asObservable();
  }

  getRequestById(id: number): Request | undefined {
    return this.requests.find(r => r.id === id);
  }

  updateRequest(updatedRequest: Request) {
    const index = this.requests.findIndex(r => r.id === updatedRequest.id);
    if (index !== -1) {
      this.requests[index] = updatedRequest;
      this.requestsSubject.next(this.requests);
    }
  }

  addRequest(request: Partial<Request>) {
    const newRequest: Request = {
      id: this.requests.length + 1,
      type: request.type || '',
      status: 'En attente',
      date: new Date().toISOString().split('T')[0],
      description: request.description || '',
      details: request.details || {}
    };

    this.requests.unshift(newRequest);
    this.requestsSubject.next(this.requests);
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

  addLeaveRequest(data: any) {
    const workingDays = this.calculateWorkingDays(data.startDate, data.endDate);
    const request: Partial<Request> = {
      type: 'Congé annuel',
      description: `Congé du ${data.startDate} au ${data.endDate} (${workingDays} jours ouvrables)`,
      details: {
        startDate: data.startDate,
        endDate: data.endDate,
        leaveType: data.leaveType,
        reason: data.reason,
        workingDays: workingDays
      }
    };
    this.addRequest(request);
  }

  addTrainingRequest(data: any) {
    const request: Partial<Request> = {
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
      }
    };
    this.addRequest(request);
  }

  addCertificateRequest(data: any) {
    const request: Partial<Request> = {
      type: 'Attestation de travail',
      description: `Attestation de travail - ${data.purpose === 'other' ? data.otherPurpose : data.purpose}`,
      details: {
        purpose: data.purpose === 'other' ? data.otherPurpose : data.purpose,
        language: data.language,
        copies: data.copies,
        comments: data.comments
      }
    };
    this.addRequest(request);
  }

  addLoanRequest(data: any) {
    const request: Partial<Request> = {
      type: 'Prêt',
      description: `Demande de prêt de ${data.loanAmount}€ sur ${data.duration} mois`,
      details: {
        loanAmount: data.loanAmount,
        loanReason: data.loanReason,
        monthlyPayment: data.monthlyPayment,
        duration: data.duration,
        comments: data.comments
      }
    };
    this.addRequest(request);
  }

  addAdvanceRequest(data: any) {
    const request: Partial<Request> = {
      type: 'Avance',
      description: `Demande d'avance de ${data.advanceAmount}€ à rembourser le ${data.repaymentDate}`,
      details: {
        advanceAmount: data.advanceAmount,
        advanceReason: data.advanceReason,
        repaymentDate: data.repaymentDate
      }
    };
    this.addRequest(request);
  }

  addDocumentRequest(data: any) {
    const request: Partial<Request> = {
      type: 'Document',
      description: `Demande de document - ${data.documentType}`,
      details: {
        documentType: data.documentType,
        urgency: data.urgency,
        additionalInfo: data.additionalInfo
      }
    };
    this.addRequest(request);
  }

  updateLeaveRequest(id: number, data: any) {
    const request = this.getRequestById(id);
    if (request) {
      const workingDays = this.calculateWorkingDays(data.startDate, data.endDate);
      request.description = `Congé du ${data.startDate} au ${data.endDate} (${workingDays} jours ouvrables)`;
      request.details = {
        startDate: data.startDate,
        endDate: data.endDate,
        leaveType: data.leaveType,
        reason: data.reason,
        workingDays: workingDays
      };
      this.updateRequest(request);
    }
  }

  updateTrainingRequest(id: number, data: any) {
    const request = this.getRequestById(id);
    if (request) {
      request.description = data.title;
      request.details = {
        title: data.title,
        organization: data.organization,
        startDate: data.startDate,
        endDate: data.endDate,
        trainingType: data.trainingType,
        objectives: data.objectives,
        cost: data.cost
      };
      this.updateRequest(request);
    }
  }

  updateCertificateRequest(id: number, data: any) {
    const request = this.getRequestById(id);
    if (request) {
      request.description = `Attestation de travail - ${data.purpose === 'other' ? data.otherPurpose : data.purpose}`;
      request.details = {
        purpose: data.purpose === 'other' ? data.otherPurpose : data.purpose,
        language: data.language,
        copies: data.copies,
        comments: data.comments
      };
      this.updateRequest(request);
    }
  }

  updateLoanRequest(id: number, data: any) {
    const request = this.getRequestById(id);
    if (request) {
      request.description = `Demande de prêt de ${data.loanAmount}€ sur ${data.duration} mois`;
      request.details = {
        loanAmount: data.loanAmount,
        loanReason: data.loanReason,
        monthlyPayment: data.monthlyPayment,
        duration: data.duration,
        comments: data.comments
      };
      this.updateRequest(request);
    }
  }

  updateAdvanceRequest(id: number, data: any) {
    const request = this.getRequestById(id);
    if (request) {
      request.description = `Demande d'avance de ${data.advanceAmount}€ à rembourser le ${data.repaymentDate}`;
      request.details = {
        advanceAmount: data.advanceAmount,
        advanceReason: data.advanceReason,
        repaymentDate: data.repaymentDate
      };
      this.updateRequest(request);
    }
  }

  updateDocumentRequest(id: number, data: any) {
    const request = this.getRequestById(id);
    if (request) {
      request.description = `Demande de document - ${data.documentType}`;
      request.details = {
        documentType: data.documentType,
        urgency: data.urgency,
        additionalInfo: data.additionalInfo
      };
      this.updateRequest(request);
    }
  }
}
