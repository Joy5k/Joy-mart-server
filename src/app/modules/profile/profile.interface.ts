export interface IProfile {
  firstName?: string;
  lastName?: string;
  image?: string;
  email: string;
  password: string;
  role: "superAdmin" | "admin" | "user" | "seller";
  phoneNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  dateOfBirth?: string;
  isDeleted?: boolean;
  isSocialLogin?: boolean;
}
