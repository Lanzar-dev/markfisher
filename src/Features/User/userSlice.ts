import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { AppThunk } from "../../Store/store";
import { axios, axiosWithAuth } from "../utils";
import { clearErrors, setError, setSuccess } from "../Error/errorSlice";
import {
  IAirtimeCategory,
  IAirtimePayload,
  IAuth,
  IBanksPayload,
  // IBankTransferPayload,
  IBillsCategory,
  IBiyaTransferPayload,
  IBundlePayload,
  ICablePayload,
  ICreatePaymentLink,
  IElectricityPayload,
  IForgotPass,
  INotify,
  IProfile,
  IResetPassword,
  ISignin,
  ISignUp,
  ITollPayload,
  ITransferPayload,
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
  isNotify: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLoading: (state, { payload }: PayloadAction<boolean>) => {
      state.isLoading = payload;
    },
    setIsNotify: (state, { payload }: PayloadAction<boolean>) => {
      state.isNotify = payload;
    },
    setNotify: (state, { payload }: PayloadAction<INotify | null>) => {
      state.notify = payload;
    },
    setLogout: (state) => {
      state.isAuth = false;
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

    setTransactions: (state, { payload }: PayloadAction<any | null>) => {
      state.transactions = payload;
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
  },
});

export const reset_password = (payload: IResetPassword): AppThunk => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    dispatch(clearErrors());
    dispatch(setIsNotify(false));
    dispatch(setNotify(null));
    try {
      const path = BASE_PATH + "/ResetPassword";
      // console.log("checking ResetPassword path: ", path, " data: ", data);
      const response = await axios.put(path, payload);
      const { data } = response;
      if (response) {
        // console.log("reset password response: ", data);
        if (data.code === 200) {
          dispatch(setSuccess(data));
          var msg: INotify = { text: data.message, color: "green" };
          dispatch(setNotify(msg));
          dispatch(setIsNotify(true));
        } else if (data.code === 400) {
          msg = { text: data.message, color: "red" };
          dispatch(setNotify(msg));
          dispatch(setIsNotify(true));
          dispatch(setError(data));
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
    dispatch(setIsNotify(false));
    dispatch(setNotify(null));
    try {
      const path = BASE_PATH + `/ForgotPassword?Email=${data.Email}`;
      // console.log("checking forget password path: ", path, " data: ", data);
      const response = await axios.post(path, data);
      if (response) {
        const data = response.data;
        // console.log("ForgotPassword: ", data);
        if (data.code === 200) {
          dispatch(setSuccess(data));
          var msg: INotify = { text: data.message, color: "green" };
          dispatch(setNotify(msg));
          dispatch(setIsNotify(true));
        } else if (data.code === 400) {
          msg = { text: data.message, color: "red" };
          dispatch(setNotify(msg));
          dispatch(setIsNotify(true));
        }
      }
    } catch (error: any) {
      console.log("response-B: ", error);
      dispatch(setError(error?.message));
    }
    dispatch(setLoading(false));
  };
};

export const signup = (data: ISignUp): AppThunk => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    dispatch(clearErrors());
    dispatch(setIsNotify(false));
    dispatch(setNotify(null));
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
        } else if (data?.code === 400) {
          var msg: INotify = { text: data.message, color: "red" };
          dispatch(setNotify(msg));
          dispatch(setIsNotify(true));
        }
      }
    } catch (error: any) {
      // console.log(" error: ", error);
      dispatch(setError(error?.response?.data?.message));
    }
    dispatch(setLoading(false));
  };
};

export const login = (data: ISignin): AppThunk => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    dispatch(clearErrors());
    dispatch(setIsNotify(false));
    dispatch(setNotify(null));
    try {
      const path = BASE_PATH + "/SignIn";
      const response = await axios.post(path, data);
      if (response) {
        const data = response.data;
        // console.log("data: ", response.data);

        if (data.code === 200) {
          dispatch(setProfile(data.body));
          // dispatch(clearErrors());
          const resp: any = { code: data.code, message: data.message };
          dispatch(setSuccess(resp));
          dispatch(setNotify({ text: "Login success", color: "green" }));
          dispatch(setIsNotify(true));
        } else if (data.code === 400) {
          dispatch(setError(data));
          var msg: INotify = { text: data.message, color: "red" };
          if (data.message === "User not found") {
            msg.text = "User not found, please register";
          }
          dispatch(setNotify(msg));
          dispatch(setIsNotify(true));
        }
      }
    } catch (error: any) {
      console.log(error?.response?.data);
      dispatch(setError(error?.response?.data));
    }
    dispatch(setLoading(false));
  };
};

