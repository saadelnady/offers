import React, { useContext, useEffect, useState } from 'react';
import { MenuContext } from '../contexts/Menu';
import { XIcon } from '@heroicons/react/solid';
import { NavLink, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts';
import ProfileMenu from './ProfileMenu';
import AuthenticationButtons from './AuthenticationButtons';
import Categories from './Categories';
import Aside from './Aside';

const Menu = () => {
    // menu
    const { isMenu, toggleMenu } = useContext(MenuContext);

    // user
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (user?.user?.role) setIsLoggedIn(true);
        else setIsLoggedIn(false);
    }, [user]);






    return (
        <div className={`transform  transition-transform duration-300  lg:hidden fixed h-screen w-96 z-50 top-0 px-10 right-0 bg-purple-50 dark:bg-gray-900 shadow-lg ${isMenu ? 'translate-x-0' : 'translate-x-full'}`}>
            <button onClick={toggleMenu}>
                <XIcon className="absolute top-5 left-10 w-10 h-10 text-red-600" />
            </button>
            <div className="">
                <Aside />
            </div>
        </div>
    );
};

export default Menu;
