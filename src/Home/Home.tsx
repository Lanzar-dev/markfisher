import biyaLogo from "../Images/biyaLogo.jpg";
import dnArrow from "../Images/DownArrow.svg";
import userPic from "../Images/User.svg";
import agent from "../Images/Agent.svg";
import favourite from "../Images/Favorite.svg";
import walletIcon from "../Images/Wallet.svg";
import rightArrow from "../Images/RightArrow.svg";
import biyaTrxRArr from "../Images/BiyaTrxRArrow.svg";
import biyaToBiya from "../Images/BiyaToBiya.svg";
import bankTrx from "../Images/BankTrx.svg";
import TrxIcon from "../Images/TrxIcon.svg";
import backArrow from "../Images/BackArrow.svg";
// import airtimeIcon from "../Images/Airtime.svg";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { useEffect, useRef, useState } from "react";
import Table from "./Table";
import { BankTransferForm } from "./BankTransferForm";
import { AyibTransferForm } from "./AyibTransferForm";
import { PSBTransferForm } from "./PSBTransferForm";
import { MySVGs } from "../SVGs/MySVGs";
// import { TollForm } from "./TollForm";
import { AirtimeForm } from "./AirtimeForm";
import { BundleForm } from "./BundleForm";
import save from "../Images/SaveToGallery.svg";
import share from "../Images/ShareQrCode.svg";
import copyIcon from "../Images/Copy.svg";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import copy from "clipboard-copy";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MediaQueryMatchers, useMediaQuery } from "react-responsive";
import SmallTable from "./SmallTable";
import { ElectricityForm } from "./ElectricityForm";
import { CableTvForm } from "./CableTvForm";
import { useAppDispatch, useAppSelector } from "../Store/store";
import {
  fetchBiyaPayment,
  fetchFlwPayment,
  fetchTransactions,
  fetchUserWallet,
  // getBillStatus,
  // getTransferStatus,
  setClearPendingBill,
  setLogout,
  setPendingBill,
} from "../Features/User/userSlice";
import { FundWalletForm } from "./FundWalletForm";
import { clearErrors } from "../Features/Error/errorSlice";
import { FiLogOut } from "react-icons/fi";
import * as routes from "../Data/Routes";

