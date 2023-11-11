import React, {
  useState,
  FormEvent,
  ChangeEvent,
  useRef,
  useEffect,
  useContext,
} from "react";
import axios from "axios";
import Spinner from "./Spinner";
import { AppContext } from "./AppProvider";
import { useNavigate } from "react-router-dom";
import PasswordInput from "./PasswordInput";

function Admin() {
  const context = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!context?.isLoggedIn) {
      navigate("/admin-login");
    }
  }, []);
  const [staffToRegister, setStaffToRegister] = useState({
    email: "",
    password: "",
    dept: "",
  });

  const [studentsToRegister, setStudentsToRegister] = useState({
    year: "",
    dept: "",
    start: "",
    end: "",
    isExtraStudent: false,
  });

  const [studentDatabaseYear, setStudentDatabaseYear] = useState(0);

  const [isRegisterStaffLoading, setIsRegisterStaffLoading] = useState(false);
  const [isRegisterStudentsLoading, setIsRegisterStudentsLoading] =
    useState(false);
  const [isCreateDBLoading, setIsCreateDBLoading] = useState(false);

  const registerStaffSuccess = useRef<HTMLParagraphElement | null>(null);
  const registerStaffError = useRef<HTMLParagraphElement | null>(null);
  const registerStudentsSuccess = useRef<HTMLParagraphElement | null>(null);
  const registerStudentsError = useRef<HTMLParagraphElement | null>(null);
  const createDBSuccess = useRef<HTMLParagraphElement | null>(null);
  const createDBerror = useRef<HTMLParagraphElement | null>(null);
  const registerStaffForm = useRef<HTMLFormElement | null>(null);
  const registerStudentsForm = useRef<HTMLFormElement | null>(null);

  function handleDBChange(e: ChangeEvent<HTMLInputElement>) {
    setStudentDatabaseYear(Number(e.target.value));
  }

  function handleDBSubmit(e: FormEvent) {
    e.preventDefault();
    createDBerror.current!.textContent = "";
    setIsCreateDBLoading(true);
    axios
      .post("http://192.168.56.1:5000/createtable", {
        year: studentDatabaseYear,
      })
      .then((res) => {
        setIsCreateDBLoading(false);
        if (res.data.status === "FAILURE") {
          createDBerror.current!.textContent = res.data.message;
        } else {
          createDBSuccess.current!.textContent =
            "Database successfully created";

          setTimeout(() => {
            createDBSuccess.current!.textContent = "";
          }, 2000);
        }
      })
      .catch((err) => {
        setIsCreateDBLoading(false);
        createDBerror.current!.textContent =
          "There was an error creating the database";
      });
  }

  function handleStaffRegisterSubmit(e: FormEvent) {
    e.preventDefault();
    setIsRegisterStaffLoading(true);

    registerStaffError.current!.textContent = "";
    axios
      .post("http://192.168.56.1:5000/registerstaff", staffToRegister)
      .then((response) => {
        setIsRegisterStaffLoading(false);

        if (response.data.code === 0) {
          registerStaffError.current!.textContent =
            "Email is already registered";
        } else {
          registerStaffSuccess.current!.textContent =
            "Staff successfully registered";

          registerStaffForm.current!.reset();

          setTimeout(() => {
            registerStaffSuccess.current!.textContent = "";
          }, 2000);
        }
      })
      .catch((error) => {
        setIsRegisterStaffLoading(false);
        registerStaffError.current!.textContent =
          "There was an error registering the staff";
      });
  }

  function handleStaffRegistrationChange(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    setStaffToRegister({ ...staffToRegister, [e.target.name]: e.target.value });
  }

  function handleStudentsRegisterSubmit(e: FormEvent) {
    e.preventDefault();
    setIsRegisterStudentsLoading(true);
    registerStudentsError.current!.textContent = "";
    axios
      .post("http://192.168.56.1:5000/registerstudentset", studentsToRegister)
      .then((response) => {
        setIsRegisterStudentsLoading(false);
        if (response.data.status === "FAILURE") {
          registerStudentsError.current!.textContent = response.data.message;
        } else {
          registerStudentsSuccess.current!.textContent =
            "Students successfully registered";

          registerStudentsForm.current!.reset();

          setTimeout(() => {
            registerStudentsSuccess.current!.textContent = "";
          }, 2000);
        }
      })
      .catch((error) => {
        setIsRegisterStudentsLoading(false);
        registerStudentsError.current!.textContent =
          "There was an error registering the students";
      });
  }

  function handleStudentsRegisterChange(e: ChangeEvent<HTMLInputElement>) {
    setStudentsToRegister({
      ...studentsToRegister,
      [e.target.name]:
        e.target.name === "isExtraStudent" ? e.target.checked : e.target.value,
    });
  }
  return (
    <div>
      <section>
        <form
          onSubmit={handleStaffRegisterSubmit}
          className="staff-form"
          ref={registerStaffForm}
        >
          <h2>Register a Staff</h2>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            onInput={handleStaffRegistrationChange}
            required
          />

          <label htmlFor="password">Password</label>
          <PasswordInput change={handleStaffRegistrationChange} />
          {/* <input
            type="password"
            name="password"
            id="password"
            onInput={handleStaffRegistrationChange}
            required
          /> */}

          <label htmlFor="dept">Department</label>
          <input
            type="text"
            name="dept"
            id="dept"
            onInput={handleStaffRegistrationChange}
            required
          />

          <p ref={registerStaffError} className="error-para"></p>
          <p ref={registerStaffSuccess} className="success-para"></p>
          {isRegisterStaffLoading && <Spinner />}
          <button type="submit">Register</button>
        </form>

        <form
          onSubmit={handleStudentsRegisterSubmit}
          className="staff-form"
          ref={registerStudentsForm}
        >
          <h2>Register students</h2>

          <label htmlFor="year">Year</label>
          <input
            type="number"
            name="year"
            id="year"
            onInput={handleStudentsRegisterChange}
            required
            min={1960}
            max={9999}
          />

          <label htmlFor="dept">Department</label>
          <input
            type="text"
            name="dept"
            id="department"
            onInput={handleStudentsRegisterChange}
            required
          />

          <label htmlFor="start">Start Number</label>
          <input
            type="number"
            name="start"
            id="start"
            onInput={handleStudentsRegisterChange}
            required
          />

          <label htmlFor="end">End Number</label>
          <input
            type="number"
            name="end"
            id="end"
            onInput={handleStudentsRegisterChange}
            required
          />

          <div className="extras-cont">
            <input
              type="checkbox"
              name="isExtraStudent"
              id="isExtraStudent"
              value={"hasExtra"}
              onChange={handleStudentsRegisterChange}
            />
            <label htmlFor="isExtraStudent">Extras?</label>
          </div>

          <p ref={registerStudentsSuccess} className="success-para"></p>
          <p ref={registerStudentsError} className="error-para"></p>
          {isRegisterStudentsLoading && <Spinner />}
          <button type="submit">Register</button>
        </form>

        <form onSubmit={handleDBSubmit} className="staff-form">
          <h2>Create Student DB</h2>
          <label htmlFor="year">Year</label>
          <input
            type="number"
            name="year"
            id="years"
            min={1960}
            max={9999}
            required
            onChange={handleDBChange}
          />
          <p ref={createDBSuccess} className="success-para"></p>
          <p ref={createDBerror} className="error-para"></p>
          {isCreateDBLoading && <Spinner />}
          <button type="submit">Create</button>
        </form>
      </section>
    </div>
  );
}

export default Admin;
