import { Component } from '@angular/core';
import { ContactService } from '../../../services/contact.service/contact.service';
import { EmailRequest } from '../../../models/contact/contact.models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent {
  contact = {
    name: '',
    email: '',
    subject: '',
    message: '',
  };

  email: EmailRequest | undefined;

  constructor(
    private contactService: ContactService,
    private snackBar: MatSnackBar,
  ) {}

  sendMessage(): void {
    if (
      !this.contact.name ||
      !this.contact.email ||
      !this.contact.subject ||
      !this.contact.message
    ) {
      return;
    }

    this.email = {
      emailFor: 'ContactUs',
      emailTo: 'info@sounddistrict.co.za',
      emailFrom: this.contact.email,
      name: this.contact.name,
      subject: this.contact.subject,
      message: this.contact.message,
    };

    this.contactService.sendEmail(this.email as EmailRequest).subscribe({
      next: (response) => {
        this.snackBar.open('Message sent successfully.', 'Close', {
          duration: 3000,
          panelClass: ['success-snack'],
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });

        this.contact = {
          name: '',
          email: '',
          subject: '',
          message: '',
        };
      },
      error: () => {
        alert('Unable to send your message. Please try again.');
      },
    });
  }
}
