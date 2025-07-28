export type TLoginUser = {
  email: string;
  password: string;
};
export type TRegisterUser = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};
export type TSocialLogin = {
  provider: 'google' | 'facebook';
  token: string;
  deviceId?: string;
  ipAddress?: string;
};