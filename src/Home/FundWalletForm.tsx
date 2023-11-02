import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../Store/store";
import { ICreatePaymentLink } from "../Features/User/type";
import * as routes from "../Data/Routes";
import { FundWallet } from "../Features/User/userSlice";

type IFundWalletFormProps = {
  fnShowCardForm: (index: boolean) => void;
};

export const FundWalletForm = ({ fnShowCardForm }: IFundWalletFormProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { errors } = useAppSelector((state) => state.error);
  const { currentUser, isLoading } = useAppSelector((state) => state.user);

  const errText: string = errors[0]?.message?.message;
  // Define the validation schema using Yup
  const validationSchema = Yup.object({
    amount: Yup.string().required("Amount is required"),
  });

  // Initial form values
  const initialValues = {
    customer: {
      email: currentUser?.Email,
      phonenumber: currentUser?.PhoneNumber,
      name: currentUser?.Email,
    },
    amount: "",
    currency: "NGN",
  };

  // console.log("init: ", storedValues);

  // Submit handler
  const handleSubmit = (values: ICreatePaymentLink) => {
    // console.log(values);
    dispatch(FundWallet(values));
    // if (isAuth === true) navigate(routes.homepage);
    navigate(routes.homepage);
  };

  // Formik form handling
  const formik = useFormik<ICreatePaymentLink>({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <>
        {errText === "Unverified account number" && (
          <div style={{ color: "orangered" }}>**{errText}**</div>
        )}
      </>
      <div className="text-1">Credit your wallet</div>

      {/* <div className="field-holder">
        <div className="title">Enter card surname</div>
        <div className="field">
          <input
            type="text"
            id="AccountNumber"
            name="AccountNumber"
            onChange={(e) => {
              formik.handleChange(e);
              if (verifiedAcct || errText === "Unverified account number") {
                dispatch(setVerifiedAcct(null));
                formik.setFieldValue("Beneficiary", "");
                formik.setFieldValue("BankName", "");
              }
            }}
            onBlur={formik.handleBlur}
            value={formik.values.AccountNumber}
            placeholder="Account number"
          />
        </div>
        {formik.touched.AccountNumber && formik.errors.AccountNumber && (
          <div className="error">{formik.errors.AccountNumber}</div>
        )}
      </div> */}

      <div className="field-holder">
        <div className="title">Enter amount</div>
        <div className="field">
          <input
            type="text"
            id="amount"
            name="amount"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.amount}
            placeholder="NGN 0.00"
          />
        </div>
        {formik.touched.amount && formik.errors.amount && (
          <div className="error">{formik.errors.amount}</div>
        )}
      </div>

      <div className="card-forms-bottom">
        <button
          onClick={() => {
            fnShowCardForm(false);
          }}
        >
          Back
        </button>

        <button type="submit" disabled={isLoading}>
          Next
        </button>
      </div>
    </form>
  );
};
