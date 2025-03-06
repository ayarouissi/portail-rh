import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, PersonalInfo, ProfessionalInfo } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private users: User[] = [];

  constructor(private router: Router) {
    // Récupérer l'utilisateur du localStorage au démarrage
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(storedUser ? JSON.parse(storedUser) : null);
    this.currentUser = this.currentUserSubject.asObservable();

    // Charger les utilisateurs du localStorage
    const storedUsers = localStorage.getItem('users');
    this.users = storedUsers ? JSON.parse(storedUsers) : [];
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  register(user: Omit<User, 'id' | 'personalInfo' | 'professionalInfo'>): boolean {
    // Vérifier si l'email existe déjà
    if (this.users.some(u => u.email === user.email)) {
      return false;
    }

    // Créer les informations personnelles par défaut
    const personalInfo: PersonalInfo = {
      cin: '',
      dateOfBirth: '',
      placeOfBirth: '',
      nationality: 'Tunisienne',
      maritalStatus: 'single',
      numberOfChildren: 0,
      address: '',
      city: '',
      country: 'Tunisie',
      phoneNumber: '',
      emergencyContact: {
        name: '',
        relationship: '',
        phoneNumber: ''
      }
    };

    // Créer les informations professionnelles par défaut
    const professionalInfo: ProfessionalInfo = {
      employeeId: `EMP${Date.now().toString().slice(-6)}`,
      department: '',
      position: '',
      grade: '',
      joinDate: new Date(),
      contractType: 'CDI',
      salary: 0,
      rib: '',
      bankName: '',
      cnss: '',
      mutuelle: ''
    };

    // Créer un nouvel utilisateur avec un ID unique
    const newUser: User = {
      ...user,
      id: Date.now().toString(),
      personalInfo,
      professionalInfo,
      profileImage: ''
    };

    // Ajouter l'utilisateur à la liste
    this.users.push(newUser);
    
    // Sauvegarder dans localStorage
    localStorage.setItem('users', JSON.stringify(this.users));

    return true;
  }

  login(email: string, password: string): boolean {
    // Trouver l'utilisateur
    const user = this.users.find(u => u.email === email && u.password === password);

    if (user) {
      // Ne pas stocker le mot de passe dans le localStorage
      const { password: _, ...userWithoutPassword } = user;
      
      // Stocker l'utilisateur dans localStorage
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      localStorage.setItem('isLoggedIn', 'true');
      
      // Mettre à jour le BehaviorSubject
      this.currentUserSubject.next(userWithoutPassword);
      return true;
    }

    return false;
  }

  logout() {
    // Supprimer l'utilisateur du localStorage
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isLoggedIn');
    
    // Mettre à jour le BehaviorSubject
    this.currentUserSubject.next(null);
    
    // Rediriger vers la page de connexion
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.currentUserValue !== null || localStorage.getItem('isLoggedIn') === 'true';
  }

  updateUserProfile(userId: string, updates: Partial<User>): boolean {
    const userIndex = this.users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return false;
    }

    // Mettre à jour l'utilisateur
    this.users[userIndex] = { ...this.users[userIndex], ...updates };
    
    // Mettre à jour localStorage
    localStorage.setItem('users', JSON.stringify(this.users));

    // Si c'est l'utilisateur actuel, mettre à jour aussi currentUser
    if (this.currentUserValue?.id === userId) {
      const updatedUser = { ...this.currentUserValue, ...updates };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      this.currentUserSubject.next(updatedUser);
    }

    return true;
  }

  getUserById(userId: string): User | null {
    return this.users.find(u => u.id === userId) || null;
  }
}
