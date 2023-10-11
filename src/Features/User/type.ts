export interface ILogin {
  Username: string;
  Password: string;
}

export interface IUserState {
  currentUser?: IProfile | null;
  isLoading: boolean;
  isAuth?: boolean;
  userId?: string;
  token?: string;
  appointment?: any;
  availableDoctors?: any[] | null;
  airtimeCategory?: IAirtimeCategory[] | null;
  selectedDoctor?: any | null;
  isBookedApt: boolean;
  doctorAptDatetime?: GetDoctorAptDates[];
  selectedDocAptDate?: EachAptDate[] | null;
}

export interface GetDoctorAptDates {
  getAppointments: EachAptDate[];
}

export interface EachAptDate {
  appointmentDate: string;
  appointmentTime: number;
  appointmentLength: number;
}

export interface IAirtimeCategory {
  id: number;
  biller_code: string;
  name: string;
  default_commission: number;
  date_added: string;
  country: string;
  is_airtime: boolean;
  biller_name: string;
  item_code: string;
  short_name: string;
  fee: number;
  commission_on_fee: boolean;
  label_name: string;
  amount: number;
}

export interface IBillsPaymentPayload {
  country: string;
  customer: string;
  amount: string;
  recurrence: string;
  type: string;
  reference: string;
  biller_name: string;
}

export interface IValidateCustomer {
  customer: string;
  code: string;
  item_code: string;
  network_name: string;
}

export interface IAuth {
  userId: string;
  token: string;
}

export interface IProfile {
  Id: string;
  Email: string;
  PhoneNumber: string;
  Password: string;
  IsVerifiedEmail: boolean;
  IsTwoFacEnabled: boolean;
  TwoFacSecret: string;
}

export interface ICreatePin {
  email: string;
  pin: string;
}

export interface IPasswordUpdate {
  password: string;
  newPassword: string;
  confirm: string;
}

export interface IPasswordChange {
  password: string;
  newPassword: string;
  email?: string;
}

export interface IPatch {
  op: string;
  value: string;
  path: string;
}

export interface IKyc {
  contact_phone: string;
  firstName?: string;
  lastName?: string;
  reference?: string;
  externalId: string;
  notifications: string[];
}

export interface IForgetPassword {
  email: string;
}

export interface IResetPassword {
  password: string;
  confirmPassword: string;
}

export interface ISignin {
  Email: string;
  Password: string;
}
export interface IBankTransferPayload {
  AccountNumber: string;
  BankName: string;
  Beneficiary: string;
  Narration: string;
  Amount: string;
}
export interface IAirtimePayload {
  MobileNumber: string;
  NetworkName: string;
  Amount: string;
  Email: string;
}
export interface IBundlePayload {
  MobileNumber: string;
  NetworkName: string;
  Amount: string;
  Email: string;
}
export interface IPSBTransferPayload {
  AccountNumber: string;
  BankName: string;
  Beneficiary: string;
  Narration: string;
  Amount: string;
}
export interface IBiyaTransferPayload {
  AccountNumber: string;
  Beneficiary: string;
  Narration: string;
  Amount: string;
}
export interface ITollPayload {
  CustomerId: string;
  Amount: string;
}
export interface IForgotPass {
  Email: string;
}
export interface ISignUp {
  Email: string;
  PhoneNumber: string;
  Password: string;
}

export interface IVerifyEmail {
  EmailOTP: string;
  Email: string;
}

export interface IBillsCategory {
  QueryParam: string;
  Index: string;
}
