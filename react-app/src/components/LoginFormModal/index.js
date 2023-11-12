import React, { useState } from "react";
import { login } from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { Link } from "react-router-dom";


import "./LoginForm.css";


function LoginFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await dispatch(login(email, password));
    if (data) {
      setErrors(data);
    } else {
      closeModal()
      
    }
  };

  const handleDemoUser = async (e) => {
    e.preventDefault();

    return dispatch(login("demo@aa.io", "password")).then(() => {
      closeModal();
    });
  };

  return (
    <div className="login-modal__wrapper">
      <h1 className="login_header">Log In</h1>
      <form onSubmit={handleSubmit} className="login_form">
        <ul>
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
        <div className="login_inputs">
          <label>
            Email
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
        </div>
        <button type="submit" className="login_button">Log In</button>
      </form>
      <Link onClick={handleDemoUser} className="login-demo_button">
        Demo User
      </Link>
    </div>
  );
}

export default LoginFormModal;
