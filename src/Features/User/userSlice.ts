import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { AppThunk } from "../../Store/store";
import { axios, axiosWithAuth } from "../utils";
import { clearErrors, setError, setSuccess } from "../Error/errorSlice";
import {
  EachAptDate,
  IAirtimeCategory,
  IAirtimePayload,
  IAuth,
  IBanksPayload,
  IBankTransferPayload,
  IBillsCategory,
  IBiyaTransferPayload,
  IBundlePayload,
  ICablePayload,
  IElectricityPayload,
  IForgotPass,
  IProfile,
  IResetPassword,
  ISignin,
  ISignUp,
  ITollPayload,
  IUserState,
  IValidateCustomer,
  IVerifiedAcct,
  IVerifyBankAcct,
  IVerifyEmail,
} from "./type";

const BASE_PATH = "Auth";
const BASE_PATH_FL = "FL";

const initialState: IUserState = {
  isLoading: false,
  userId: "",
  isBookedApt: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLoading: (state, { payload }: PayloadAction<boolean>) => {
      state.isLoading = payload;
    },

    setLogout: (state) => {
      state.isAuth = false;
      state.selectedDocAptDate = null;
      state.selectedDoctor = null;
      state.token = "";
      state.userId = "";
      state.currentUser = null;
      state.banks = null;
      state.airtimeCategory = null;
    },

    setProfile: (state, { payload }: PayloadAction<IProfile>) => {
      state.currentUser = payload;
    },

    setBanks: (state, { payload }: PayloadAction<IBanksPayload[]>) => {
      state.banks = payload;
    },

    setTollCategory: (
      state,
      { payload }: PayloadAction<IAirtimeCategory[]>
    ) => {
      state.tollCategory = payload;
    },

    setCableCategory: (
      state,
      { payload }: PayloadAction<IAirtimeCategory[]>
    ) => {
      state.cableCategory = payload;
    },

    setElectricityCategory: (
      state,
      { payload }: PayloadAction<IAirtimeCategory[]>
    ) => {
      state.electricityCategory = payload;
    },
    setBundleCategory: (
      state,
      { payload }: PayloadAction<IAirtimeCategory[]>
    ) => {
      state.bundleCategory = payload;
    },

    setAirtimeCategory: (
      state,
      { payload }: PayloadAction<IAirtimeCategory[]>
    ) => {
      state.airtimeCategory = payload;
    },

    setAuth: (state, { payload }: PayloadAction<IAuth>) => {
      state.isLoading = false;
      state.userId = payload.userId;
      state.token = payload.token;
      state.isAuth = true;
    },

    setToken: (state, { payload }: PayloadAction<string>) => {},
    setUserId: (state, { payload }: PayloadAction<string>) => {
      state.userId = payload;
    },
    setVerifiedAcct: (
      state,
      { payload }: PayloadAction<IVerifiedAcct | null>
    ) => {
      state.verifiedAcct = payload;
    },
    setSelectedDocAptDate: (
      state,
      { payload }: PayloadAction<EachAptDate[]>
    ) => {
      state.selectedDocAptDate = payload;
    },
  },
});

export const reset_password = (data: IResetPassword): AppThunk => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const path = "/ResetPassword";
      // console.log("checking ResetPassword path: ", path, " data: ", data);
      const response = await axios.put(path, data);
      if (response) {
        const { data } = response;
        if (data && !data.token) {
          if (data.error.length > 0)
            data.error.forEach((element: string) => {
              dispatch(setError(element));
            });
          else if (data.message) dispatch(setError(data.message));
        } else if (data && data.token) {
          dispatch(setProfile(data.profile));
          dispatch(setToken(data.token));
        }
      }
    } catch (error: any) {
      dispatch(setError(error?.message));
    }
    dispatch(setLoading(false));
  };
};

