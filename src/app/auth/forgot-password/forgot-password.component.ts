import { Component } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from "../../shared/services/auth.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {StorageService} from "../../shared/services/storage.service";
import {UpdatePasswordRequest} from "../../shared/model/upPassReq.model";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
token :string;
  public show: boolean = false;
  resetPasswordForm: FormGroup;
  errorMessage: string;
  successMessage: string;

  constructor(public router:Router,private route: ActivatedRoute,private authService: AuthService, private fb: FormBuilder,private storageService:StorageService) {


  }

  ngOnInit() {
this.route.queryParams.subscribe(s => {
  console.log(s["token"])
  this.token=s["token"];
});
console.log(this.token);
    this.resetPasswordForm = this.fb.group({

      password: ['', [Validators.required, Validators.minLength(6)]], // Minimum password length of 6
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator }); // Add password match validator
  }

  onSubmit() {
    if (this.resetPasswordForm.valid) {
     const  request = new UpdatePasswordRequest(
        this.token,
        this.resetPasswordForm.value.password,
        this.resetPasswordForm.value.confirmPassword
      );

      console.log(this.token, this.resetPasswordForm.value.password, this.resetPasswordForm.value.confirmPassword);

      this.authService.ResetPasword(request)
        .subscribe(

          (response) => {
            this.successMessage = response;
            this.errorMessage = null;
            // Handle successful password reset (e.g., redirect to login page)
          },
          (error) => {
            this.handleErrors(error);
          }
        );
    } else {
      // Handle form validation errors (optional)
      console.error('Form is invalid:', this.resetPasswordForm.errors);
    }
  }

  private handleErrors(error: any) {
    this.errorMessage = 'An error occurred.'; // Default error message
    if (error.error) {
      this.errorMessage = error.error; // Assuming the error response contains an error message in the `error` property
    }

    // More specific error handling based on the error message
    if (this.errorMessage.includes('Password Confirm shouldn\'t be null')) {
      this.errorMessage = 'Please confirm your password by entering it again in the "Confirm Password" field.';
    }
  }

  private passwordMatchValidator(control: FormGroup): { [key: string]: any } | null {
    const password = control.get('password').value;
    const confirmPassword = control.get('confirmPassword').value;
    if (password !== confirmPassword) {
      return { 'noMatch': true }; // Custom error key for password mismatch
    }
    return null;
  }

  showPassword() {
    this.show = !this.show;
  }

}
