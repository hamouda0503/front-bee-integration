import { Role } from "./Role";


export class User {
  id?: string;
  firstname: string;
  lastname: string;

  email: string;
  password?: string; // Optionnel si vous ne souhaitez pas envoyer le mot de passe dans certaines requêtes
  role: Role;

  authorities:any ;

  constructor() {
    this.firstname = '';
    this.lastname = '';
    this.email = '';
    this.role = Role.USER; // Définissez une valeur par défaut si nécessaire


}}