export const bookAppointment = (data: any): AppThunk => {
  return async (dispatch, getState) => {
    dispatch(setLoading(true));
    dispatch(clearErrors());
    try {
      const path = BASE_PATH + "/CreateAppointment";
      const newData = { ...data };
      newData.aptdate = formatDate(newData.aptdate);
      // console.log("checking ResetPassword path: ", path, " data: ", newData);
      const response = await axiosWithAuth(
        getState().patient.token as string
      ).post(path, data);

      if (response) {
        const data = response.data;
        // console.log("bookApt response: ", data);
        if (data.status === true) {
          // console.log("first-1: ", data.message);
          dispatch(setSuccess(data.message));
        } else if (data.status === false) {
          // console.log("first-2: ", data.message);
          dispatch(setSuccess(data.message));
        }
      }
    } catch (error: any) {
      dispatch(setError(error?.message));
    }
    dispatch(setLoading(false));
  };
};

export const cancelAppointment = (data: any): AppThunk => {
  return async (dispatch, getState) => {
    dispatch(setLoading(true));
    dispatch(clearErrors());
    try {
      const path = BASE_PATH + "/CancelAppointmentRequest";
      const payload: any = {
        appointmentId: data.recordID.toString(),
        UserId: getState().patient.userId,
      };
      const response = await axiosWithAuth(
        getState().patient.token as string
      ).post(path, payload);

      if (response) {
        const data = response.data;
        // console.log("data: ", data);
        if (data.status === true) {
          if ((data.message = "Success")) {
            dispatch(setSuccess(data.data));
          }
        }
      }
    } catch (error: any) {
      dispatch(setError(error?.message));
    }
    dispatch(setLoading(false));
  };
};

export const forget_password = (data: IForgotPass): AppThunk => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    dispatch(clearErrors());
    try {
      const path = BASE_PATH + "/ForgotPassword";
      // console.log("checking forget password path: ", path, " data: ", data);
      const response = await axios.post(path, data);
      if (response) {
        const data = response.data;
        // console.log("response-B: ", data);
        if (data.status === true) {
          if (data.message === "Success") {
            dispatch(setSuccess(data.data));
          }
        }
      }
    } catch (error: any) {
      // console.log("response-B: ", error);
      dispatch(setError(error?.message));
    }
    dispatch(setLoading(false));
  };
};

export const login = (data: ISignin): AppThunk => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    dispatch(clearErrors());
    try {
      const path = BASE_PATH + "/SignIn";
      const response = await axios.post(path, data);
      if (response) {
        const data = response.data;
        // console.log("data: ", response.data);

        if (data.code === 200) {
          dispatch(setProfile(data.body));
          dispatch(clearErrors());
          const resp: any = { code: data.code, message: data.message };
          dispatch(setSuccess(resp));
        }
      }
    } catch (error: any) {
      // console.log(error?.response?.data);
      dispatch(setError(error?.response?.data));
    }
    dispatch(setLoading(false));
  };
};

export const verifyEmail = (data: IVerifyEmail): AppThunk => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    dispatch(clearErrors());
    try {
      const path = BASE_PATH + "/VerifyEmail";
      const response = await axios.put(path, data);
      if (response) {
        const data = response.data;
        // console.log("data: ", response.data);
        if (data.code === 200) {
          dispatch(setSuccess(data));
        }
      }
    } catch (error: any) {
      // console.log(error?.response?.data);
      dispatch(setError(error?.response?.data));
    }
    dispatch(setLoading(false));
  };
};

export const resendVerifyEmail = (data: string): AppThunk => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    dispatch(clearErrors());
    try {
      const path = BASE_PATH + `/ResendVerifyEmail?Email=${data}`;
      const response = await axios.get(path);
      if (response) {
        const data = response.data;
        // console.log("data: ", response.data);
        if (data.code === 200) {
          dispatch(setSuccess(data));
        }
      }
    } catch (error: any) {
      console.log(error);
      dispatch(setError(error?.response?.data));
    }
    dispatch(setLoading(false));
  };
};

