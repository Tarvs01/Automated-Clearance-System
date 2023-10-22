import React, { useState, FormEvent, ChangeEvent, useContext } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function StaffLogin() {
  const [staffLoginData, setStaffLoginData] = useState({ email: "", password: "" });

  const [isError, setIsError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e : FormEvent) => {
    e.preventDefault();
    axios.post("http://192.168.56.1:5000/loginstaff", staffLoginData).then((response) => {
      if (response.data.status === "FAILURE") {
        setIsError("Invalid credentials");
      }
      else {
        if (sessionStorage) {
          sessionStorage.setItem("ACS", response.data.data.dept);
        }
        navigate("/staff");
      }
    }).catch((error) => {
      console.log(error);
      setIsError(error.message)
    })
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setIsError("");
    setStaffLoginData({ ...staffLoginData, [e.target.name]: e.target.value });
  }

  return (
      <div>
          <form onSubmit={handleSubmit}>
              <h2>Login</h2>
              
              <label htmlFor="email">Email</label>
              <input type="email" name="email" id="email" onChange={handleChange} />

              <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" onChange={handleChange} />
        
        {isError && <p className='login-error-message'>{isError}</p>}

        <button type="submit">Submit</button>
          </form>
    </div>
  )
}

export default StaffLogin