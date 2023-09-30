import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useAppDispatch } from "../Store/store";
import { IAirtimePayload } from "../Features/User/type";
import * as routes from "../Data/Routes";
import { BuyAirtime } from "../Features/User/userSlice";

export const BundleForm = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  // Define the validation schema using Yup
  const validationSchema = Yup.object({
    MobileNumber: Yup.string().required("AccountNumber is required"),
    NetworkName: Yup.string().required("BankName is required"),
    Amount: Yup.string().required("Amount is required"),
  });

  // Initial form values
  const initialValues = {
    MobileNumber: "",
    NetworkName: "",
    Amount: "",
  };

  // console.log("init: ", storedValues);

  // Submit handler
  const handleSubmit = (values: IAirtimePayload) => {
    dispatch(BuyAirtime(values));
    // if (isAuth === true) navigate(routes.homepage);
    navigate(routes.homepage);
  };

  // Formik form handling
  const formik = useFormik<IAirtimePayload>({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });
  return (
    <form>
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
          <input
            type="text"
            id="NetworkName"
            name="NetworkName"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.NetworkName}
            placeholder="Network name"
          />
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
    </form>
  );
};
