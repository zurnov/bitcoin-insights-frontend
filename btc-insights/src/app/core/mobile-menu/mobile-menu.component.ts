import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { NAV_LINKS } from 'src/app/shared/helpers/navLinks';

@Component({
  selector: 'app-mobile-menu',
  templateUrl: './mobile-menu.component.html',
  styleUrls: ['./mobile-menu.component.css'],
})
export class MobileMenuComponent {
  navLinks = NAV_LINKS;
  @Output() isMobileMenuOpenChange = new EventEmitter<boolean>();

  @HostListener('document:keyup', ['$event'])
  handleKeyUp(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.closeMobileMenu();
    }
  }

  closeMobileMenu() {
    this.isMobileMenuOpenChange.emit(false);
  }
}
