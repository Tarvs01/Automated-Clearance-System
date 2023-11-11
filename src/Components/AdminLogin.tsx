import React, {
  useState,
  useRef,
  FormEvent,
  ChangeEvent,
  useContext,
} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";
import { AppContext } from "./AppProvider";
import PasswordInput from "./PasswordInput";

function AdminLogin() {
  const context = useContext(AppContext);
  const [adminLoginData, setadminLoginData] = useState({
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
      .post("http://192.168.56.1:5000/loginadmin", adminLoginData)
      .then((response) => {
        //if request success
        setIsLoading(false); //hide loading spinner

        //if the user credentials are invalid
        if (response.data.status === "FAILURE") {
          loginError.current!.textContent = "Invalid credentials"; //display error message
        } else {
          //otherwise
          context?.setIsLoggedIn(true);
          navigate("/admin"); //navigate to their page
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
    setadminLoginData({ ...adminLoginData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="staff-form center-form">
        <h2> Admin Login</h2>

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

export default AdminLogin;
