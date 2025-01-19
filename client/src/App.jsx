import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { client } from './utils/apolloClient';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Hotels from './pages/Hotels';
import AddHotel from './pages/AddHotel.jsx';
import Bookings from './pages/Bookings';
import PrivateRoute from './components/common/PrivateRoute';
import Notfound from "./pages/Notfound.jsx";
import { ToastProvider } from './context/ToastContext';
import GlobalToast from './components/common/GlobalToast.jsx';
function App() {
    return (
        <ApolloProvider client={client}>
            <AuthProvider>
                <ToastProvider>
                <Router>
                    <Layout>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/hotels" element={<Hotels />} />
                            <Route
                                path="/addhotel"
                                element={
                                    <PrivateRoute adminOnly>
                                        <AddHotel />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/edithotel/:hotelId"
                                element={
                                    <PrivateRoute adminOnly>
                                        <AddHotel />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/bookings"
                                element={
                                    <PrivateRoute>
                                        <Bookings />
                                    </PrivateRoute>
                                }
                            />
                            <Route path="*" element={<Notfound/>} />
                        </Routes>
                    </Layout>
                </Router>
                    <GlobalToast/>
                </ToastProvider>
            </AuthProvider>
        </ApolloProvider>
    );
}

export default App;