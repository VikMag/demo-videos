import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  username: string = '';
  rol: string = '';
  currentYear: number = new Date().getFullYear();

  constructor() {}

  ngOnInit(): void {
    this.username = localStorage.getItem('username') || 'Usuario';
    this.rol = localStorage.getItem('rol') || '';
  }

  
}
