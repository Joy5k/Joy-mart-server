import config from "../config";
import { ProfileModel } from "../modules/profile/profile.model";
import { USER_ROLE } from "../modules/user/user.constant";
import { User } from "../modules/user/user.model";

const superUser = {
  email: "mmehedihasanjoyv@gmail.com",
  password: config.super_admin_password,
  needsPasswordChange: false,
  role: USER_ROLE.superAdmin,
  status: "in-progress",
  isDeleted: false,
};
const superUserProfile = {
  firstName: "Mehedi",
  lastName: "Hasan",
  image:
    "https://thumbs.dreamstime.com/b/test-icon-vector-question-mark-260nw-1221230525.jpg",
  email:"mmehedihasanjoyv@gmail.com",
  password: config.super_admin_password, 
  phoneNumber: "01700000000",
  address: "Dhaka",
  city: "Dhaka",
  country: "Bangladesh",
  state: "Dhaka",
  zipCode: "1212",
  dateOfBirth: "1998-01-01",
  isDeleted: false,

};
const seedSuperAdmin = async () => {
  const isSuperAdminExists = await User.findOne({ role: USER_ROLE.superAdmin });
  const isSuperAdminExistsOnProfileModel= await ProfileModel.findOne({ email: superUserProfile.email });
  if (!isSuperAdminExistsOnProfileModel) {
    await ProfileModel.create([superUserProfile]);
  }
  if (!isSuperAdminExists) {
    await User.create(superUser);
  }
};
export default seedSuperAdmin;
