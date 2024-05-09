import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { NAV_LINKS } from 'src/app/shared/helpers/navLinks';

@Component({
  selector: 'app-mobile-menu',
  templateUrl: './mobile-menu.component.html',
  styleUrls: ['./mobile-menu.component.css'],
})
export class MobileMenuComponent {
  showLogo = true;
  navLinks = NAV_LINKS;
  @Output() isMobileMenuOpenChange = new EventEmitter<boolean>();

  constructor() {
    this.checkScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    if (window.innerWidth < 768) {
      this.showLogo = false;
    } else {
      this.showLogo = true;
    }
  }

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
