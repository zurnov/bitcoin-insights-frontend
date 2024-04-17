import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css'],
})
export class PaginationComponent {
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 20; //!static
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

  handlePageChange(pageOrAction: number | string): void {
    if (typeof pageOrAction === 'number') {
      this.pageChange.emit(pageOrAction);
    } else if (pageOrAction === 'prev' && this.currentPage > 1) {
      this.pageChange.emit(this.currentPage - 1);
    } else if (pageOrAction === 'next' && this.currentPage < this.totalPages) {
      this.pageChange.emit(this.currentPage + 1);
    }
  }

  get selectPageNums(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  getPagesInRange(): number[] {
    const pages = [];
    const pagesToShow = 10;
    const half = Math.floor(pagesToShow / 2);
    let startPage = Math.max(1, this.currentPage - half);
    let endPage = Math.min(this.totalPages, startPage + pagesToShow - 1);

    if (endPage - startPage + 1 < pagesToShow) {
      startPage = Math.max(1, endPage - pagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }
}
