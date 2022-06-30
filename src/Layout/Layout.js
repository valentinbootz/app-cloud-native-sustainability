import React from 'react';
import { Outlet } from 'react-router-dom';

import './Layout.css'

import HeaderNavigation from './HeaderNavigation';

class Layout extends React.Component {
    render() {
        return (
            <div className='layout'>
                <HeaderNavigation />
                <Outlet />
            </div>
        )
    }
}

export default Layout;