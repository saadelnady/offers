import { useContext } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts';
import { MenuContext } from '../contexts/Menu';

const Aside = () => {
  const { user } = useContext(AuthContext);
  // Url State
  const { pathname } = useLocation();
  const ActiveLinkElement = () => (
    <span
      className="absolute inset-y-0 right-0 w-1 bg-purple-600 rounded-tl-lg rounded-bl-lg"
      aria-hidden="true"
    ></span>
  );
  const activeLinkStyle = 'text-gray-800 dark:text-gray-100';
  const linkStyle =
    'inline-flex items-center w-full text-md font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200';
  const linkClassName = ({ isActive }) => {
    return `${linkStyle} ${isActive ? activeLinkStyle : ''}`;
  };

  // menu
  const { setIsMenu } = useContext(MenuContext);

  return (
    <aside className="z-20 min-h-screen  h-full w-64 overflow-y-auto bg-purple-50 dark:bg-gray-900 lg:bg-white lg:dark:bg-gray-800 block  ">
      <div className="h-full  grid grid-rows-[50px_1fr_100px]  py-4 text-gray-500 dark:text-gray-400">
        <a className="mr-6 text-5xl font-bold text-gray-800 dark:text-gray-200">خدمات</a>
        <ul className=" mt-10" onClick={() => setIsMenu(false)}>
          <li className="relative px-6 py-3">
            {pathname === '/dashboard/orders' && <ActiveLinkElement />}
            <NavLink to={'/dashboard/orders'} className={linkClassName}>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  d="m22 8c0-.478-.379-1-1-1h-13c-.62 0-1 .519-1 1v13c0 .621.52 1 1 1h13c.478 0 1-.379 1-1zm-16-2h13.25c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-13.75c-.53 0-1 .47-1 1v13.75c0 .414.336.75.75.75s.75-.336.75-.75zm-2.5-2.5h13.75c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-14.25c-.53 0-1 .47-1 1v14.25c0 .414.336.75.75.75s.75-.336.75-.75z"
                  fillRule="nonzero"
                />
              </svg>
              <span className="mr-4">طلبات</span>
            </NavLink>
          </li>
          <li className="relative px-6 py-3">
            {pathname === '/dashboard/services' && <ActiveLinkElement />}
            <NavLink to={'/dashboard/services'} className={linkClassName}>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
              <span className="mr-4">خدماتي</span>
            </NavLink>
          </li>
          <li className="relative px-6 py-3">
            {pathname === '/dashboard/add-service' && <ActiveLinkElement />}
            <NavLink to={'/dashboard/add-service'} className={linkClassName}>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  d="m21 3.998c0-.478-.379-1-1-1h-16c-.62 0-1 .519-1 1v16c0 .621.52 1 1 1h16c.478 0 1-.379 1-1zm-16.5.5h15v15h-15zm6.75 6.752h-3.5c-.414 0-.75.336-.75.75s.336.75.75.75h3.5v3.5c0 .414.336.75.75.75s.75-.336.75-.75v-3.5h3.5c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-3.5v-3.5c0-.414-.336-.75-.75-.75s-.75.336-.75.75z"
                  fillRule="nonzero"
                />
              </svg>
              <span className="mr-4">اضافة خدمة جديدة</span>
            </NavLink>
          </li>

          {/* admin navigation links  */}
          {user?.user?.role === 'Admin' && (
            <>
              <li className="relative px-6 py-3">
                {pathname === '/dashboard/add-new-company' && <ActiveLinkElement />}
                <NavLink to={'/dashboard/add-new-company'} className={linkClassName}>
                  <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      d="m21 3.998c0-.478-.379-1-1-1h-16c-.62 0-1 .519-1 1v16c0 .621.52 1 1 1h16c.478 0 1-.379 1-1zm-16.5.5h15v15h-15zm6.75 6.752h-3.5c-.414 0-.75.336-.75.75s.336.75.75.75h3.5v3.5c0 .414.336.75.75.75s.75-.336.75-.75v-3.5h3.5c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-3.5v-3.5c0-.414-.336-.75-.75-.75s-.75.336-.75.75z"
                      fillRule="nonzero"
                    />
                  </svg>
                  <span className="mr-4">اضافة شركة جديدة</span>
                </NavLink>
              </li>
              <li className="relative px-6 py-3">
                {pathname === '/dashboard/joinRequests' && <ActiveLinkElement />}
                <NavLink to={'/dashboard/joinRequests'} className={linkClassName}>
                  <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      d="m22 8c0-.478-.379-1-1-1h-13c-.62 0-1 .519-1 1v13c0 .621.52 1 1 1h13c.478 0 1-.379 1-1zm-16-2h13.25c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-13.75c-.53 0-1 .47-1 1v13.75c0 .414.336.75.75.75s.75-.336.75-.75zm-2.5-2.5h13.75c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-14.25c-.53 0-1 .47-1 1v14.25c0 .414.336.75.75.75s.75-.336.75-.75z"
                      fillRule="nonzero"
                    />
                  </svg>
                  <span className="mr-4">طلبات الانضمام</span>
                </NavLink>
              </li>
              <li className="relative px-6 py-3">
                {pathname === '/dashboard/companies' && <ActiveLinkElement />}
                <NavLink to={'/dashboard/companies'} className={linkClassName}>
                  <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      d="m22 8c0-.478-.379-1-1-1h-13c-.62 0-1 .519-1 1v13c0 .621.52 1 1 1h13c.478 0 1-.379 1-1zm-16-2h13.25c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-13.75c-.53 0-1 .47-1 1v13.75c0 .414.336.75.75.75s.75-.336.75-.75zm-2.5-2.5h13.75c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-14.25c-.53 0-1 .47-1 1v14.25c0 .414.336.75.75.75s.75-.336.75-.75z"
                      fillRule="nonzero"
                    />
                  </svg>
                  <span className="mr-4"> شركات</span>
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </aside>
  );
};

export default Aside;
