export interface ILogin {
  Username: string;
  Password: string;
}

export interface IUserState {
  currentUser?: IProfile | null;
  isLoading: boolean;
  isAuth?: boolean;
  isNotify: boolean;
  userId?: string;
  token?: string;
  rtoken?: string;
  banks?: IBanksPayload[] | null;
  airtimeCategory?: IAirtimeCategory[] | null;
  tollCategory?: IAirtimeCategory[] | null;
  electricityCategory?: IAirtimeCategory[] | null;
  bundleCategory?: IAirtimeCategory[] | null;
  cableCategory?: IAirtimeCategory[] | null;
  verifiedAcct?: IVerifiedAcct | null;
  notify?: INotify | null;
  transactions?: [] | null;
  pendingBill: IPendingBill[];
}
export interface IPendingBill {
  Type: string;
  Reference: string;
  Count: number;
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

export interface IVerifyBankAcct {
  account_number: string;
  account_bank: string;
}
export interface IVerifiedAcct {
  account_name: string;
  account_number: string;
  bank_id: number;
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
  OTP: number;
  Email: string;
  NewPassword: string;
  ConfirmPassword: string;
}

export interface ISignin {
  Email: string;
  Password?: string;
}
export interface IBankTransferPayload {
  AccountNumber: string;
  BankName: string;
  Beneficiary: string;
  Narration: string;
  Amount: string;
}

export interface ITransferPayload {
  BankCode: string;
  AccountNumber: string;
  Amount: string;
  Narration: string;
  Currency: string;
  Email: string;
}

export interface IElectricityPayload {
  MeterNumber: string;
  OfficeName: string;
  Amount: string;
  BillerCode: string;
  ItemCode: string;
  Email: string;
  BillerName: string;
  IsPrepaid: boolean;
}

export interface ICablePayload {
  DecoderNumber: string;
  SubscriptionName: string;
  Amount: string;
  ItemCode: string;
  BillerCode: string;
  BillerName: string;
  Email: string;
}

export interface IBanksPayload {
  id: string;
  code: string;
  name: string;
}

export interface IAirtimePayload {
  MobileNumber: string;
  NetworkName: string;
  Amount: string;
  Email: string;
  BillerCode: string;
  ItemCode: string;
}

export interface IBundlePayload {
  MobileNumber: string;
  NetworkName: string;
  BundleName: string;
  Amount: string;
  Email: string;
  BillerCode: string;
  ItemCode: string;
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
  Currency: string;
  Email: string;
}

export interface ITollPayload {
  CustomerId: string;
  Amount: string;
  TollName: string;
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

export interface ICreatePaymentLink {
  customer: ICustomer;
  amount: string;
  currency: string;
  tx_ref?: string;
  redirect_url?: string;
  meta?: IMeta;
  customizations?: ICustomizations;
}

interface ICustomer {
  email: String;
  phonenumber: String;
  name: string;
}

interface IMeta {
  consumer_id?: number;
  consumer_mac?: string;
}

interface ICustomizations {
  title?: string;
  logo?: string;
  description?: string;
}

export interface INotify {
  color?: string;
  text: string;
}
