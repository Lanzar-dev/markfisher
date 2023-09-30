import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useAppDispatch } from "../Store/store";
import { IBiyaTransferPayload } from "../Features/User/type";
import * as routes from "../Data/Routes";
import { BiyaTransfer } from "../Features/User/userSlice";

export const BiyaTransferForm = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  // Define the validation schema using Yup
  const validationSchema = Yup.object({
    AccountNumber: Yup.string().required("AccountNumber is required"),
    Beneficiary: Yup.string().required("Beneficiary is required"),
    Narration: Yup.string().required("Narration is required"),
    Amount: Yup.string().required("Amount is required"),
  });

  // Initial form values
  const initialValues = {
    AccountNumber: "",
    Beneficiary: "",
    Narration: "",
    Amount: "",
  };

  // console.log("init: ", storedValues);

  // Submit handler
  const handleSubmit = (values: IBiyaTransferPayload) => {
    dispatch(BiyaTransfer(values));
    // if (isAuth === true) navigate(routes.homepage);
    navigate(routes.homepage);
  };

  // Formik form handling
  const formik = useFormik<IBiyaTransferPayload>({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });
  return (
    <form>
      <div className="text-1">Transfer to</div>

      <div className="field-holder">
        <div className="title">Enter account/Phone number</div>
        <div className="field">
          <input
            type="text"
            id="AccountNumber"
            name="AccountNumber"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.AccountNumber}
            placeholder="Account or Phone number"
          />
        </div>
        {formik.touched.AccountNumber && formik.errors.AccountNumber && (
          <div className="error">{formik.errors.AccountNumber}</div>
        )}
      </div>

      <div className="field-holder">
        <div className="title">Wallet holder name</div>
        <div className="field">
          <input
            type="text"
            id="Beneficiary"
            name="Beneficiary"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.Beneficiary}
            placeholder="amina.adewale@gmail.com"
          />
        </div>
        {formik.touched.Beneficiary && formik.errors.Beneficiary && (
          <div className="error">{formik.errors.Beneficiary}</div>
        )}
      </div>

      <div className="field-holder">
        <div className="title">Narration (Optional)</div>
        <div className="field">
          <input
            type="text"
            id="Narration"
            name="Narration"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.Narration}
            placeholder="Describe transaction"
          />
        </div>
        {formik.touched.Narration && formik.errors.Narration && (
          <div className="error">{formik.errors.Narration}</div>
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
