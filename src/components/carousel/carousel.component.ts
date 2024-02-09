import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { Image } from '../../models/image';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css',
})
export class CarouselComponent implements OnChanges, OnDestroy {
  @Input() carouselImges!: Image[];
  @Input() indecators: boolean = true;
  @Input() controls: boolean = true;
  @Input() autoSlide: boolean = false;
  @Input() intervalInSecands: number = 3;
  private timeId: any;

  selectedIndex: number;
  constructor() {
    this.selectedIndex = 0;
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.autoSlide) {
      this.timeId = setInterval(() => {
        this.onNextClick();
      }, this.intervalInSecands * 1000);
    }
  }
  selectImage(selectedImage: number) {
    this.selectedIndex = selectedImage;
  }
  onPrevClick() {
    if (this.selectedIndex == 0)
      this.selectedIndex = this.carouselImges.length - 1;
    else --this.selectedIndex;
  }
  onNextClick() {
    if (this.selectedIndex == this.carouselImges.length - 1)
      this.selectedIndex = 0;
    else this.selectedIndex++;
  }

  ngOnDestroy(): void {
    clearInterval(this.timeId);
  }
}
