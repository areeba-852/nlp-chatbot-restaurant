import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
  });
  const { email, password } = inputValue;
  useEffect(() => {
    // Optional: hit a /verify route to check session from cookie
    axios.get("http://localhost:5000/verify", {
      withCredentials: true,
    })
      .then((res) => {
        if (res.data.user) {
          navigate("/home");
        }
      })
      .catch(() => {});
  }, [navigate]);
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

  const handleError = (err) =>
    toast.error(err, {
      position: "bottom-left",
    });
  const handleSuccess = (msg) =>
    toast.success(msg, {
      position: "bottom-left",
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const { data } = await axios.post(
          "http://localhost:5000/login",
          inputValue,
          { withCredentials: true } // Important for cookie
        );
  console.log('data', data)
        if (data.success) {
          handleSuccess("Login successful");
          setTimeout(() => {
            navigate("/home");
          }, 1000);
        } else {
          handleError(data.message || "Invalid credentials");
        }
      } catch (err) {
        handleError(err.response?.data?.message || "Server error");
      }
  
      setInputValue({ email: "", password: "" });
    };

  return (
    <div className="form_container">
      <h2>Login Account</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            value={email}
            placeholder="Enter your email"
            onChange={handleOnChange}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            value={password}
            placeholder="Enter your password"
            onChange={handleOnChange}
          />
        </div>
        <button type="submit">Submit</button>
        <span>
          Already have an account? <Link to={"/signup"}>Signup</Link>
        </span>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Login;