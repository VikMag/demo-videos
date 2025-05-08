import { Component, OnInit } from '@angular/core';
import { VideoService } from '../services/video.service';
declare var bootstrap: any; // Si usas Bootstrap puro

@Component({
  selector: 'app-catalogos',
  templateUrl: './catalogos.component.html',
  styleUrls: ['./catalogos.component.css']
})
export class CatalogosComponent implements OnInit {
  videos: any[] = [];
  categories: { [key: string]: any[] } = {}; // Tipado más claro
  errorMessage: string = '';
  isAdmin: boolean = false;
  selectedVideo: any = null; // Nueva propiedad para el modal

  constructor(private videoService: VideoService) { }

  ngOnInit(): void {
    this.loadVideos();
    this.isAdmin = localStorage.getItem('rol') === 'admin';
  }

  loadVideos(): void {
    this.videoService.getAllVideos().subscribe({
      next: (data) => {
        this.videos = data;
        this.groupVideosByCategory();
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar los videos: ' + error.message;
      }
    });
  }

  groupVideosByCategory(): void {
    this.categories = {}; // Limpiamos categorías antes de agrupar
    
    this.videos.forEach(video => {
      const categoryName = video.categoria_nombre || 'Sin categoría';
      
      if (!this.categories[categoryName]) {
        this.categories[categoryName] = [];
      }
      
      this.categories[categoryName].push(video);
    });
  }
  deleteVideo(videoId: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este video?')) {
      this.videoService.deleteVideo(videoId).subscribe({
        next: () => {
          // Quitar el video del array local
          this.videos = this.videos.filter(video => video.id !== videoId);
          this.groupVideosByCategory(); // actualizar categorías
        },
        error: (error) => {
          this.errorMessage = 'Error al eliminar el video: ' + error.message;
        }
      });
    }
  }

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  openModal(video: any): void {
    this.selectedVideo = video;
    const modal = new bootstrap.Modal(document.getElementById('videoDetailModal'));
    modal.show();
  }

  purchaseVideo(video: any): void {
    // Aquí aún no implementado
    alert(`Función de compra pendiente para: ${video.titulo}`);
  }
}