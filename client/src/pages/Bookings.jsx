import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { Container, Card, Row, Col, Badge } from 'react-bootstrap';
import { Calendar, Building, BedDouble, User, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import {MY_BOOKINGS_QUERY} from "../graphql/queries/bookings.js";
import {useToast} from "../context/ToastContext.jsx";
import {getStatusBadgeColor} from "../constants/StatusBadgeColor.js";
import '../index.css'

const MyBookings = () => {
    const { loading, error, data } = useQuery(MY_BOOKINGS_QUERY);
    const { showToast } = useToast();
    if (loading) return (
        <Container className="py-5 background">
            <div className="text-center">Loading your bookings...</div>
        </Container>
    );

    if (error) return (
        showToast(`Error: ${error.message}`)
    );

    const bookings = data?.me?.bookings || [];

    return (
        <div className="background">
        <Container className="py-5 ba ">
            <h1 className="mb-4">My Bookings</h1>
            {bookings.length === 0 ? (
                <Card className="text-center p-5 bg-light-subtle">
                    <Card.Body>
                        <h3>No bookings found</h3>
                        <p>You haven't made any bookings yet.</p>
                    </Card.Body>
                </Card>
            ) : (
                bookings.map((booking) => (
                    <Card key={booking.id} className="mb-4 shadow-sm">
                        <Card.Header className="bg-light">
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">
                                    <Building className="me-2" size={20} />
                                    {booking.hotel.name}
                                </h5>
                                <Badge bg={getStatusBadgeColor(booking.status)}>
                                    {booking.status}
                                </Badge>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col md={4}>
                                    {booking.hotel.images?.[0] && (
                                        <img
                                            src={booking.hotel.images[0]}
                                            alt={booking.hotel.name}
                                            className="img-fluid rounded mb-3"
                                            style={{ objectFit: 'cover', height: '200px', width: '100%' }}
                                        />
                                    )}
                                </Col>
                                <Col md={8}>
                                    <Row className="mb-3">
                                        <Col md={6}>
                                            <div className="d-flex align-items-center mb-2">
                                                <BedDouble className="me-2" size={20} />
                                                <strong>Room Type:</strong>
                                            </div>
                                            <p>{booking.room.roomType}</p>
                                        </Col>
                                        <Col md={6}>
                                            <div className="d-flex align-items-center mb-2">
                                                <strong>Price per night:</strong>
                                            </div>
                                            <p>₹{booking.room.price}</p>
                                        </Col>
                                    </Row>
                                    <Row className="mb-3">
                                        <Col md={6}>
                                            <div className="d-flex align-items-center mb-2">
                                                <Calendar className="me-2" size={20} />
                                                <strong>Check-in:</strong>
                                            </div>
                                            <p>{format(new Date(booking.startDate), 'MMM dd, yyyy')}</p>
                                        </Col>
                                        <Col md={6}>
                                            <div className="d-flex align-items-center mb-2">
                                                <Calendar className="me-2" size={20} />
                                                <strong>Check-out:</strong>
                                            </div>
                                            <p>{format(new Date(booking.endDate), 'MMM dd, yyyy')}</p>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={6}>
                                            <div className="d-flex align-items-center mb-2">
                                                <User className="me-2" size={20} />
                                                <strong>Guests:</strong>
                                            </div>
                                            <p>{booking.guestCount} guests</p>
                                        </Col>
                                        <Col md={6}>
                                            <div className="d-flex align-items-center mb-2">
                                                <Building className="me-2" size={20} />
                                                <strong>Address:</strong>
                                            </div>
                                            <p>{booking.hotel.address}</p>
                                        </Col>
                                    </Row>
                                    {booking.room.features && booking.room.features.length > 0 && (
                                        <div>
                                            <strong>Room Features:</strong>
                                            <div className="d-flex flex-wrap gap-2 mt-2">
                                                {booking.room.features.map((feature, index) => (
                                                    <Badge key={index} bg="light" text="dark">
                                                        {feature}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                ))
            )}
        </Container>
        </div>
    );
};

export default MyBookings;