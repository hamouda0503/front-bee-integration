import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import {AvatarService} from "../../shared/services/avatar.service";
import {DomSanitizer} from "@angular/platform-browser";
import Swal from 'sweetalert2';
import {RegisterRequest  } from '../../shared/model/register-request';
import { AuthenticationResponse } from '../../shared/model/authentication-response';
import { VerificationRequest } from '../../shared/model/verification-request';

import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {


  avatarUrl: any;
  defaultUrl : string ='https://placehold.jp/150x150.png';
  avatar: any;


  registerRequest: RegisterRequest = {};
  authResponse: AuthenticationResponse = {};
  message = '';
  otpCode = '';




  selectedValue = 'thumbs';

  // options = [
  //   { value: 'thumbs', label: 'thumbs' },
  //   { value: 'fun-emoji', label: 'Fun Emoji' },
  //   { value: 'big-smile', label: 'Big Smile' },
  //   { value: 'notionists-neutral', label: ' Notionists Neutral' },
  //
  // ];

  public show: boolean = false;

  currentFile?: File;

  registrationForm: FormGroup;
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';


  loading = false;

  constructor(private fb: FormBuilder,private authService: AuthService,public router: Router, private avatarService: AvatarService, private sanitizer: DomSanitizer,private toastr: ToastrService) { }

  ngOnInit() {

    this.registrationForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      password: ['', Validators.required],  
      role: ['', Validators.required],
      mfaEnabled: [false] // Checkbox value
    });
  }

  selectFile(event: any): void {
    this.currentFile = event.target.files;
    console.log(this.currentFile[0]);
  }

  


  onSubmit() {
    if (this.registrationForm.valid) {
      this.loading = true;
  
      const formData = new FormData();
      formData.append('firstname', this.registrationForm.value["firstname"]);
      formData.append('lastname', this.registrationForm.value["lastname"]);
      formData.append('email', this.registrationForm.value["email"]);
      formData.append('phone', this.registrationForm.value["phone"]);
      formData.append('password', this.registrationForm.value["password"]);
      formData.append('role', this.registrationForm.value["role"]);
      formData.append('mfaEnabled', this.registrationForm.value["mfaEnabled"]);
      formData.append('file', this.currentFile[0]);
  
      console.log(formData);
  
      this.authService.register(formData).subscribe({
        next: data => {
          console.log(data);
          this.isSuccessful = true;
          this.isSignUpFailed = false;
  
          // Show Toastr success notification on successful registration
          this.toastr.success('Registration Successful!', 'Success');
  
          if (data) {
            this.authResponse = data;
            console.log(this.authResponse);
          } else {
            // Inform the user with Toastr notification
            this.toastr.info('Account created successfully. Please check your email to confirm your account.', 'Info');
            // Redirect to login page after 3 seconds
            setTimeout(() => {
              this.router.navigate(['auth/login']);
            }, 3000);
          }
        },
        error: err => {
          this.errorMessage = err.error.message;
          this.isSignUpFailed = true;
  
          // Show Toastr error notification
          this.toastr.error(err.error.message, 'Error');
        }
      });
    }
  }
  

  verifyTfa() {
    this.loading = true;
    this.message = '';
  
    const verifyRequest: VerificationRequest = {
      email: this.registrationForm.value["email"],
      code: this.otpCode
    };
  
    this.authService.verifyCode(verifyRequest)
      .subscribe({
        next: (response) => {
          this.message = 'Account created successfully\nYou will be redirected to the Welcome page in 3 seconds';
          this.toastr.success('Code verification successful!', 'Success');
          this.loading = false;
  
          setTimeout(() => {
            // localStorage.setItem('token', response.accessToken as string);
            this.router.navigate(['auth/login']);
          }, 3000);
        },
        error: (err) => {
          this.message = 'Invalid code';
          this.toastr.error('Code verification failed!', 'Error');
          this.loading = false;
        }
      });
  }
  


  generateAvatar(seed: string) {
    this.avatarService.getAvatar("thumbs",seed).subscribe(blob => {
      const url = URL.createObjectURL(blob);
      this.avatarUrl = this.sanitizer.bypassSecurityTrustUrl(url);
      this.avatar=url;
      console.log(this.avatarUrl);
      console.log(this.avatar);


    });
  }

  // generateAvatar(seed: string) {
  //   this.avatarService.getAvatar(this.selectedValue,seed).subscribe(blob => {
  //     const url = URL.createObjectURL(blob);
  //     this.avatarUrl = this.sanitizer.bypassSecurityTrustUrl(url);
  //     this.avatar=url;
  //     console.log(this.avatarUrl);
  //     console.log(this.avatar);
  //
  //
  //   });
  // }

    // onSelectionChange(event: any) {
  //   this.selectedValue = event.target.value;
  //   // Perform any actions based on the selected value here
  // }
  showPassword() {
    this.show = !this.show;
  }

}
