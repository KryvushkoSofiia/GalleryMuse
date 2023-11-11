import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { signUp } from "../../store/session";
import "./SignupForm.css";

function SignupFormModal() {
	const dispatch = useDispatch();
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [errors, setErrors] = useState({});
	const { closeModal } = useModal();

	const handleSubmit = async (e) => {
		e.preventDefault();
		const newErrors = {};

		if (password !== confirmPassword) {
			newErrors.confirmPassword = "Confirm Password field must be the same as the Password field";
		}

		if (!password || password.length < 6 || password.length > 20) {
			newErrors.password = "Password is required and must be between 6 and 20 characters";
		}

		if (!username || username.length > 40) {
			newErrors.username = "Username should not be longer than 40 characters";
		}

		if (!firstName || firstName.length > 50) {
			newErrors.firstName = "First Name should not be longer than 50 characters";
		}

		if (!lastName || lastName.length > 50) {
			newErrors.lastName = "Last Name should not be longer than 50 characters";
		}

		setErrors(newErrors);

		if (Object.keys(newErrors).length === 0) {
			const data = await dispatch(signUp(username, email, firstName, lastName, password));
			if (data) {
				setErrors(data);
			} else {
				closeModal();
			}
		}
	};
	return (
		<div className="signup-modal__wrapper">
			<h1 className="signup_header">Sign Up</h1>
			<form onSubmit={handleSubmit} className="signup_form">
				<div className="signup-modal_inputs">
					<label>
						Email
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</label>
					{errors.email && <span className="error">{errors.email}</span>}
					<label>
						Username
						<input
							type="text"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							required
						/>
					</label>
					{errors.username && <span className="error">{errors.username}</span>}
					<label className="input-label">
						First Name
						<input
							type="text"
							value={firstName}
							onChange={(e) => setFirstName(e.target.value)}
							required
							className="input-field"
						/>
					</label>
					{errors.firstName && <span className="error">{errors.firstName}</span>}
					<label className="input-label">
						Last Name
						<input
							type="text"
							value={lastName}
							onChange={(e) => setLastName(e.target.value)}
							required
							className="input-field"
						/>
					</label>
					{errors.lastName && <span className="error">{errors.lastName}</span>}
					<label>
						Password
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</label>
					{errors.password && <span className="error">{errors.password}</span>}
					<label>
						Confirm Password
						<input
							type="password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							required
						/>
					</label>
					{errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
				</div>
				<button type="submit" className="signup_button">Sign Up</button>
			</form>
		</div>
	);
}

export default SignupFormModal;
