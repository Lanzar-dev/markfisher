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
  const { airtimeCategory, currentUser } = useAppSelector(
    (state) => state.user
  );
  // Define the validation schema using Yup
  const validationSchema = Yup.object({
    MobileNumber: Yup.string().required("Mobile number is required"),
    NetworkName: Yup.string().required("Network name is required"),
    Amount: Yup.string().required("Amount is required"),
  });

  // Initial form values
  const initialValues = {
    MobileNumber: "",
    NetworkName: "",
    Amount: "",
    Email: "",
  };

  // console.log("init: ", storedValues);

  // Submit handler
  const handleSubmit = (values: IAirtimePayload) => {
    const newPayload = { ...values, Email: currentUser.Email };
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

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="text-1">Pay to</div>

      <div className="field-holder">
        <div className="title">Mobile number</div>
        <div className="field">
          <input
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

      <div className="field-holder">
        <div className="title">Choose a network</div>
        <div className="field">
          <select
            id="NetworkName"
            name="NetworkName"
            onChange={(e) => {
              formik.handleChange(e);
            }}
            onBlur={formik.handleBlur}
            value={formik.values.NetworkName}
            className="field"
          >
            {/* <option value="" disabled>
              Select a Date
            </option> */}
            {airtimeCategory?.map(
              (airtime: IAirtimeCategory, index: number) => (
                <option value={airtime.name} key={index}>
                  {airtime.name}
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
        <button type="submit">Next</button>
      </div>
    </form>
  );
};
