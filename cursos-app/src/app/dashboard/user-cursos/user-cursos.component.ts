import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VideoService } from '../../services/video.service'; // Ruta correcta del servicio
import { UserService } from 'src/app/services/user.service';  // Ruta correcta del servicio


@Component({
  selector: 'app-user-cursos',
  templateUrl: './user-cursos.component.html',
  styleUrls: ['./user-cursos.component.css']
})
export class UserCursosComponent implements OnInit {
  userId: string = '';
  videos: any[] = [];  // Videos comprados por el usuario
  allVideos: any[] = [];  // Todos los videos disponibles
  errorMessage: string = '';
  successMessage: string = '';
  username: string = '';
  constructor(
    private route: ActivatedRoute,
      private videoService: VideoService,
      private userService: UserService // Asegúrate de que la ruta sea correcta
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id') || ''; // Obtener el user_id desde la ruta
    this.loadUserVideos();
    this.loadAllVideos();
    this.loadUserDetails();
  }

  loadUserDetails(): void {
    const userIdNumber = parseInt(this.userId, 10);
    this.userService.getUserById(userIdNumber).subscribe(
      (response) => {
        this.username = response.username;
      },
      (error) => {
        console.error(error);
      }
    );
  }
  // Obtener los videos comprados por el usuario
  loadUserVideos(): void {
    const userIdNumber = parseInt(this.userId, 10);
    this.videoService.getPurchasedVideos(userIdNumber).subscribe(
      (response) => {
        this.videos = response;
        this.successMessage = 'Videos cargados correctamente';
      },
      (error) => {
        this.errorMessage = 'Error al cargar los videos del usuario';
        console.error(error);
      }
    );
  }

  // Obtener todos los videos disponibles
  loadAllVideos(): void {
    this.videoService.getAllVideos().subscribe(
      (response) => {
        this.allVideos = response;
      },
      (error) => {
        this.errorMessage = 'Error al cargar los videos disponibles';
        console.error(error);
      }
    );
  }

  purchaseVideo(video: any): void {
    const payload = {
      user_id: parseInt(this.userId, 10),
      video_id: video.id,
      precio_pagado: video.precio
    };
  
    this.videoService.purchaseVideo(payload).subscribe(
      (response) => {
        this.successMessage = 'Video comprado exitosamente';
        this.errorMessage = '';
        this.loadUserVideos(); // Recargar los videos comprados
      },
      (error) => {
        this.errorMessage = 'Error al comprar el video';
        this.successMessage = '';
        console.error(error);
      }
    );
  }
}
