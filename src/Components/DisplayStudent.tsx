import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function DisplayStudent() {
  const matricNumber = useParams();
  const [studentData, setStudentData] = useState({
    matricNumber: "",
    library: "",
    crc: "",
    deptLab: "",
    deptOfficer: "",
    deptHod: "",
  });

  console.log(matricNumber);

  useEffect(() => {
    axios
      .post("http://192.168.56.1:5000/getsinglestudent", matricNumber)
      .then((response) => {
        setStudentData((prevData) => {
          return { ...prevData, ...response.data[0] };
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div>
      <h2 className="student-header">
        Clearance Details for {matricNumber.matricNumber?.replaceAll("-", "/").toUpperCase()}
      </h2>
      <table>
        <thead>
          <tr>
            <th>Department</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Department Lab</td>
            <td className={studentData.deptLab}>{studentData.deptLab}</td>
          </tr>
          <tr>
            <td>Department Officer</td>
            <td className={studentData.deptOfficer}>
              {studentData.deptOfficer}
            </td>
          </tr>
          <tr>
            <td>Department HOD</td>
            <td className={studentData.deptHod}>{studentData.deptHod}</td>
          </tr>
          <tr>
            <td>Library</td>
            <td className={studentData.library}>{studentData.library}</td>
          </tr>
          <tr>
            <td>CRC</td>
            <td className={studentData.crc}>{studentData.crc}</td>
          </tr>
        </tbody>
      </table>

      <ul className="legend">
        <li><h3 className="default">Default</h3>: There are no issues with the department and the department has not approved your clearance</li>
        <li><h3 className="UI">Unrectified Issues</h3>: You have unsettled issue(s) with the department</li>
        <li><h3 className="approved">Approved</h3>: The department has approved your clearance</li>
      </ul>
    </div>
  );
}

export default DisplayStudent;