export const fetchUserWallet = (data: any): AppThunk => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    dispatch(clearErrors());
    try {
      const path = BASE_PATH + `/FetchUserWallet?Email=${data}`;
      const response = await axios.get(path);
      if (response) {
        const data = response.data;
        // console.log("data: ", response.data);

        if (data.code === 200) {
          dispatch(setProfile(data.body));
          // dispatch(clearErrors());
          const resp: any = { code: data.code, message: data.message };
          dispatch(setSuccess(resp));
        }
      }
    } catch (error: any) {
      console.log(error?.response?.data);
      dispatch(setError(error?.response?.data));
    }
    dispatch(setLoading(false));
  };
};

export const fetchTransactions = (data: any): AppThunk => {
  return async (dispatch) => {
    // dispatch(setLoading(true));
    dispatch(clearErrors());
    try {
      const path = BASE_PATH + `/FetchTransactions?Email=${data}`;
      const response = await axios.get(path);
      if (response) {
        const data = response.data;
        // console.log("fetch transaction data: ", response.data);

        if (data.code === 200) {
          dispatch(setTransactions(data?.body));
          // dispatch(setProfile(data.body));
          // // dispatch(clearErrors());
          // const resp: any = { code: data.code, message: data.message };
          // dispatch(setSuccess(resp));
        }
      }
    } catch (error: any) {
      console.log(error?.response?.data);
      dispatch(setError(error?.response?.data));
    }
    // dispatch(setLoading(false));
  };
};

export const fetchFlwPayment = (data: any): AppThunk => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    dispatch(clearErrors());
    dispatch(setIsNotify(false));
    dispatch(setNotify(null));
    try {
      const path = BASE_PATH_FL + `/FetchFlwPayment?TrxId=${data}`;
      const response = await axios.get(path);
      if (response) {
        const data = response.data;
        // console.log("FetchFlwPayment data: ", data);

        if (data.code === 200) {
          if (data?.body?.Status === "successful") {
            const resp: any = { code: data.code, message: data.message };
            dispatch(setSuccess(resp));
            dispatch(
              setNotify({ text: "Your wallet has been funded", color: "green" })
            );
            dispatch(setIsNotify(true));
          }
        }
      }
    } catch (error: any) {
      console.log(error?.response?.data);
      dispatch(setError(error?.response?.data));
    }
    dispatch(setLoading(false));
  };
};

export const fetchBiyaPayment = (data: any): AppThunk => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    dispatch(clearErrors());
    try {
      const path = BASE_PATH_FL + `/FetchBiyaPayment?TrxRef=${data}`;
      const response = await axios.get(path);
      if (response) {
        const data = response.data;
        // console.log("FetchBiyaPayment data: ", data);

        if (data.code === 200) {
          // dispatch(setProfile(data.body));
          // dispatch(clearErrors());
          // const resp: any = { code: data.code, message: data.message };
          // dispatch(setSuccess(resp));
        }
      }
    } catch (error: any) {
      console.log(error?.response?.data);
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
        console.log("verify data: ", response.data);
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

export const GetTransferFee = (data: any): AppThunk => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    dispatch(clearErrors());
    try {
      const path = BASE_PATH_FL + `/GetTransferFee?Amount=${data}`;
      const response = await axios.get(path);
      if (response) {
        const data = response.data;

        console.log("data: ", data);
        if (data.status === true) {
          //
        } else if (data.status === false) {
          dispatch(setError(data.message));
        }
      }
    } catch (error: any) {
      dispatch(setError(error?.response?.data));
    }
    dispatch(setLoading(false));
  };
};

export const BankTransfer = (data: ITransferPayload): AppThunk => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    dispatch(clearErrors());
    dispatch(setIsNotify(false));
    dispatch(setNotify(null));
    try {
      const path = BASE_PATH_FL + "/BankTransfer";
      const response = await axios.post(path, data);
      if (response) {
        const data = response.data;

        // console.log("bank transfer data: ", data);
        if (data.code === 200) {
          dispatch(setSuccess(data));
          const msg = `₦${data?.body?.Amount} has been sent to ${data?.body?.Receiver}`;
          dispatch(setNotify({ text: msg, color: "green" }));
          dispatch(setIsNotify(true));
        } else if (data.code === 400) {
          const msg = data?.body;
          dispatch(setNotify({ text: msg, color: "red" }));
          dispatch(setIsNotify(true));
        }
      }
    } catch (error: any) {
      const errText = error?.response?.data;
      console.log("transfer error ", errText);
      dispatch(setError(error?.response?.data));
    }
    dispatch(setLoading(false));
  };
};

