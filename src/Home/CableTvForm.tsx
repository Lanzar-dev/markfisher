import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../Store/store";
import { IAirtimeCategory, ICablePayload } from "../Features/User/type";
import * as routes from "../Data/Routes";
import { DstvPayment, getBillsCategories } from "../Features/User/userSlice";
import { useEffect } from "react";

type IElectricityFormProps = {
  fnShowCardForm: (index: boolean) => void;
};

export const CableTvForm = ({ fnShowCardForm }: IElectricityFormProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { cableCategory, currentUser, isLoading } = useAppSelector(
    (state) => state.user
  );
  // Define the validation schema using Yup
  const validationSchema = Yup.object({
    DecoderNumber: Yup.string().required("Decoder number is required"),
    SubscriptionName: Yup.string().required("Subscription name is required"),
    Amount: Yup.string().required("Amount is required"),
    BillerCode: Yup.string().required("Biller code is required"),
    BillerName: Yup.string().required("Biller name is required"),
    ItemCode: Yup.string().required("Item code is required"),
  });

  // Initial form values
  const initialValues = {
    DecoderNumber: "",
    SubscriptionName: "",
    Amount: "",
    Email: "",
    BillerCode: "",
    BillerName: "",
    ItemCode: "",
  };

  // console.log("init: ", storedValues);

  // Submit handler
  const handleSubmit = (values: ICablePayload) => {
    const newPayload = { ...values, Email: currentUser.Email };
    // console.log(newPayload);
    dispatch(DstvPayment(newPayload));
    // if (isAuth === true) navigate(routes.homepage);
    navigate(routes.homepage);
  };

  // Formik form handling
  const formik = useFormik<ICablePayload>({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });

  useEffect(() => {
    if (!cableCategory) {
      dispatch(getBillsCategories({ QueryParam: "cable", Index: "1" }));
    }
  }, [dispatch, cableCategory]);

  useEffect(() => {
    if (cableCategory) {
      formik.setFieldValue("Amount", cableCategory[0].amount.toString());
    }
  }, [cableCategory]); //formik

  const ChangeAmount = (e: any) => {
    const selectedCat: IAirtimeCategory[] = cableCategory?.filter(
      (obj: IAirtimeCategory) => obj.biller_name === e
    );
    formik.setFieldValue("BillerCode", selectedCat[0]?.biller_code);
    formik.setFieldValue("BillerName", selectedCat[0]?.biller_name);
    formik.setFieldValue("ItemCode", selectedCat[0]?.item_code);
    formik.setFieldValue("Amount", selectedCat[0].amount.toString());
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
          Enter decoder/smart number
        </div>
        <div className="w-[90vw] md:w-[28vw] h-[36px] flex-shrink-0 border border-t-0 border-l-0 border-r-0 bg-white pl-[5px] focus:outline-none">
          <input
            className="w-[90vw] md:w-[28vw] h-[36px] flex-shrink-0 border border-t-0 border-l-0 border-r-0 bg-white pl-[5px] focus:outline-none"
            type="text"
            id="DecoderNumber"
            name="DecoderNumber"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.DecoderNumber}
            placeholder="Decoder number"
          />
        </div>
        {formik.touched.DecoderNumber && formik.errors.DecoderNumber && (
          <div className="error">{formik.errors.DecoderNumber}</div>
        )}
      </div>

      <div className="w-fit mb-[15px] mt-[15px] md:mt-0 mx-auto md:mx-0">
        <div className="w-fit h-[24px] md:h-[22px] flex-shrink-0 text-black text-base not-italic font-extrabold leading-normal">
          Choose subscription
        </div>
        <div className="w-[90vw] md:w-[28vw] h-[36px] flex-shrink-0 border border-t-0 border-l-0 border-r-0 bg-white pl-[5px] focus:outline-none">
          <select
            id="SubscriptionName"
            name="SubscriptionName"
            onChange={(e) => {
              formik.handleChange(e);
              ChangeAmount(e.currentTarget.value);
            }}
            onBlur={formik.handleBlur}
            value={formik.values.SubscriptionName}
            className="w-[90vw] md:w-[28vw] h-[36px] flex-shrink-0 border border-t-0 border-l-0 border-r-0 bg-white pl-[5px] focus:outline-none"
          >
            <option value="" disabled>
              ...
            </option>
            {cableCategory?.map((airtime: IAirtimeCategory, index: number) => (
              <option value={airtime.biller_name} key={index}>
                {airtime.biller_name}
              </option>
            ))}
            {/* Add more options as needed */}
          </select>
        </div>
        {formik.touched.SubscriptionName && formik.errors.SubscriptionName && (
          <div className="error">{formik.errors.SubscriptionName}</div>
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
            disabled
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
