import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../Store/store";
import { IAirtimeCategory, ITollPayload } from "../Features/User/type";
import * as routes from "../Data/Routes";
import { TollPayment, getBillsCategories } from "../Features/User/userSlice";
import { useEffect } from "react";

type ITollFormProps = {
  fnShowCardForm: (index: boolean) => void;
};

export const TollForm = ({ fnShowCardForm }: ITollFormProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { tollCategory } = useAppSelector((state) => state.user);
  // Define the validation schema using Yup
  const validationSchema = Yup.object({
    CustomerId: Yup.string().required("AccountNumber is required"),
    Amount: Yup.string().required("Amount is required"),
  });

  // Initial form values
  const initialValues = {
    CustomerId: "",
    Amount: "",
    TollName: "",
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

  useEffect(() => {
    if (!tollCategory) {
      dispatch(getBillsCategories({ QueryParam: "toll", Index: "1" }));
    }
  }, [dispatch, tollCategory]);

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
        <div className="title">Choose Toll</div>
        <div className="field">
          <select
            id="TollName"
            name="TollName"
            onChange={(e) => {
              formik.handleChange(e);
            }}
            onBlur={formik.handleBlur}
            value={formik.values.TollName}
            className="field"
          >
            <option value="" disabled>
              ...
            </option>
            {tollCategory?.map((toll: IAirtimeCategory, index: number) => (
              <option value={toll.biller_name} key={index}>
                {toll.name}
              </option>
            ))}
            {/* Add more options as needed */}
          </select>
        </div>
        {formik.touched.TollName && formik.errors.TollName && (
          <div className="error">{formik.errors.TollName}</div>
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
