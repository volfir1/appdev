import React from 'react';

const Navbar = () => {
  return (
    <div style={styles.navbar}>
      <h2 style={styles.brand}>ActOnPov</h2>
      <div style={styles.links}>
        <a href="/login" style={styles.link}>Get Started</a>
        <a href="#" style={styles.link}>About</a>
        <a href="#" style={styles.link}>Contact</a>
      </div>
    </div>
  );
};

const styles = {
  navbar: {
    backgroundColor: '#b91c1c',
    color: '#fff',
    padding: '15px 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    zIndex: 10,
  },
  brand: {
    margin: 0,
    fontSize: '24px',
  },
  links: {
    display: 'flex',
    gap: '20px',
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
};

export default Navbar;
