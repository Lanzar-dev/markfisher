import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../Store/store";
import { IAirtimeCategory, IBundlePayload } from "../Features/User/type";
import * as routes from "../Data/Routes";
import { BuyBundle, getBillsCategories } from "../Features/User/userSlice";
import { useEffect, useState } from "react";

type IBundleFormProps = {
  fnShowCardForm: (index: boolean) => void;
};

export const BundleForm = ({ fnShowCardForm }: IBundleFormProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [networkBundles, setNetworkBundles] = useState<
    IAirtimeCategory[] | null
  >();
  const { currentUser, bundleCategory } = useAppSelector((state) => state.user);
  // Define the validation schema using Yup
  const validationSchema = Yup.object({
    MobileNumber: Yup.string().required("AccountNumber is required"),
    BundleName: Yup.string().required("BankName is required"),
    Amount: Yup.string().required("Amount is required"),
  });

  // Initial form values
  const initialValues = {
    MobileNumber: "",
    Network: "",
    BundleName: "",
    Amount: "",
    Email: "",
  };

  // console.log("init: ", storedValues);

  // Submit handler
  const handleSubmit = (values: IBundlePayload) => {
    const newPayload = { ...values, Email: currentUser.Email };
    dispatch(BuyBundle(newPayload));
    // if (isAuth === true) navigate(routes.homepage);
    navigate(routes.homepage);
  };

  // Formik form handling
  const formik = useFormik<IBundlePayload>({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });

  useEffect(() => {
    if (!bundleCategory) {
      dispatch(getBillsCategories({ QueryParam: "data_bundle", Index: "1" }));
    }
  }, [dispatch, bundleCategory]);

  const ChangeAmount = (e: any) => {
    const selectedCat: IAirtimeCategory = bundleCategory?.find(
      (obj: IAirtimeCategory) => obj.biller_name === e
    );
    formik.setFieldValue("Amount", selectedCat.amount.toString());
  };

  const ChangeNetworkBundles = (e: any) => {
    const selectedCat: IAirtimeCategory[] = bundleCategory?.filter(
      (obj: IAirtimeCategory) => obj.biller_name.includes(e)
    );
    setNetworkBundles(selectedCat);
    formik.setFieldValue("Amount", selectedCat[0]?.amount.toString());
  };

  useEffect(() => {
    const thisFnc = () => {
      const selectedCat: IAirtimeCategory[] = bundleCategory?.filter(
        (obj: IAirtimeCategory) => obj.biller_name.includes("AIRTEL")
      );
      setNetworkBundles(selectedCat);
      formik.setFieldValue("Amount", selectedCat[0]?.amount.toString());
    };
    thisFnc();
  }, []);

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
          <select
            id="Network"
            name="Network"
            onChange={(e) => {
              formik.handleChange(e);
              ChangeNetworkBundles(e.currentTarget.value);
            }}
            onBlur={formik.handleBlur}
            value={formik.values.Network}
            className="field"
          >
            {/* <option value="" disabled>
              Select a Date
            </option> */}
            {["AIRTEL", "MTN", "9MOBILE", "GLO"].map(
              (network: any, index: number) => (
                <option value={network} key={index}>
                  {network}
                </option>
              )
            )}
            {/* Add more options as needed */}
          </select>
        </div>
        {formik.touched.Network && formik.errors.Network && (
          <div className="error">{formik.errors.Network}</div>
        )}
      </div>

      <div className="field-holder">
        <div className="title">Choose a bundle</div>
        <div className="field">
          <select
            id="BundleName"
            name="BundleName"
            onChange={(e) => {
              formik.handleChange(e);
              ChangeAmount(e.currentTarget.value);
            }}
            onBlur={formik.handleBlur}
            value={formik.values.BundleName}
            className="field"
          >
            {/* <option value="" disabled>
              Select a Date
            </option> */}
            {networkBundles?.map((airtime: IAirtimeCategory, index: number) => (
              <option value={airtime.biller_name} key={index}>
                {airtime.biller_name}
              </option>
            ))}
            {/* Add more options as needed */}
          </select>
        </div>
        {formik.touched.BundleName && formik.errors.BundleName && (
          <div className="error">{formik.errors.BundleName}</div>
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
        <button type="submit">Next</button>
      </div>
    </form>
  );
};
