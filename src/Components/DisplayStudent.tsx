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
      <h2 className="student-header">Clearance Details for {matricNumber.matricNumber?.replaceAll("-", "/")}</h2>
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
            <td>{studentData.deptLab}</td>
          </tr>
          <tr>
            <td>Department Officer</td>
            <td>{studentData.deptOfficer}</td>
          </tr>
          <tr>
            <td>Department HOD</td>
            <td>{studentData.deptHod}</td>
          </tr>
          <tr>
            <td>Library</td>
            <td>{studentData.library}</td>
          </tr>
          <tr>
            <td>CRC</td>
            <td>{studentData.crc}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default DisplayStudent;
