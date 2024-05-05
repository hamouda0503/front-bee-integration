export class UpdatePasswordRequest {
  token: string;
  password: string;
  passwordConfirm: string;

  constructor(
    token?: string,
    password?: string,
    passwordConfirm?: string
  ) {
    this.token = token || ''; // Use empty string as default
    this.password = password || '';
    this.passwordConfirm = passwordConfirm || '';
  }

}
