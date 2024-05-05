  import { Component, OnInit } from '@angular/core';
  import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';

  import {UserService} from "../../../../shared/services/user.service";
  import {User} from "../../../../shared/model/user.model";
  import {StorageService} from "../../../../shared/services/storage.service";
  import {AvatarService} from "../../../../shared/services/avatar.service";
  import {DomSanitizer} from "@angular/platform-browser";

  @Component({
    selector: 'app-edit-profile',
    templateUrl: './edit-profile.component.html',
    styleUrls: ['./edit-profile.component.scss']
  })
  export class EditProfileComponent implements OnInit {

    public myProfile: UntypedFormGroup;
    public editProfile: UntypedFormGroup;
    public user : any;
    avatarUrl: any;

    constructor(private fb: UntypedFormBuilder, private userService: UserService,private storage: StorageService, private avatarService: AvatarService, private sanitizer: DomSanitizer) {
      // this.generateAvatar(this.storage.getUser().email);
    }

    // generateAvatar(seed: string) {
    //   this.avatarService.getAvatar("thumbs",seed).subscribe(blob => {
    //     const url = URL.createObjectURL(blob);
    //     this.avatarUrl = this.sanitizer.bypassSecurityTrustUrl(url);

    //     console.log(this.avatarUrl);



    //   });
    // }


    ngOnInit(): void {

      this.user = this.storage.getUser();
      this.myProfile = this.fb.group({
        bio: ['On the other hand, we denounce with righteous indignation'],
        firstName: [this.user.firstname],
        lastName: [this.user.lastname],
        phone: [this.user.phone],
        email: [this.user.email, [Validators.email]],


      });
      this.editProfile = this.fb.group({
        firstName: [this.user.firstname],
        lastName: [this.user.lastname],
        phone: [this.user.phone],
      })
    }


    onSubmit() {
      if (this.editProfile.valid) {
        const updatedUser = this.editProfile.value as User;

        console.log(updatedUser ,this.user.email)// Cast form values to User object
        this.userService.updateUser(this.user.email, updatedUser) // Call UserService update method
          .subscribe(response => {
            console.log('User profile updated successfully:', response);
            // Handle successful update (e.g., show success message)
          }, error => {
            console.error('Error updating user profile:', error);
            // Handle errors (e.g., show error message)
          });
      }
    }


  }
