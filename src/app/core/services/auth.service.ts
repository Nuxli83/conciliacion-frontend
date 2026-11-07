import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  //private apiUrl = 'https://localhost:7232/api/auth'; 
  private apiUrl = `${environment.apiUrl}/auth`;
  private readonly TOKEN_KEY = 'jwt_token';

  // 🚀 1. Creamos el estado reactivo inicializándolo con el estado actual del token
  private authState$ = new BehaviorSubject<boolean>(this.isTokenValid());

  // 🚀 2. Exponemos el estado como un Observable para el HTML del AppComponent
  public isLoggedIn$: Observable<boolean> = this.authState$.asObservable();

  constructor(private http: HttpClient) {}

  private isTokenValid(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        console.log('---->', response);
        if (response && response.token) {
          this.setToken(response.token);
          // 🚀 3. ¡Avisamos a toda la app que el usuario ya inició sesión!
          this.authState$.next(true); 
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    // 🚀 4. ¡Avisamos a toda la app que el usuario cerró sesión!
    this.authState$.next(false); 
  }

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Dejamos este por si tus Guards de rutas aún lo usan de forma síncrona
  isLoggedIn(): boolean {
    return this.isTokenValid();
  }
}