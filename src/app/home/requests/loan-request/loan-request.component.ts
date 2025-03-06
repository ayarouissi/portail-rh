import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestsService } from '../requests.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loan-request',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './loan-request.component.html',
  styleUrls: ['./loan-request.component.scss']
})
export class LoanRequestComponent implements OnInit {
  requestId: string | null = null;
  editMode = false;
  loanForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private requestsService: RequestsService
  ) {
    this.loanForm = new FormGroup({
      loanAmount: new FormControl(0, [Validators.required, Validators.min(0)]),
      loanReason: new FormControl('', [Validators.required]),
      monthlyPayment: new FormControl(0, [Validators.required, Validators.min(0)]),
      duration: new FormControl(12, [Validators.required, Validators.min(1), Validators.max(60)])
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.requestId = id;
      this.editMode = true;
      const request = this.requestsService.getRequestById(id);
      if (request && request.details) {
        this.loanForm.patchValue({
          loanAmount: request.details.loanAmount || 0,
          loanReason: request.details.loanReason || '',
          monthlyPayment: request.details.monthlyPayment || 0,
          duration: request.details.duration || 12
        });
      }
    }
  }

  onSubmit() {
    if (!this.loanForm.valid) {
      return;
    }

    const formData = this.loanForm.value;
    
    if (this.requestId) {
      this.requestsService.updateLoanRequest(this.requestId, formData);
    } else {
      this.requestsService.addLoanRequest(formData);
    }
    this.router.navigate(['/home/requests']);
  }

  onCancel() {
    this.router.navigate(['/home/requests']);
  }
}
