import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestsService } from '../requests.service';

@Component({
  selector: 'app-document-request',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './document-request.component.html',
  styleUrls: ['./document-request.component.scss']
})
export class DocumentRequestComponent implements OnInit {
  documentForm: FormGroup;
  editMode = false;
  requestId: number | null = null;

  documentTypes = [
    'Attestation de salaire',
    'Attestation de travail',
    'Fiche de paie',
    'Autre document'
  ];

  constructor(
    private fb: FormBuilder,
    private requestsService: RequestsService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.documentForm = this.fb.group({
      documentType: ['', Validators.required],
      urgency: [false],
      additionalInfo: ['']
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.editMode = true;
      this.requestId = +id;
      const request = this.requestsService.getRequestById(this.requestId);
      if (request && request.details) {
        this.documentForm.patchValue({
          documentType: request.details.documentType,
          urgency: request.details.urgency,
          additionalInfo: request.details.additionalInfo
        });
      }
    }
  }

  onSubmit() {
    if (this.documentForm.valid) {
      if (this.editMode && this.requestId) {
        this.requestsService.updateDocumentRequest(this.requestId, this.documentForm.value);
      } else {
        this.requestsService.addDocumentRequest(this.documentForm.value);
      }
      this.router.navigate(['/home/requests']);
    }
  }

  onCancel() {
    this.router.navigate(['/home/requests']);
  }
}
