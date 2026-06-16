import { Component } from '@angular/core';
import { FeedbackService } from '../../services/feedback.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css'],
})
export class FeedbackComponent {
  isOpen = false;
  submitting = false;
  submitted = false;

  email = '';
  message = '';

  constructor(
    private feedbackService: FeedbackService,
    private notificationService: NotificationService,
  ) {}

  toggle() {
    this.isOpen = !this.isOpen;
    if (!this.isOpen) {
      this.reset();
    }
  }

  submit() {
    if (!this.message.trim()) return;

    this.submitting = true;
    this.feedbackService
      .submit({
        email: this.email.trim() || undefined,
        message: this.message.trim(),
        pageUrl: window.location.pathname,
      })
      .subscribe({
        next: () => {
          this.submitting = false;
          this.submitted = true;
        },
        error: () => {
          this.submitting = false;
          this.notificationService.showError('Failed to send feedback. Please try again.');
        },
      });
  }

  close() {
    this.isOpen = false;
    this.reset();
  }

  private reset() {
    this.email = '';
    this.message = '';
    this.submitted = false;
    this.submitting = false;
  }
}