export const BankTransfer = (data: IBankTransferPayload): AppThunk => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    dispatch(clearErrors());
    try {
      const path = BASE_PATH + "/LoginPatientAccount";
      const response = await axios.post(path, data);
      if (response) {
        const data = response.data;

        // console.log("data: ", data);
        if (data.status === true) {
          const payload: IAuth = {
            userId: data.data.tokenModel.id,
            token: data.data.tokenModel.accessToken,
          };
          dispatch(setAuth(payload));
          dispatch(setProfile(data.data.patientDetailsResponse));
        } else if (data.status === false) {
          dispatch(setError(data.message));
        }
      }
    } catch (error: any) {
      dispatch(setError(error?.message));
    }
    dispatch(setLoading(false));
  };
};

export const BuyAirtime = (data: IAirtimePayload): AppThunk => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    dispatch(clearErrors());
    try {
      const path = BASE_PATH_FL + "/BuyAirtime";
      const response = await axios.post(path, data);
      if (response) {
        const data = response.data;

        // console.log("data: ", data);
        if (data.code === 200) {
          const payload: IAuth = {
            userId: data.data.tokenModel.id,
            token: data.data.tokenModel.accessToken,
          };
          dispatch(setAuth(payload));
          dispatch(setProfile(data.data.patientDetailsResponse));
        } else if (data.code === 400) {
          dispatch(setError(data));
        }
      }
    } catch (error: any) {
      // console.log(error);
      dispatch(setError(error?.response?.data));
    }
    dispatch(setLoading(false));
  };
};

export const BuyBundle = (data: IBundlePayload): AppThunk => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    dispatch(clearErrors());
    try {
      const path = BASE_PATH_FL + "/BuyBundle";
      const response = await axios.post(path, data);
      if (response) {
        const data = response.data;

        // console.log("data: ", data);
        if (data.code === 200) {
          const payload: IAuth = {
            userId: data.data.tokenModel.id,
            token: data.data.tokenModel.accessToken,
          };
          dispatch(setAuth(payload));
          dispatch(setProfile(data.data.patientDetailsResponse));
        } else if (data.code === 400) {
          dispatch(setError(data));
        }
      }
    } catch (error: any) {
      dispatch(setError(error?.response?.data));
    }
    dispatch(setLoading(false));
  };
};

export const BuyElectricity = (data: IElectricityPayload): AppThunk => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    dispatch(clearErrors());
    try {
      const path = BASE_PATH_FL + "/BuyElectricity";
      const response = await axios.post(path, data);
      if (response) {
        const data = response.data;

        // console.log("data: ", data);
        if (data.code === 200) {
          const payload: IAuth = {
            userId: data.data.tokenModel.id,
            token: data.data.tokenModel.accessToken,
          };
          dispatch(setAuth(payload));
          dispatch(setProfile(data.data.patientDetailsResponse));
        } else if (data.code === 400) {
          dispatch(setError(data));
        }
      }
    } catch (error: any) {
      dispatch(setError(error?.response?.data));
    }
    dispatch(setLoading(false));
  };
};

export const DstvPayment = (data: ICablePayload): AppThunk => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    dispatch(clearErrors());
    try {
      const path = BASE_PATH_FL + "/BuyAirtime";
      const response = await axios.post(path, data);
      if (response) {
        const data = response.data;

        // console.log("data: ", data);
        if (data.code === 200) {
          const payload: IAuth = {
            userId: data.data.tokenModel.id,
            token: data.data.tokenModel.accessToken,
          };
          dispatch(setAuth(payload));
          dispatch(setProfile(data.data.patientDetailsResponse));
        } else if (data.code === 400) {
          dispatch(setError(data));
        }
      }
    } catch (error: any) {
      dispatch(setError(error?.message));
    }
    dispatch(setLoading(false));
  };
};

