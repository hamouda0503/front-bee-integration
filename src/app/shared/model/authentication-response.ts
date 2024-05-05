import { User } from "./user.model";

export interface AuthenticationResponse {
  accessToken?: string;
  refreshToken?: string;
  mfaEnabled?: string;
  secretImageUri?: string;
  user?:User
}
