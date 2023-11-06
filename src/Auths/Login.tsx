import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../Store/store";
import * as routes from "../Data/Routes";
import {
  login,
  resendVerifyEmail,
  setUserId,
  verifyEmail,
} from "../Features/User/userSlice";
import { ISignin, IVerifyEmail } from "../Features/User/type";
import { useEffect, useState } from "react";
import OTPInput from "../Components/OTPInput";
import { clearErrors } from "../Features/Error/errorSlice";

export const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { errors } = useAppSelector((state) => state.error);
  const { userId, isLoading, currentUser } = useAppSelector(
    (state) => state.user
  );
  const [showPass, setShowPass] = useState<boolean>(false);
  const [showVerifyEmail, setShowVerifyEmail] = useState<boolean>(false);
  const [showResend, setShowResend] = useState<boolean>(false);
  const [otp, setOTP] = useState<string>("");
  const errTexts = errors[0]?.message;
  const errText: string = errors[0]?.message?.message;

  useEffect(() => {
    //dispatch(clearErrors());
    if (currentUser) {
      navigate(routes.homepage);
    }
  }, [navigate, currentUser]);
  // console.log(isAuth);
  // Define the validation schema using Yup
  const validationSchema = Yup.object({
    Email: Yup.string().required("Email is required"),
    Password: Yup.string()
      .min(6, "Must not be less than 6 characters")
      .required("Required")
      .matches(/^(?=.*[a-z])/, "Must contain at least one lowercase character")
      .matches(/^(?=.*[A-Z])/, "Must contain at least one uppercase character")
      .matches(/^(?=.*[0-9])/, "Must contain at least one number")
      .matches(/^(?=.*[!@#%&])/, "Must contain at least one special character"),
  });

  // Initial form values
  const initialValues = {
    Email: "",
    Password: "",
  };

  const getOtp = (otp: string) => {
    // alert(otp);
    setOTP(otp);
  };

  const verify: IVerifyEmail = {
    Email: userId,
    EmailOTP: otp,
  };

  // Submit handler
  const handleSubmit = (values: ISignin) => {
    if (!showVerifyEmail) {
      dispatch(login(values));
    } else if (showVerifyEmail) {
      if (!showResend) {
        dispatch(verifyEmail(verify));
      } else if (showResend) {
        dispatch(resendVerifyEmail(formik.values.Email));
      }
    }
    // if (isAuth === true) navigate(routes.homepage);
    // navigate(routes.homepage);
  };

  // Formik form handling
  const formik = useFormik<ISignin>({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });

  useEffect(() => {
    if (!showVerifyEmail) {
      dispatch(clearErrors());
    }
  }, [dispatch, showVerifyEmail]);

  useEffect(() => {
    if (errors?.length > 0) {
      if (errTexts?.message !== "Expired OTP") {
        setShowResend(false);
        // dispatch(clearErrors());
      } else if (errTexts?.message === "Expired OTP") {
        setShowResend(true);
        // dispatch(clearErrors());
      }
    }
  }, [dispatch, errors?.length, errTexts?.message]);

  useEffect(() => {
    if (errors?.length > 0) {
      if (
        errText === "Unverified email" ||
        errText === "created successfully"
      ) {
        setShowVerifyEmail(true);
        formik.setFieldValue("Email", userId);
        formik.setFieldValue("Password", "Abcde1&&&");
        // dispatch(clearErrors());
      } else if (errText === "Verified email") {
        formik.setFieldValue("Email", "");
        formik.setFieldValue("Password", "");
        setShowVerifyEmail(false);
        dispatch(clearErrors());
      }
    }
  }, [dispatch /*, formik, errors, */, userId, errText]);

  useEffect(() => {
    if (errors?.length > 0 && errText === "login success") {
      navigate(routes.homepage);
      // dispatch(clearErrors());
    }
  }, [navigate, dispatch, errors, errText]);

  // console.log("verified: ", errText);

  return (
    <div className="Auth-Login">
      <div className="left-div">
        <div className="text">
          <div className="message-1">Welcome!</div>
          <div className="message-2">Log in to get started</div>
        </div>
      </div>
      <div className="right-div">
        <div className="form">
          <div className="img"></div>
          <div className="form-holder">
            <form onSubmit={formik.handleSubmit} className="lg-form">
              {!showVerifyEmail ? (
                <>
                  <div className="field-holder">
                    <div className="title">Email address</div>
                    <div className="description">Enter your email address</div>
                    <div className="field">
                      {Email()}
                      <input
                        type="text"
                        id="Email"
                        name="Email"
                        onChange={(e) => {
                          formik.handleChange(e);
                          dispatch(setUserId(e.currentTarget.value));
                        }}
                        onBlur={formik.handleBlur}
                        value={formik.values.Email}
                        // placeholder="Enter Email"
                      />
                    </div>
                    {formik.touched.Email && formik.errors.Email && (
                      <div className="error">{formik.errors.Email}</div>
                    )}
                  </div>

                  <div className="field-holder">
                    <div className="title">Password</div>
                    <div className="description">
                      Enter your account password
                    </div>
                    <div className="field">
                      {Pass()}
                      <input
                        type={showPass ? "text" : "password"}
                        id="Password"
                        name="Password"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.Password}
                        // placeholder="Enter password"
                      />
                    </div>
                    {formik.touched.Password && formik.errors.Password && (
                      <div className="error">{formik.errors.Password}</div>
                    )}
                  </div>

                  <div className="forgot-password">
                    Forgot password?
                    <a href="#a" onClick={() => navigate(routes.f_password)}>
                      Reset here
                    </a>
                  </div>
                  <div className="forgot-password">
                    Don't have an account?
                    <a href="#b" onClick={() => navigate(routes.signup)}>
                      Register now
                    </a>
                    <button type="submit" disabled={isLoading}>
                      Continue
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <OTPInput getOTP={getOtp} showResend={showResend} />
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );

  function Email() {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M11.1094 5.12946C9.52956 5.48013 8.35398 6.55521 7.85087 8.10949C7.74268 8.44366 7.71817 8.61579 7.69876 9.17674C7.67434 9.88305 7.71189 10.1985 7.88401 10.7345C8.28409 11.9802 9.31224 13.0334 10.5467 13.4621C11.4324 13.7696 12.568 13.7695 13.4542 13.4618C14.6518 13.0459 15.6709 12.0266 16.0869 10.8284C16.3945 9.94277 16.3944 8.80713 16.0867 7.92096C15.5974 6.5119 14.3749 5.44957 12.8759 5.13059C12.4898 5.04846 11.4773 5.0478 11.1094 5.12946ZM11.6399 6.24302C10.4523 6.36715 9.40801 7.21437 8.99246 8.39074C8.89918 8.65488 8.88484 8.78594 8.88484 9.37512C8.88484 9.96429 8.89918 10.0953 8.99246 10.3595C9.67342 12.2872 11.8742 13.1088 13.6128 12.0843C14.2328 11.7189 14.765 11.0591 15.004 10.3595C15.147 9.94085 15.1806 9.10821 15.073 8.64855C14.7115 7.10365 13.244 6.07535 11.6399 6.24302ZM10.7127 15.2595C8.27959 15.6521 6.19614 16.9854 4.84389 19.0151C4.65231 19.3027 4.48398 19.6096 4.46978 19.697C4.41639 20.026 4.70551 20.3901 5.02037 20.3905C5.32168 20.391 5.42706 20.3047 5.78378 19.7649C6.40651 18.8227 7.06965 18.1491 7.94532 17.5691C11.0901 15.4862 15.3029 16.1268 17.7164 19.0548C17.8651 19.2353 18.1076 19.5682 18.2551 19.7946C18.5603 20.2627 18.6892 20.3673 18.9609 20.3673C19.3193 20.3673 19.5877 20.0513 19.5302 19.697C19.4963 19.4882 18.9013 18.5992 18.4499 18.0831C17.2432 16.7034 15.4945 15.6966 13.6584 15.3243C12.9956 15.1899 11.366 15.1541 10.7127 15.2595Z"
          fill="#828282"
        />
      </svg>
    );
  }

  function Pass() {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        onClick={() => setShowPass(!showPass)}
        style={{ cursor: "pointer" }}
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10.8515 0.094397C8.78633 0.517866 7.13975 1.9738 6.47206 3.96669C6.21556 4.7323 6.18776 5.06015 6.18758 7.32533L6.18739 9.37729L5.73748 9.88002C3.38979 12.5034 2.86648 16.1177 4.38148 19.2457C5.53072 21.6186 7.69123 23.2889 10.3593 23.8672C10.7962 23.9619 10.9805 23.9739 11.9999 23.9739C13.0191 23.9739 13.2031 23.962 13.6349 23.8677C15.963 23.3591 17.8288 22.0981 19.0915 20.1797C20.0965 18.6528 20.5955 16.7158 20.4438 14.9305C20.3432 13.7465 20.1146 12.9386 19.568 11.8359C19.1803 11.0536 18.8094 10.508 18.2138 9.84374L17.8146 9.39843L17.8135 7.33035C17.8126 5.68865 17.7976 5.17644 17.7405 4.84597C17.4561 3.1979 16.5307 1.79104 15.1405 0.893475C14.5371 0.503897 13.7864 0.210788 13.0377 0.0724126C12.4885 -0.0290717 11.4002 -0.018103 10.8515 0.094397ZM11.1718 1.10066C9.90209 1.33105 8.75895 2.07993 8.04954 3.14615C7.72006 3.64129 7.52445 4.07141 7.36976 4.64061C7.25187 5.07458 7.24831 5.13069 7.22975 6.84004L7.21067 8.59414L7.32012 8.52439C8.88917 7.52497 10.5579 7.06372 12.328 7.14022C13.9325 7.20955 15.2966 7.64343 16.6797 8.52439L16.7891 8.59414L16.77 6.84004C16.7515 5.13069 16.7479 5.07458 16.63 4.64061C16.0415 2.47447 14.1502 1.01493 11.9586 1.03546C11.7106 1.0378 11.3565 1.06715 11.1718 1.10066ZM11.3382 8.20532C8.43908 8.46355 5.94706 10.4113 4.9767 13.1774C4.68125 14.0198 4.61689 14.449 4.61904 15.5625C4.62073 16.4212 4.63615 16.638 4.72306 17.0278C5.30801 19.6509 7.16342 21.7473 9.63087 22.5729C10.5474 22.8796 10.9279 22.9385 11.9999 22.9395C12.8176 22.9403 13.0321 22.925 13.439 22.837C14.9695 22.5058 16.1638 21.8583 17.2533 20.7689C18.3002 19.7222 18.95 18.5394 19.2719 17.095C19.4225 16.4189 19.4453 15.146 19.3198 14.4102C18.9166 12.0444 17.4252 10.0259 15.3046 8.97594C14.3646 8.51047 13.6305 8.30089 12.6093 8.20644C12.0212 8.15202 11.9369 8.15197 11.3382 8.20532ZM11.6707 11.1556C10.5123 11.3028 9.64044 12.2278 9.53647 13.4202C9.43981 14.5284 10.1999 15.6408 11.2733 15.962L11.4608 16.0181L11.4843 17.8984C11.5077 19.778 11.5077 19.7788 11.6145 19.8854C11.7016 19.9725 11.7725 19.9922 11.9999 19.9922C12.2273 19.9922 12.2982 19.9725 12.3853 19.8854C12.492 19.7788 12.4921 19.7779 12.5155 17.9017L12.539 16.0247L12.7795 15.9433C13.8393 15.5847 14.5581 14.5075 14.4633 13.4202C14.3379 11.9823 13.0953 10.9746 11.6707 11.1556ZM11.4121 12.3215C10.7421 12.6384 10.4298 13.3773 10.6689 14.0792C10.7723 14.3827 11.1389 14.7733 11.443 14.9042C11.9968 15.1424 12.6292 14.9945 13.0481 14.5286C13.6846 13.8206 13.4578 12.7331 12.5877 12.3215C12.3667 12.2169 12.2377 12.1876 11.9999 12.1876C11.762 12.1876 11.6331 12.2169 11.4121 12.3215Z"
          fill="#828282"
        />
      </svg>
    );
  }
};
