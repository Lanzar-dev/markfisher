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
  const { currentUser, bundleCategory, isLoading } = useAppSelector(
    (state) => state.user
  );
  // Define the validation schema using Yup
  const validationSchema = Yup.object({
    MobileNumber: Yup.string().required("Mobile number is required"),
    BundleName: Yup.string().required("Bundle name is required"),
    Amount: Yup.string().required("Amount is required"),
    BillerCode: Yup.string().required("Biller code is required"),
    ItemCode: Yup.string().required("Item code is required"),
  });

  // Initial form values
  const initialValues = {
    MobileNumber: "",
    NetworkName: "",
    BundleName: "",
    Amount: "",
    Email: "",
    BillerCode: "",
    ItemCode: "",
  };

  // console.log("init: ", storedValues);

  // Submit handler
  const handleSubmit = (values: IBundlePayload) => {
    const newPayload = { ...values, Email: currentUser.Email };
    // console.log(newPayload);
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
    formik.setFieldValue("BundleName", selectedCat[0]?.biller_name.toString());
    formik.setFieldValue("Amount", selectedCat[0]?.amount.toString());
    formik.setFieldValue("BillerCode", selectedCat[0]?.biller_code);
    formik.setFieldValue("ItemCode", selectedCat[0]?.item_code);
  };

  const SetOtherFormFields = (e: any) => {
    const selectedCat: IAirtimeCategory[] = bundleCategory?.filter(
      (obj: IAirtimeCategory) => obj.biller_name.includes(e)
    );
    formik.setFieldValue("BillerCode", selectedCat[0]?.biller_code);
    formik.setFieldValue("ItemCode", selectedCat[0]?.item_code);
  };

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
              ChangeNetworkBundles(e.currentTarget.value);
            }}
            onBlur={formik.handleBlur}
            value={formik.values.NetworkName}
            className="field"
          >
            <option value="" disabled>
              ...
            </option>
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
        {formik.touched.NetworkName && formik.errors.NetworkName && (
          <div className="error">{formik.errors.NetworkName}</div>
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
              SetOtherFormFields(e.currentTarget.value);
              ChangeAmount(e.currentTarget.value);
            }}
            onBlur={formik.handleBlur}
            value={formik.values.BundleName}
            className="field"
          >
            <option value="" disabled>
              ...
            </option>
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
        <button type="submit" disabled={isLoading}>
          Next
        </button>
      </div>
    </form>
  );
};
