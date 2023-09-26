import biyaLogo from "../Images/biyaLogo.png";
import homeIcon from "../Images/HomeButton.svg";
import scanPayIcon from "../Images/Scanpay.svg";
import transferIcon from "../Images/Transfer.svg";
import airtimeIcon from "../Images/Airtime.svg";
import bundleIcon from "../Images/Bundle.svg";
import withdrawIcon from "../Images/Withdraw.svg";
import payBillIcon from "../Images/PayBill.svg";
import myQrIcon from "../Images/MyQR.svg";
import merchantIcon from "../Images/Merchant.svg";
import settingsIcon from "../Images/Settings.svg";
import dnArrow from "../Images/DownArrow.svg";
import userPic from "../Images/User.svg";
import agent from "../Images/Agent.svg";
import favourite from "../Images/Favorite.svg";
import walletIcon from "../Images/Wallet.svg";
import rightArrow from "../Images/RightArrow.svg";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { useState } from "react";
import Table from "./Table";

export const Home = () => {
  const [showBalance, setShowBalance] = useState<boolean>(false);

  return (
    <div className="Home">
      <div className="left-div">
        <img src={biyaLogo} alt="biyaLogo1" />
        <div className="side-bar">
          {navComponent(homeIcon, "homeIcon", "Home")}
          {navComponent(scanPayIcon, "transferIcon", "Scan & pay")}
          {navComponent(transferIcon, "transferIcon", "Transfer")}
          {navComponent(airtimeIcon, "transferIcon", "Airtime")}
          {navComponent(bundleIcon, "transferIcon", "Buy Bundle")}
          {navComponent(withdrawIcon, "transferIcon", "Withdraw")}
          {navComponent(payBillIcon, "transferIcon", "Pay bill")}
          {navComponent(myQrIcon, "transferIcon", "My QR")}
          {navComponent(merchantIcon, "transferIcon", "Pay merchant")}
          {navComponent(settingsIcon, "transferIcon", "Settings")}
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
            Welcome, Deji <img src={dnArrow} alt={"dnArrow"} />
          </div>
        </div>
        <div className="right-content">
          <div className="card-holder">
            <div className="card">
              <div className="name">
                <div className="left">
                  Hey Amina!
                  {showBalance ? (
                    <BsEyeFill onClick={() => setShowBalance(!showBalance)} />
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
                    <img src={walletIcon} alt="WalletLogo1" /> Withdraw money
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
            <Table />
          </div>
        </div>
      </div>
    </div>
  );

  function navComponent(icon: any, alt: string, content: string) {
    return (
      <div className="side-component">
        <img src={icon} alt={alt} />
        {content}
      </div>
    );
  }
};
