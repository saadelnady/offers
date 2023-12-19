import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/Auth';
import { toast } from 'react-toastify';
import { getUserProfileData } from '../server/user';
import { MenuContext } from '../contexts/Menu';

const ProfileMenu = () => {
  // route
  const navigate = useNavigate();
  // toggle Menu
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => {
    setMenuOpen((menuOpen) => !menuOpen);
  };

  // isLogged
  const { user, logout } = useContext(AuthContext);
  const isCompany = user?.user?.role === 'Company';
  const isAdmin = user?.user?.role === 'Admin';

  const [userProfile, setUserProfile] = useState({});

  useEffect(() => {
    const getUserData = async () => {
      const response = await getUserProfileData(user?.user?.id, user?.token);
      if (response.status === 401) return logout();
      const res = await response.json()
      setUserProfile(res?.data?.user);
    };
    getUserData();
  }, [user]);


  // floatingMenu 
  const { isMenu, toggleMenu: tg, setIsMenu } = useContext(MenuContext);


  return (
    <div className='relative '>
      <button onClick={toggleMenu} className="relative align-middle rounded-full focus:shadow-outline-purple focus:ring-0 transition-all duration-200 z-20">
        <img
          className="object-cover w-10 h-10 rounded-full"
          src={
            userProfile?.image?.[0]
              ? `${import.meta.env.VITE_API_BASE_URL}/uploads/user/${userProfile?.image?.[0]}`
              : `${import.meta.env.VITE_API_BASE_URL}/uploads/user/profie.jpg`
          }
          alt=""
        />
      </button>

      <ul className={`transform origin-top  ${menuOpen ? 'scale-y-100  ' : ' scale-y-0 -translate-y-5'} transition-transform duration-300 absolute z-10 top-7 left-0 md:right-[unset] md:left-0 w-40 p-2 mt-2 space-y-2 text-gray-600 bg-white border border-gray-100 rounded-md shadow-md dark:border-gray-700 dark:text-gray-300 dark:bg-gray-700`}>
        <li onClick={() => {
          setIsMenu(false)
          setMenuOpen(false)
        }} className="flex">
          <Link
            className="inline-flex items-center w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-200"
            to={`${isAdmin || isCompany ? '/dashboard/profile' : '/profile'}`}
          >
            <svg
              className="w-4 h-4 ml-3"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            <span>{userProfile?.full_name}</span>
          </Link>
        </li>

        <li onClick={() => {
          setIsMenu(false)
          setMenuOpen(false)
        }} className="flex">
          <Link
            className="inline-flex items-center w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-200"
            to={'/'}
            onClick={() => {
              logout();
              navigate('/');
              toast.success('تم الخروج', {
                position: toast.POSITION.TOP_RIGHT,
              });
            }}
          >
            <svg
              className="w-4 h-4 ml-3"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
            </svg>
            <span>تسجيل الخروج</span>
          </Link>
        </li>
      </ul>

    </div>
  );
};

export default ProfileMenu;
