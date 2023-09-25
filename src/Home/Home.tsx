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

export const Home = () => {
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
            <div className="card"></div>
            <div className="card"></div>
            <div className="card"></div>
          </div>
          <div className="recent-transaction"></div>
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
