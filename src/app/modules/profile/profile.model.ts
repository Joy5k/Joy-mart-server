import { model, Schema } from "mongoose";
import { IProfile } from "./profile.interface";
import bcrypt from "bcrypt";
import config from "../../config";

export const ProfileSchema = new Schema<IProfile>({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default:
      "https://thumbs.dreamstime.com/b/test-icon-vector-question-mark-male-user-person-profile-avatar-symbol-help-sign-glyph-pictogram-test-icon-vector-168495430.jpg",
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
  },
  address: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  country: {
    type: String,
  },
  zipCode: {
    type: String,
  },
  dateOfBirth: {
    type: String,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  }
});
ProfileSchema.pre("save", async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this; // doc
  // hashing password and save into DB

  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );

  next();
});

// set '' after saving password
ProfileSchema.post("save", function (doc, next) {
  doc.password = "";
  next();
});
export const ProfileModel = model<IProfile>("Profile", ProfileSchema);
