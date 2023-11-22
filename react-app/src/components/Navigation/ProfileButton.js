import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../store/session";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import { NavLink } from "react-router-dom";

import './ProfileButton.css'
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef(null); // Initialize ulRef with null

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) { // Check if ulRef.current is not null before accessing contains method
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout());
    history.push('/');
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");
  const closeMenu = () => setShowMenu(false);

  return (
    <>
      <button onClick={openMenu} className="profile-button">
        Profile
      </button>
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <div className="profile_dropdown__wrapper">
            <li className="profile_dropdown__item">{user.username}</li>
            <li className="profile_dropdown__item">{user.email}</li>
            <li className="profile_dropdown__item"><NavLink to={`/create-gallery`} activeClassName="active-link" className="dropdown_item__url">create gallery</NavLink></li>
            <li className="profile_dropdown__item"><NavLink to={`/my-galleries`} activeClassName="active-link" className="dropdown_item__url">my galleries</NavLink></li>
            <li className="profile_dropdown__item"><NavLink to={`/visited-galleries`} activeClassName="active-link" className="dropdown_item__url">visited</NavLink></li>
            <li className="profile_dropdown__item"><NavLink to={`/favorite-galleries`} activeClassName="active-link" className="dropdown_item__url">♡</NavLink></li>
            <li>
              <button className="profile_dropdown__logout" onClick={handleLogout}>Log Out</button>
            </li>
          </div>
        ) : (
          <div className="profile_dropdown__wrapper no-user">
            <OpenModalButton
              buttonText="Log In"
              onItemClick={closeMenu}
              className = "navigation_button"
              modalComponent={<LoginFormModal />}
            />

            <OpenModalButton
              buttonText="Sign Up"
              onItemClick={closeMenu}
              className = "navigation_button"
              modalComponent={<SignupFormModal />}
            />
          </div>
        )}
      </ul>
    </>
  );
}

export default ProfileButton;
