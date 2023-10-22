import React, { FormEvent, useState, ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom';

function StudentLogin() {

    const [matricNumber, setMatricNumber] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!/^([a-z]{3})(\/\d{2})(\/\d{4})$/.test(matricNumber)) {
            console.log("invalid matric number");
            let input: HTMLInputElement | null = document.querySelector("input");
            input!.style.borderColor = "red";
        }
        else {
            let route = matricNumber.replaceAll("/", "-");
            navigate(route);
        }
        
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setMatricNumber(e.target.value);
        let input: HTMLInputElement | null = document.querySelector("input");
        input!.style.borderColor = "gray";
    }

  return (
      <div>
          <form onSubmit={handleSubmit}>
              <h1>Enter Your Matric Number</h1>
              <input type="text" onChange={handleChange}/>

              <button type="submit">Submit</button>
          </form>
    </div>
  )
}

export default StudentLogin