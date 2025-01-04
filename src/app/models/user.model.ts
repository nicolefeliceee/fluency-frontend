export class User {
  name: string;
  email: string;
  phone: string;
  location: number;
  userType: string;

  constructor(name: string, email: string, phone: string, location: number, userType: string) {
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.location = location;
    this.userType = userType;
  }
}