export const BuyAirtime = (data: IAirtimePayload): AppThunk => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    dispatch(clearErrors());
    dispatch(setIsNotify(false));
    dispatch(setNotify(null));
    try {
      const path = BASE_PATH_FL + "/BuyAirtime";
      const response = await axios.post(path, data);
      if (response) {
        const data = response.data;

        // console.log("airtime response: ", data);
        if (data.code === 200) {
          dispatch(setSuccess(data));
          const msg = `₦${data?.body?.amount} ${data?.body?.network} airtime purchased for ${data?.body?.phone_number}`;
          dispatch(setNotify({ text: msg, color: "green" }));
          dispatch(setIsNotify(true));
        } else if (data.code === 400) {
          dispatch(setError(data));
          dispatch(setNotify({ text: data?.body, color: "red" }));
          dispatch(setIsNotify(true));
        }
      }
    } catch (error: any) {
      const errText = error?.response?.data;
      // console.log(errText);
      if (errText?.message === "Failed") {
        dispatch(
          setNotify({ text: "Network error. Please try again", color: "red" })
        );
        dispatch(setIsNotify(true));
      }
      dispatch(setError(errText));
    }
    dispatch(setLoading(false));
  };
};

export const BuyBundle = (data: IBundlePayload): AppThunk => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    dispatch(clearErrors());
    dispatch(setIsNotify(false));
    dispatch(setNotify(null));
    try {
      const path = BASE_PATH_FL + "/BuyBundle";
      const response = await axios.post(path, data);
      if (response) {
        const data = response.data;

        // console.log("bundle response: ", data);
        if (data.code === 200) {
          dispatch(setSuccess(data));
          const msg = `₦${data?.body?.amount} ${data?.body?.network} airtime purchased for ${data?.body?.phone_number}`;
          dispatch(setNotify({ text: msg, color: "green" }));
          dispatch(setIsNotify(true));
        } else if (data.code === 400) {
          dispatch(setError(data));
          dispatch(setNotify({ text: data?.body, color: "red" }));
          dispatch(setIsNotify(true));
        }
      }
    } catch (error: any) {
      const errText = error?.response?.data;
      // console.log(errText);
      if (errText?.message === "Failed") {
        dispatch(
          setNotify({ text: "Network error. Please try again", color: "red" })
        );
        dispatch(setIsNotify(true));
      }
      dispatch(setError(errText));
    }
    dispatch(setLoading(false));
  };
};

export const BuyElectricity = (data: IElectricityPayload): AppThunk => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    dispatch(clearErrors());
    dispatch(setIsNotify(false));
    dispatch(setNotify(null));
    try {
      const path = BASE_PATH_FL + "/BuyElectricity";
      const response = await axios.post(path, data);
      if (response) {
        const data = response.data;

        console.log("buy electricity data: ", data);
        if (data.code === 200) {
          dispatch(setSuccess(data));
          const msg = `₦${data?.body?.amount} ${data?.body?.type} electricity purchased for meter: ${data?.body?.customer}`;
          dispatch(setNotify({ text: msg, color: "green" }));
          dispatch(setIsNotify(true));
        } else if (data.code === 400) {
          dispatch(setError(data));
          var msg = data?.body;
          if (data?.message === "Validation failed") {
            msg = `Meter number could not be verified!`;
          }
          dispatch(setNotify({ text: msg, color: "red" }));
          dispatch(setIsNotify(true));
        }
      }
    } catch (error: any) {
      const errText = error?.response?.data;
      // console.log(errText);
      if (errText?.message === "Failed") {
        dispatch(
          setNotify({ text: "Network error. Please try again", color: "red" })
        );
        dispatch(setIsNotify(true));
      }
      dispatch(setError(errText));
    }
    dispatch(setLoading(false));
  };
};

