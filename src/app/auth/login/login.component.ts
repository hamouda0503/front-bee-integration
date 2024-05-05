import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from '../../shared/services/auth.service';
import { AuthenticationRequest } from '../../shared/model/authentication-request';
import { AuthenticationResponse } from '../../shared/model/authentication-response';
import { VerificationRequest } from '../../shared/model/verification-request';



import { StorageService } from '../../shared/services/storage.service';
import Swal from 'sweetalert2';

import { ToastrService } from 'ngx-toastr';


@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  public newUser = false;

  public loginForm: FormGroup;
  public show: boolean = false
  public errorMessage: any;

  authRequest: AuthenticationRequest = {};
  otpCode = '';
  authResponse: AuthenticationResponse = {};

  isLoggedIn = false;
  isLoginFailed = false;

  isLoggedin?: boolean;

  roles :any;

  constructor(private fb: FormBuilder, private authService: AuthService, private storageService: StorageService, public router: Router,private toastr: ToastrService) {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
    });
  }

  ngOnInit() {
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
      this.roles = this.storageService.getUser().role;
    }

  
  }

  

  forgotPassword() {
    Swal.fire({
      title: 'Forgot Password?',
      text: 'Please enter your registered email address.',
      input: 'email',
      showCancelButton: true,
      confirmButtonColor:"#FFC107",
      confirmButtonText: 'Send Reset Link',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        const email = result.value;

        // Call your authentication service method
        this.authService.ForgotPassword(email).subscribe(
          (response) => {
            // Handle successful response (optional)
            console.log('Forgot password response:', response);
            Swal.fire('Success!', 'A password reset link has been sent to your email.', 'success');
          },
          (error) => {
            // Handle errors (optional)
            console.error('Error sending forgot password email:', error);
            Swal.fire('Error!', 'An error occurred while sending the reset link.', 'error');
          }
        );
      }
    });
  }


  login() {
    this.authService.login(this.loginForm.value["email"], this.loginForm.value["password"])
      .subscribe({
        next: (data) => {
          // Assuming data contains access_token, refresh_token, and user info
  
          this.authResponse = data;
          console.log(this.authResponse);
  
          if (!this.authResponse.mfaEnabled) {
            const accessToken = data.accessToken;
            const refreshToken = data.refreshToken;
            const userInfo = data.user; // Might need adjustment based on response structure
  
            this.storageService.saveTokensAndUserInfo(accessToken, refreshToken, userInfo);
            this.isLoggedIn = true;
            // this.reloadPage();
            this.router.navigate(["/single-page"]);
            this.toastr.success('Login successful!', 'Success');
          } else {
            // User requires MFA verification (handle MFA flow here)
            this.toastr.info('MFA verification required. Please check your email or phone for the code.', 'Info');
          }
        },
        error: (err) => {
          this.errorMessage = err.error.message;
          this.isLoginFailed = true;
          this.toastr.error('Login failed: ' + err.error.message, 'Error');
        }
      });
  }
  

  verifyCode() {
    const verifyRequest: VerificationRequest = {
      email: this.loginForm.value["email"],
      code: this.otpCode
    };
  
    this.authService.verifyCode(verifyRequest)
      .subscribe({
        next: (data) => {
  
          console.log("content data : ", data);
          const accessToken = data.accessToken;
          const refreshToken = data.refreshToken;
          const userInfo = data.user; // Might need adjustment based on response structure
  
          this.storageService.saveTokensAndUserInfo(accessToken, refreshToken, userInfo);
          // this.isLoggedIn = true;
          // this.reloadPage();
          this.toastr.success('MFA verification successful!', 'Success');
          this.router.navigate(["/single-page"]);
          
        },
        error: (err) => {
          this.errorMessage = err.error.message;
          // this.isLoginFailed = true;
          this.toastr.error('MFA verification failed: ' + err.error.message, 'Error');
        }
      });
  }

  showPassword(){
    this.show = !this.show
  }
}
