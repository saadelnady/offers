import { Outlet } from 'react-router-dom';
import Aside from '../components/Aside';
import DashHeader from '../components/AdminHeader';

const LayoutCompany = () => {
  return (
    <div className={`flex  bg-gray-50 dark:bg-gray-900 h-auto`}>
      <div className='hidden md:block'>
        <Aside />
      </div>
      <div className="flex flex-col flex-1 min-h-screen bg-gray-50 dark:bg-gray-900 h-auto">
        <DashHeader />
        <main
          className="h-full pb-16 "

        >
          <div
            className="container px-6 mx-auto grid "

          >
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default LayoutCompany;
