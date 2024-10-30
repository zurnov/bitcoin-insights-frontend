import { Component, ElementRef, ViewChild } from '@angular/core';
import { LoadingService } from 'src/app/shared/services/loading.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent {
  isLoading$ = this.loadingService.isLoading$;
  showDropdown: string | null = null;

  @ViewChild('linkedinDropdown', { static: false })
  linkedinDropdown!: ElementRef;
  @ViewChild('githubDropdown', { static: false }) githubDropdown!: ElementRef;

  constructor(private loadingService: LoadingService) {}

  toggleDropdown(dropdown: string) {
    this.showDropdown = this.showDropdown === dropdown ? null : dropdown;

    setTimeout(() => {
      if (this.showDropdown === 'linkedin' && this.linkedinDropdown) {
        this.linkedinDropdown.nativeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      } else if (this.showDropdown === 'github' && this.githubDropdown) {
        this.githubDropdown.nativeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }, 0);
  }
}
