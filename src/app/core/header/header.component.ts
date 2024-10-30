import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { NAV_LINKS } from 'src/app/shared/helpers/navLinks';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements AfterViewInit {
  isMobileMenuOpen = false;
  navLinks = NAV_LINKS;
  isButtonVisible = false;

  @ViewChild('burgerBtn', { static: false }) burgerBtn!: ElementRef;

  observer!: IntersectionObserver;

  ngAfterViewInit() {
    this.observer = new IntersectionObserver(
      (entries) => {
        this.isButtonVisible = entries[0].isIntersecting;
      },
      {
        threshold: 1,
        rootMargin: '-50% 0px -50% 0px',
      }
    );

    this.observer.observe(this.burgerBtn.nativeElement);
  }

  openMobileMenu() {
    if (this.isButtonVisible) {
      this.isMobileMenuOpen = true;
    } else {
      // console.log('burger btn not fully visible');

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });

      this.isMobileMenuOpen = true;
    }
  }

  handleCloseMobileMenu(value: boolean) {
    this.isMobileMenuOpen = value;
  }

  ngOnDestroy() {
    if (this.observer && this.burgerBtn) {
      this.observer.unobserve(this.burgerBtn.nativeElement);
    }
  }
}
