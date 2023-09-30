import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useAppDispatch } from "../Store/store";
import { ITollPayload } from "../Features/User/type";
import * as routes from "../Data/Routes";
import { TollPayment } from "../Features/User/userSlice";

export const TollForm = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  // Define the validation schema using Yup
  const validationSchema = Yup.object({
    CustomerId: Yup.string().required("AccountNumber is required"),
    Amount: Yup.string().required("Amount is required"),
  });

  // Initial form values
  const initialValues = {
    CustomerId: "",
    Amount: "",
  };

  // console.log("init: ", storedValues);

  // Submit handler
  const handleSubmit = (values: ITollPayload) => {
    dispatch(TollPayment(values));
    // if (isAuth === true) navigate(routes.homepage);
    navigate(routes.homepage);
  };

  // Formik form handling
  const formik = useFormik<ITollPayload>({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });
  return (
    <form>
      <div className="text-1">Pay to</div>

      <div className="field-holder">
        <div className="title">Toll ID</div>
        <div className="field">
          <input
            type="text"
            id="CustomerId"
            name="CustomerId"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.CustomerId}
            placeholder="Enter customer ID"
          />
        </div>
        {formik.touched.CustomerId && formik.errors.CustomerId && (
          <div className="error">{formik.errors.CustomerId}</div>
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
