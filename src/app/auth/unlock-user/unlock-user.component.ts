import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-unlock-user',
  templateUrl: './unlock-user.component.html',
  styleUrls: ['./unlock-user.component.scss']
})
export class UnlockUserComponent implements OnInit {

  public show: boolean = false;

  verifyForm: FormGroup;

  errorMessage = '';

  constructor(private fb: FormBuilder,private authService: AuthService,public router: Router,private toastr: ToastrService) { }

  ngOnInit() {
    this.verifyForm = this.fb.group({
      OTP: ['', Validators.required],
    });
  }


  onSubmit() {
    this.authService.ActivateAccount(this.verifyForm.value["OTP"]).subscribe({
      next: data => {
        this.toastr.success('Account Activated Successfully!', 'Success'); // Success Toastr notification
  
        setTimeout(() => {
          this.router.navigate(['auth/login']);
        }, 3000);
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.toastr.error(this.errorMessage, 'Error'); // Error Toastr notification
      }
    });
  }
  



  showPassword() {
    this.show = !this.show;
  }

}
