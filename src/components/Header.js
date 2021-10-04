import React from 'react'
import { useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'

const Header = (props) => {

  const history = useHistory()
  const location = useLocation();
  const userName = location.pathname.split('/')[1]
  const logo = useSelector((state) => state.product.logo);
  const gotoHome = () => {
    history.push(`/${userName}`)
  }

  return (
    <>
      <div className="header">
      </div>
    </> 
  );
}

export default Header;
