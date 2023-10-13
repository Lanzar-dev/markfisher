import biyaLogo from "../Images/biyaLogo.png";
import dnArrow from "../Images/DownArrow.svg";
import userPic from "../Images/User.svg";
import agent from "../Images/Agent.svg";
import favourite from "../Images/Favorite.svg";
import walletIcon from "../Images/Wallet.svg";
import rightArrow from "../Images/RightArrow.svg";
import biyaTrxRArr from "../Images/BiyaTrxRArrow.svg";
import bankTrx from "../Images/BankTrx.svg";
import TrxIcon from "../Images/TrxIcon.svg";
// import airtimeIcon from "../Images/Airtime.svg";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { useEffect, useRef, useState } from "react";
import Table from "./Table";
import { BankTransferForm } from "./BankTransferForm";
import { BiyaTransferForm } from "./BiyaTransferForm";
import { PSBTransferForm } from "./PSBTransferForm";
import { MySVGs } from "../SVGs/MySVGs";
import { TollForm } from "./TollForm";
import { AirtimeForm } from "./AirtimeForm";
import { BundleForm } from "./BundleForm";
import save from "../Images/SaveToGallery.svg";
import share from "../Images/ShareQrCode.svg";
import copyIcon from "../Images/Copy.svg";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import copy from "clipboard-copy";
import { useNavigate } from "react-router-dom";
import { MediaQueryMatchers, useMediaQuery } from "react-responsive";
import SmallTable from "./SmallTable";
import { ElectricityForm } from "./ElectricityForm";
import { CableTvForm } from "./CableTvForm";

