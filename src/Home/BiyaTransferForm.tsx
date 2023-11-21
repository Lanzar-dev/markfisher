import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../Store/store";
import { IBiyaTransferPayload } from "../Features/User/type";
import * as routes from "../Data/Routes";
import {
  BiyaTransfer,
  VerifyBiyaAccount,
  setVerifiedAcct,
} from "../Features/User/userSlice";
import { useCallback, useEffect } from "react";

type IBiyaTransferFormProps = {
  fnShowCardForm: (index: boolean) => void;
};

export const BiyaTransferForm = ({
  fnShowCardForm,
}: IBiyaTransferFormProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  // const { errors } = useAppSelector((state) => state.error);
  const { verifiedAcct, currentUser, isLoading } = useAppSelector(
    (state) => state.user
  );
  // const errText: string = errors[0]?.message?.message;
  // Define the validation schema using Yup
  const validationSchema = Yup.object({
    AccountNumber: Yup.string().required("Account number is required"),
    Beneficiary: Yup.string().required("Beneficiary is required"),
    Narration: Yup.string().required("Narration is required"),
    Amount: Yup.string().required("Amount is required"),
  });

  // Initial form values
  const initialValues = {
    AccountNumber: "",
    Beneficiary: "",
    Narration: "",
    Amount: "",
    Currency: "NGN",
    Email: currentUser?.Email,
  };

  // console.log("init: ", storedValues);

  // Submit handler
  const handleSubmit = (values: IBiyaTransferPayload) => {
    // console.log(values);
    dispatch(BiyaTransfer(values));
    // if (isAuth === true) navigate(routes.homepage);
    navigate(routes.homepage);
  };

  // Formik form handling
  const formik = useFormik<IBiyaTransferPayload>({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });

  useEffect(() => {
    dispatch(setVerifiedAcct(null));
  }, [dispatch]);

  const setField = useCallback(() => {
    if (!formik.values.Beneficiary) {
      formik.setFieldValue("Beneficiary", verifiedAcct?.account_name);
    }
  }, [formik, verifiedAcct]);

  useEffect(() => {
    if (verifiedAcct) {
      setField();
    }
  }, [setField, verifiedAcct]);

  const checkAcctNum = (accNum: any) => {
    // let accNum = formik.values.AccountNumber;
    if (accNum.length === 10 && !verifiedAcct) {
      dispatch(VerifyBiyaAccount(accNum));
    } else if (accNum.length < 10) {
      dispatch(setVerifiedAcct(null));
      formik.setFieldValue("Beneficiary", "");
    }
  };

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="mt-[70px] pl-[15px] md:pl-[35px] h-fit mb-[50px] md:mb-0"
    >
      <div className="text-lightBlack text-base not-italic font-[600] leading-normal w-fit my-5 mx-0">
        Transfer to
      </div>

      <div className="w-fit mb-[15px] mt-[15px] md:mt-0 mx-auto md:mx-0">
        <div className="w-fit h-[24px] md:h-[22px] flex-shrink-0 text-black text-base not-italic font-extrabold leading-normal">
          Enter account/Phone number
        </div>
        <div className="w-[90vw] md:w-[28vw] h-[36px] flex-shrink-0 border border-t-0 border-l-0 border-r-0 bg-white pl-[5px] focus:outline-none">
          <input
            className="w-[90vw] md:w-[28vw] h-[36px] flex-shrink-0 border border-t-0 border-l-0 border-r-0 bg-white pl-[5px] focus:outline-none"
            type="text"
            id="AccountNumber"
            name="AccountNumber"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.AccountNumber}
            placeholder="Account or Phone number"
            onFocus={(e) => {
              const acctNum = e.currentTarget.value;
              if (acctNum && !verifiedAcct) {
                checkAcctNum(acctNum);
              }
              if (acctNum.length < 10) {
                dispatch(setVerifiedAcct(null));
                formik.setFieldValue("Beneficiary", "");
              }
            }}
          />
        </div>
        {formik.touched.AccountNumber && formik.errors.AccountNumber && (
          <div className="error">{formik.errors.AccountNumber}</div>
        )}
      </div>

      <div className="w-fit mb-[15px] mt-[15px] md:mt-0 mx-auto md:mx-0">
        <div className="w-fit h-[24px] md:h-[22px] flex-shrink-0 text-black text-base not-italic font-extrabold leading-normal">
          Wallet holder name
        </div>
        <div className="w-[90vw] md:w-[28vw] h-[36px] flex-shrink-0 border border-t-0 border-l-0 border-r-0 bg-white pl-[5px] focus:outline-none">
          <input
            className="w-[90vw] md:w-[28vw] h-[36px] flex-shrink-0 border border-t-0 border-l-0 border-r-0 bg-white pl-[5px] focus:outline-none"
            type="text"
            id="Beneficiary"
            name="Beneficiary"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.Beneficiary}
            placeholder="amina.adewale@gmail.com"
            disabled
          />
        </div>
        {formik.touched.Beneficiary && formik.errors.Beneficiary && (
          <div className="error">{formik.errors.Beneficiary}</div>
        )}
      </div>

      <div className="w-fit mb-[15px] mt-[15px] md:mt-0 mx-auto md:mx-0">
        <div className="w-fit h-[24px] md:h-[22px] flex-shrink-0 text-black text-base not-italic font-extrabold leading-normal">
          Narration (Optional)
        </div>
        <div className="w-[90vw] md:w-[28vw] h-[36px] flex-shrink-0 border border-t-0 border-l-0 border-r-0 bg-white pl-[5px] focus:outline-none">
          <input
            className="w-[90vw] md:w-[28vw] h-[36px] flex-shrink-0 border border-t-0 border-l-0 border-r-0 bg-white pl-[5px] focus:outline-none"
            type="text"
            id="Narration"
            name="Narration"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.Narration}
            placeholder="Describe transaction"
          />
        </div>
        {formik.touched.Narration && formik.errors.Narration && (
          <div className="error">{formik.errors.Narration}</div>
        )}
      </div>

      <div className="w-fit mb-[15px] mt-[15px] md:mt-0 mx-auto md:mx-0">
        <div className="w-fit h-[24px] md:h-[22px] flex-shrink-0 text-black text-base not-italic font-extrabold leading-normal">
          Enter amount
        </div>
        <div className="w-[90vw] md:w-[28vw] h-[36px] flex-shrink-0 border border-t-0 border-l-0 border-r-0 bg-white pl-[5px] focus:outline-none">
          <input
            className="w-[90vw] md:w-[28vw] h-[36px] flex-shrink-0 border border-t-0 border-l-0 border-r-0 bg-white pl-[5px] focus:outline-none"
            type="text"
            id="Amount"
            name="Amount"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.Amount}
            placeholder="NGN 0.00"
            onFocus={() => {
              const acctNum = formik.values.AccountNumber;
              if (acctNum && !verifiedAcct) {
                checkAcctNum(acctNum);
              }
            }}
          />
        </div>
        {formik.touched.Amount && formik.errors.Amount && (
          <div className="error">{formik.errors.Amount}</div>
        )}
      </div>

      <div className="mt-[50px] mb-[50px] md:mb-0 ml-0 md:ml-[-35px] xs:max-md:text-center">
        <button
          className=" ml-[15px] font-extrabold hover:cursor-pointer text-black text-center text-sm not-italic leading-normal w-[127px] h-[35px] flex-shrink-0 bg-white rounded-[94px] border-0"
          onClick={() => {
            fnShowCardForm(false);
          }}
        >
          Back
        </button>
        {verifiedAcct && (
          <button
            className="ml-[10vw] bg-biyaLightBlue hover:cursor-pointer text-white text-center text-sm not-italic font-[400] leading-normal w-[127px] h-[35px] flex-shrink-0 rounded-[94px] border-0"
            type="submit"
            disabled={isLoading}
          >
            Next
          </button>
        )}
      </div>
    </form>
  );
};
