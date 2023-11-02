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
    <form onSubmit={formik.handleSubmit}>
      <div className="text-1">Transfer to</div>

      <div className="field-holder">
        <div className="title">Enter meter number</div>
        <div className="field">
          <input
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

      <div className="field-holder">
        <div className="title">Choose Office</div>
        <div className="field">
          <select
            id="OfficeName"
            name="OfficeName"
            onChange={(e) => {
              formik.handleChange(e);
              SetOtherFormFields(e.currentTarget.value);
            }}
            onBlur={formik.handleBlur}
            value={formik.values.OfficeName}
            className="field"
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

      <div className="field-holder">
        <div className="title">Enter amount</div>
        <div className="field">
          <input
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