export const Home = () => {
  const navigate = useNavigate();
  const [showBalance, setShowBalance] = useState<boolean>(false);
  const [navIndex, setNavIndex] = useState<number>(1);
  const [showCardForm, setShowCardForm] = useState<boolean>(false);
  const [cardFormIndex, setCardFormIndex] = useState<number>(1);
  const [showUserInfo, setShowUserInfo] = useState<boolean>(false);
  const isMobile = useMediaQuery({ maxWidth: 600 } as MediaQueryMatchers);
  // const isDesktop = useMediaQuery({ minWidth: 768 } as MediaQueryMatchers);

  const decideFormStage = (index: number) => {
    setCardFormIndex(index);
    setShowCardForm(!showCardForm);
  };

  useEffect(() => {
    if (navIndex === 5 || navIndex === 4) {
      if (navIndex === 5) setCardFormIndex(6);
      if (navIndex === 4) setCardFormIndex(4);
      // setShowCardForm((preValue) => !preValue);
      setShowCardForm(true);
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
    navigate("/");
  };

  const funcSetShowCard = (isBool: boolean) => {
    if (navIndex === 5 || navIndex === 4) setNavIndex(1);
    setShowCardForm(isBool);
  };

  return (
    <div className="Home">
      {!isMobile && (
        <>
          {showCardForm && (
            <div className="card-forms">
              <div className="card-forms-title">
                <div className="biyaCircle">
                  {cardFormIndex === 1 && "B"}
                  {cardFormIndex === 2 && <img src={bankTrx} alt="bankTrx" />}
                  {cardFormIndex === 4 && (
                    <MySVGs
                      index={cardFormIndex}
                      fill={"rgba(4, 157, 254, 1)"}
                    />
                  )}
                  {cardFormIndex === 3 && <img src={TrxIcon} alt="TrxIcon" />}
                  {cardFormIndex === 6 && (
                    <MySVGs
                      index={cardFormIndex - 1}
                      fill={"rgba(4, 157, 254, 1)"}
                    />
                  )}
                  {cardFormIndex === 7 && <img src={TrxIcon} alt="TrxIcon" />}
                </div>
                <div className="title">
                  {cardFormIndex === 1 && "Biyawa to Biyawa"}
                  {cardFormIndex === 2 && "Electricity postpaid"}
                  {cardFormIndex === 3 && "Electricity prepaid"}
                  {cardFormIndex === 4 && "Airtime"}
                  {cardFormIndex === 6 && "Buy a bundle"}
                  {cardFormIndex === 7 && "Tolls"}
                </div>
              </div>
              {cardFormIndex === 1 && (
                <BiyaTransferForm fnShowCardForm={funcSetShowCard} />
              )}
              {cardFormIndex === 2 && (
                <ElectricityForm
                  fnShowCardForm={funcSetShowCard}
                  isPostpaid={true}
                />
              )}
              {cardFormIndex === 3 && (
                <ElectricityForm
                  fnShowCardForm={funcSetShowCard}
                  isPostpaid={false}
                />
              )}
              {cardFormIndex === 4 && (
                <AirtimeForm fnShowCardForm={funcSetShowCard} />
              )}
              {cardFormIndex === 5 && (
                <CableTvForm
                  fnShowCardForm={funcSetShowCard}
                  isPostpaid={false}
                />
              )}
              {cardFormIndex === 6 && (
                <BundleForm fnShowCardForm={funcSetShowCard} />
              )}
              {cardFormIndex === 7 && <TollForm />}
            </div>
          )}
          <div className="left-div">
            <img
              src={biyaLogo}
              alt="biyaLogo1"
              onClick={() => setNavIndex(1)}
            />
            <div className="side-bar">
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
            <div className="user">
              <div className="holder">
                <div
                  className="userImg"
                  style={{
                    width: "40px",
                    height: "40px",
                    flexShrink: "0",
                    borderRadius: "40px",
                    background: `url(${userPic}), lightgray 50% / cover no-repeat`,
                  }}
                ></div>
                Welcome, Deji{" "}
                <img
                  src={dnArrow}
                  alt={"dnArrow"}
                  onClick={() => setShowUserInfo(!showUserInfo)}
                />
              </div>
              {showUserInfo && (
                <div className="user-info">
                  <ul>
                    <li>Profile</li>
                    <li onClick={LogOut}>Log out</li>
                  </ul>
                </div>
              )}
            </div>
            <div className="right-content">
              {(navIndex === 1 || navIndex === 5 || navIndex === 4) && (
                <div className="home">
                  <div className="card-holder">
                    <div className="card">
                      <div className="name">
                        <div className="left">
                          Hey Amina!
                          {showBalance ? (
                            <BsEyeFill
                              onClick={() => setShowBalance(!showBalance)}
                            />
                          ) : (
                            <BsEyeSlashFill
                              onClick={() => setShowBalance(!showBalance)}
                            />
                          )}
                        </div>
                        <div className="right">
                          <div className="add">
                            <img src={walletIcon} alt="WalletLogo1" /> Add money
                            <img src={rightArrow} alt="rightArrow" />
                          </div>
                          <div className="add">
                            <img src={walletIcon} alt="WalletLogo1" /> Withdraw
                            money
                            <img src={rightArrow} alt="rightArrow" />
                          </div>
                        </div>
                      </div>
                      <div className="amount">
                        <span>Current balance</span> <br />{" "}
                        {showBalance ? "NGN267,679.00" : "************"}
                      </div>
                    </div>
                    <div className="card">
                      <div>
                        Manage Your <br /> Favourites
                      </div>
                      <img src={favourite} alt="favouriteIcon" />
                    </div>
                    <div className="card">
                      <div>Find An Agent</div>
                      <img src={agent} alt="agentIcon" />
                    </div>
                  </div>
                  <div className="recent-transaction">
                    <br />
                    <div className="title">Recent transactions</div>
                    <Table />
                  </div>
                </div>
              )}
              {navIndex === 2 && <div className="scanpay"></div>}
              {navIndex === 3 && (
                <div className="transfer">
                  <div className="card">
                    <div className="biyaCircle">B</div>
                    <div className="biyaTrx">Biyawa to Biyawa wallet</div>
                    <img
                      src={biyaTrxRArr}
                      alt="biyaTrxRArr1"
                      onClick={() => decideFormStage(1)}
                    />
                  </div>
                  <div className="card">
                    <div className="biyaCircle">
                      <img src={bankTrx} alt="bankTrx" />
                    </div>
                    <div className="biyaTrx">Other accounts and banks</div>
                    <img
                      src={biyaTrxRArr}
                      alt="biyaTrxRArr2"
                      onClick={() => decideFormStage(2)}
                    />
                  </div>
                  <div className="card">
                    <div className="biyaCircle">
                      <img src={TrxIcon} alt="bankTrxIcon" />
                    </div>
                    <div className="biyaTrx">Other payment service bank</div>
                    <img
                      src={biyaTrxRArr}
                      alt="biyaTrxRArr3"
                      onClick={() => decideFormStage(3)}
                    />
                  </div>
                </div>
              )}
              {navIndex === 4 && <></>}
              {navIndex === 5 && <></>}
              {navIndex === 6 && (
                <div className="withdraw">
                  <div className="card">
                    <div className="biyaCircle">
                      <img src={bankTrx} alt="bankTrx" />
                    </div>
                    <div className="biyaTrx">Withdraw via bank</div>
                    <img
                      src={biyaTrxRArr}
                      alt="biyaTrxRArr2"
                      onClick={() => decideFormStage(2)}
                    />
                  </div>
                  <div className="card">
                    <div className="biyaCircle">
                      <img src={TrxIcon} alt="bankTrxIcon" />
                    </div>
                    <div className="biyaTrx">
                      Withdraw via payment service bank
                    </div>
                    <img
                      src={biyaTrxRArr}
                      alt="biyaTrxRArr3"
                      onClick={() => decideFormStage(3)}
                    />
                  </div>
                </div>
              )}
              {navIndex === 7 && (
                <div className="paybill">
                  <div className="card">
                    <div className="biyaCircle">B</div>
                    <div className="biyaTrx">Solar</div>
                    <img
                      src={biyaTrxRArr}
                      alt="biyaTrxRArr1"
                      onClick={() => decideFormStage(1)}
                    />
                  </div>
                  <div className="card">
                    <div className="biyaCircle">
                      <img src={TrxIcon} alt="bankTrxIcon" />
                    </div>
                    <div className="biyaTrx">Electricity postpaid</div>
                    <img
                      src={biyaTrxRArr}
                      alt="biyaTrxRArr2"
                      onClick={() => decideFormStage(2)}
                    />
                  </div>
                  <div className="card">
                    <div className="biyaCircle">
                      <img src={TrxIcon} alt="bankTrxIcon" />
                    </div>
                    <div className="biyaTrx">Electricity prepaid</div>
                    <img
                      src={biyaTrxRArr}
                      alt="biyaTrxRArr3"
                      onClick={() => decideFormStage(3)}
                    />
                  </div>
                  <div className="card">
                    <div className="biyaCircle">
                      <MySVGs index={4} fill={"rgba(4, 157, 254, 1)"} />
                    </div>
                    <div className="biyaTrx">Airtime recharge</div>
                    <img
                      src={biyaTrxRArr}
                      alt="biyaTrxRArr3"
                      onClick={() => decideFormStage(4)}
                    />
                  </div>
                  <div className="card">
                    <div className="biyaCircle">B</div>
                    <div className="biyaTrx">Cable TV</div>
                    <img
                      src={biyaTrxRArr}
                      alt="biyaTrxRArr3"
                      onClick={() => decideFormStage(5)}
                    />
                  </div>
                  <div className="card">
                    <div className="biyaCircle">
                      <MySVGs index={5} fill={"rgba(4, 157, 254, 1)"} />
                    </div>
                    <div className="biyaTrx">Internet subscription</div>
                    <img
                      src={biyaTrxRArr}
                      alt="biyaTrxRArr3"
                      onClick={() => decideFormStage(6)}
                    />
                  </div>
                  <div className="card">
                    <div className="biyaCircle">
                      <img src={TrxIcon} alt="bankTrxIcon" />
                    </div>
                    <div className="biyaTrx">Tolls</div>
                    <img
                      src={biyaTrxRArr}
                      alt="biyaTrxRArr3"
                      onClick={() => decideFormStage(7)}
                    />
                  </div>
                </div>
              )}
              {navIndex === 8 && (
                <div className="myQr">
                  <div className="card-holder">
                    <div className="card">
                      <div className="name">
                        <div className="left">
                          Hey Amina! <br />
                          <span>Scan this code to receive payemnts</span>
                        </div>
                      </div>
                      <div className="qr-holder">
                        <div className="qr" ref={qrCodeRef}>
                          <QRCodeCanvas value="Olaiyapo Raphael Adetunji" />
                        </div>
                        <div className="num-holder">
                          <div className="number">
                            2372957524034720
                            <img
                              src={copyIcon}
                              alt="copy"
                              onClick={() =>
                                handleCopyClick("2372957524034720")
                              }
                            />
                          </div>
                          <div className="save-share">
                            <div className="save">
                              <div className="biyaCircle">
                                <img
                                  src={save}
                                  alt="save"
                                  onClick={handleSaveClick}
                                />
                              </div>
                              <div className="title">Save to gallery</div>
                            </div>
                            <div className="save">
                              <div className="biyaCircle">
                                <img src={share} alt="share" />
                              </div>
                              <div className="title">Share QR code</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="recent-transaction">
                    <br />
                    <div className="title">Recent transactions</div>
                    <Table />
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
      {isMobile && (
        <div className="xs-screen">
          <div className="top"></div>
          <div className="user">
            <div className="card">
              <div className="name">
                <div className="left">Hey Amina!</div>
                <div className="right">
                  <div className="add">
                    <img src={walletIcon} alt="WalletLogo1" /> Add money
                    <img src={rightArrow} alt="rightArrow" />
                  </div>
                  <div className="add">
                    <img src={walletIcon} alt="WalletLogo1" /> Withdraw money
                    <img src={rightArrow} alt="rightArrow" />
                  </div>
                </div>
              </div>
              <div className="amount">
                <div>
                  <span>Current balance</span> <br />{" "}
                  {showBalance ? "NGN267,679.00" : "************"}
                </div>
                {showBalance ? (
                  <BsEyeFill onClick={() => setShowBalance(!showBalance)} />
                ) : (
                  <BsEyeSlashFill
                    onClick={() => setShowBalance(!showBalance)}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="down">
            <br />
            <h3>Quick Actions</h3>
            <div className="icons">
              <div className="xs-grid">
                <div className="card">
                  <div className="biyaCircle">
                    <img src={walletIcon} alt="bankTrxIcon" />
                  </div>
                  <div className="biyaTrx">Add Money</div>
                </div>
                <div className="card">
                  <div className="biyaCircle">
                    <img src={TrxIcon} alt="bankTrxIcon" />
                  </div>
                  <div className="biyaTrx">Transfer Money</div>
                </div>
                <div className="card">
                  <div className="biyaCircle">
                    {/* <img src={airtimeIcon} alt="bankTrxIcon" /> */}
                    <MySVGs index={4} fill="rgba(4, 157, 254, 1)" />
                  </div>
                  <div className="biyaTrx">Recharge Airtime</div>
                </div>
                <div className="card">
                  <div className="biyaCircle">
                    {/* <img src={walletIcon} alt="bankTrxIcon" /> */}
                    <MySVGs index={5} fill="rgba(4, 157, 254, 1)" />
                  </div>
                  <div className="biyaTrx">Buy Bundle</div>
                </div>
                <div className="card">
                  <div className="biyaCircle">
                    {/* <img src={walletIcon} alt="bankTrxIcon" /> */}
                    <MySVGs index={6} fill="rgba(4, 157, 254, 1)" />
                  </div>
                  <div className="biyaTrx">Withdraw Cash</div>
                </div>
                <div className="card">
                  <div className="biyaCircle">
                    {/* <img src={walletIcon} alt="bankTrxIcon" /> */}
                    <MySVGs index={7} fill="rgba(4, 157, 254, 1)" />
                  </div>
                  <div className="biyaTrx">Pay Bill</div>
                </div>
                <div className="card">
                  <div className="biyaCircle">
                    {/* <img src={walletIcon} alt="bankTrxIcon" /> */}
                    <MySVGs index={9} fill="rgba(4, 157, 254, 1)" />
                  </div>
                  <div className="biyaTrx">Pay Merchant</div>
                </div>
                <div className="card">
                  <div className="biyaCircle">
                    {/* <img src={walletIcon} alt="bankTrxIcon" /> */}
                    <MySVGs index={8} fill="rgba(4, 157, 254, 1)" />
                  </div>
                  <div className="biyaTrx">My QR</div>
                </div>
              </div>
            </div>

            <div className="card-2">
              <div>
                <div className="card">
                  <div>
                    Manage Your <br /> Favourites
                  </div>
                  <img src={favourite} alt="favouriteIcon" />
                </div>
                <div className="card">
                  <div>Find An Agent</div>
                  <img src={agent} alt="agentIcon" />
                </div>
              </div>
            </div>
          </div>
          <div className="small-table">
            <br />
            <div className="title">Recent transactions</div>
            <SmallTable />
            {/* <br /> */}
          </div>
        </div>
      )}
    </div>
  );

  function navComponent(content: string, index: number) {
    return (
      <div
        className="side-component"
        onClick={() => {
          setNavIndex(index);
        }}
      >
        <MySVGs
          index={index}
          fill={navIndex === index ? "rgba(4, 157, 254, 1)" : "#263238"}
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
