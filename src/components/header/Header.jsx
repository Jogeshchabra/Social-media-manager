import React, { useContext, useState } from 'react';
import styles from './Header.module.css';
import logo from './../../images/logo.png';
import Container from '@material-ui/core/Container';
import { AuthContext } from '../../context/Auth';
import { Menu, MenuItem } from '@material-ui/core';
import { signOut } from '../../utils/auth';
import { Link } from 'react-router-dom';

const Header = () => {
  const { currentUser } = useContext(AuthContext);

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  function handleLogout() {
    signOut().catch(() => {
      alert('Could not log out');
    });
    handleClose();
  }

  return (
    <header className={styles.header}>
      <Container maxWidth="lg">
        <nav>
          {!currentUser && (
            <Link to="/" className={styles.brand}>
              <img src={logo} alt="brand logo" className={styles.brandImg} />
            </Link>
          )}
          {currentUser && (
            <ul className={styles.navMenu}>
              <li className={styles.navMenuItem} onClick={handleClick}>
                <div>{currentUser.displayName}</div>
                <div>{currentUser.email}</div>
              </li>
            </ul>
          )}
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </nav>
      </Container>
    </header>
  );
};

export default Header;
