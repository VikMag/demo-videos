import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { UserVideoService } from '../services/uservideo.service';
import { DomSanitizer } from '@angular/platform-browser';
import { VideoService } from '../services/video.service'; // Importa el servicio de videos

declare var bootstrap: any; // Declaración necesaria para Bootstrap

@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.component.html',
  styleUrls: ['./cursos.component.css']
})
export class CursosComponent implements OnInit, AfterViewInit {
  videos: any[] = [];
  documentos: any[] = [];
  errorMessage: string = '';
  currentVideoUrl: any;
  videoModal: any;
  documentModal: any;
  
  @ViewChild('videoIframe') videoIframe!: ElementRef;

  constructor(
    private userVideoService: UserVideoService,
    private videoService: VideoService, // Inyecta el servicio de videos
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.loadUserVideos();
  }

  ngAfterViewInit(): void {
    this.initModals();
  }

  private initModals(): void {
    const videoModalElement = document.getElementById('videoModal');
    if (videoModalElement) {
      this.videoModal = new bootstrap.Modal(videoModalElement);
    }

    const documentModalElement = document.getElementById('documentModal');
    if (documentModalElement) {
      this.documentModal = new bootstrap.Modal(documentModalElement);
    }
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

  openVideoModal(url: string): void {
    const videoId = this.extractVideoId(url);
    if (!videoId) {
      this.errorMessage = 'URL de video no válida';
      return;
    }

    this.currentVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${videoId}?autoplay=1`
    );

    if (this.videoModal) {
      this.videoModal.show();
    }

    const modalElement = document.getElementById('videoModal');
    if (modalElement) {
      modalElement.addEventListener('hidden.bs.modal', () => {
        this.stopVideo();
      });
    }
  }

  openDocumentModal(videoId: number): void {
    this.loadDocumentsForVideo(videoId);
    if (this.documentModal) {
      this.documentModal.show();
    }
  }

  stopVideo(): void {
    if (this.videoIframe?.nativeElement) {
      this.videoIframe.nativeElement.src = '';
    }
    this.currentVideoUrl = null;
  }

  private loadDocumentsForVideo(videoId: number): void {
    this.videoService.getDocumentsById(videoId).subscribe(
      (response) => {
          this.documentos = response;
      },
      (error) => {
          this.errorMessage = 'Error al cargar los documentos';
          console.error(error);
      }
  );
  }

  private extractVideoId(url: string): string | null {
    const regExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  }

  getUniqueCategories(): string[] {
    return [...new Set(this.videos.map(v => v.categoria_nombre))];
  }

  getVideosByCategory(category: string): any[] {
    return this.videos.filter(v => v.categoria_nombre === category);
  }
}
