import React from 'react';
import Aux from '../../hoc/Ax';
import classes from './Layout.module.css';

const Layout = (props) => (

    <Aux>
        <div>Toolbar, SideDrawer, Backdrpop</div>
        <main className={classes.Content}>{props.children}</main>
    </Aux>


)
export default Layout;