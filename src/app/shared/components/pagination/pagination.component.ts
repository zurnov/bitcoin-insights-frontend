import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css'],
})
export class PaginationComponent {
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 10;
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
}
