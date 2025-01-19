import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';

const NavigationBar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container">
                <a className="navbar-brand" href="#"><img src={'/3.jpg'} alt="logo" width={80} /></a>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav  mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link active" aria-current="page" to={'/'}>Home</Link>
                        </li>
                        {user && (<li className="nav-item">
                            <Link className="nav-link" to={'/hotels'}>Hotels</Link>
                        </li>)}
                        {user?.role === 'user' && (
                            <li className="nav-item">
                                <Link className="nav-link" to={'/bookings'}>My Bookings</Link>
                            </li>
                        )}
                        {user?.role === 'admin' && (
                            <li className="nav-item">
                                <Link className="nav-link" to={'/addhotel'}>Add Hotel</Link>
                            </li>
                        )}
                    </ul>
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                        {token ? (
                            <>
                                <Dropdown>
                                    <Dropdown.Toggle variant="link" id="dropdown-basic">
                                        <img src="/avatar.png" alt="avatar" className="rounded-circle" width={40} height={40} />
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.ItemText>{user.name}</Dropdown.ItemText>
                                        <Dropdown.ItemText>{user.email}</Dropdown.ItemText>
                                        <Dropdown.Divider />
                                        <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="btn btn-outline-primary me-2" to="/login">Login</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="btn btn-primary" to="/register">Register</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default NavigationBar;