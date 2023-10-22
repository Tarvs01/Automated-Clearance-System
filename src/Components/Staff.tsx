import React, { useEffect, useState, FormEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Defaulter from "./Defaulter";
import { StaffData } from "./types";
import { type } from "os";
import { error } from "console";

function Staff() {
  const navigate = useNavigate();
  const [staffData, setStaffData] = useState<StaffData>({
    dept: "la",
    defaulters: [],
  });

  useEffect(() => {
    if (sessionStorage) {
      let data = sessionStorage.getItem("ACS");
      
      if (!data) {
        navigate("/staff-login");
      } else {
        axios.get(`http://192.168.56.1:5000/getstaffdefaulters/${data}`).then((response) => {
          setStaffData({dept: data, defaulters: JSON.parse(response.data.data[0].defaulters)})
        }).catch((error) => {
          console.log(error);
        })
      }
    }
  }, []);

  let dummyData = [
    {
      matricNumber: "cpe-17-3148",
      offences: [
        {
          description:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa perspiciatis sequi commodi mollitia quaerat architecto exercitationem minima assumenda similique ipsum",
          date: "24/05/2022",
        },
        {
          description:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus, dolorum",
          date: "12/02/2023",
        },
      ],
    },
    {
      matricNumber: "cpe-17-3142",
      offences: [
        {
          decription:
            "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ratione nihil voluptatibus aliquam consectetur, quidem sapiente",
          date: "31/01/2023",
        },
      ],
    },
  ];

  const [newDefaulterData, setNewDefaulterData] = useState({
    matricNumber: "",
    description: "",
    date: "",
  });

  function addDefaulterSubmit(e: FormEvent) {
    e.preventDefault();
    console.log(newDefaulterData);
    let offences = [];
    offences.push({
      id: 0,
      description: newDefaulterData.description,
      date: newDefaulterData.date,
    });

    let newDefaulter = {
      id: staffData.defaulters.length,
      matricNumber: newDefaulterData.matricNumber,
      offences: offences,
    };

    axios.put("http://192.168.56.1:5000/addnewdefaulter", { dept: staffData.dept, matricNumber: newDefaulter.matricNumber.replaceAll("/", "-") }).then((response) => {
      console.log(response);
    }).catch((error) => {
      console.log(error);
      
    })

    setStaffData((prevData) => {
      return {
        dept: staffData.dept,
        defaulters: [...staffData.defaulters, newDefaulter],
      };
    });
  }

  function addDefaulterChange(e: ChangeEvent<HTMLInputElement>) {
    setNewDefaulterData({
      ...newDefaulterData,
      [e.target.name]: e.target.value,
    });
  }

  function approveAll() {
    axios.put(`http://192.168.56.1:5000/approveall/${staffData.dept}`, {}).then((response) => {
      
    }).catch((err) => {
      console.log(err);
    })
  }

  useEffect(() => {
    console.log("About to update staff defaulters");
    axios
      .post("http://192.168.56.1:5000/updatestaffdefaulters", staffData)
      .then((response) => {
        console.log("Updated staff defaulters")
      })
      .catch((error) => {
        console.log(error);
      });
  }, [staffData]);

  return (
    <div>
      <h2>Clearance for {staffData.dept}</h2>

      <section>
        <h2>Defaulters</h2>
        {staffData.defaulters.length === 0 && <p>There are no defaulters</p>}
        {staffData.defaulters.length !== 0 &&
          staffData.defaulters.map((value, index) => {
            return (
              <Defaulter key={index} props={value} updateState={setStaffData} />
            );
          })}
      </section>

      <section>
        <form onSubmit={addDefaulterSubmit}>
          <h2>Add Defaulter</h2>
          <label htmlFor="matricNumber">Matric Number</label>
          <input
            type="text"
            name="matricNumber"
            id="matricNumber"
            onChange={addDefaulterChange}
          />

          <label htmlFor="description">Description</label>
          <input
            type="text"
            name="description"
            id="description"
            onChange={addDefaulterChange}
          />

          <label htmlFor="date">Date</label>
          <input
            type="date"
            name="date"
            id="date"
            onChange={addDefaulterChange}
          />

          <button type="submit">Submit</button>
        </form>

        <button onClick={approveAll}>Approve All</button>
      </section>
    </div>
  );
}

export default Staff;
