import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl:'./pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {
  @Input() currentPage: number=1;
  @Input() totalPages: number=1;
  @Output() pageChange = new EventEmitter<number>();

  getPageArray(totalPages: number): number[] {
    return Array(totalPages).fill(0).map((_, index) => index + 1);
  }
  onPageChange(page: number) {
    this.pageChange.emit(page);
  }
}
