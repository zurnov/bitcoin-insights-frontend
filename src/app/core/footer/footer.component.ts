import { Component } from '@angular/core';
import { LoadingService } from 'src/app/shared/services/loading.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent {
  isLoading$ = this.loadingService.isLoading$;
  showDropdown: string | null = null; 

  constructor(private loadingService: LoadingService) {}

  toggleDropdown(dropdown: string) {
    this.showDropdown = this.showDropdown === dropdown ? null : dropdown;
  }
}
