import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../Store/store";
import {
  IBankTransferPayload,
  IBanksPayload,
  IVerifiedAcct,
} from "../Features/User/type";
import * as routes from "../Data/Routes";
import {
  BankTransfer,
  GetBanks,
  VerifyBankAccount,
  setVerifiedAcct,
} from "../Features/User/userSlice";
import { useEffect, useState } from "react";

type IBankTransferFormProps = {
  fnShowCardForm: (index: boolean) => void;
};

export const BankTransferForm = ({
  fnShowCardForm,
}: IBankTransferFormProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { verifiedAcct, banks } = useAppSelector((state) => state.user);
  // Define the validation schema using Yup
  const validationSchema = Yup.object({
    AccountNumber: Yup.string().required("AccountNumber is required"),
    BankName: Yup.string().required("BankName is required"),
    Beneficiary: Yup.string().required("Beneficiary is required"),
    Narration: Yup.string().required("Narration is required"),
    Amount: Yup.string().required("Amount is required"),
  });

  // Initial form values
  const initialValues = {
    AccountNumber: "",
    BankName: "",
    Beneficiary: "",
    Narration: "",
    Amount: "",
  };

  // console.log("init: ", storedValues);

  // Submit handler
  const handleSubmit = (values: IBankTransferPayload) => {
    dispatch(BankTransfer(values));
    // if (isAuth === true) navigate(routes.homepage);
    navigate(routes.homepage);
  };

  // Formik form handling
  const formik = useFormik<IBankTransferPayload>({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });

  useEffect(() => {
    dispatch(setVerifiedAcct(null));
  }, []);

  useEffect(() => {
    if (!banks) {
      dispatch(GetBanks());
    }
  }, [dispatch, banks]);

  const filteredBanks = banks?.filter((bank: IBanksPayload) =>
    bank.name.toLowerCase().includes("bank")
  );

  useEffect(() => {
    if (formik.values.AccountNumber.length === 10 && !verifiedAcct) {
      const bank: IBanksPayload = filteredBanks?.find(
        (obj: IBanksPayload) => obj.name === formik.values.BankName
      );
      // console.log(bank);
      dispatch(
        VerifyBankAccount({
          acctNum: formik.values.AccountNumber,
          bankCode: bank?.code,
        })
      );
    } else if (formik.values.AccountNumber.length < 10 && verifiedAcct) {
      dispatch(setVerifiedAcct(null));
      formik.setFieldValue("Beneficiary", "");
    }
  }, [
    dispatch,
    filteredBanks,
    formik.values.BankName,
    formik.values.AccountNumber,
  ]);

  useEffect(() => {
    if (verifiedAcct) {
      formik.setFieldValue("Beneficiary", verifiedAcct?.account_name);
    }
  }, [verifiedAcct]);

  return (
    <form>
      <div className="text-1">Transfer to</div>

      <div className="field-holder">
        <div className="title">Enter account number</div>
        <div className="field">
          <input
            type="text"
            id="AccountNumber"
            name="AccountNumber"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.AccountNumber}
            placeholder="Account number"
          />
        </div>
        {formik.touched.AccountNumber && formik.errors.AccountNumber && (
          <div className="error">{formik.errors.AccountNumber}</div>
        )}
      </div>

      <div className="field-holder">
        <div className="title">Choose a bank</div>
        <div className="field">
          <select
            id="BankName"
            name="BankName"
            onChange={(e) => {
              formik.handleChange(e);
            }}
            onBlur={formik.handleBlur}
            value={formik.values.BankName}
            className="field"
          >
            {/* <option value="" disabled>
              Select a Date
            </option> */}
            {filteredBanks?.map((bank: IBanksPayload, index: number) => (
              <option value={bank.name} key={index}>
                {bank.name}
              </option>
            ))}
            {/* Add more options as needed */}
          </select>
        </div>
        {formik.touched.BankName && formik.errors.BankName && (
          <div className="error">{formik.errors.BankName}</div>
        )}
      </div>

      <div className="field-holder">
        <div className="title">Beneficiary</div>
        <div className="field">
          <input
            type="text"
            id="Beneficiary"
            name="Beneficiary"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.Beneficiary}
            placeholder="Beneficiary name"
            disabled
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
