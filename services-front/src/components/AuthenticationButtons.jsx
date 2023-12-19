import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { MenuContext } from '../contexts/Menu';

const AuthenticationButtons = () => {

  // floatingMenu 
  const { isMenu, setIsMenu } = useContext(MenuContext);

  const linkStyle = 'rounded border border-purple-600 px-6 py-1 font-medium focus:outline-none text-center max-w-[200px]';

  return (
    <div className="flex flex-col md:flex-row justify-start md:items-center gap-5">
      <Link
        onClick={() => setIsMenu(false)}
        to={'/login'}
        className={`${linkStyle} bg-purple-600 text-white dark:hover:bg-gray-900 hover:bg-white dark:hover:text-white hover:text-purple-600  active:text-purple-600`}
      >
        دخول
      </Link>
      <Link
        onClick={() => setIsMenu(false)}
        to={'/register'}
        className={`${linkStyle} bg-white text-purple-600 dark:text-white hover:bg-purple-600 hover:text-white dark:bg-gray-900 dark:hover:bg-purple-600 active:bg-purple-600`}
      >
        تسجيل
      </Link>
    </div>
  );
};

export default AuthenticationButtons;
