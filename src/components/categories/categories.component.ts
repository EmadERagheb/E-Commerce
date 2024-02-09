import { Component, Input } from '@angular/core';
import { ICategory } from '../../models/icategory';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent {
  @Input() categories: ICategory[] = []
}
