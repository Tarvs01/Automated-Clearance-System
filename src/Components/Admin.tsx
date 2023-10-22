import React, { useState, FormEvent, ChangeEvent } from 'react'
import axios from 'axios';

function Admin() {

    const [staffToRegister, setStaffToRegister] = useState({ email: "", password: "", dept: "" });

    const [studentsToRegister, setStudentsToRegister] = useState({ year: "", dept: "", start: "", end: "" });

    function handleStaffRegisterSubmit(e : FormEvent) {
        e.preventDefault();
        axios.post("http://192.168.56.1:5000/registerstaff", staffToRegister).then((response) => {
            console.log(response);
            
        }).catch((error) => {
            console.log(error);
            
        })
    }

    function handleStaffRegistrationChange(e: ChangeEvent<HTMLInputElement>) {
        e.preventDefault();
        setStaffToRegister({ ...staffToRegister, [e.target.name]: e.target.value });

        console.log(staffToRegister);
        
    }

    function handleStudentsRegisterSubmit(e : FormEvent) {
        e.preventDefault();
        axios.post("http://192.168.56.1:5000/registerstudentset", studentsToRegister).then((response) => {
            console.log(response);
            
        }).catch((error) => {
            console.log(error);
            
        })
    }

    function handleStudentsRegisterChange(e : ChangeEvent<HTMLInputElement>) {
        e.preventDefault();
        setStudentsToRegister({ ...studentsToRegister, [e.target.name]: e.target.value });
    }
  return (
    <div>
      <section>
        <form onSubmit={handleStaffRegisterSubmit}>
          <h1>Register a Staff</h1>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            onChange={handleStaffRegistrationChange}
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            onChange={handleStaffRegistrationChange}
          />

          <label htmlFor="dept">Department</label>
          <input
            type="text"
            name="dept"
            id="dept"
            onChange={handleStaffRegistrationChange}
          />

          <button type="submit">Register</button>
          <button type="reset">Reset</button>
        </form>

        <form onSubmit={handleStudentsRegisterSubmit}>
          <h1>Register students</h1>

          <label htmlFor="year">Year</label>
          <input
            type="number"
            name="year"
            id="year"
            onChange={handleStudentsRegisterChange}
          />

          <label htmlFor="dept">Department</label>
          <input
            type="text"
            name="dept"
            id="dept"
            onChange={handleStudentsRegisterChange}
          />

          <label htmlFor="start">Start Number</label>
          <input
            type="number"
            name="start"
            id="start"
            onChange={handleStudentsRegisterChange}
          />

          <label htmlFor="end">End Number</label>
          <input
            type="number"
            name="end"
            id="end"
            onChange={handleStudentsRegisterChange}
          />

          <button type="submit">Register</button>
          <button type="reset">Reset</button>
        </form>
      </section>
    </div>
  );
}

export default Admin