export const GetBanks = (): AppThunk => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    dispatch(clearErrors());
    try {
      const path = BASE_PATH_FL + "/GetBanks";
      const response = await axios.get(path);
      if (response) {
        const data = response.data;

        // console.log("data: ", data);
        if (data.code === 200) {
          dispatch(setBanks(data.body));
        } else if (data.code === 400) {
          dispatch(setError(data));
        }
      }
    } catch (error: any) {
      dispatch(setError(error?.message));
    }
    dispatch(setLoading(false));
  };
};

export const VerifyBankAccount = (data: IVerifyBankAcct): AppThunk => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    dispatch(clearErrors());
    try {
      const path = BASE_PATH_FL + "/VerifyBankAccount";
      const response = await axios.post(path, data);
      // console.log(data);
      if (response) {
        const data = response.data;

        // console.log("data: ", data);
        if (data.code === 200) {
          dispatch(setVerifiedAcct(data.body.data));
          // dispatch(setBanks(data.body));
        } else if (data.code === 400) {
          dispatch(setError(data));
        }
      }
    } catch (error: any) {
      // dispatch(clearErrors());
      dispatch(setError(error?.message));
    }
    dispatch(setLoading(false));
  };
};

export const BiyaTransfer = (data: IBiyaTransferPayload): AppThunk => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    dispatch(clearErrors());
    try {
      const path = BASE_PATH + "/LoginPatientAccount";
      const response = await axios.post(path, data);
      if (response) {
        const data = response.data;

        // console.log("data: ", data);
        if (data.status === true) {
          const payload: IAuth = {
            userId: data.data.tokenModel.id,
            token: data.data.tokenModel.accessToken,
          };
          dispatch(setAuth(payload));
          dispatch(setProfile(data.data.patientDetailsResponse));
        } else if (data.status === false) {
          dispatch(setError(data.message));
        }
      }
    } catch (error: any) {
      dispatch(setError(error?.message));
    }
    dispatch(setLoading(false));
  };
};

export const TollPayment = (data: ITollPayload): AppThunk => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    dispatch(clearErrors());
    try {
      const path = BASE_PATH + "/LoginPatientAccount";
      const response = await axios.post(path, data);
      if (response) {
        const data = response.data;

        // console.log("data: ", data);
        if (data.status === true) {
          const payload: IAuth = {
            userId: data.data.tokenModel.id,
            token: data.data.tokenModel.accessToken,
          };
          dispatch(setAuth(payload));
          dispatch(setProfile(data.data.patientDetailsResponse));
        } else if (data.status === false) {
          dispatch(setError(data.message));
        }
      }
    } catch (error: any) {
      dispatch(setError(error?.message));
    }
    dispatch(setLoading(false));
  };
};

export const updateUserEmail = (data: any): AppThunk => {
  return async (dispatch, getState) => {
    dispatch(setLoading(true));
    dispatch(clearErrors());
    try {
      const path = BASE_PATH + "/UpdatePatientEmail";
      const response = await axiosWithAuth(
        getState().patient.token as string
      ).post(path, data);
      if (response) {
        const data = response.data;
        // console.log("data: ", response);
        if (data.status === true) {
          if ((data.message = "Success")) {
            dispatch(setSuccess(data.data));
          }
        }
      }
    } catch (error: any) {
      dispatch(setError(error?.message));
    }
    dispatch(setLoading(false));
  };
};

export const getBillsCategories = (payload: IBillsCategory): AppThunk => {
  return async (dispatch) => {
    dispatch(clearErrors());
    dispatch(setLoading(true));
    try {
      const path = BASE_PATH_FL + "/GetBillCategories";

      const response = await axios.post(path, payload);
      // console.log(response);
      if (response) {
        const data = response.data;
        // console.log("billCats response: ", data);
        if (payload.QueryParam === "airtime") {
          dispatch(setAirtimeCategory(data));
        } else if (payload.QueryParam === "data_bundle") {
          dispatch(setBundleCategory(data));
        } else if (payload.QueryParam === "power") {
          dispatch(setElectricityCategory(data));
        } else if (payload.QueryParam === "cable") {
          dispatch(setCableCategory(data));
        } else if (payload.QueryParam === "toll") {
          dispatch(setTollCategory(data));
        }
        if (data.code === 200) {
          dispatch(setProfile(data.body));

          const resp: any = { code: data.code, message: data.message };
          dispatch(setSuccess(resp));
        }
      }
    } catch (error: any) {
      // console.log(" error: ", error);
      dispatch(setError(error?.response?.data?.message));
    }
    dispatch(setLoading(false));
  };
};

