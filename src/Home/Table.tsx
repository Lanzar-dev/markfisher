import React, { useState } from "react";
import rArrow from "../Images/TabRArrow.svg";
import lArrow from "../Images/TabLArrow.svg";
import trxUserBg from "../Images/TrxUser.svg";
import trxUser from "../Images/trxxUser.png";
import sporty from "../Images/Sporty.svg";
import sportyIcon from "../Images/sportyIcon.png";
import spotify from "../Images/Spotify.svg";
import spotifyIcon from "../Images/spotifyIcon.png";

export const Table = () => {
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [data, setdata] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState(1);
  // const itemsPerPage = 5;

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(data?.length / rowsPerPage);
  const indexOfLastItem = currentPage * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;

  return (
    <div className="table-container">
      <table>
        <thead className="head">
          {/* <tr>
            <th>Doctor name</th>
            <th>Type</th>
            <th>Date</th>
            <th>Status</th>
          </tr> */}
        </thead>
        <tbody>
          <tr>
            <td className="table-cell">
              <div
                style={{
                  background: `url(${trxUserBg}), lightgray 50% / cover no-repeat`,
                }}
              >
                <img src={trxUser} alt="trxUser" />
              </div>
            </td>
            <td className="table-cell">Jimi Dayo</td>
            <td className="table-cell">Dec 7th 12:16 PM</td>
            <td className={`table-cell `}>Succesful</td>
            <td className={`table-cell`}>+NGN50,000</td>
          </tr>
          <tr>
            <td className="table-cell">
              <div
                style={{
                  background: `url(${sporty}), lightgray 50% / cover no-repeat`,
                }}
              >
                <img src={sportyIcon} alt="trxUser" />
              </div>
            </td>
            <td className="table-cell">Sportybet</td>
            <td className="table-cell">Dec 7th 12:16 PM</td>
            <td className={`table-cell `}>Succesful</td>
            <td className={`table-cell`}>-NGN400</td>
          </tr>
          <tr>
            <td className="table-cell">
              <div
                style={{
                  background: `url(${spotify}), lightgray 50% / cover no-repeat`,
                }}
              >
                <img src={spotifyIcon} alt="trxUser" />
              </div>
            </td>
            <td className="table-cell">Spotify</td>
            <td className="table-cell">Dec 7th 12:16 PM</td>
            <td className={`table-cell `}>Failed</td>
            <td className={`table-cell`}>-NGN1,999</td>
          </tr>
        </tbody>
      </table>

      <div className="pagination">
        <img src={lArrow} alt="tabLArrow" />
        <span>{`${indexOfFirstItem + 1} of ${totalPages}`}</span>
        <img src={rArrow} alt="tabRArrow" />
      </div>
    </div>
  );
};

export default Table;
