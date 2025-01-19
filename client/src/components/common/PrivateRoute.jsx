import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const PrivateRoute = ({ children, adminOnly }) => {
    const { user, loading } = useContext(AuthContext);
    if (loading) {
        return null;
    }
    if (!user) {

        return <Navigate to="/login" />;
    }

    if (adminOnly && !user.role === 'admin') {
        return <Navigate to="/" />;
    }
    console.log('PrivateRoute:', children , user.role);


    return children;
};

export default PrivateRoute;