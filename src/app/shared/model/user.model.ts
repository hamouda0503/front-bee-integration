export class User {
    id?: string;
  firstname: string;
  lastname: string;


    imageUrl?: string;
    phone?: string;
    email?: string;
    password?: string; // Consider not storing password in local storage
    confirmPassword?: string; // Consider not storing confirm password in local storage
    role?: string;
    enabled?: boolean;
    token?: string; // Optional, could be used to store access token locally

    constructor(data?: any) {
      if (data) {
        this.id = data.id;
        this.firstname = data.firstname;
        this.lastname = data.lastname;
        this.imageUrl = data.imageUrl;
        this.email = data.email;
        this.password = data.password; // Include with caution
        this.confirmPassword = data.confirmPassword; // Include with caution
        this.role = data.role;
        this.enabled = data.enabled;
        this.token = data.token; // Optional
      }
    }
  }
