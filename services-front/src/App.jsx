import { useContext, useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AdminMenu, Menu, ProtectedRoute, Spinner } from './components';
import {
  AddNewCompany,
  AddService,
  AllServices,
  CompanyDetails,
  CompanyOrders,
  CompanyService,
  ErrorPage,
  JoinRequest,
  Login,
  Profile,
  Register,
  ServiceDetails,
  CompanyJoinRequests,
  CompanyOrder,
  Companies,
} from './pages';
import { LayoutCompany, LayoutHome } from './layouts';
import { AuthContext, DarkModeContext } from './contexts';
import { MenuContext } from './contexts/Menu';

function App() {
  // dark mode context
  const { isDarkMode } = useContext(DarkModeContext);

  // which Router based on User that did log in
  const { user } = useContext(AuthContext);

  const isUser = user?.user?.role === 'User';
  const isCompany = user?.user?.role === 'Company';
  const isAdmin = user?.user?.role === 'Admin';
  const isGuest = !isUser && !isCompany && !isAdmin;

  if (user === undefined) return (
    <div className='h-screen w-screen flex justify-center items-center ' >
      <Spinner />
    </div>
  )

  // menu
  const { isMenu, toggleMenu } = useContext(MenuContext);

  // jsx
  return (
    <div className={`${isDarkMode ? 'dark' : 'light'} font-cairo bg-gray-50 dark:bg-gray-900 overflow-y-auto`}>
      <ToastContainer />
      {isAdmin ? <AdminMenu /> : <Menu />}
      <Routes>
        {/* User Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute isAuth={isGuest || isUser} redirectTo={'/dashboard/services'}>
              <LayoutHome />
            </ProtectedRoute>
          }
        >
          <Route index element={<AllServices />} />
          <Route path="service/:id" element={<ServiceDetails />} />
          <Route path="company/:id" element={<CompanyDetails />} />
          <Route path="join-request" element={<JoinRequest />} />
          <Route
            path="register"
            element={
              <ProtectedRoute isAuth={isGuest} redirectTo={'/'}>
                <Register />
              </ProtectedRoute>
            }
          />
          <Route
            path="login"
            element={
              <ProtectedRoute isAuth={isGuest} redirectTo={'/'}>
                <Login />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute isAuth={isUser} redirectTo={'/login'}>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<ErrorPage />} />
        </Route>

        {/* Dashboard Routes */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isAuth={isAdmin || isCompany} redirectTo={'/login'}>
              <LayoutCompany />
            </ProtectedRoute>
          }
        >
          <Route path="services" index element={<CompanyService />} />
          <Route path="service/:id" element={<ServiceDetails />} />
          <Route path="service/edit/:id" element={<AddService />} />
          <Route path="add-service" element={<AddService />} />
          <Route path="orders" element={<CompanyOrders />} />
          <Route path="order/:id" element={<CompanyOrder />} />
          <Route path="companies" element={<Companies />} />
          <Route path="profile" element={<Profile isCompany />} />
          <Route
            path="add-new-company"
            element={
              <ProtectedRoute isAuth={isAdmin} redirectTo={'/dashboard/services'}>
                <AddNewCompany />
              </ProtectedRoute>
            }
          />
          <Route
            path="joinRequests"
            element={
              <ProtectedRoute isAuth={isAdmin} redirectTo={'/dashboard/services'}>
                <CompanyJoinRequests />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to={'/dashboard/services'} />} />
        </Route>

        {/* Redirect to Home for unmatched routes */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </div>
  );
}

export default App;
