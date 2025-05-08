import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { VideoService } from '../services/video.service'; // Importa el servicio de videos
import { Router } from '@angular/router';
declare var bootstrap: any; // Si usas Bootstrap puro

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
    newDocument = { nombre: '', url: '', video_id: 0 };
    documentos: any[] = [];
    users: any[] = [];
    videos: any[] = []; // Lista de videos
    newUser = { username: '', email: '', password: '', rol: 'estudiante' };
    newVideo: any = {
        titulo: '',
        url: '',
        descripcion: '',
        imagen: '',
        categoria_id: null, // Este es el ID de la categoría seleccionada
        precio: 0
    };
    errorMessage: string = '';
    successMessage: string = '';
    categories: any[] = []; // Lista de categorías

    private modalInstance: any; // Instancia del modal para controlarla

    constructor(
        private userService: UserService,
        private videoService: VideoService, // Inyecta el servicio de videos
        private router: Router
    ) {}

    ngOnInit(): void {
        this.loadUsers();
        this.loadVideos(); // Cargar videos
        this.loadCategories();
    }

    // Cargar todos los usuarios
    loadUsers(): void {
        this.userService.getAllUsers().subscribe(
            (response) => {
                this.users = response;
            },
            (error) => {
                this.errorMessage = 'Error al cargar los usuarios';
                console.error(error);
            }
        );
    }

    // Cargar documentos por video
    loadDocuments(videoId: number): void {
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
    closeModal() {
      const modalElement = document.getElementById('documentModal');
      if (modalElement) {
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide();  // Cerrar el modal
          modalElement.removeAttribute('aria-hidden');  // Asegurarse de que 'aria-hidden' se elimine
          document.body.classList.remove('modal-open');  // Eliminar el bloqueo del fondo
         
        }
      }
    }
    // Abrir el modal para agregar un documento
    openModalDocument(videoId: number): void {
        this.newDocument.video_id = videoId; // Asignamos el ID del video
        this.loadDocuments(videoId); // Cargar documentos del video

        const modalElement = document.getElementById('documentModal');
        if (modalElement) {
            this.modalInstance = new bootstrap.Modal(modalElement); // Crear una nueva instancia
            this.modalInstance.show(); // Asegura que el modal se muestre

            modalElement.setAttribute('aria-hidden', 'false'); // Aseguramos que el modal no tenga aria-hidden cuando se abre
        }
    }

    // Crear un nuevo documento
    createDocument(): void {
        this.videoService.createDocument(this.newDocument).subscribe(
            (res) => {
                this.successMessage = 'Documento agregado correctamente';
                this.loadDocuments(this.newDocument.video_id); // Cargar los documentos asociados al video
                this.clearDocumentForm(); // Limpiar el formulario
            },
            (error) => {
                this.errorMessage = 'Error al agregar el documento';
                console.error(error);
            }
        );
    }

    // Cargar todos los videos
    loadVideos(): void {
        this.videoService.getAllVideos().subscribe(
            (response) => {
                this.videos = response;
            },
            (error) => {
                this.errorMessage = 'Error al cargar los videos';
                console.error(error);
            }
        );
    }

    // Crear un nuevo usuario
    createUser(): void {
        this.userService.createUser(this.newUser).subscribe(
            (response) => {
                this.successMessage = 'Usuario creado exitosamente';
                this.loadUsers();
                this.clearForm();
            },
            (error) => {
                this.errorMessage = 'Error al crear el usuario';
                console.error(error);
            }
        );
    }

    // Crear un nuevo video
    createVideo(): void {
        this.videoService.createVideo(this.newVideo).subscribe(
            (response) => {
                this.successMessage = 'Video creado exitosamente';
                this.loadVideos();
                this.clearVideoForm();
            },
            (error) => {
                this.errorMessage = 'Error al crear el video';
                console.error(error);
            }
        );
    }

    // Eliminar un usuario
    deleteUser(userId: number): void {
        if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
            this.userService.deleteUser(userId).subscribe(
                (response) => {
                    this.successMessage = 'Usuario eliminado exitosamente';
                    this.loadUsers();
                },
                (error) => {
                    this.errorMessage = 'Error al eliminar el usuario';
                    console.error(error);
                }
            );
        }
    }

    // Eliminar un video
    deleteVideo(videoId: number): void {
        if (confirm('¿Estás seguro de que quieres eliminar este video?')) {
            this.videoService.deleteVideo(videoId).subscribe(
                (response) => {
                    this.successMessage = 'Video eliminado exitosamente';
                    this.loadVideos();
                },
                (error) => {
                    this.errorMessage = 'Error al eliminar el video';
                    console.error(error);
                }
            );
        }
    }

    // Eliminar un documento
    deleteDocument(documentId: number): void {
        if (confirm('¿Estás seguro de que quieres eliminar este documento?')) {
            this.videoService.deleteDocument(documentId).subscribe(
                (response) => {
                    this.successMessage = 'Documento eliminado exitosamente';
                    this.loadDocuments(this.newDocument.video_id); // Recargar los documentos
                },
                (error) => {
                    this.errorMessage = 'Error al eliminar el documento';
                    console.error(error);
                }
            );
        }
    }

    // Limpiar formulario de documento
    clearDocumentForm(): void {
        this.newDocument = { nombre: '', url: '', video_id: 0 };
    }

    // Limpiar formulario de usuario
    clearForm(): void {
        this.newUser = { username: '', email: '', password: '', rol: 'estudiante' };
    }

    // Limpiar formulario de video
    clearVideoForm(): void {
        this.newVideo = { titulo: '', url: '', descripcion: '', imagen: '', categoria_id: null, precio: 0 };
    }

    // Cargar las categorías de los videos
    loadCategories(): void {
        this.videoService.getVideosCategories().subscribe(
            (response) => {
                this.categories = response;
            },
            (error) => {
                this.errorMessage = 'Error al cargar las categorías';
                console.error(error);
            }
        );
    }

    // Obtener el nombre de la categoría por su ID
    getCategoryName(categoriaId: number): string {
        const category = this.categories.find(cat => cat.id === categoriaId);
        return category ? category.nombre : 'Categoría no disponible';
    }
}
