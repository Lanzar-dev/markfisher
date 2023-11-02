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
    <form onSubmit={formik.handleSubmit}>
      <div className="text-1">Transfer to</div>

      <div className="field-holder">
        <div className="title">Enter decoder/smart number</div>
        <div className="field">
          <input
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

      <div className="field-holder">
        <div className="title">Choose subscription</div>
        <div className="field">
          <select
            id="SubscriptionName"
            name="SubscriptionName"
            onChange={(e) => {
              formik.handleChange(e);
              ChangeAmount(e.currentTarget.value);
            }}
            onBlur={formik.handleBlur}
            value={formik.values.SubscriptionName}
            className="field"
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
            disabled
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
