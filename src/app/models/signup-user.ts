export class SignupUser {
  userType!: string;
  name!: string;
  email!: string;
  phone!: string;
  location!: string;
  password!: string;
  category!: any[];
  targetLocation!: any[];
  targetAgeRange!: any[];
  targetGender!: any[];

  constructor(userType: string, name: string, email: string, phone: string, location: string, password: string, category: any[], targetLocation: any[], targetAgeRange: any[], targetGender: any[]) {
    this.userType = userType;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.location = location;
    this.password = password;
    this.category = category;
    this.targetLocation = targetLocation;
    this.targetAgeRange = targetAgeRange;
    this.targetGender = targetGender;
  }

}
