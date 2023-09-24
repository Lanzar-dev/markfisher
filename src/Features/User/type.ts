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
  appointmentHistory?: IAppointmentHistory[] | null;
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

export interface IAppointmentHistory {
  recordID: number;
  internalid: number;
  recordstatus: number;
  appointmentdate: string;
  appointmenttime: number;
  appointmentlength: number;
  appointmentcode: number;
  appointmenttype: number;
  appointmenttypeValue: string;
  reason: string;
  arrivaltime: number;
  consultationtime: number;
  visitlength: number;
  comment: string;
  created: string;
  updated: string;
  doctorsId: number;
  doctors: IADoctor;
}

interface IADoctor {
  surname: string;
  firstname: string;
  title: string;
  photoUrl: string;
}

export interface IAuth {
  userId: string;
  token: string;
}

export interface IProfile {
  address1: string;
  address2: string;
  city: string;
  dob: string;
  email: string;
  firstname: string;
  homephone: string;
  internalid: number;
  medicarelineno: string;
  medicareno: string;
  mobilephone: string;
  postcode: any;
  sexcode: number;
  surname: string;
  workphone: string;
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

export interface ISignUp {
  Email: string;
  PhoneNumber: string;
  Password: string;
}
