import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../Store/store";
import {
  IBankTransferPayload,
  IBanksPayload,
  ITransferPayload,
} from "../Features/User/type";
import * as routes from "../Data/Routes";
import {
  BankTransfer,
  GetBanks,
  VerifyBankAccount,
  setVerifiedAcct,
} from "../Features/User/userSlice";
import { useCallback, useEffect, useState } from "react";

type IBankTransferFormProps = {
  fnShowCardForm: (index: boolean) => void;
};

export const BankTransferForm = ({
  fnShowCardForm,
}: IBankTransferFormProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { errors } = useAppSelector((state) => state.error);
  const { verifiedAcct, banks, currentUser, isLoading } = useAppSelector(
    (state) => state.user
  );
  const [check, setCheck] = useState<boolean>(false);
  const errText: string = errors[0]?.message?.message;
  // Define the validation schema using Yup
  const validationSchema = Yup.object({
    AccountNumber: Yup.string()
      .min(10, "Cannot be less than ten digits")
      .max(10, "Must be ten digits")
      .required("Account number is required"),
    BankName: Yup.string().required("Bank name is required"),
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
    const bank = banks?.find(
      (bank: IBanksPayload) => bank.name === values.BankName
    );

    const newPayload: ITransferPayload = {
      AccountNumber: values.AccountNumber,
      Amount: values.Amount,
      Currency: "NGN",
      Narration: values.Narration,
      BankCode: bank.code,
      Email: currentUser?.Email,
    };
    // console.log(newPayload);
    dispatch(BankTransfer(newPayload));
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
  }, [dispatch]);

  useEffect(() => {
    if (!banks) {
      dispatch(GetBanks());
    }
  }, [dispatch, banks]);

  let filteredBanks = banks?.filter(
    (bank: IBanksPayload) =>
      bank.name.toLowerCase().includes("bank") &&
      !bank.name.toLowerCase().startsWith("9") &&
      !bank.name.toLowerCase().startsWith("smartcash")
  );

  const setField = useCallback(() => {
    formik.setFieldValue("Beneficiary", verifiedAcct?.account_name);
  }, [verifiedAcct]); //formik

  useEffect(() => {
    if (verifiedAcct) {
      setField();
    }
  }, [setField, verifiedAcct]);

  filteredBanks?.sort((a: any, b: any) => {
    let nameA = a.name.toUpperCase(); // ignore upper and lowercase
    let nameB = b.name.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    // names must be equal
    return 0;
  });

  const checkAcctNum = (accName: any) => {
    let accNum = formik.values.AccountNumber;
    if (accNum.length === 10 && !verifiedAcct) {
      const bank: IBanksPayload = filteredBanks?.find(
        (obj: IBanksPayload) => obj.name === accName
      );
      // console.log(bank);
      dispatch(
        VerifyBankAccount({
          account_number: formik.values.AccountNumber,
          account_bank: bank?.code,
        })
      );
    } else if (accNum.length < 10) {
      dispatch(setVerifiedAcct(null));
      formik.setFieldValue("Beneficiary", "");
    }
  };

  useEffect(() => {
    if (formik.values.AccountNumber.length < 10) {
      setCheck(true);
    } else {
      setCheck(false);
    }
  }, [formik.values.AccountNumber]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <>
        {errText === "Unverified account number" && (
          <div style={{ color: "orangered" }}>**{errText}**</div>
        )}
      </>
      <div className="text-1">Transfer to</div>

      <div className="field-holder">
        <div className="title">Enter account number</div>
        <div className="field">
          <input
            type="text"
            id="AccountNumber"
            name="AccountNumber"
            onChange={(e) => {
              formik.handleChange(e);
              if (verifiedAcct || errText === "Unverified account number") {
                dispatch(setVerifiedAcct(null));
                formik.setFieldValue("Beneficiary", "");
                formik.setFieldValue("BankName", "");
              }
            }}
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
              checkAcctNum(e.currentTarget.value);
            }}
            onBlur={formik.handleBlur}
            value={formik.values.BankName}
            className="field"
            disabled={verifiedAcct || check ? true : false}
          >
            <option value="" disabled>
              ...
            </option>
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
        {verifiedAcct && (
          <button type="submit" disabled={isLoading}>
            Next
          </button>
        )}
      </div>
    </form>
  );
};
