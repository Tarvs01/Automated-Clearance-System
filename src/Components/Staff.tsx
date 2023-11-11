import React, {
  useEffect,
  useState,
  FormEvent,
  ChangeEvent,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Defaulter from "./Defaulter";
import { StaffData } from "./types";
import Spinner from "./Spinner";

function Staff() {
  const approveOneError = useRef<HTMLParagraphElement | null>(null);
  const approveOneSuccess = useRef<HTMLParagraphElement | null>(null);

  const addDefaulterError = useRef<HTMLParagraphElement | null>(null);
  const addDefaulterSuccess = useRef<HTMLParagraphElement | null>(null);

  const approveAllError = useRef<HTMLParagraphElement | null>(null);
  const approveAllSuccess = useRef<HTMLParagraphElement | null>(null);

  const [isAddDefaulterLoading, setIsAddDefaulterLoading] = useState(false);
  const [isApproveAllLoading, setIsApproveAllLoading] = useState(false);
  const [isApproveOneLoading, setIsApproveOneLoading] = useState(false);

  const formRef = useRef<HTMLFormElement | null>(null);

  const navigate = useNavigate();
  const [staffData, setStaffData] = useState<StaffData>({
    dept: "",
    defaulters: [],
  });

  useEffect(() => {
    if (sessionStorage) {
      let data = sessionStorage.getItem("ACS");

      if (!data) {
        navigate("/staff-login");
      } else {
        axios
          .get(`http://192.168.56.1:5000/getstaffdefaulters/${data}`)
          .then((response) => {
            setStaffData({
              dept: data,
              defaulters: JSON.parse(response.data.data[0].defaulters),
            });
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
  }, []);

  const [newDefaulterData, setNewDefaulterData] = useState({
    matricNumber: "",
    description: "",
    date: "",
  });

  const [singleApprovalMatricNumber, setSingleApprovalMatricNumber] =
    useState("");

  //funtion handler for the Add Defaulter form submision
  function addDefaulterSubmit(e: FormEvent) {
    e.preventDefault();

    //remove any previous error
    addDefaulterError.current!.textContent = "";

    //create a new offence based on the form data
    let offences = [];
    offences.push({
      id: 0,
      description: newDefaulterData.description,
      date: newDefaulterData.date,
    });

    //creata a new defaulter
    let newDefaulter = {
      id: staffData.defaulters.length,
      matricNumber: newDefaulterData.matricNumber,
      offences: offences,
    };

    //if the given matric number is invalid
    if (!/^([a-z]{3})(\/\d{2})(\/\d{4})$/.test(newDefaulterData.matricNumber)) {
      addDefaulterError.current!.textContent = "Invalid matric number"; //display an error message
    } else {
      //otherwise

      //check if the new defaulter has already been previosuly added
      let present = staffData.defaulters.find((value) => {
        return value.matricNumber === newDefaulterData.matricNumber;
      });

      //If they have been previously added
      if (present) {
        addDefaulterError.current!.textContent =
          "Defaulter already exists. Add to their offence instead";
      } else {
        //otherwise
        setIsAddDefaulterLoading(true); //display a spinner to signify loading

        //send the new defaulter to the database to update
        axios
          .put("http://192.168.56.1:5000/addnewdefaulter", {
            dept: staffData.dept,
            matricNumber: newDefaulter.matricNumber.replaceAll("/", "-"),
          })
          .then((response) => {
            //on request success
            setIsAddDefaulterLoading(false); //hide the loading spinner

            addDefaulterSuccess.current!.textContent =
              "Successfully added defaulter"; //display a success message

            //reset the form values
            setNewDefaulterData({
              matricNumber: "",
              description: "",
              date: "",
            });

            formRef.current!.reset(); //Reset the form

            //update the data of the staff
            setStaffData((prevData) => {
              return {
                dept: staffData.dept,
                defaulters: [...staffData.defaulters, newDefaulter],
              };
            });

            //remove the success message after the specified time
            setTimeout(() => {
              addDefaulterSuccess.current!.textContent = "";
            }, 2000);
          })
          .catch((error) => {
            //on request failure
            setIsAddDefaulterLoading(false); //hide the loading spinner
            addDefaulterError.current!.textContent =
              "There was an error. Try again"; //display an error message
          });
      }
    }
  }

  //input change handler for the add defaulter form
  function addDefaulterInputChange(e: ChangeEvent<HTMLInputElement>) {
    setNewDefaulterData({
      ...newDefaulterData,
      [e.target.name]: e.target.value,
    });
  }

  //textarea change handler for the add defaulter form
  function addDefaulterTextareaChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setNewDefaulterData({
      ...newDefaulterData,
      [e.target.name]: e.target.value,
    });
  }

  //function handler for the approve all form
  function approveAll() {
    setIsApproveAllLoading(true); //display a loading spinner

    //make a server request to update the database
    axios
      .put(`http://192.168.56.1:5000/approveall/${staffData.dept}`, {})
      .then((response) => {
        //if the request was successful
        setIsApproveAllLoading(false); //hide the loading spinner

        approveAllSuccess.current!.textContent =
          "All non defaulters successfully approved"; //display a success message

        //Hide the success message after the specified time
        setTimeout(() => {
          approveAllSuccess.current!.textContent = "";
        }, 2000);
      })
      .catch((err) => {
        //if the request had any issue
        setIsApproveAllLoading(false); //hide the loading spinner
        approveAllError.current!.textContent = "There was an error. Try again"; //display an error message
      });
  }

  //function handler for the approve one form
  function approveOne(e: FormEvent) {
    e.preventDefault();

    //if the given matric number is invalid
    if (!/^([a-z]{3})(\/\d{2})(\/\d{4})$/.test(singleApprovalMatricNumber)) {
      approveOneError.current!.textContent = "Invalid matric number"; //display an error message
    } else {
      //otherwise

      //if the current staff is a departmental staff
      if (staffData.dept?.startsWith("dept")) {
        let dept = staffData.dept.slice(
          staffData.dept.length - 3,
          staffData.dept.length
        );

        //check that the matric number belongs to the department of that staff
        if (!singleApprovalMatricNumber.startsWith(dept)) {
          //if it does not belong to that department
          approveOneError.current!.textContent =
            "You can only approve students of your department."; //display an error message
        } else {
          //otherwise

          setIsApproveOneLoading(true); //display a loading spinner
          axios
            .put("http://192.168.56.1:5000/approveone", {
              matricNumber: singleApprovalMatricNumber.replaceAll("/", "-"),
              dept: staffData.dept,
            })
            .then((response) => {
              //if the request was successful
              setIsApproveOneLoading(false); //hide the loading spinner

              approveOneSuccess.current!.textContent =
                "Student successfully approved"; //display a success message

              //hide the success message after the specified time
              setTimeout(() => {
                approveOneSuccess.current!.textContent = "";
              }, 2000);
            })
            .catch((error) => {
              //if the request had any issue
              setIsApproveOneLoading(false); //hide the loading spinner
              approveOneError.current!.textContent =
                "There was an error. Try again";
            });
        }
      } else {
        //if the staff is not a departmental staff
        setIsApproveOneLoading(true); //display a loading spinner
        axios
          .put("http://192.168.56.1:5000/approveone", {
            matricNumber: singleApprovalMatricNumber.replaceAll("/", "-"),
            dept: staffData.dept,
          })
          .then((response) => {
            //if the request was successful
            setIsApproveOneLoading(false); //hide the loading spinner

            approveOneSuccess.current!.textContent =
              "Student successfully approved"; //display a success message

            //hide the success message after the specified time
            setTimeout(() => {
              approveOneSuccess.current!.textContent = "";
            }, 2000);
          })
          .catch((error) => {
            //if the request had any issue
            setIsApproveOneLoading(false); //hide the loading spinner
            approveOneError.current!.textContent =
              "There was an error. Try again";
          });
      }
    }
  }

  //input change handler for the approve one form
  function handleSingleApprovalChange(e: ChangeEvent<HTMLInputElement>) {
    setSingleApprovalMatricNumber(e.target.value);
  }

  //this runs whenever the staff data is updated
  useEffect(() => {
    axios
      .post("http://192.168.56.1:5000/updatestaffdefaulters", staffData)
      .then((response) => {})
      .catch((error) => {
        alert(
          "There was an error. Please refresh to make sure that your change has reflected"
        );
      });
  }, [staffData]);

  let previousOpenDefaulter: any = null;
  let previousOpenDefaulterId = -1;

  //function to close the other open Defaulter component when a new one is opened
  function openDefaulter(newOpenDefaulter: any, id: number) {
    if (previousOpenDefaulter !== null && previousOpenDefaulterId !== id) {
      previousOpenDefaulter(false);
    }
    previousOpenDefaulter = newOpenDefaulter;
    previousOpenDefaulterId = id;
  }

  function logOut() {
    if (sessionStorage) {
      sessionStorage.removeItem("ACS");
      window.location.reload();
    }
  }

  return (
    <div>
      <h2 className="staff-heading">
        Clearance for{" "}
        {(() => {
          if (staffData.dept?.startsWith("dept")) {
            let fullTitle = staffData.dept.slice(
              staffData.dept.length - 3,
              staffData.dept.length
            );

            switch (staffData.dept.slice(0, staffData.dept.length - 3)) {
              case "deptHod":
                fullTitle += " HOD";
                break;
              case "deptOfficer":
                fullTitle += " Departmental Officer";
                break;
              case "deptLab":
                fullTitle += " Lab Department";
                break;
              default:
                fullTitle += " Unknown. Please report this error";
            }

            return fullTitle;
          } else {
            return staffData.dept;
          }
        })()}
      </h2>

      <section>
        <h2 className="defaulters-heading">Defaulters</h2>
        {staffData.defaulters.length === 0 && (
          <p className="no-defaulter">There are no defaulters</p>
        )}
        {staffData.defaulters.length !== 0 &&
          staffData.defaulters.map((value, index) => {
            return (
              <Defaulter
                key={index}
                props={value}
                updateState={setStaffData}
                openDefaulter={openDefaulter}
              />
            );
          })}
      </section>

      <section>
        <form
          onSubmit={addDefaulterSubmit}
          className="staff-form"
          ref={formRef}
        >
          <h2>Add Defaulter</h2>
          <label htmlFor="matricNumber">Matric Number</label>
          <input
            type="text"
            name="matricNumber"
            id="matricNumber"
            required
            onChange={addDefaulterInputChange}
            onInput={addDefaulterInputChange}
          />

          <label htmlFor="description">Description</label>
          <textarea
            name="description"
            id="description"
            rows={6}
            required
            onChange={addDefaulterTextareaChange}
          ></textarea>

          <label htmlFor="date">Date</label>
          <input
            type="date"
            name="date"
            id="date"
            required
            onChange={addDefaulterInputChange}
          />
          <p ref={addDefaulterError} className="error-para"></p>
          <p ref={addDefaulterSuccess} className="success-para"></p>
          {isAddDefaulterLoading && <Spinner />}
          <button type="submit">Submit</button>
        </form>
      </section>

      <section className="approve-all">
        <p>
          The button below approves the clearance status for all students that
          have no issues with the department. Its action cannot be reversed.
        </p>

        <p ref={approveAllError} className="error-para"></p>
        <p ref={approveAllSuccess} className="success-para"></p>
        {isApproveAllLoading && <Spinner />}
        <button onClick={approveAll}>Approve All</button>
      </section>

      <section className="approve-one">
        <form onSubmit={approveOne} className="staff-form">
          <h2> Approve One Student</h2>
          <label htmlFor="matricNumber">Matric Number</label>
          <input
            type="text"
            name="matricNumber"
            id="matricNumber"
            onChange={handleSingleApprovalChange}
          />
          <p ref={approveOneError} className="error-para"></p>
          <p ref={approveOneSuccess} className="success-para"></p>
          {isApproveOneLoading && <Spinner />}
          <button type="submit">Submit</button>
        </form>
      </section>

      <section className="logout">
        <button onClick={logOut}>Log Out</button>
      </section>
    </div>
  );
}

export default Staff;
