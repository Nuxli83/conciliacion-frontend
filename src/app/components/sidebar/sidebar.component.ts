import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule], // Importante
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {


  constructor(private router: Router,) {}

  logout() {
    this.router.navigate(['/login']).then(() => {
    localStorage.removeItem('jwt_token');
     
    window.location.reload();
    });
  }
}
