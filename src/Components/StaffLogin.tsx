import React, { useState, FormEvent, ChangeEvent, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";
import PasswordInput from "./PasswordInput";

function StaffLogin() {
  const [staffLoginData, setStaffLoginData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const loginError = useRef<HTMLParagraphElement | null>(null);

  const navigate = useNavigate();

  //function handler for staff login form
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true); //display the spinner
    loginError.current!.textContent = ""; //clear any error

    //attempt to authenticate user
    axios
      .post("http://192.168.56.1:5000/loginstaff", staffLoginData)
      .then((response) => {
        //if request success
        setIsLoading(false); //hide loading spinner

        //if the user credentials are invalid
        if (response.data.status === "FAILURE") {
          loginError.current!.textContent = "Invalid credentials"; //display error message
        } else {
          //otherwise
          if (sessionStorage) {
            sessionStorage.setItem("ACS", response.data.data.dept);
          }
          navigate("/staff"); //navigate to their page
        }
      })
      .catch((error) => {
        //if there is any request error
        setIsLoading(false); //hide loading spinner
        loginError.current!.textContent = "There was an error. Try again"; //display error message
      });
  };

  //function handler for input element
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    loginError.current!.textContent = ""; //clear any error
    setStaffLoginData({ ...staffLoginData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="staff-form center-form">
        <h2> Staff Login</h2>

        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          onChange={handleChange}
          required
        />

        <label htmlFor="password">Password</label>
        <PasswordInput change={handleChange} />
        {/* <input
          type="password"
          name="password"
          id="password"
          onChange={handleChange}
          required
        /> */}

        <p ref={loginError} className="error-para"></p>
        {isLoading && <Spinner />}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default StaffLogin;
