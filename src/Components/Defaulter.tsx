import React, { useState, FormEvent, ChangeEvent } from "react";
import { DefaulterDetails, StaffData } from "./types";
import axios from "axios";

function Defaulter({ props, updateState }: DefaulterDetails) {
  const [isOpen, setIsOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [offenceDetails, setOffenceDetails] = useState({
    description: "",
    date: "",
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    updateState((prevState) => {
      let newState: StaffData = { dept: "", defaulters: [] };
      newState.dept = prevState.dept;
      newState.defaulters = prevState.defaulters.map((val) => {
        if (val.id === props.id) {
          val.offences.push({
            id: val.offences.length,
            description: offenceDetails.description,
            date: offenceDetails.date,
          });
        }
        return val;
      });
      return newState;
    });

    setIsFormOpen(!isFormOpen);
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setOffenceDetails({ ...offenceDetails, [e.target.name]: e.target.value });
  }

  function removeOffence(id: number) {
    updateState((prevState) => {
      let newState: StaffData = { dept: "", defaulters: [] };
      newState.dept = prevState.dept;
      newState.defaulters = prevState.defaulters.map((val) => {
        if (val.id === props.id) {
          val.offences = val.offences.filter((value) => value.id !== id);
        }
        return val;
      });

      let clearedMatricNumber = "";
      newState.defaulters = newState.defaulters.filter(
        (val) => {
          if (val.offences.length === 0) {
            clearedMatricNumber = val.matricNumber.replaceAll("/", "-");
            return false;
          }
          return true;
        }
      );

      if (clearedMatricNumber) {
        console.log("About to call clear defaulter for: ", clearedMatricNumber);
        axios.put("http://192.168.56.1:5000/removesingledefaulter", { dept: prevState.dept, matricNumber: clearedMatricNumber }).then((response) => {
          console.log("Called clear defaulter for: ", clearedMatricNumber);
          console.log(response);
        }).catch((error) => {
          console.log(error);
        })
      }
      
      return newState;
    });
  }

  return (
    <div className="defaulter-cont">
      <div className="main-cont">
        <div className="matric-number-tile" onClick={() => setIsOpen(!isOpen)}>
          <p>{props.matricNumber}</p>
          <div className="arrow" style={{transform: `rotate(${isOpen ? "0deg" : "-90deg"})`}}>
            <svg
              height="57.5"
              viewBox="0 0 95 57.5"
              width="95"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 10.1C0 7.5 1 5 2.9 3 6.8-.9 13.2-.9 17.1 3l30.4 30.3L77.9 2.9C81.8-1 88.2-1 92.1 2.9s3.9 10.3 0 14.2L54.6 54.6c-1.9 1.9-4.4 2.9-7.1 2.9s-5.2-1.1-7.1-2.9L2.9 17.2C1 15.2 0 12.6 0 10.1z"
                fill="inherit"
              ></path>
            </svg>
          </div>
        </div>

        {isOpen && (
          <div className="offences-cont">
            {props.offences.map((value) => {
              return (
                <div className="offence-cont" key={value.id}>
                  <h3>Details</h3>
                  <p>{value.description}</p>

                  <h3>Date</h3>
                  <p>{value.date}</p>

                  <button onClick={() => removeOffence(value.id)}>
                    Clear offence
                  </button>
                </div>
              );
            })}

            {isFormOpen && (
              <form onSubmit={handleSubmit}>
                <label htmlFor="description">Description</label>
                <input
                  type="text"
                  name="description"
                  id="description"
                  onChange={handleChange}
                />

                <label htmlFor="date">Date</label>
                <input
                  type="date"
                  name="date"
                  id="date"
                  onChange={handleChange}
                />

                <button type="submit">Add Offence</button>
              </form>
            )}
            {!isFormOpen && (
              <button onClick={() => setIsFormOpen(!isFormOpen)}>
                Add New Offence
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Defaulter;
