import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { Observable } from 'rxjs';
import { AuthService } from './core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidebarComponent, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit {
  isUserLoggedIn$!: Observable<boolean>;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Escuchamos el flujo constante de la autenticación
    this.isUserLoggedIn$ = this.authService.isLoggedIn$;
  }
}
