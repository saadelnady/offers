import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ isAuth, redirectTo, children }) => {
  return isAuth ? <>{children}</> : <Navigate to={redirectTo} />;
};

export default ProtectedRoute;
