import React, {useState, useEffect} from 'react';
import  {useAuth} from '../AuthContext'
import { useNavigate } from 'react-router-dom';

const Header = ({onMainClick, onProfileClick, onSignClick, onUploadClick}) => {
  
  const {isAuthenticated, userLogin, handleLogOut} = useAuth();
  const navigate = useNavigate();

  const handleMainClick = () => {
    onMainClick();
    navigate('/');
  }

  const handleOnSignClick = () => {
    onSignClick();
    navigate('/');
  }

  
  return (
    <header className='header'>
      <span className='item' id='main' onClick={() => handleMainClick()}>Main</span>
      <span className='item' id='videos'>Videos</span>
      {isAuthenticated ? (
        <div className='item'>
        <span className='item' id='upload' onClick={onUploadClick}>Upload</span>
        <span className='item' id='logout' onClick={handleLogOut}>LogOut</span>
        <span className='item' id='profile' onClick={onProfileClick}>{userLogin}</span>
        </div>
      ) : (
      <span className='item' id='' onClick={() => handleOnSignClick()}>Sign</span>
      )}
    </header>
    );
};






// class Header extends React.Component {
// }

export default Header;