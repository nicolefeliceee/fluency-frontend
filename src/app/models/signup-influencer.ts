export class SignupInfluencer {
  userType!: string;
  name!: string;
  gender!: string;
  email!: string;
  phone!: string;
  dob!: string;
  location!: string;
  category!: any[];
  feedsPrice!: string;
  reelsPrice!: string;
  storyPrice!: string;
  instagramId!: string;
  token!: string;

  constructor(userType: string, name: string, email: string, phone: string, location: string, gender: string, dob: string, category: any[], feeds: string, reels: string, story: string, instagramId: string, token: string) {
    this.userType = userType;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.location = location;
    this.dob = dob;
    this.gender = gender;
    this.category = category;
    this.feedsPrice = feeds;
    this.reelsPrice = reels;
    this.storyPrice = story;
    this.instagramId = instagramId;
    this.token = token;
  }
}