export const DstvPayment = (data: ICablePayload): AppThunk => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    dispatch(clearErrors());
    dispatch(setIsNotify(false));
    dispatch(setNotify(null));
    try {
      const path = BASE_PATH_FL + "/CableSubscription";
      const response = await axios.post(path, data);
      if (response) {
        const data = response.data;

        console.log("buy cableTv data: ", data);
        if (data.code === 200) {
          dispatch(setSuccess(data));
          const msg = `₦${data?.body?.amount} ${data?.body?.type} electricity purchased for meter: ${data?.body?.customer}`;
          dispatch(setNotify({ text: msg, color: "green" }));
          dispatch(setIsNotify(true));
        } else if (data.code === 400) {
          dispatch(setError(data));
          var msg = data?.body;
          if (data?.message === "Validation failed") {
            msg = `Meter number could not be verified!`;
          }
          dispatch(setNotify({ text: msg, color: "red" }));
          dispatch(setIsNotify(true));
        }
      }
    } catch (error: any) {
      const errText = error?.response?.data;
      // console.log(errText);
      if (errText?.message === "Failed") {
        dispatch(
          setNotify({ text: "Network error. Please try again", color: "red" })
        );
        dispatch(setIsNotify(true));
      }
      dispatch(setError(errText));
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

        console.log("validate bank acct data: ", data);
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

export const VerifyBiyaAccount = (payload: any): AppThunk => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    dispatch(clearErrors());
    dispatch(setIsNotify(false));
    dispatch(setNotify(null));
    try {
      const path = BASE_PATH_FL + `/BiyaValidateAccount?Search=${payload}`;
      const response = await axios.post(path, payload);
      // console.log(data);
      if (response) {
        const data = response.data;

        // console.log("validate biya acct data: ", data);
        if (data.code === 200) {
          dispatch(setVerifiedAcct(data.body.data));
          const msg = "Account is valid";
          dispatch(setNotify({ text: msg, color: "green" }));
          dispatch(setIsNotify(true));
        } else if (data.code === 400) {
          dispatch(setError(data));
          var msg = data?.message;
          if (data?.message === "User not found") {
            msg = `User with account/phone number ${payload} does not exit`;
          }
          dispatch(setNotify({ text: msg, color: "red" }));
          dispatch(setIsNotify(true));
        }
      }
    } catch (error: any) {
      // dispatch(clearErrors());
      console.log(error?.response?.data);
      dispatch(setError(error?.message));
    }
    dispatch(setLoading(false));
  };
};

export const BiyaTransfer = (payload: IBiyaTransferPayload): AppThunk => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    dispatch(clearErrors());
    dispatch(setIsNotify(false));
    dispatch(setNotify(null));
    try {
      const path = BASE_PATH_FL + "/BiyaTransfer";
      const response = await axios.post(path, payload);
      if (response) {
        const data = response.data;

        // console.log("biya transfer data: ", data);
        if (data.code === 200) {
          // dispatch(fetchUserWallet(payload.Email));
          dispatch(setSuccess(data));
          const msg = `₦${data?.body?.Amount} has been sent to ${data?.body?.Receiver}`;
          dispatch(setNotify({ text: msg, color: "green" }));
          dispatch(setIsNotify(true));
        } else if (data.code === 400) {
          dispatch(setError(data.message));
          dispatch(setNotify({ text: data.body, color: "red" }));
          dispatch(setIsNotify(true));
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

export const FundWallet = (payload: ICreatePaymentLink): AppThunk => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    dispatch(clearErrors());
    dispatch(setIsNotify(false));
    dispatch(setNotify(null));
    try {
      const path = BASE_PATH_FL + "/FundWallet";
      const response = await axios.post(path, payload);
      if (response) {
        const data = response.data;
        // console.log("data: ", data);
        if (data.code === 200) {
          // dispatch(fetchUserWallet(payload.customer));
          window.location.href = data.body.link;
        }
      }
    } catch (error: any) {
      console.log(error?.response?.data);
      dispatch(setError(error?.response?.data));
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

export const getBillStatus = (ref: any, billType: any): AppThunk => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    dispatch(clearErrors());
    try {
      const path =
        BASE_PATH_FL + `/GetBillStatus?Reference=${ref}&&BillType=${billType}`;
      const response = await axios.get(path);
      if (response) {
        const data = response.data;
        console.log("get bill status data: ", response.data);

        if (data.code === 200) {
          // dispatch(setTransactions(data?.body));
          // dispatch(setProfile(data.body));
          // // dispatch(clearErrors());
          // const resp: any = { code: data.code, message: data.message };
          // dispatch(setSuccess(resp));
        }
      }
    } catch (error: any) {
      console.log("Get bill error: ", error?.response?.data);
      dispatch(setError(error?.response?.data));
    }
    dispatch(setLoading(false));
  };
};

// function formatDate(inputDate: string) {
//   const dateObject = new Date(inputDate);

//   const year = dateObject.getFullYear();
//   const month = String(dateObject.getMonth() + 1).padStart(2, "0");
//   const day = String(dateObject.getDate()).padStart(2, "0");

//   return `${year}-${month}-${day}`;
// }

export const getAccessToken = (data: any): AppThunk => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    dispatch(clearErrors());
    try {
      const path = BASE_PATH + "/GenInterswitchAccessToken";
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
  setIsNotify,
  setNotify,
  setTransactions,
} = userSlice.actions;
export default userSlice.reducer;
