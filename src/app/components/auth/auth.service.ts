import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(null); //token user
  private loggedIn = new BehaviorSubject<boolean>(false);
  private message: string;


  constructor(private router: Router) {
    this.message = "";
  }

  get currentUser() {
    return this.currentUserSubject.asObservable();
  }

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  login(objUserDetails: any) {
    debugger;
    if (objUserDetails.id === 0) {
      this.message = "Please enter valid username and password !!";
      this.loggedIn.next(false);
      this.currentUserSubject.next(null);
      localStorage.removeItem("userDetails");
    } else {
      localStorage.setItem("userDetails", JSON.stringify(objUserDetails));
      this.message = "";
      this.loggedIn.next(true);
      this.currentUserSubject.next(objUserDetails);
      this.router.navigate(['/dashboard/default']);
    }
  }

  logout() {
    localStorage.clear();
    this.loggedIn.next(false);
    this.currentUserSubject.next(null);
  }

  getMessage(): string {
    return this.message;
  }

}
