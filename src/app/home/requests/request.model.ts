export interface RequestDetails {
  // Advance request fields
  advanceAmount?: number;
  advanceReason?: string;
  repaymentDate?: string;
  
  // Loan request fields
  loanAmount?: number;
  loanReason?: string;
  monthlyPayment?: number;
  duration?: number;
  repaymentPeriod?: number;
  
  // Document request fields
  documentType?: string;
  reason?: string;
  urgency?: string;
  description?: string;
  purpose?: string;
  language?: string;
  copies?: number;
  comments?: string;
  
  // Training request fields
  trainingType?: string;
  startDate?: string;
  endDate?: string;
  objectives?: string;
  cost?: number;
}

export interface Request {
  id: string;
  type: string;
  date: string;
  status: string;
  userId: string;
  details: RequestDetails;
  description?: string;
}
