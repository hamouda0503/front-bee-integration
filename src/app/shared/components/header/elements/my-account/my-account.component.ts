import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "src/app/shared/services/auth.service";
import { UserService } from "src/app/shared/services/user.service";
import {User} from "../../../../model/user.model";
import {StorageService} from "../../../../services/storage.service";
import {AvatarService} from "../../../../../shared/services/avatar.service";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: "app-my-account",
  templateUrl: "./my-account.component.html",
  styleUrls: ["./my-account.component.scss"],
})
export class MyAccountComponent implements OnInit {
  public userName: string;
  public profileImg: "assets/images/dashboard/profile.jpg";

  avatarUrl: any;
  constructor(public router: Router,private authService: AuthService,private userS:UserService,private storageservice:StorageService, private avatarService: AvatarService, private sanitizer: DomSanitizer) {
    this.generateAvatar(this.storageservice.getUser().email);
  }





  generateAvatar(seed: string) {
    this.avatarService.getAvatar("thumbs",seed).subscribe(blob => {
      const url = URL.createObjectURL(blob);
      this.avatarUrl = this.sanitizer.bypassSecurityTrustUrl(url);

      console.log(this.avatarUrl);



    });
  }
  user:any ;
  ngOnInit() {
    this.user=this.storageservice.getUser();
    console.log(this.user);
  }

  logout() {
    this.userS.logout().subscribe(() => {
      // Handle successful logout:
      console.log('Logout successful!');
      // Clear local storage (tokens, user info)
      localStorage.removeItem('auth-token'); // Replace with your token storage key
      localStorage.removeItem('auth-user-info'); // Replace with your user info storage key
      localStorage.removeItem('auth-refresh-token'); // Replace with your user info storage key
      this.router.navigateByUrl('/auth/login');// Redirect to login page (using router)
    }, (error) => {
      console.error('Logout error:', error);
      // Handle logout error (optional)
    });
  }

  logoutFunc() {
 this.logout();

  }
}
