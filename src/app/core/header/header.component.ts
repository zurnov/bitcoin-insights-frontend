import { Component, HostListener } from '@angular/core';
import { NAV_LINKS } from 'src/app/shared/helpers/navLinks';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  isMobileMenuOpen = false;
  navLinks = NAV_LINKS;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (this.isMobileMenuOpen) {
      this.isMobileMenuOpen = false;
    }
  }

  openMobileMenu() {
    this.isMobileMenuOpen = true;
  }

  handleCloseMobileMenu(value: boolean) {
    this.isMobileMenuOpen = value;
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.onWindowScroll);
  }
}