export const getAppointmentHistoryById = (
  userId: number,
  pageNo: number
): AppThunk => {
  return async (dispatch, getState) => {
    dispatch(setLoading(true));
    try {
      const path =
        BASE_PATH +
        `/GetAppointmentHistoryById?userId=${userId}&pageNo=${pageNo}`;
      // console.log("user state: ", getState().patient);
      const response = await axiosWithAuth(
        getState().patient.token as string
      ).get(path);
      if (response) {
        const data = response?.data;
        if (data?.status === true) {
          // if (data?.data) dispatch(setAppointmentHistory(data?.data));
        }
      }
    } catch (error: any) {
      // dispatch(setError(error?.message));
      dispatch(setError(error?.response?.data?.message));
    }
    dispatch(setLoading(false));
  };
};

export const getDocAptDatesById = (userId: number): AppThunk => {
  return async (dispatch, getState) => {
    dispatch(setLoading(true));
    try {
      const path = BASE_PATH + `/GetSessionByUserID`;
      // console.log("user state: ", getState().patient);
      const response = await axiosWithAuth(
        getState().patient.token as string
      ).post(path, { UserId: userId });

      if (response) {
        const data = response?.data;
        // console.log("aptDates: ", data);
        if (data.status === true) {
          //
        }
      }
    } catch (error: any) {
      // dispatch(setError(error?.message));
      dispatch(setError(error?.response?.data?.message));
    }
    dispatch(setLoading(false));
  };
};

export const signup = (data: ISignUp): AppThunk => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    dispatch(clearErrors());
    try {
      const path = BASE_PATH + "/SignUp";

      const response = await axios.post(path, data);
      // console.log(response);
      if (response) {
        const data = response.data;
        // console.log("signup response: ", data);
        if (data.code === 200) {
          dispatch(setProfile(data.body));
          dispatch(clearErrors());
          const resp: any = { code: data.code, message: data.message };
          dispatch(setSuccess(resp));
        }
      }
    } catch (error: any) {
      // console.log(" error: ", error);
      dispatch(setError(error?.response?.data?.message));
    }
    dispatch(setLoading(false));
  };
};

export const validateCustomerDetails = (data: IValidateCustomer): AppThunk => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    dispatch(clearErrors());
    try {
      const path = BASE_PATH_FL + "/ValidateCustomerDetails";
      const response = await axios.post(path, data);
      if (response) {
        const data = response.data;
        // console.log("data: ", response.data);
        if (data.code === 200) {
          dispatch(setSuccess(data));
        }
      }
    } catch (error: any) {
      // console.log(error?.response?.data);
      dispatch(setError(error?.response?.data));
    }
    dispatch(setLoading(false));
  };
};

function formatDate(inputDate: string) {
  const dateObject = new Date(inputDate);

  const year = dateObject.getFullYear();
  const month = String(dateObject.getMonth() + 1).padStart(2, "0");
  const day = String(dateObject.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export const {
  setUserId,
  setLoading,
  setAuth,
  setLogout,
  setProfile,
  setToken,
  setBanks,
  setCableCategory,
  setTollCategory,
  setElectricityCategory,
  setAirtimeCategory,
  setBundleCategory,
  setVerifiedAcct,
  setSelectedDocAptDate,
} = userSlice.actions;
export default userSlice.reducer;
