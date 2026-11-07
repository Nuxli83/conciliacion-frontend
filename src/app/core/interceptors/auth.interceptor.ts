import { inject } from '@angular/core';
import { HttpRequest, HttpHandlerFn, HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr'; // 👈 Importación
export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  
  // 1. Inyectamos las herramientas que necesitamos
  const router = inject(Router);
  const authService = inject(AuthService);
  const toastr = inject(ToastrService); // 👈 Inyección
  const token = localStorage.getItem('jwt_token'); 
  let clonedReq = req;

  // 2. Viaje de IDA: Pegamos el token si existe
  if (token) {
    const cleanToken = token.replace(/"/g, '');
    clonedReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${cleanToken}`)
    });
  }

  // 3. Viaje de REGRESO: Ejecutamos la petición y escuchamos posibles errores
  return next(clonedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      
      // Si el servidor nos responde con un 401 (No autorizado / Token expirado)
      if (error.status === 401) {
        console.warn('Sesión expirada o token inválido. Redirigiendo al login...');
        
        // Limpiamos el rastro de la sesión vieja
        authService.logout(); 
        
        
        return next(clonedReq).pipe(
          catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
            
              toastr.warning('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.', 'Sesión terminada');
              
              authService.logout();
              router.navigate(['/login']);
            }
            return throwError(() => error);
          })
        );
        
        // Lo mandamos de regreso a la pantalla de login
        router.navigate(['/login']); 
      }

      // Dejamos que el error siga su curso por si el componente también quiere hacer algo
      return throwError(() => error);
    })
  );
};