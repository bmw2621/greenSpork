import React from 'react';

import styles from '../styles/form.module.css';
const logo = require("../images/greenSporkLogo.png")

const Layout = ({ children }) => (
    <>
        <header>
            <img src={logo} alt="Green Spork Logo"/>
            <div className={styles.headerText}>
                <span id={styles.title1}>Green Spork</span>
                <span id={styles.title2}>Cafe & Market</span>
                <span id={styles.title3}>Richmond Hill, GA</span>
            </div>
        </header>
        <main style={{"width": "100%","height": "100%","margin": "0","padding": "0"}}>{children}</main>
    </>
)

export default Layout