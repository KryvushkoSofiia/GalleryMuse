import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import LOGO from './LOGO.svg';
// import '../../fonts/fonts.css'

function Navigation({ isLoaded }) {
	const sessionUser = useSelector(state => state.session.user);

	return (
		<div className='navigation__wrapper'>
			<div>
				<NavLink exact to="/">
					<img id="mySvg" src={LOGO} alt="Home" />
				</NavLink>
			</div>
			<div>
				{isLoaded && (
					<ProfileButton user={sessionUser} />
				)}
			</div>
		</div>
	);
}

export default Navigation;
