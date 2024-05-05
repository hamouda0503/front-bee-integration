import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { Observable } from "rxjs";
@Injectable({
  providedIn: "root",
})
export class AdminGuard  {
  constructor(public router: Router) {}
  user1 : any  = "";
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    // Guard for user is login or not
   this.user1 = localStorage.getItem("auth-token");
   console.log(this.user1)
    // let user = JSON.parse(this.user1);
    console.log(this.user1)

    if (!this.user1 || this.user1 === "") {
      this.router.navigate(["/auth/login"]);
      return true;
    } else if (this.user1) {
      if (!Object.keys(this.user1).length) {
        this.router.navigate(["/auth/login"]);
        return true;
      }
    }
    return true;
  }
  //  // Guard for user is logged in or not
  //  const user1 = localStorage.getItem("auth-user-info");
  //  let user = JSON.parse(user1);

  //  if (!user || !Object.keys(user).length) {
  //    // Check if the current route is /auth/forgot-password
  //    if (next.url.toString() === '/auth/forgot-password') {
  //      return true; // Allow access to /auth/forgot-password
  //    }

  //    this.router.navigate(["/auth/login"]);
  //    return false;
  //  }

//    return true;
//  }
}
