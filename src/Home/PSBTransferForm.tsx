import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../Store/store";
import {
  IBanksPayload,
  IPSBTransferPayload,
  ITransferPayload,
} from "../Features/User/type";
import * as routes from "../Data/Routes";
import {
  BankTransfer,
  GetBanks,
  VerifyBankAccount,
  setVerifiedAcct,
} from "../Features/User/userSlice";
import { useEffect } from "react";

type IPSBTransferFormProps = {
  fnShowCardForm: (index: boolean) => void;
};

export const PSBTransferForm = ({ fnShowCardForm }: IPSBTransferFormProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { errors } = useAppSelector((state) => state.error);
  const errText: string = errors[0]?.message?.message;
  const { verifiedAcct, banks, currentUser, isLoading } = useAppSelector(
    (state) => state.user
  );
  // Define the validation schema using Yup
  const validationSchema = Yup.object({
    AccountNumber: Yup.string().required("Account number is required"),
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
  const handleSubmit = (values: IPSBTransferPayload) => {
    const bank: IBanksPayload = banks?.find(
      (bank: IBanksPayload) => (bank.name = values.BankName)
    );
    const newPayload: ITransferPayload = {
      AccountNumber: values.AccountNumber,
      Amount: values.Amount,
      Currency: "NGN",
      Narration: values.Narration,
      BankCode: bank.code,
      Email: currentUser?.Email,
    };
    dispatch(BankTransfer(newPayload));
    // if (isAuth === true) navigate(routes.homepage);
    navigate(routes.homepage);
  };

  // Formik form handling
  const formik = useFormik<IPSBTransferPayload>({
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
      bank.name.toLowerCase().includes("psb") ||
      bank.name.toLowerCase().startsWith("9") ||
      bank.name.toLowerCase().startsWith("smartcash")
  );

  useEffect(() => {
    if (verifiedAcct) {
      formik.setFieldValue("Beneficiary", verifiedAcct?.account_name);
    }
  }, [formik, verifiedAcct]);

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

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="mt-[35px] md:mt-[70px] pl-[15px] md:pl-[35px] h-fit mb-[50px] md:mb-0"
    >
      <>
        {errText === "Unverified account number" && (
          <div style={{ color: "orangered" }}>**{errText}**</div>
        )}
      </>
      <div className="text-lightBlack text-base not-italic font-[600] leading-normal w-fit my-5 mx-0">
        Transfer to
      </div>

      <div className="w-fit mb-[15px] mt-[15px] md:mt-0 mx-auto md:mx-0">
        <div className="w-fit h-[24px] md:h-[22px] flex-shrink-0 text-black text-base not-italic font-extrabold leading-normal">
          Enter account or Wallet number
        </div>
        <div className="w-[90vw] md:w-[28vw] h-[36px] flex-shrink-0 border border-t-0 border-l-0 border-r-0 bg-white pl-[5px] focus:outline-none">
          <input
            className="w-[90vw] md:w-[28vw] h-[36px] flex-shrink-0 border border-t-0 border-l-0 border-r-0 bg-white pl-[5px] focus:outline-none"
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

      <div className="w-fit mb-[15px] mt-[15px] md:mt-0 mx-auto md:mx-0">
        <div className="w-fit h-[24px] md:h-[22px] flex-shrink-0 text-black text-base not-italic font-extrabold leading-normal">
          Choose a PSB
        </div>
        <div className="w-[90vw] md:w-[28vw] h-[36px] flex-shrink-0 border border-t-0 border-l-0 border-r-0 bg-white pl-[5px] focus:outline-none">
          <select
            id="BankName"
            name="BankName"
            onChange={(e) => {
              formik.handleChange(e);
              checkAcctNum(e.currentTarget.value);
            }}
            onBlur={formik.handleBlur}
            value={formik.values.BankName}
            className="w-[90vw] md:w-[28vw] h-[36px] flex-shrink-0 border border-t-0 border-l-0 border-r-0 bg-white pl-[5px] focus:outline-none"
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

      <div className="w-fit mb-[15px] mt-[15px] md:mt-0 mx-auto md:mx-0">
        <div className="w-fit h-[24px] md:h-[22px] flex-shrink-0 text-black text-base not-italic font-extrabold leading-normal">
          Beneficiary
        </div>
        <div className="w-[90vw] md:w-[28vw] h-[36px] flex-shrink-0 border border-t-0 border-l-0 border-r-0 bg-white pl-[5px] focus:outline-none">
          <input
            className="w-[90vw] md:w-[28vw] h-[36px] flex-shrink-0 border border-t-0 border-l-0 border-r-0 bg-white pl-[5px] focus:outline-none"
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

      <div className="w-fit mb-[15px] mt-[15px] md:mt-0 mx-auto md:mx-0">
        <div className="w-fit h-[24px] md:h-[22px] flex-shrink-0 text-black text-base not-italic font-extrabold leading-normal">
          Narration (Optional)
        </div>
        <div className="w-[90vw] md:w-[28vw] h-[36px] flex-shrink-0 border border-t-0 border-l-0 border-r-0 bg-white pl-[5px] focus:outline-none">
          <input
            className="w-[90vw] md:w-[28vw] h-[36px] flex-shrink-0 border border-t-0 border-l-0 border-r-0 bg-white pl-[5px] focus:outline-none"
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

      <div className="w-fit mb-[15px] mt-[15px] md:mt-0 mx-auto md:mx-0">
        <div className="w-fit h-[24px] md:h-[22px] flex-shrink-0 text-black text-base not-italic font-extrabold leading-normal">
          Enter amount
        </div>
        <div className="w-[90vw] md:w-[28vw] h-[36px] flex-shrink-0 border border-t-0 border-l-0 border-r-0 bg-white pl-[5px] focus:outline-none">
          <input
            className="w-[90vw] md:w-[28vw] h-[36px] flex-shrink-0 border border-t-0 border-l-0 border-r-0 bg-white pl-[5px] focus:outline-none"
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

      <div className="mt-[30px] md:mt-[50px] mb-[50px] md:mb-0 ml-0 md:ml-[-35px] xs:max-md:text-center">
        <button
          className=" ml-[15px] font-extrabold hover:cursor-pointer text-black text-center text-sm not-italic leading-normal w-[127px] h-[35px] flex-shrink-0 bg-white rounded-[94px] border-0"
          onClick={() => {
            fnShowCardForm(false);
          }}
        >
          Back
        </button>
        {verifiedAcct && (
          <button
            className="ml-[10vw] bg-biyaLightBlue hover:cursor-pointer text-white text-center text-sm not-italic font-[400] leading-normal w-[127px] h-[35px] flex-shrink-0 rounded-[94px] border-0"
            type="submit"
            disabled={isLoading}
          >
            Next
          </button>
        )}
      </div>
    </form>
  );
};
