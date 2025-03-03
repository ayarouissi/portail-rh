import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestsService } from '../requests.service';

@Component({
  selector: 'app-advance-request',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './advance-request.component.html',
  styleUrls: ['./advance-request.component.scss']
})
export class AdvanceRequestComponent implements OnInit {
  advanceForm: FormGroup;
  editMode = false;
  requestId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private requestsService: RequestsService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.advanceForm = this.fb.group({
      advanceAmount: ['', [Validators.required, Validators.min(0)]],
      advanceReason: ['', Validators.required],
      repaymentDate: ['', Validators.required]
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.editMode = true;
      this.requestId = +id;
      const request = this.requestsService.getRequestById(this.requestId);
      if (request && request.details) {
        this.advanceForm.patchValue({
          advanceAmount: request.details.advanceAmount,
          advanceReason: request.details.advanceReason,
          repaymentDate: request.details.repaymentDate
        });
      }
    }
  }

  onSubmit() {
    if (this.advanceForm.valid) {
      if (this.editMode && this.requestId) {
        this.requestsService.updateAdvanceRequest(this.requestId, this.advanceForm.value);
      } else {
        this.requestsService.addAdvanceRequest(this.advanceForm.value);
      }
      this.router.navigate(['/home/requests']);
    }
  }

  onCancel() {
    this.router.navigate(['/home/requests']);
  }
}
