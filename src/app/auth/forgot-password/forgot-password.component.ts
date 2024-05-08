import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResetPasswordRequest} from "../../shared/model/reset-password-request";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  token: string;
  show: boolean = false;
  resetPasswordForm: FormGroup;
  errorMessage: string;
  successMessage: string;

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
    });

    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  onSubmit() {
    if (this.resetPasswordForm.valid) {
      const request: ResetPasswordRequest = {
        newPassword: this.resetPasswordForm.value.password,
        confirmPassword: this.resetPasswordForm.value.confirmPassword
      };

      this.authService.resetPassword(request, this.token)
        .subscribe(
          () => {
            this.successMessage = 'Password reset successful.';
            this.errorMessage = null;
            // Handle successful password reset (e.g., redirect to login page)
          },
          error => {
            this.handleErrors(error);
          }
        );
    } else {
      console.error('Form is invalid:', this.resetPasswordForm.errors);
    }
  }

  private handleErrors(error: any) {
    this.errorMessage = 'An error occurred.';
    if (error.error) {
      this.errorMessage = error.error;
    }

    if (this.errorMessage.includes('Password Confirm shouldn\'t be null')) {
      this.errorMessage = 'Please confirm your password by entering it again.';
    }
  }

  private passwordMatchValidator(control: FormGroup): { [key: string]: any } | null {
    const password = control.get('password').value;
    const confirmPassword = control.get('confirmPassword').value;
    if (password !== confirmPassword) {
      return { 'noMatch': true };
    }
    return null;
  }

  showPassword() {
    this.show = !this.show;
  }
}
