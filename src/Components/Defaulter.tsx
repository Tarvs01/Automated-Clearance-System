import React, { useState, FormEvent, ChangeEvent, useEffect } from "react";
import { DefaulterDetails, StaffData } from "./types";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";

function Defaulter({ props, updateState, openDefaulter }: DefaulterDetails) {
  const [isOpen, setIsOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [offenceDetails, setOffenceDetails] = useState({
    description: "",
    date: "",
  });

  //handler function for the new offence form submission
  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    //update the staff details to include the new offence
    updateState((prevState) => {
      let newState: StaffData = { dept: "", defaulters: [] };
      newState.dept = prevState.dept;

      //add the new offence to the right offender
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

    //close the form
    setIsFormOpen(!isFormOpen);
  }

  //function handler for the form input element
  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    setOffenceDetails({ ...offenceDetails, [e.target.name]: e.target.value });
  }

  //function handler for the form textarea element
  function handleTextareaChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setOffenceDetails({ ...offenceDetails, [e.target.name]: e.target.value });
  }

  //function for removing an offenders offence
  function removeOffence(id: number) {
    //update the staff state
    updateState((prevState) => {
      let newState: StaffData = { dept: "", defaulters: [] };
      newState.dept = prevState.dept;

      //filter out the offence from the other offences
      newState.defaulters = prevState.defaulters.map((val) => {
        if (val.id === props.id) {
          val.offences = val.offences.filter((value) => value.id !== id);
        }
        return val;
      });

      //if the offender no longer has any offence, remove the offender from the list
      let clearedMatricNumber = "";
      newState.defaulters = newState.defaulters.filter((val) => {
        if (val.offences.length === 0) {
          clearedMatricNumber = val.matricNumber.replaceAll("/", "-");
          return false;
        }
        return true;
      });

      //update the database
      if (clearedMatricNumber) {
        axios
          .put("http://192.168.56.1:5000/removesingledefaulter", {
            dept: prevState.dept,
            matricNumber: clearedMatricNumber,
          })
          .then((response) => {
            setIsOpen(!isOpen);
          })
          .catch((error) => {
            alert(
              "There was an error with your request. Please refresh the page to clarify"
            );
          });
      }

      return newState;
    });
  }

  //close other open defaulter components when this one is opened
  useEffect(() => {
    if (isOpen) {
      openDefaulter(setIsOpen, props.id);
    }
  }, [isOpen]);

  return (
    <div className="defaulter-cont">
      <div className="main-cont">
        <div className="matric-number-tile" onClick={() => setIsOpen(!isOpen)}>
          <p>{props.matricNumber}</p>
          <div
            className="arrow"
            style={{ transform: `rotate(${isOpen ? "0deg" : "-90deg"})` }}
          >
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

        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="offences-cont"
              initial={{ height: "0px" }}
              animate={{ height: "auto" }}
              exit={{ height: "0px" }}
            >
              {props.offences.map((value) => {
                return (
                  <div className="offence-cont" key={value.id}>
                    <h3>Details</h3>
                    <p>{value.description}</p>

                    <h3>Date</h3>
                    <p>{value.date}</p>

                    <button
                      onClick={() => {
                        removeOffence(value.id);
                        console.log("remove called");
                      }}
                    >
                      Clear offence
                    </button>
                  </div>
                );
              })}

              {isFormOpen && (
                <form onSubmit={handleSubmit} className="add-new-offence-form">
                  <label htmlFor="description">Description</label>
                  <textarea
                    name="description"
                    id="description"
                    rows={6}
                    onChange={handleTextareaChange}
                    required
                  ></textarea>

                  <label htmlFor="date">Date</label>
                  <input
                    type="date"
                    name="date"
                    id="date"
                    required
                    onChange={handleInputChange}
                  />

                  <button type="submit">Add Offence</button>
                </form>
              )}
              {!isFormOpen && (
                <button
                  onClick={() => setIsFormOpen(!isFormOpen)}
                  className="add-new-offence-btn"
                >
                  Add New Offence
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Defaulter;
