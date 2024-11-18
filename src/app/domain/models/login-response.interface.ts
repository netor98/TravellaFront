import {User} from "../models/user.model";

export interface LoginResponse {
  jwt: string;
  name: string;
  id: string;
  email: string;
  role: string;
}
