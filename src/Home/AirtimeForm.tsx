import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../Store/store";
import { IAirtimeCategory, IAirtimePayload } from "../Features/User/type";
import * as routes from "../Data/Routes";
import { BuyAirtime, getBillsCategories } from "../Features/User/userSlice";
import { useEffect } from "react";

type IAirtimeFormProps = {
  fnShowCardForm: (index: boolean) => void;
};

export const AirtimeForm = ({ fnShowCardForm }: IAirtimeFormProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { airtimeCategory, currentUser, isLoading } = useAppSelector(
    (state) => state.user
  );
  // Define the validation schema using Yup
  const validationSchema = Yup.object({
    MobileNumber: Yup.string().required("Mobile number is required"),
    NetworkName: Yup.string().required("Network name is required"),
    Amount: Yup.string().required("Amount is required"),
    BillerCode: Yup.string().required("Biller code is required"),
    ItemCode: Yup.string().required("Item code is required"),
  });

  // Initial form values
  const initialValues = {
    MobileNumber: "",
    NetworkName: "",
    Amount: "",
    Email: "",
    BillerCode: "",
    ItemCode: "",
  };

  // console.log("init: ", storedValues);

  // Submit handler
  const handleSubmit = (values: IAirtimePayload) => {
    const newPayload: IAirtimePayload = { ...values, Email: currentUser.Email };
    // console.log("payload: ", newPayload);
    dispatch(BuyAirtime(newPayload));
    // if (isAuth === true) navigate(routes.homepage);
    navigate(routes.homepage);
  };

  // Formik form handling
  const formik = useFormik<IAirtimePayload>({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });

  useEffect(() => {
    if (!airtimeCategory) {
      dispatch(getBillsCategories({ QueryParam: "airtime", Index: "1" }));
    }
  }, [dispatch, airtimeCategory]);

  const SetOtherFormFields = (e: any) => {
    const selectedCat: IAirtimeCategory[] = airtimeCategory?.filter(
      (obj: IAirtimeCategory) => obj.short_name.includes(e)
    );
    formik.setFieldValue("BillerCode", selectedCat[0]?.biller_code);
    formik.setFieldValue("ItemCode", selectedCat[0]?.item_code);
  };

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="mt-[70px] pl-[15px] md:pl-[35px] h-fit mb-[50px] md:mb-0"
    >
      <div className=" text-lightBlack text-base not-italic font-[600] leading-normal w-fit my-5 mx-0">
        Pay to
      </div>

      <div className=" w-fit mb-[15px] mt-[15px] md:mt-0 mx-auto md:mx-0">
        <div className=" w-fit h-[24px] md:h-[22px] flex-shrink-0 text-black text-base not-italic font-extrabold leading-normal">
          Mobile number
        </div>
        <div className="w-[90vw] md:w-[28vw] h-[36px] flex-shrink-0 border border-t-0 border-l-0 border-r-0 bg-white pl-[5px] focus:outline-none">
          <input
            className="w-[90vw] md:w-[28vw] h-[36px] flex-shrink-0 border border-t-0 border-l-0 border-r-0 bg-white pl-[5px] focus:outline-none"
            type="text"
            id="MobileNumber"
            name="MobileNumber"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.MobileNumber}
            placeholder="Mobile number"
          />
        </div>
        {formik.touched.MobileNumber && formik.errors.MobileNumber && (
          <div className="error">{formik.errors.MobileNumber}</div>
        )}
      </div>

      <div className="w-fit mb-[15px]  mt-[15px] md:mt-0 mx-auto md:mx-0">
        <div className=" w-fit h-[22px] flex-shrink-0 text-black text-base not-italic font-extrabold leading-normal">
          Choose a network
        </div>
        <div className="w-[90vw] md:w-[28vw] h-[36px] flex-shrink-0 border border-t-0 border-l-0 border-r-0 bg-white pl-[5px] focus:outline-none">
          <select
            id="NetworkName"
            name="NetworkName"
            onChange={(e) => {
              formik.handleChange(e);
              SetOtherFormFields(e.currentTarget.value);
            }}
            onBlur={formik.handleBlur}
            value={formik.values.NetworkName}
            className="w-[90vw] md:w-[28vw] h-[36px] flex-shrink-0 border border-t-0 border-l-0 border-r-0 bg-white pl-[5px] focus:outline-none"
          >
            <option value="" disabled>
              ...
            </option>
            {airtimeCategory?.map(
              (airtime: IAirtimeCategory, index: number) => (
                <option value={airtime.short_name} key={index}>
                  {airtime.short_name}
                </option>
              )
            )}
            {/* Add more options as needed */}
          </select>
        </div>
        {formik.touched.NetworkName && formik.errors.NetworkName && (
          <div className="error">{formik.errors.NetworkName}</div>
        )}
      </div>

      <div className="w-fit mb-[15px] mt-[15px] md:mt-0 mx-auto md:mx-0">
        <div className=" w-fit h-[22px] flex-shrink-0 text-black text-base not-italic font-extrabold leading-normal">
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
