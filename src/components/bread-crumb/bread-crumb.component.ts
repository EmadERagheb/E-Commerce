import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-bread-crumb',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './bread-crumb.component.html',
  styleUrl: './bread-crumb.component.css'
})
export class BreadCrumbComponent {
  @Input() titles: string[] = [];
  @Input() links: string[] = [];
  mySepartor = '<i class="fa-solid fa-angles-right"></i>'
}
