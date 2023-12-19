import Header from '../components/Header';
import { Outlet } from 'react-router-dom';

function LayoutHome() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <Header />

      <div className="min-h-[95vh] mt-[2vh] max-w-7xl mx-auto ">
        <Outlet />
      </div>
    </div>
  );
}

export default LayoutHome;
