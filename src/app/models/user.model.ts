export interface User {
  local?: {
    email: string;
    password: string;
    profilePicture: string;
  };

  username: string;
  fname: string;
  lname: string;

  followers: [string];
  following: [string];
  isAdmin: boolean;
  provider: 'local';
  google: {};
  bio: string;
  gender: boolean;
  createdAt: Date;
  updatedAt: Date;
}
