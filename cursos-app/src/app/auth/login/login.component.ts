import { Component } from '@angular/core';
import { Router } from '@angular/router';  // Necesario para la navegación después del login
import { AuthService } from '../auth.service';  // Importamos el servicio de autenticación
import { NgForm } from '@angular/forms'; // Importamos para la validación del formulario

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  error: string = '';  // Definimos la propiedad `error` que se usa en el template

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(form: NgForm): void {
    if (form.valid) {
      this.authService.login({ email: this.email, password: this.password }).subscribe({
        next: (response) => {
          console.log('Login exitoso');
          // Aquí puedes redirigir dependiendo del rol del usuario
          const rol = localStorage.getItem('rol');
          if (rol === 'admin') {
            this.router.navigate(['/dashboard']);  // Redirige al dashboard de admin
          } else {
            this.router.navigate(['/cursos']);  // Redirige a la página de cursos de estudiantes
          }
        },
        error: (err) => {
          console.log('Error en el login', err);
          this.error = 'Credenciales inválidas';  // Asignamos el mensaje de error
        }
      });
    }
  }
}
