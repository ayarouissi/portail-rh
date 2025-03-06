import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  editMode: boolean = false;

  maritalStatusOptions = [
    { value: 'single', label: 'Célibataire' },
    { value: 'married', label: 'Marié(e)' },
    { value: 'divorced', label: 'Divorcé(e)' },
    { value: 'widowed', label: 'Veuf/Veuve' }
  ];

  contractTypeOptions = [
    { value: 'cdi', label: 'CDI' },
    { value: 'cdd', label: 'CDD' },
    { value: 'internship', label: 'Stage' },
    { value: 'temporary', label: 'Intérim' }
  ];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.user = this.authService.currentUserValue;
  }

  onImageChange(event: any) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (e: any) => {
        if (this.user) {
          this.user.profileImage = e.target.result;
          this.authService.updateUserProfile(this.user.id, { profileImage: this.user.profileImage });
        }
      };

      reader.readAsDataURL(file);
    }
  }

  removeProfileImage() {
    if (this.user) {
      this.user.profileImage = '';
      this.authService.updateUserProfile(this.user.id, { profileImage: '' });
    }
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
  }

  saveProfile() {
    if (this.user) {
      this.authService.updateUserProfile(this.user.id, this.user);
      this.editMode = false;
    }
  }

  cancelEdit() {
    this.user = this.authService.currentUserValue;
    this.editMode = false;
  }

  formatDate(date: Date): string {
    return new Date(date).toISOString().split('T')[0];
  }

  changePassword() {
    // Cette fonctionnalité sera implémentée plus tard
    console.log('Changing password...');
  }
}
