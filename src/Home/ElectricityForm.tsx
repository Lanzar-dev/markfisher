import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../Store/store";
import { IAirtimeCategory, IElectricityPayload } from "../Features/User/type";
import * as routes from "../Data/Routes";
import { BuyElectricity, getBillsCategories } from "../Features/User/userSlice";
import { useEffect, useState } from "react";

type IElectricityFormProps = {
  fnShowCardForm: (index: boolean) => void;
  isPostpaid: boolean;
};

export const ElectricityForm = ({
  fnShowCardForm,
  isPostpaid,
}: IElectricityFormProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [office, setOffice] = useState<IAirtimeCategory[] | null>();
  const { electricityCategory, currentUser, isLoading } = useAppSelector(
    (state) => state.user
  );
  // Define the validation schema using Yup
  const validationSchema = Yup.object({
    MeterNumber: Yup.string().required("Meter number is required"),
    OfficeName: Yup.string().required("Office name is required"),
    Amount: Yup.string().required("Amount is required"),
    BillerCode: Yup.string().required("Biller code is required"),
    BillerName: Yup.string().required("Biller name is required"),
    ItemCode: Yup.string().required("Item code is required"),
  });

  // Initial form values
  const initialValues = {
    MeterNumber: "",
    OfficeName: "",
    Amount: "",
    Email: "",
    BillerCode: "",
    ItemCode: "",
    BillerName: "",
    IsPrepaid: false,
  };

  // console.log("init: ", storedValues);

  // Submit handler
  const handleSubmit = (values: IElectricityPayload) => {
    const newPayload = { ...values, Email: currentUser.Email };
    // console.log(newPayload);
    dispatch(BuyElectricity(newPayload));
    // if (isAuth === true) navigate(routes.homepage);
    navigate(routes.homepage);
  };

  // Formik form handling
  const formik = useFormik<IElectricityPayload>({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });

  useEffect(() => {
    if (!electricityCategory) {
      dispatch(getBillsCategories({ QueryParam: "power", Index: "1" }));
    }
  }, [dispatch, electricityCategory]);

  useEffect(() => {
    if (electricityCategory) {
      var select: string;
      if (isPostpaid) {
        select = "POSTPAID";
        formik.setFieldValue("IsPrepaid", false);
      } else {
        select = "PREPAID";
        formik.setFieldValue("IsPrepaid", true);
      }
      const selectedCat: IAirtimeCategory[] = electricityCategory?.filter(
        (obj: IAirtimeCategory) =>
          obj.biller_name.toUpperCase().includes(select)
      );

      setOffice(selectedCat);
    }
  }, [electricityCategory, isPostpaid]); //formik

  const SetOtherFormFields = (e: any) => {
    const selectedCat: IAirtimeCategory[] = electricityCategory?.filter(
      (obj: IAirtimeCategory) => obj.biller_name.includes(e)
    );
    formik.setFieldValue("BillerCode", selectedCat[0]?.biller_code);
    formik.setFieldValue("BillerName", selectedCat[0]?.biller_name);
    formik.setFieldValue("ItemCode", selectedCat[0]?.item_code);
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
          Enter meter number
        </div>
        <div className="w-[90vw] md:w-[28vw] h-[36px] flex-shrink-0 border border-t-0 border-l-0 border-r-0 bg-white pl-[5px] focus:outline-none">
          <input
            className="w-[90vw] md:w-[28vw] h-[36px] flex-shrink-0 border border-t-0 border-l-0 border-r-0 bg-white pl-[5px] focus:outline-none"
            type="text"
            id="MeterNumber"
            name="MeterNumber"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.MeterNumber}
            placeholder="Meter number"
          />
        </div>
        {formik.touched.MeterNumber && formik.errors.MeterNumber && (
          <div className="error">{formik.errors.MeterNumber}</div>
        )}
      </div>

      <div className="w-fit mb-[15px] mt-[15px] md:mt-0 mx-auto md:mx-0">
        <div className="w-fit h-[24px] md:h-[22px] flex-shrink-0 text-black text-base not-italic font-extrabold leading-normal">
          Choose Office
        </div>
        <div className="w-[90vw] md:w-[28vw] h-[36px] flex-shrink-0 border border-t-0 border-l-0 border-r-0 bg-white pl-[5px] focus:outline-none">
          <select
            id="OfficeName"
            name="OfficeName"
            onChange={(e) => {
              formik.handleChange(e);
              SetOtherFormFields(e.currentTarget.value);
            }}
            onBlur={formik.handleBlur}
            value={formik.values.OfficeName}
            className="w-[90vw] md:w-[28vw] h-[36px] flex-shrink-0 border border-t-0 border-l-0 border-r-0 bg-white pl-[5px] focus:outline-none"
          >
            <option value="" disabled>
              ...
            </option>
            {office?.map((airtime: IAirtimeCategory, index: number) => (
              <option value={airtime.biller_name} key={index}>
                {airtime.name}
              </option>
            ))}
            {/* Add more options as needed */}
          </select>
        </div>
        {formik.touched.OfficeName && formik.errors.OfficeName && (
          <div className="error">{formik.errors.OfficeName}</div>
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