export const Home = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentUser, isNotify, pendingBill, isAuth, transactions } =
    useAppSelector((state: any) => state.user);
  const { errors } = useAppSelector((state: any) => state.error);
  const [showBalance, setShowBalance] = useState<boolean>(false);
  const [navIndex, setNavIndex] = useState<number>(1);
  const [showCardForm, setShowCardForm] = useState<boolean>(false);
  const [cardFormIndex, setCardFormIndex] = useState<number>(0);
  const [showUserInfo, setShowUserInfo] = useState<boolean>(false);
  const [zindex, setZindex] = useState<number>(4);
  const isMobile = useMediaQuery({ maxWidth: 600 } as MediaQueryMatchers);
  // const isDesktop = useMediaQuery({ minWidth: 768 } as MediaQueryMatchers);
  const [searchParams, setSearchParams] = useSearchParams();
  const errtext = errors[0]?.message;

  //Always get user wallet balance on first rendering or reload

  if (!isAuth) {
    navigate(routes.login);
  }

  useEffect(() => {
    // console.log("useEffect is running");
    // console.log("isAuth:", isAuth);
    // console.log("navigate:", navigate);

    if (!isAuth) {
      navigate(routes.login);
    }
  }, [isAuth, navigate]);

  useEffect(() => {
    dispatch(fetchUserWallet(currentUser?.Email));
    dispatch(fetchTransactions(currentUser?.Email));
  }, [dispatch, currentUser?.Email]);

  useEffect(() => {
    const searchStatus = searchParams.get("status");
    const searchTrxId = searchParams.get("transaction_id");
    const searchTrxRef = searchParams.get("tx_ref");
    if (searchStatus === "successful") {
      dispatch(fetchBiyaPayment(searchTrxRef));
      dispatch(fetchFlwPayment(searchTrxId));
      dispatch(fetchUserWallet(currentUser?.Email));
    }
    // console.log("checking ", errtext?.message);
    if (
      errtext?.message === "Success transfer" ||
      errtext?.message === "Queued transfer" ||
      errtext?.message === "Bundle purchased" ||
      errtext?.message === "Airtime purchased" ||
      errtext?.message === "Cable purchased" ||
      errtext?.body?.status === "success" ||
      errtext?.body?.status === "failed"
    ) {
      setShowCardForm(false);
      dispatch(fetchUserWallet(currentUser?.Email));
      dispatch(fetchTransactions(currentUser?.Email));
      dispatch(clearErrors());
      if (isMobile) {
        setNavIndex(1);
      }
    }
  }, [dispatch, isNotify, searchParams, errtext, currentUser, isMobile]);

  // Separate useEffect for resetting searchParams
  //checking transactions for any pending bill
  useEffect(() => {
    transactions?.forEach((trx: any, index: number) => {
      const isFind = pendingBill?.findIndex(
        (item: any) => item?.Reference === trx?.Ref
      );
      if (trx?.Status === "pending" && isFind === -1) {
        dispatch(
          setPendingBill({ Reference: trx?.Ref, Type: trx?.Type, Count: 0 })
        );
      }
    });

    setSearchParams("");
  }, [dispatch, transactions, setSearchParams, pendingBill]);

  const decideFormStage = (index: number) => {
    setCardFormIndex(index);
    setShowCardForm(!showCardForm);
  };
  // console.log(errors);
  useEffect(() => {
    if (navIndex === 5 || navIndex === 4) {
      if (navIndex === 5) setCardFormIndex(10);
      if (navIndex === 4) setCardFormIndex(8);
      // setShowCardForm((preValue) => !preValue);
      setShowCardForm(true);
    } else if (navIndex === 8) {
      setShowCardForm(false);
    }
  }, [navIndex]);

  const handleCopyClick = async (text: string) => {
    try {
      await copy(text);
      alert("Text copied to clipboard!");
    } catch (error) {
      console.error("Copy failed: ", error);
    }
  };

  const qrCodeRef = useRef<any>(null);

  const handleSaveClick = () => {
    // Get the QR code element
    const qrCodeElement = qrCodeRef.current;

    // Use html2canvas to capture the QR code element
    html2canvas(qrCodeElement).then(function (canvas) {
      // Convert the canvas to a blob
      canvas.toBlob(function (blob: any) {
        // Save the blob as a file
        saveAs(blob, "qrcode.png");
      });
    });
  };

  const LogOut = () => {
    dispatch(setLogout());
    navigate("/");
  };

  const funcSetShowCard = (isBool: boolean) => {
    if (navIndex === 5 || navIndex === 4) setNavIndex(1);
    setShowCardForm(isBool);
  };

  //Check if there are pending bill and call getBillStatus endpoint
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (pendingBill?.length > 0) {
        // console.log("pend: ", pendingBill[0]);
        dispatch(fetchUserWallet(currentUser?.Email));
        dispatch(fetchTransactions(currentUser?.Email));

        var isFind;
        transactions?.forEach((trx: any, index: number) => {
          if (trx.Status === "pending") {
            isFind = 1;
          } else {
            isFind = -1;
          }
        });
        if (isFind === -1) {
          // console.log("isFind: ", isFind);
          dispatch(setClearPendingBill());
        }
      }
    }, 60000);

    return () => {
      clearInterval(intervalId);
    };
  }, [dispatch, pendingBill, currentUser?.Email, transactions]);

  // console.log("navIndex: ", navIndex, " cardFormIndex: ", cardFormIndex);

  var name: string = currentUser?.Email?.slice(0, 5);
  name = name?.at(0)?.toUpperCase() + name?.slice(1, 5);
  var acctNum: string = currentUser?.AccountNumber;

  return (
    <div className="bg-white h-screen flex">
      {showCardForm && (
        <div className=" absolute w-[100vw] md:w-[35vw] h-[93vh] md:h-screen right-0 z-[4] rounded-md border-2 border-sideFormBorder bg-sideFormBg overflow-y-auto">
          <div className="w-[100vw] md:w-[35vw] h-screen md:h-[93vh]">
            <div className="flex items-center pt-[60px] md:pt-0">
              <div className="w-[60.579px] h-[60.579px] flex-shrink-0 bg-biyaCircle rounded-[50%] flex items-center justify-center text-biyaLightBlue text-2xl not-italic font-[600] leading-normal ml-[15px] mr-[20px] mt-[15px] cursor-pointer">
                {(cardFormIndex === 1 || cardFormIndex === 9) && "B"}
                {(cardFormIndex === 2 || cardFormIndex === 4) &&
                  navIndex !== 4 && (
                    <img
                      src={bankTrx}
                      alt="bankTrx"
                      className="w-[35px] left-[17px] top-[15px]"
                    />
                  )}
                {(cardFormIndex === 8 || navIndex === 4) && (
                  <MySVGs index={4} fill={"rgba(4, 157, 254, 1)"} />
                )}
                {(cardFormIndex === 3 ||
                  cardFormIndex === 5 ||
                  cardFormIndex === 11) && (
                  <img
                    src={TrxIcon}
                    alt="TrxIcon"
                    className="w-[35px] left-[17px] top-[15px]"
                  />
                )}
                {(cardFormIndex === 10 || navIndex === 5) && (
                  <MySVGs index={5} fill={"rgba(4, 157, 254, 1)"} />
                )}
                {(cardFormIndex === 7 || cardFormIndex === 6) &&
                  navIndex !== 5 && (
                    <img
                      src={TrxIcon}
                      alt="TrxIcon"
                      className="w-[35px] left-[17px] top-[15px]"
                    />
                  )}
              </div>
              <div className=" text-black text-xl not-italic font-[600] leading-normal">
                {cardFormIndex === 1 && navIndex === 3 && "Ayib to Ayib"}
                {cardFormIndex === 2 && navIndex === 3 && "Bank transfer"}
                {cardFormIndex === 3 && navIndex === 3 && "PSB transfer"}
                {cardFormIndex === 6 &&
                  navIndex === 7 &&
                  "Electricity postpaid"}
                {cardFormIndex === 7 && navIndex === 7 && "Electricity prepaid"}
                {((cardFormIndex === 8 && navIndex === 7) || navIndex === 4) &&
                  "Airtime"}
                {cardFormIndex === 9 && navIndex === 7 && "Cable Tv"}
                {((cardFormIndex === 10 && navIndex === 7) || navIndex === 5) &&
                  "Buy a bundle"}
                {/* {cardFormIndex === 7 && "Tolls"} */}
                {cardFormIndex === 11 && "Fund wallet"}
                {cardFormIndex === 4 && navIndex === 6 && "Bank withdrawal"}
                {cardFormIndex === 5 && navIndex === 6 && "PSB withdrawal"}
              </div>
            </div>
            {cardFormIndex === 1 && navIndex === 3 && (
              <AyibTransferForm fnShowCardForm={funcSetShowCard} />
            )}
            {((cardFormIndex === 2 && navIndex === 3) ||
              (cardFormIndex === 4 && navIndex === 6)) && (
              <BankTransferForm fnShowCardForm={funcSetShowCard} />
            )}
            {((cardFormIndex === 3 && navIndex === 3) ||
              (cardFormIndex === 5 && navIndex === 6)) && (
              <PSBTransferForm fnShowCardForm={funcSetShowCard} />
            )}
            {cardFormIndex === 6 && navIndex === 7 && (
              <ElectricityForm
                fnShowCardForm={funcSetShowCard}
                isPostpaid={true}
              />
            )}
            {cardFormIndex === 7 && navIndex === 7 && (
              <ElectricityForm
                fnShowCardForm={funcSetShowCard}
                isPostpaid={false}
              />
            )}
            {((cardFormIndex === 8 && navIndex === 7) || navIndex === 4) && (
              <AirtimeForm fnShowCardForm={funcSetShowCard} />
            )}
            {cardFormIndex === 9 && navIndex === 7 && (
              <CableTvForm fnShowCardForm={funcSetShowCard} />
            )}
            {((cardFormIndex === 10 && navIndex === 7) || navIndex === 5) && (
              <BundleForm fnShowCardForm={funcSetShowCard} />
            )}
            {/* {cardFormIndex === 7 && (
              <TollForm fnShowCardForm={funcSetShowCard} />
            )} */}
            {cardFormIndex === 11 && (
              <FundWalletForm fnShowCardForm={funcSetShowCard} />
            )}
          </div>
        </div>
      )}
      {!isMobile && (
        <>
          <div className="w-[16vw]">
            <img
              className="w-[7vw] mt-[2vh] ml-[1vw] hover:cursor-pointer"
              src={biyaLogo}
              alt="biyaLogo1"
              onClick={() => {
                setNavIndex(1);
              }}
            />
            <div className="mt-[50px]">
              {navComponent("Home", 1)}
              {navComponent("Scan & pay", 2)}
              {navComponent("Transfer", 3)}
              {navComponent("Airtime", 4)}
              {navComponent("Buy Bundle", 5)}
              {navComponent("Withdraw", 6)}
              {navComponent("Pay bill", 7)}
              {navComponent("My QR", 8)}
              {navComponent("Pay merchant", 9)}
              {navComponent("Settings", 10)}
            </div>
          </div>

          <div className="right-div">
            <div className="relative">
              <div className="w-fit mt-[3vh] mr-[1vw] mb-[3vh] ml-auto flex items-center">
                <div
                  className="mr-[7px]"
                  style={{
                    width: "40px",
                    height: "40px",
                    flexShrink: "0",
                    borderRadius: "40px",
                    background: `url(${userPic}), lightgray 50% / cover no-repeat`,
                  }}
                ></div>
                <div
                  className=" cursor-pointer flex"
                  onClick={() => setShowUserInfo(!showUserInfo)}
                >
                  Welcome, {name}
                  <img
                    className=" hover:cursor-pointer ml-[7px]"
                    src={dnArrow}
                    alt={"dnArrow"}
                  />
                </div>
              </div>
              {showUserInfo && (
                <div className="absolute top-[40px] right-[10px] w-fit z-[3] border-[0.5px] rounded-[7px] bg-white dropdown-box-shadow">
                  <ul className="py-[3px] px-[15px]">
                    <li className="ml-0 mt-[0px] list-none hover:cursor-pointer">
                      Profile
                    </li>
                    <li
                      className="ml-0 mt-[5px] list-none hover:cursor-pointer"
                      onClick={LogOut}
                    >
                      Log out
                    </li>
                  </ul>
                </div>
              )}
            </div>
            <div className="overflow-y-auto overflow-x-auto w-[84vw] h-[92vh] rounded-t-[20px] bg-white2">
              {(navIndex === 1 || navIndex === 5 || navIndex === 4) && (
                <div>
                  <div className="flex">
                    <div className="my-[35px] rounded-[20px] bg-white w-[390.6px] h-[129.138px] flex-shrink-0 user-filter ml-[38px]">
                      <div className="flex h-[60px] py-[5px] pl-[18px] pr-[5px]">
                        <div className="text-black text-[25px] not-italic font-[600] leading-normal flex">
                          Hey {name}!
                          {showBalance ? (
                            <BsEyeFill
                              className="pt-[6px] hover:cursor-pointer"
                              onClick={() => setShowBalance(!showBalance)}
                            />
                          ) : (
                            <BsEyeSlashFill
                              className="pt-[6px] hover:cursor-pointer"
                              onClick={() => setShowBalance(!showBalance)}
                            />
                          )}
                        </div>
                        <div className="flex-1">
                          <div
                            className="flex items-center justify-center ml-auto mt-[9px] text-biyaLightBlue text-center text-sm not-italic font-[400] leading-normal"
                            onClick={() => {
                              setCardFormIndex(11);
                              funcSetShowCard(!showCardForm);
                            }}
                          >
                            <img
                              src={walletIcon}
                              alt="WalletLogo1"
                              className="mt-0 mr-[5px] hover:cursor-pointer"
                            />{" "}
                            Add money
                            <img
                              src={rightArrow}
                              alt="rightArrow"
                              className="mt-0 hover:cursor-pointer"
                            />
                          </div>
                          <div
                            className="flex items-center justify-center ml-auto mt-[9px] text-biyaLightBlue text-center text-sm not-italic font-[400] leading-normal"
                            onClick={() => {
                              setNavIndex(6);
                            }}
                          >
                            <img
                              src={walletIcon}
                              alt="WalletLogo1"
                              className="mt-0 mr-[5px] hover:cursor-pointer"
                            />{" "}
                            Withdraw money
                            <img
                              src={rightArrow}
                              alt="rightArrow"
                              className="mt-0 hover:cursor-pointer"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="py-[2px] pl-[18px] pr-[5px] text-black text-[20px] not-italic leading-normal font-[700]">
                        <span className="text-black text-[10px] not-italic font-[500] leading-normal">
                          Current balance
                        </span>{" "}
                        <br />{" "}
                        {showBalance
                          ? `₦${parseFloat(currentUser?.WalletBalance).toFixed(
                              2
                            )}`
                          : "************"}
                      </div>
                    </div>
                    <div className="my-[35px] rounded-[20px] bg-biyaRed w-[390.6px] h-[129.138px] flex-shrink-0 user-filter mx-[20px] flex items-center justify-center">
                      <div className="text-white text-[25px] not-italic font-[600] leading-normal mr-[25px]">
                        Manage Your <br /> Favourites
                      </div>
                      <img
                        src={favourite}
                        alt="favouriteIcon"
                        className=" inline-flex w-[100.248px] h-[100.248px] transform rotate[360deg] items-center justify-center flex-shrink-0 pt-[1.203px] pr-[2.558px] pb-[1.536px] pl-[0.181px]"
                      />
                    </div>
                    <div className="my-[35px] rounded-[20px] bg-biyaLightBlue w-[390.6px] h-[129.138px] flex-shrink-0 user-filter flex items-center justify-center text-[20px]">
                      <div className="text-white text-[25px] not-italic font-[600] leading-normal mr-[25px]">
                        Find An Agent
                      </div>
                      <img
                        src={agent}
                        alt="agentIcon"
                        className=" inline-flex w-[55.345px] h-[55.345px] transform rotate-[360deg] items-center justify-center flex-shrink-0 pt-[1.203px] pr-[2.558px] pb-[1.536px] pl-[0.181px]"
                      />
                    </div>
                  </div>
                  <div className="ml-[38px] mb-[40px] w-[784px] h-[450px] flex-shrink-0 rounded-[20px] bg-white user-filter">
                    <br />
                    <div className="w-fit mt-[5px] ml-[20px] text-black text-lg not-italic font-[600] leading-normal">
                      Recent transactions
                    </div>
                    <Table />
                  </div>
                </div>
              )}
              {navIndex === 2 && <div className="scanpay"></div>}
              {navIndex === 3 && (
                <div className="flex">
                  <div
                    className="cursor-pointer mt-[30px] ml-[40px] w-[250.255px] h-[246.941px] flex-shrink-0 rounded-[10px] bg-biyaLightBlue relative"
                    onClick={() => decideFormStage(1)}
                  >
                    <div className="w-[70.579px] h-[70.579px] flex-shrink-0 bg-white3 rounded-[50%] flex items-center justify-center text-biyaLightBlue text-[28px] not-italic font-[600] leading-normal absolute ml-[15px] mt-[15px] cursor-pointer">
                      B
                    </div>
                    <div className="w-[162.417px] h-[56.349px] flex-shrink-0 absolute bottom-[15px] left-[20px] text-white text-[15px] not-italic font-[600] leading-normal">
                      Ayib to Ayib wallet
                    </div>
                    <MySVGs
                      index={12}
                      fill="white"
                      className={"absolute right-[10px] bottom-[25px]"}
                    />
                  </div>
                  <div
                    className="mt-[30px] ml-[40px] w-[250.255px] h-[246.941px] flex-shrink-0 rounded-[10px] bg-biyaLightBlue relative cursor-pointer"
                    onClick={() => decideFormStage(2)}
                  >
                    <div className="w-[70.579px] h-[70.579px] flex-shrink-0 bg-white3 rounded-[50%] flex items-center justify-center text-biyaLightBlue text-[28px] not-italic font-[600] leading-normal absolute ml-[15px] mt-[15px] cursor-pointer">
                      <img
                        src={bankTrx}
                        alt="bankTrx"
                        className="absolute left-[17px] top-[15px] w-[35px]"
                      />
                    </div>
                    <div className="w-[162.417px] h-[56.349px] flex-shrink-0 absolute bottom-[15px] left-[20px] text-white text-[15px] not-italic font-[600] leading-normal">
                      Other accounts and banks
                    </div>
                    <MySVGs
                      index={12}
                      fill="white"
                      className={"absolute right-[10px] bottom-[25px]"}
                    />
                  </div>
                  <div
                    className="cursor-pointer relative mt-[30px] ml-[40px] w-[250.255px] h-[246.941px] flex-shrink-0 rounded-[10px] bg-biyaLightBlue"
                    onClick={() => decideFormStage(3)}
                  >
                    <div className="w-[70.579px] h-[70.579px] flex-shrink-0 bg-white3 rounded-[50%] flex items-center justify-center text-biyaLightBlue text-[28px] not-italic font-[600] leading-normal absolute ml-[15px] mt-[15px] cursor-pointer">
                      <img
                        src={TrxIcon}
                        alt="bankTrxIcon"
                        className="w-[35px] absolute left-[17px] top-[15px]"
                      />
                    </div>
                    <div className="w-[162.417px] h-[56.349px] flex-shrink-0 absolute bottom-[15px] left-[20px] text-white text-[15px] not-italic font-[600] leading-normal">
                      Other payment service bank
                    </div>
                    <MySVGs
                      index={12}
                      fill="white"
                      className={"absolute right-[10px] bottom-[25px]"}
                    />
                  </div>
                </div>
              )}
              {navIndex === 4 && <></>}
              {navIndex === 5 && <></>}
              {navIndex === 6 && (
                <div className="flex">
                  <div
                    className="cursor-pointer mt-[30px] ml-[40px] w-[250.255px] h-[246.941px] flex-shrink-0 rounded-[10px] bg-biyaLightBlue relative"
                    onClick={() => decideFormStage(4)}
                  >
                    <div className="w-[70.579px] h-[70.579px] flex-shrink-0 bg-white3 rounded-[50%] flex items-center justify-center text-biyaLightBlue text-[28px] not-italic font-[600] leading-normal absolute ml-[15px] mt-[15px] cursor-pointer">
                      <img
                        src={bankTrx}
                        alt="bankTrx"
                        className="absolute left-[17px] top-[15px] w-[35px]"
                      />
                    </div>
                    <div className="w-[162.417px] h-[56.349px] flex-shrink-0 absolute bottom-[15px] left-[20px] text-white text-[15px] not-italic font-[600] leading-normal">
                      Withdraw via bank
                    </div>
                    <MySVGs
                      index={12}
                      fill="white"
                      className={"absolute right-[10px] bottom-[25px]"}
                    />
                  </div>
                  <div
                    className="cursor-pointer mt-[30px] ml-[40px] w-[250.255px] h-[246.941px] flex-shrink-0 rounded-[10px] bg-biyaLightBlue relative"
                    onClick={() => decideFormStage(5)}
                  >
                    <div className="w-[70.579px] h-[70.579px] flex-shrink-0 bg-white3 rounded-[50%] flex items-center justify-center text-biyaLightBlue text-[28px] not-italic font-[600] leading-normal absolute ml-[15px] mt-[15px] cursor-pointer">
                      <img
                        src={TrxIcon}
                        alt="bankTrxIcon"
                        className="absolute left-[17px] top-[15px] w-[35px]"
                      />
                    </div>
                    <div className="w-[162.417px] h-[56.349px] flex-shrink-0 absolute bottom-[15px] left-[20px] text-white text-[15px] not-italic font-[600] leading-normal">
                      Withdraw via payment service bank
                    </div>
                    <MySVGs
                      index={12}
                      fill="white"
                      className={"absolute right-[10px] bottom-[25px]"}
                    />
                  </div>
                </div>
              )}
              {navIndex === 7 && (
                <div className="grid grid-cols-4 gap-[10px] my-0 mx-auto w-[1100px] lg:w-[100%]">
                  {/* <div
                    className="cursor-pointer mt-[30px] ml-[40px] w-[250.255px] h-[246.941px] flex-shrink-0 rounded-[10px] bg-biyaLightBlue relative"
                    onClick={() => decideFormStage(1)}
                  >
                    <div className="w-[70.579px] h-[70.579px] flex-shrink-0 bg-white3 rounded-[50%] flex items-center justify-center text-biyaLightBlue text-[28px] not-italic font-[600] leading-normal absolute ml-[15px] mt-[15px] cursor-pointer">
                      B
                    </div>
                    <div className="w-[162.417px] h-[56.349px] flex-shrink-0 absolute bottom-[15px] left-[20px] text-white text-[15px] not-italic font-[600] leading-normal">
                      Solar
                    </div>
                    <MySVGs
                      index={12}
                      fill="white"
                      className={"absolute right-[10px] bottom-[25px]"}
                    />
                  </div> */}
                  <div
                    className="cursor-pointer mt-[30px] ml-[40px] w-[250.255px] h-[246.941px] flex-shrink-0 rounded-[10px] bg-biyaLightBlue relative"
                    onClick={() => decideFormStage(6)}
                  >
                    <div className="w-[70.579px] h-[70.579px] flex-shrink-0 bg-white3 rounded-[50%] flex items-center justify-center text-biyaLightBlue text-[28px] not-italic font-[600] leading-normal absolute ml-[15px] mt-[15px] cursor-pointer">
                      <img
                        src={TrxIcon}
                        alt="bankTrxIcon"
                        className="absolute left-[17px] top-[15px] w-[35px]"
                      />
                    </div>
                    <div className="w-[162.417px] h-[56.349px] flex-shrink-0 absolute bottom-[15px] left-[20px] text-white text-[15px] not-italic font-[600] leading-normal">
                      Electricity postpaid
                    </div>
                    <MySVGs
                      index={12}
                      fill="white"
                      className={"absolute right-[10px] bottom-[25px]"}
                    />
                  </div>
                  <div
                    className="cursor-pointer mt-[30px] ml-[40px] w-[250.255px] h-[246.941px] flex-shrink-0 rounded-[10px] bg-biyaLightBlue relative"
                    onClick={() => decideFormStage(7)}
                  >
                    <div className="w-[70.579px] h-[70.579px] flex-shrink-0 bg-white3 rounded-[50%] flex items-center justify-center text-biyaLightBlue text-[28px] not-italic font-[600] leading-normal absolute ml-[15px] mt-[15px] cursor-pointer">
                      <img
                        src={TrxIcon}
                        alt="bankTrxIcon"
                        className="absolute left-[17px] top-[15px] w-[35px]"
                      />
                    </div>
                    <div className="w-[162.417px] h-[56.349px] flex-shrink-0 absolute bottom-[15px] left-[20px] text-white text-[15px] not-italic font-[600] leading-normal">
                      Electricity prepaid
                    </div>
                    <MySVGs
                      index={12}
                      fill="white"
                      className={"absolute right-[10px] bottom-[25px]"}
                    />
                  </div>
                  <div
                    className="cursor-pointer mt-[30px] ml-[40px] w-[250.255px] h-[246.941px] flex-shrink-0 rounded-[10px] bg-biyaLightBlue relative"
                    onClick={() => decideFormStage(8)}
                  >
                    <div className="w-[70.579px] h-[70.579px] flex-shrink-0 bg-white3 rounded-[50%] flex items-center justify-center text-biyaLightBlue text-[28px] not-italic font-[600] leading-normal absolute ml-[15px] mt-[15px] cursor-pointer">
                      <MySVGs
                        index={4}
                        fill={"rgba(4, 157, 254, 1)"}
                        className="absolute left-[17px] top-[15px] w-[35px]"
                      />
                    </div>
                    <div className="w-[162.417px] h-[56.349px] flex-shrink-0 absolute bottom-[15px] left-[20px] text-white text-[15px] not-italic font-[600] leading-normal">
                      Airtime recharge
                    </div>
                    <MySVGs
                      index={12}
                      fill="white"
                      className={"absolute right-[10px] bottom-[25px]"}
                    />
                  </div>
                  <div
                    className="cursor-pointer mt-[30px] ml-[40px] w-[250.255px] h-[246.941px] flex-shrink-0 rounded-[10px] bg-biyaLightBlue relative"
                    onClick={() => decideFormStage(9)}
                  >
                    <div className="w-[70.579px] h-[70.579px] flex-shrink-0 bg-white3 rounded-[50%] flex items-center justify-center text-biyaLightBlue text-[28px] not-italic font-[600] leading-normal absolute ml-[15px] mt-[15px] cursor-pointer">
                      B
                    </div>
                    <div className="w-[162.417px] h-[56.349px] flex-shrink-0 absolute bottom-[15px] left-[20px] text-white text-[15px] not-italic font-[600] leading-normal">
                      Cable TV
                    </div>
                    <MySVGs
                      index={12}
                      fill="white"
                      className={"absolute right-[10px] bottom-[25px]"}
                    />
                  </div>
                  <div
                    className="cursor-pointer mt-[30px] ml-[40px] w-[250.255px] h-[246.941px] flex-shrink-0 rounded-[10px] bg-biyaLightBlue relative"
                    onClick={() => decideFormStage(10)}
                  >
                    <div className="w-[70.579px] h-[70.579px] flex-shrink-0 bg-white3 rounded-[50%] flex items-center justify-center text-biyaLightBlue text-[28px] not-italic font-[600] leading-normal absolute ml-[15px] mt-[15px] cursor-pointer">
                      <MySVGs
                        index={5}
                        fill={"rgba(4, 157, 254, 1)"}
                        className="absolute left-[17px] top-[15px] w-[35px]"
                      />
                    </div>
                    <div className="w-[162.417px] h-[56.349px] flex-shrink-0 absolute bottom-[15px] left-[20px] text-white text-[15px] not-italic font-[600] leading-normal">
                      Internet subscription
                    </div>
                    <MySVGs
                      index={12}
                      fill="white"
                      className={"absolute right-[10px] bottom-[25px]"}
                    />
                  </div>
                  {/* <div
                    className="cursor-pointer mt-[30px] ml-[40px] w-[250.255px] h-[246.941px] flex-shrink-0 rounded-[10px] bg-biyaLightBlue relative"
                    onClick={() => decideFormStage(7)}
                  >
                    <div className="w-[70.579px] h-[70.579px] flex-shrink-0 bg-white3 rounded-[50%] flex items-center justify-center text-biyaLightBlue text-[28px] not-italic font-[600] leading-normal absolute ml-[15px] mt-[15px] cursor-pointer">
                      <img
                        src={TrxIcon}
                        alt="bankTrxIcon"
                        className="absolute left-[17px] top-[15px] w-[35px]"
                      />
                    </div>
                    <div className="w-[162.417px] h-[56.349px] flex-shrink-0 absolute bottom-[15px] left-[20px] text-white text-[15px] not-italic font-[600] leading-normal">
                      Tolls
                    </div>
                    <MySVGs
                      index={12}
                      fill="white"
                      className={"absolute right-[10px] bottom-[25px]"}
                    />
                  </div> */}
                </div>
              )}
              {navIndex === 8 && (
                <div>
                  <div className="flex">
                    <div className="ml-[38px] my-[35px] rounded-[20px] bg-white w-[415px] h-[260px] flex-shrink-0 user-filter">
                      <div className="flex h-[60px] py-[5px] pl-[18px] pr-[5px]">
                        <div className="text-black text-[25px] not-italic font-[600] leading-normal">
                          Hey {name}! <br />
                          <span className="text-lightBlack text-center text-[12px] not-italic font-[400] leading-normal">
                            Scan this code to receive payemnts
                          </span>
                        </div>
                      </div>
                      <div className="pt-[25px] flex">
                        <div
                          className="py-[2px] pl-[18px] pr-[5px] text-black text-[25px] not-italic font-[700] leading-normal"
                          ref={qrCodeRef}
                        >
                          <QRCodeCanvas value="Olaiyapo Raphael Adetunji" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-center text-biyaLightBlue text-center text-lg not-italic font-[600] leading-normal">
                            {acctNum}
                            <img
                              className="ml-[6px] cursor-pointer"
                              src={copyIcon}
                              alt="copy"
                              onClick={() => handleCopyClick(acctNum)}
                            />
                          </div>
                          <div className="flex text-center pl-[30px] mt-[30px]">
                            <div className=" items-center">
                              <div className="w-[49.579px] h-[49.579px] flex-shrink-0 bg-biyaCircle rounded-[50%] flex items-center justify-center text-biyaLightBlue text-[28px] not-italic font-[600] leading-normal ml-[15px] mr-[20px] mt-[15px] cursor-pointer">
                                <img
                                  className=" w-[24px] left-[17px] top-[15px]"
                                  src={save}
                                  alt="save"
                                  onClick={handleSaveClick}
                                />
                              </div>
                              <div className="text-lightBlack text-center text-[13px] not-italic font-[400] leading-normal">
                                Save to gallery
                              </div>
                            </div>
                            <div className="items-center ml-[15px]">
                              <div className="w-[49.579px] h-[49.579px] flex-shrink-0 bg-biyaCircle rounded-[50%] flex items-center justify-center text-biyaLightBlue text-[28px] not-italic font-[600] leading-normal ml-[15px] mr-[20px] mt-[15px] cursor-pointer">
                                <img
                                  src={share}
                                  alt="share"
                                  className="w-[24px] left-[17px] top-[15px]"
                                />
                              </div>
                              <div className="text-lightBlack text-center text-[13px] not-italic font-[400] leading-normal">
                                Share QR code
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="ml-[38px] mb-[40px] w-[784px] h-[450px] flex-shrink-0 rounded-[20px] bg-white user-filter">
                    <br />
                    <div className="w-fit mt-[5px] ml-[20px] text-black text-lg not-italic font-[600] leading-normal">
                      Recent transactions
                    </div>
                    <Table />
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
      {isMobile && (
        <div className="overflow-y-auto relative h-screen">
          {navIndex === 6 && (
            <div
              className="bg-white2 z-[4] w-screen h-[93vh] overflow-y-auto pb-[150px]"
              style={{ zIndex: zindex }}
            >
              <div className="text-black text-left text-xl not-italic font-[600] leading-normal h-fit flex items-center mt-[40px] mb-[30px]">
                <img
                  className="ml-[25px] mr-[50px]"
                  src={backArrow}
                  alt="bankTrx"
                  onClick={() => setNavIndex(1)}
                />
                Withdraw Money
              </div>
              <ul className="w-screen pl-0">
                {WithdrawList("Withdraw via bank", 4, bankTrx, biyaTrxRArr)}
                {WithdrawList(
                  "Withdraw via payment service bank",
                  5,
                  TrxIcon,
                  biyaTrxRArr
                )}
              </ul>
            </div>
          )}
          {navIndex === 3 && (
            <div
              className="bg-white2 z-[4] w-screen h-[93vh] overflow-y-auto pb-[150px]"
              style={{ zIndex: zindex }}
            >
              <div className="text-black text-left text-xl not-italic font-[600] leading-normal h-fit flex items-center mt-[40px] mb-[30px]">
                <img
                  className="ml-[25px] mr-[50px]"
                  src={backArrow}
                  alt="bankTrx"
                  onClick={() => setNavIndex(1)}
                />
                Transfer Money
              </div>
              <ul className="w-screen pl-0">
                {TransferList(1, bankTrx, biyaTrxRArr, "Biya to Biya wallet")}
                {TransferList(
                  2,
                  biyaToBiya,
                  biyaTrxRArr,
                  "Other accounts and banks"
                )}
                {TransferList(
                  3,
                  TrxIcon,
                  biyaTrxRArr,
                  "Other payment service bank"
                )}
              </ul>
            </div>
          )}
          {navIndex === 7 && (
            <div
              className=" bg-white2 z-[4] w-screen h-[93vh] overflow-y-auto pb-[150px]"
              style={{ zIndex: zindex }}
            >
              <div className="text-black text-left text-xl not-italic font-[600] leading-normal h-fit flex items-center mt-[40px] mb-[30px]">
                <img
                  className="ml-[25px] mr-[50px]"
                  src={backArrow}
                  alt="bankTrx"
                  onClick={() => setNavIndex(1)}
                />
                Pay Bills
              </div>
              <ul className="w-screen pl-0">
                <li className="list-none ml-0">
                  <div className="flex items-center">
                    <div className="w-[55.579px] h-[55.579px] flex-shrink-0 bg-biyaCircle rounded-[50%] flex items-center mx-[15px] mt-[15px] cursor-pointer">
                      <img
                        src={bankTrx}
                        alt="bankTrx"
                        className="mx-auto w-[30px]"
                      />
                    </div>
                    <div className="max-w-[60vw]">Electricity postpaid</div>
                    <img
                      className="ml-auto mr-[25px]"
                      src={biyaTrxRArr}
                      alt="biyaTrxRArr2"
                      onClick={() => {
                        decideFormStage(6);
                        setNavIndex(7);
                        setZindex(3);
                      }}
                    />
                  </div>
                </li>
                <li className="list-none ml-0">
                  <div className="flex items-center">
                    <div className="w-[55.579px] h-[55.579px] flex-shrink-0 bg-biyaCircle rounded-[50%] flex items-center mx-[15px] mt-[15px] cursor-pointer">
                      <img
                        src={TrxIcon}
                        alt="bankTrxIcon"
                        className="mx-auto w-[30px]"
                      />
                    </div>
                    <div className="max-w-[60vw]">Electricity prepaid</div>
                    <img
                      className="ml-auto mr-[25px]"
                      src={biyaTrxRArr}
                      alt="biyaTrxRArr2"
                      onClick={() => {
                        decideFormStage(7);
                        // setNavIndex(7);
                        setZindex(3);
                      }}
                    />
                  </div>
                </li>
                <li className="list-none ml-0">
                  <div className="flex items-center">
                    <div className="w-[55.579px] h-[55.579px] flex-shrink-0 bg-biyaCircle rounded-[50%] flex items-center mx-[15px] mt-[15px] cursor-pointer">
                      <img
                        src={TrxIcon}
                        alt="bankTrxIcon"
                        className="mx-auto w-[30px]"
                      />
                    </div>
                    <div className="max-w-[60vw]">Airtime recharge</div>
                    <img
                      className="ml-auto mr-[25px]"
                      src={biyaTrxRArr}
                      alt="biyaTrxRArr2"
                      onClick={() => {
                        decideFormStage(8);
                        // setNavIndex(7);
                        setZindex(3);
                      }}
                    />
                  </div>
                </li>
                <li className="list-none ml-0">
                  <div className="flex items-center">
                    <div className="w-[55.579px] h-[55.579px] flex-shrink-0 bg-biyaCircle rounded-[50%] flex items-center mx-[15px] mt-[15px] cursor-pointer">
                      <img
                        src={TrxIcon}
                        alt="bankTrxIcon"
                        className="mx-auto w-[30px]"
                      />
                    </div>
                    <div className="max-w-[60vw]">Internet subscription</div>
                    <img
                      className="ml-auto mr-[25px]"
                      src={biyaTrxRArr}
                      alt="biyaTrxRArr2"
                      onClick={() => {
                        decideFormStage(10);
                        // setNavIndex(7);
                        setZindex(3);
                      }}
                    />
                  </div>
                </li>
                <li className="list-none ml-0">
                  <div className="flex items-center">
                    <div className="w-[55.579px] h-[55.579px] flex-shrink-0 bg-biyaCircle rounded-[50%] flex items-center mx-[15px] mt-[15px] cursor-pointer">
                      <img
                        src={TrxIcon}
                        alt="bankTrxIcon"
                        className="mx-auto w-[30px]"
                      />
                    </div>
                    <div className="max-w-[60vw]">Cable TV</div>
                    <img
                      className="ml-auto mr-[25px]"
                      src={biyaTrxRArr}
                      alt="biyaTrxRArr2"
                      onClick={() => {
                        decideFormStage(9);
                        // setNavIndex(7);
                        setZindex(3);
                      }}
                    />
                  </div>
                </li>
              </ul>
            </div>
          )}
          {navIndex === 8 && (
            <div className="w-screen" style={{ zIndex: zindex }}>
              <div className="text-center text-black text-xl not-italic font-[600] leading-normal h-fit mb-[30px] py-[20px] px-[5px] border-b border-gray-300">
                My QR
              </div>
              <div className="flex flex-col items-center">
                <div className=" text-lightBlack text-center text-xs not-italic font-[600] leading-normal">
                  My QR number
                </div>
                <div className=" text-biyaLightBlue text-center text-lg not-italic font-[600] leading-normal mb-[10px]">
                  {currentUser?.AccountNumber}
                </div>
                <div
                  className=" text-lightBlack text-center text-xs not-italic font-[400] leading-normal"
                  ref={qrCodeRef}
                >
                  <QRCodeCanvas value="Olaiyapo Raphael Adetunji" size={200} />
                </div>
                <div className="mt-2">Scan this code to receive payments</div>
                <div className="flex mt-[60px]">
                  <div className="my-0 mx-[10px]">
                    <div className="w-[60.579px] h-[60.579px] flex-shrink-0 bg-biyaCircle rounded-[50%] flex items-center justify-center text-biyaLightBlue text-2xl not-italic font-[600] leading-normal ml-[15px] mr-[20px] mt-[15px] cursor-pointer">
                      <img
                        src={save}
                        alt="save"
                        onClick={handleSaveClick}
                        className="w-[35px] left-[17px] top-[15px]"
                      />
                    </div>
                    <div className=" text-lightBlack text-center text-[10px] not-italic font-[400] leading-normal">
                      Save to gallery
                    </div>
                  </div>
                  <div className="my-0 mx-[10px] text-center">
                    <div className="w-[60.579px] h-[60.579px] flex-shrink-0 bg-biyaCircle rounded-[50%] flex items-center justify-center text-biyaLightBlue text-2xl not-italic font-[600] leading-normal ml-[15px] mr-[20px] mt-[15px] cursor-pointer">
                      <img
                        src={share}
                        alt="share"
                        className="w-[35px] left-[17px] top-[15px]"
                      />
                    </div>
                    <div className="text-lightBlack text-center text-[10px] not-italic font-[400] leading-normal">
                      Share QR code
                    </div>
                  </div>
                  {/* </div> */}
                </div>
              </div>
            </div>
          )}
          {navIndex === 1 && (
            <>
              <div className=" w-screen h-[20vh] flex-shrink-0 rounded-none bg-biyaLightBlue"></div>
              <div className=" absolute top-[65px] left-[3vw] z-[3] rounded-[20px] bg-white w-[94vw] h-[159px] user-filter">
                <div>
                  <div className=" flex h-[60px] py-[5px] pl-[18px] pr-[5px]">
                    <div className="text-black text-2xl not-italic font-[600] leading-normal">
                      Hey {name}!
                    </div>
                    <div className=" flex-1">
                      <div
                        className="flex items-center w-fit ml-auto m-[9px] text-biyaLightBlue text-center text-sm not-italic font-[400] leading-normal"
                        onClick={() => {
                          setCardFormIndex(11);
                          funcSetShowCard(!showCardForm);
                        }}
                      >
                        <img
                          src={walletIcon}
                          alt="WalletLogo1"
                          className="mt-0 mr-[5px] hover:cursor-pointer"
                        />{" "}
                        Add money
                        <img
                          src={rightArrow}
                          alt="rightArrow"
                          className="mt-0 hover:cursor-pointer"
                        />
                      </div>
                      <div
                        className="flex items-center w-fit ml-auto m-[9px] text-biyaLightBlue text-center text-sm not-italic font-[400] leading-normal"
                        onClick={() => {
                          setNavIndex(6);
                        }}
                      >
                        <img
                          src={walletIcon}
                          alt="WalletLogo1"
                          className="mt-0 mr-[5px] hover:cursor-pointer"
                        />{" "}
                        Withdraw money
                        <img
                          src={rightArrow}
                          alt="rightArrow"
                          className="mt-0 hover:cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="py-[2px] pr-[5px] pl-[18px] flex">
                    <div className="mt-[20px] text-black text-xl not-italic font-[700] leading-normal">
                      <span className="text-black text-[10px] not-italic font-[500] leading-normal">
                        Current balance
                      </span>{" "}
                      <br />{" "}
                      {showBalance
                        ? `₦${parseFloat(currentUser?.WalletBalance).toFixed(
                            2
                          )}`
                        : "************"}
                    </div>
                    {showBalance ? (
                      <BsEyeFill
                        onClick={() => setShowBalance(!showBalance)}
                        className="ml-auto mr-[25px] mt-[45px]"
                      />
                    ) : (
                      <BsEyeSlashFill
                        className="ml-auto mr-[25px] mt-[45px]"
                        onClick={() => setShowBalance(!showBalance)}
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className="rounded-none bg-white2 down-height">
                <br />
                <h3 className="text-black text-lg not-italic font-[600] leading-normal mt-[100px] mr-[15px] ml-[10px]">
                  Quick Actions
                </h3>
                <div className="w-screen overflow-x-auto mt-[-15px]">
                  <div className=" grid grid-cols-4 gap-0">
                    {IconHolder("Add Money", walletIcon, 11, 0)}
                    {IconHolder("Transfer Money", TrxIcon, 3, 0)}
                    {IconHolder("Recharge Airtime", "", 4, 4)}
                    {IconHolder("Buy Bundle", "", 5, 5)}
                    {IconHolder("Withdraw Cash", "", 6, 6)}
                    {IconHolder("Pay Bill", "", 7, 7)}
                    {IconHolder("Pay Merchant", "", -1, 9)}
                    {IconHolder("My QR", "", 8, 8)}
                  </div>
                </div>
                <div className="overflow-x-auto w-screen">
                  <div className=" w-fit flex">
                    <div className="my-[35px] rounded-[7px] bg-biyaRed w-[50vw] min-w-[170px] h-[80px] flex-shrink-0 user-filter mx-[10px] flex items-center justify-center">
                      <div className="text-white text-[13px] not-italic font-[600] leading-normal mr-[15px] pl-[10px]">
                        Manage Your <br /> Favourites
                      </div>
                      <img
                        src={favourite}
                        alt="favouriteIcon"
                        className=" inline-flex w-[40px] pt-[1.203px] pr-[2.558px] pb-[1.536px] pl-[0.181px] justify-center items-center flex-shrink-0 transform rotate-[360deg]"
                      />
                    </div>
                    <div className="my-[35px] rounded-[7px] bg-biyaLightBlue w-[50vw] min-w-[170px] h-[80px] flex items-center justify-center mr-[10px] flex-shrink-0 user-filter">
                      <div className="text-white text-[13px] not-italic font-[600] leading-normal mr-[15px] pl-[10px]">
                        Find An Agent
                      </div>
                      <img
                        src={agent}
                        alt="agentIcon"
                        className=" inline-flex w-[40px] transform rotate-[360deg] items-center justify-center flex-shrink-0 pt-[1.203px] pr-[2.558px] pb-[1.536px] pl-[0.181px]"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white2 mb-[50px] mt-[0px] w-screen h-fit flex-shrink-0">
                <br />
                <div className="w-fit mt-[0px] ml-[20px] text-black text-lg not-italic font-[600] leading-normal">
                  Recent transactions
                </div>
                <SmallTable />
              </div>
            </>
          )}
          <div className="bottom-box-shadow border fixed bottom-0 w-screen h-[9vh] flex-shrink-0 rounded-tl-[20px] rounded-tr-[20px] bg-white flex items-center z-[20]">
            <div
              className="my-0 mx-auto w-fit h-fit max-h-[8vh] flex flex-col text-center text-xs not-italic font-[500] leading-normal"
              onClick={() => setNavIndex(1)}
            >
              <MySVGs
                fill={navIndex === 1 ? "rgba(4, 157, 254, 1)" : "#263238"}
                index={1}
                className={"my-0 mx-auto w-[10vw]"}
              />
              Home
            </div>
            <div
              className="my-0 mx-auto w-fit h-fit max-h-[8vh] flex flex-col text-center text-xs not-italic font-[500] leading-normal"
              onClick={() => setNavIndex(2)}
            >
              <MySVGs
                fill={navIndex === 2 ? "rgba(4, 157, 254, 1)" : "#263238"}
                index={2}
                className={"my-0 mx-auto w-[10vw]"}
              />
              Scan & pay
            </div>
            <div
              className="my-0 mx-auto w-fit h-fit max-h-[8vh] flex flex-col text-center text-xs not-italic font-[500] leading-normal"
              onClick={() => setNavIndex(3)}
            >
              <MySVGs
                fill={navIndex === 3 ? "rgba(4, 157, 254, 1)" : "#263238"}
                index={3}
                className={"my-0 mx-auto w-[10vw]"}
              />
              Transfer
            </div>
            <div
              className="my-0 mx-auto w-fit h-fit max-h-[8vh] flex flex-col text-center text-xs not-italic font-[500] leading-normal"
              onClick={LogOut}
            >
              <FiLogOut
                style={{ fontSize: "20px" }}
                className={"my-0 mx-auto w-[10vw]"}
              />
              LogOut
            </div>
          </div>
        </div>
      )}
    </div>
  );

  function WithdrawList(text: string, index: number, img1: any, img2: any) {
    return (
      <li className="list-none ml-0">
        <div className="flex items-center">
          <div className="w-[55.579px] h-[55.579px] flex-shrink-0 bg-biyaCircle rounded-[50%] flex items-center mx-[15px] mt-[15px] cursor-pointer">
            <img src={img1} alt="bankTrx" className="mx-auto w-[30px]" />
          </div>
          <div className="max-w-[60vw]">{text}</div>
          <img
            className="ml-auto mr-[25px]"
            src={img2}
            alt="biyaTrxRArr2"
            onClick={() => {
              decideFormStage(index);
              // setNavIndex(6);
            }}
          />
        </div>
      </li>
    );
  }

  function TransferList(index: number, img1: any, img2: any, text: string) {
    return (
      <li className=" list-none ml-0">
        <div className="flex items-center">
          <div className="w-[55.579px] h-[55.579px] flex-shrink-0 bg-biyaCircle rounded-[50%] flex items-center mx-[15px] mt-[15px] cursor-pointer">
            <img src={img1} alt="bankTrx" className="mx-auto w-[30px]" />
          </div>
          <div className="max-w-[60vw]">{text}</div>
          <img
            className="ml-auto mr-[25px]"
            src={img2}
            alt="biyaTrxRArr2"
            onClick={() => {
              decideFormStage(index);
              // setNavIndex(7);
              setZindex(3);
            }}
          />
        </div>
      </li>
    );
  }

  function IconHolder(
    text: string,
    icon: string,
    index: number,
    svgIndex: number
  ) {
    return (
      <div
        className="mt-[15px] mx-auto w-[85px] h-fit flex-shrink-0 rounded-[10px] bg-none"
        onClick={() => {
          setCardFormIndex(index);
          if (index === 11) {
            setNavIndex(1);
            funcSetShowCard(!showCardForm);
          } else if (index !== 11) {
            setNavIndex(index);
          }
        }}
      >
        <div className="w-[70.579px] h-[70.579px] flex-shrink-0 bg-biyaCircle rounded-[50%] flex items-center justify-center text-biyaLightBlue text-[28px] not-italic font-[600] leading-normal ml-[10px] mt-[15px] cursor-pointer">
          {icon !== "" ? (
            <img src={icon} alt="bankTrxIcon" className="w-[35px]" />
          ) : (
            <MySVGs index={svgIndex} fill="rgba(4, 157, 254, 1)" />
          )}
        </div>
        <div className="text-center text-lightBlack text-[13px] not-italic font-[400] leading-normal">
          {text}
        </div>
      </div>
    );
  }

  function navComponent(content: string, index: number) {
    return (
      <div
        className="w-fit my-[10px] flex items-center hover:cursor-pointer"
        onClick={() => {
          if (index !== 4 || navIndex !== 5) {
            setShowCardForm(false);
          }
          setNavIndex(index);
        }}
      >
        <MySVGs
          index={index}
          fill={navIndex === index ? "rgba(4, 157, 254, 1)" : "#263238"}
          className={"w-[30px] my-[5px] ml-[20px] mr-[10px]"}
        />
        <div
          style={{
            color: `${navIndex === index ? "rgba(4, 157, 254, 1)" : "#263238"}`,
          }}
        >
          {content}
        </div>
      </div>
    );
  }
};
