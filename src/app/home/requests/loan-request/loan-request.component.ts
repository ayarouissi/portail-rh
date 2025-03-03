import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestsService } from '../requests.service';

@Component({
  selector: 'app-loan-request',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './loan-request.component.html',
  styleUrls: ['./loan-request.component.scss']
})
export class LoanRequestComponent implements OnInit {
  loanForm: FormGroup;
  editMode = false;
  requestId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private requestsService: RequestsService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loanForm = this.fb.group({
      loanAmount: ['', [Validators.required, Validators.min(0)]],
      loanReason: ['', Validators.required],
      monthlyPayment: ['', [Validators.required, Validators.min(0)]],
      duration: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.editMode = true;
      this.requestId = +id;
      const request = this.requestsService.getRequestById(this.requestId);
      if (request && request.details) {
        this.loanForm.patchValue({
          loanAmount: request.details.loanAmount,
          loanReason: request.details.loanReason,
          monthlyPayment: request.details.monthlyPayment,
          duration: request.details.duration
        });
      }
    }
  }

  onSubmit() {
    if (this.loanForm.valid) {
      if (this.editMode && this.requestId) {
        this.requestsService.updateLoanRequest(this.requestId, this.loanForm.value);
      } else {
        this.requestsService.addLoanRequest(this.loanForm.value);
      }
      this.router.navigate(['/home/requests']);
    }
  }

  onCancel() {
    this.router.navigate(['/home/requests']);
  }
}
