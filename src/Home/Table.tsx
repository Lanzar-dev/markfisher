import React, { useState } from "react";
import rArrow from "../Images/TabRArrow.svg";
import lArrow from "../Images/TabLArrow.svg";

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
            <td className="table-cell">Raphael Adetuni</td>
            <td className="table-cell">Raphael Adetuni</td>
            <td className="table-cell">Raphael Adetuni</td>
            <td className={`table-cell `}>Raphael Adetuni</td>
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
