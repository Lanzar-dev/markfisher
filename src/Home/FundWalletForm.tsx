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
    <form
      onSubmit={formik.handleSubmit}
      className="mt-[70px] pl-[15px] md:pl-[35px] h-fit mb-[50px] md:mb-0"
    >
      <>
        {errText === "Unverified account number" && (
          <div style={{ color: "orangered" }}>**{errText}**</div>
        )}
      </>
      <div className="text-lightBlack text-base not-italic font-[600] leading-normal w-fit my-5 mx-0">
        Credit your wallet
      </div>

      <div className="w-fit mb-[15px] mt-[15px] md:mt-0 mx-auto md:mx-0">
        <div className="w-fit h-[24px] md:h-[22px] flex-shrink-0 text-black text-base not-italic font-extrabold leading-normal">
          Enter amount
        </div>
        <div className="w-[90vw] md:w-[28vw] h-[36px] flex-shrink-0 border border-t-0 border-l-0 border-r-0 bg-white pl-[5px] focus:outline-none">
          <input
            className="w-[90vw] md:w-[28vw] h-[36px] flex-shrink-0 border border-t-0 border-l-0 border-r-0 bg-white pl-[5px] focus:outline-none"
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

      <div className="mt-[50px] mb-[50px] md:mb-0 ml-0 md:ml-[-35px] xs:max-md:text-center">
        <button
          className=" ml-[15px] font-extrabold hover:cursor-pointer text-black text-center text-sm not-italic leading-normal w-[127px] h-[35px] flex-shrink-0 bg-white rounded-[94px] border-0"
          onClick={() => {
            fnShowCardForm(false);
          }}
        >
          Back
        </button>
        <button
          className="ml-[10vw] bg-biyaLightBlue hover:cursor-pointer text-white text-center text-sm not-italic font-[400] leading-normal w-[127px] h-[35px] flex-shrink-0 rounded-[94px] border-0"
          type="submit"
          disabled={isLoading}
        >
          Next
        </button>
      </div>
    </form>
  );
};
