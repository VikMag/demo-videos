import { Component, OnInit } from '@angular/core';
import { UserVideoService } from '../services/uservideo.service';
import { UserService } from '../services/user.service';  
import { Router } from '@angular/router';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {
  feedback = {
    subject: '',
    video: '',
    message: ''
  };
  errorMessage: string = '';
  successMessage: string = '';  // Para mostrar mensaje de éxito
  videos: any[] = [];

  constructor(
    private userVideoService: UserVideoService,
    private userService: UserService,  
    private router: Router
  ) { }

  ngOnInit(): void {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      this.errorMessage = 'Usuario no identificado';
      return;
    }

    this.loadUserVideos();
  }

  loadUserVideos(): void {
    const userId = localStorage.getItem('user_id');
    
    if (!userId) {
      this.errorMessage = 'Usuario no identificado';
      return;
    }

    this.userVideoService.getPurchasedVideos(Number(userId)).subscribe({
      next: (data) => {
        this.videos = data;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar tus cursos: ' + error.message;
      }
    });
  }

  submitFeedback(): void {
    if (!this.feedback.subject || !this.feedback.video || !this.feedback.message) {
      this.errorMessage = 'Por favor, completa todos los campos.';
      return;
    }

    // Si los campos son válidos, enviamos el feedback
    this.userService.sendFeedback(this.feedback.subject, this.feedback.video, this.feedback.message).subscribe({
      next: (response) => {
        this.successMessage = 'Feedback enviado con éxito.';
        this.feedback = { subject: '', video: '', message: '' };  // Limpiar formulario
        this.errorMessage = '';
      },
      error: (error) => {
        this.errorMessage = 'Error al enviar el feedback: ' + error.message;
      }
    });
  }
}
