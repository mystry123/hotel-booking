import React, { useState } from 'react';
import { Modal, Button, Badge, Carousel, ListGroup, Dropdown } from 'react-bootstrap';
import { MapPin, Phone, Coffee, Box } from 'lucide-react';
import { useQuery, useMutation } from '@apollo/client';
import BookingModal from "./BookingModal.jsx";
import ConfirmBox from '../../common/ConfirmBox.jsx';
import { GET_HOTEL_DETAILS } from "../../../graphql/queries/hotel.js";
import { UPDATE_BOOKING_STATUS } from "../../../graphql/mutations/booking.js";
import { getStatusBadgeColor } from '../../../constants/statusBadgeColor.js';
import { useToast } from '../../../context/ToastContext.jsx';
import {SECONDARY_COLOR} from "../../../constants/colors.js";

const HotelDetailModal = ({ show, onHide, hotelId }) => {
    const { loading, error, data } = useQuery(GET_HOTEL_DETAILS, {
        variables: { id: hotelId },
        skip: !hotelId
    });
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [showConfirmBox, setShowConfirmBox] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [newStatus, setNewStatus] = useState('');
    const [updateBookingStatus] = useMutation(UPDATE_BOOKING_STATUS);
    const { showToast } = useToast();

    const user = JSON.parse(localStorage.getItem('user'));

    const handleBookRoom = (room) => {
        setSelectedRoom(room);
        setShowBookingModal(true);
    };

    const handleUpdateStatus = (bookingId, status) => {
        setSelectedBooking(bookingId);
        setNewStatus(status);
        setShowConfirmBox(true);
    };

    const confirmUpdateStatus = async () => {
        try {
            await updateBookingStatus({
                variables: {
                    id: selectedBooking,
                    input: {
                        status: newStatus
                    }
                }
            });
            setShowConfirmBox(false);
            showToast('Booking status updated successfully!');
        } catch (error) {
            showToast(`Error updating booking status: ${error.message}`);
        }
    };

    if (loading) return null;
    if (error) return `Error! ${error.message}`;

    const hotel = data?.hotel;
    if (!hotel) return null;

    return (
        <>
            <Modal
                show={show}
                onHide={onHide}
                size="lg"
                aria-labelledby="hotel-detail-modal"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="hotel-detail-modal">
                        {hotel.name}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Image Carousel */}
                    <Carousel className="mb-4">
                        {hotel.images.map((image, index) => (
                            <Carousel.Item key={index}>
                                <div style={{ height: '300px', position: 'relative' }}>
                                    <img
                                        src={image || '/api/placeholder/800/600'}
                                        alt={`${hotel.name} - Image ${index + 1}`}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
                                    />
                                </div>
                            </Carousel.Item>
                        ))}
                    </Carousel>

                    {/* Hotel Info */}
                    <div className="mb-4">
                        <div className="d-flex align-items-center mb-2">
                            <MapPin size={18} className="me-2" />
                            <span>{hotel.address}</span>
                        </div>
                        {hotel.phoneNumber && (
                            <div className="d-flex align-items-center mb-2">
                                <Phone size={18} className="me-2" />
                                <span>{hotel.phoneNumber}</span>
                            </div>
                        )}
                        <div className="d-flex align-items-center mb-2">
                            <Box size={18} className="me-2" />
                            <span>{hotel.totalRooms} Total Rooms</span>
                        </div>
                        <div className="mt-3 flex">
                            <h6 className="mb-2">Starting Price : <span
                                className="text-info-emphasis"> ₹{hotel.price}/night </span></h6>
                            <h5></h5>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-4">
                        <h5>Description</h5>
                        <p className="text-gray-700 mb-1 line-clamp-2 pre-wrap">{hotel.description}</p>
                    </div>

                    {/* Amenities */}
                    <div className="mb-4">
                        <h5 className="mb-3">
                            <Coffee size={18} className="me-2" />
                            Amenities
                        </h5>
                        <div className="d-flex flex-wrap gap-2">
                            {hotel.amenities.map((amenity, index) => (
                                <Badge key={index} bg="secondary">
                                    {amenity}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* Room Types */}
                    <div className="mb-4">
                        <h5 className="mb-3">Available Rooms</h5>
                        <ListGroup>
                            {hotel.rooms.map((room) => (
                                <ListGroup.Item key={room.id} className="d-flex justify-content-between align-items-start">
                                    <div>
                                        <h6 className="mb-1">{room.roomType}</h6>
                                        <small>
                                            {room.features.map((feature, index) => (
                                                <Badge
                                                    key={index}
                                                    bg="light"
                                                    text="dark"
                                                    className="me-1"
                                                >
                                                    {feature}
                                                </Badge>
                                            ))}
                                        </small>
                                    </div>
                                    <div className="text-end">
                                        <h6 className="mb-1"> ₹{room.price}</h6>
                                        <small className="text-muted">per night</small>
                                    </div>
                                    <div>
                                        {user?.role === 'user' && (
                                            <Button
                                                variant="primary"
                                                onClick={() => handleBookRoom(room)}
                                                style={{
                                                    backgroundColor: '#F27851',
                                                    borderColor: '#F27851'
                                                }}
                                            >
                                                Book Now
                                            </Button>
                                        )}
                                    </div>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </div>

                    {user?.role === "admin" ? <div className="mb-4">
                        <h5 className="mb-3">Bookings</h5>
                        <ListGroup>
                            {hotel.bookings.map((booking) => (
                                <ListGroup.Item key={booking.id}
                                                className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h6 className="mb-1">User: {booking.user.name}</h6>
                                        <small>
                                            <div>Start Date: {new Date(booking.startDate).toLocaleDateString()}</div>
                                            <div>End Date: {new Date(booking.endDate).toLocaleDateString()}</div>
                                            <div>Guest Count: {booking.guestCount}</div>
                                            <div>Booking status:     <Badge bg={getStatusBadgeColor(booking.status)}>
                                                {booking.status}
                                            </Badge></div>
                                        </small>
                                    </div>
                                    <div className="text-end">
                                        <Dropdown>
                                            <Dropdown.Toggle variant="outline-info" id="dropdown-basic" >
                                                Update Status
                                            </Dropdown.Toggle>

                                            <Dropdown.Menu>
                                                <Dropdown.Item onClick={() => handleUpdateStatus(booking.id, 'PENDING')}>Pending</Dropdown.Item>
                                                <Dropdown.Item onClick={() => handleUpdateStatus(booking.id, 'CONFIRMED')}>Confirmed</Dropdown.Item>
                                                <Dropdown.Item onClick={() => handleUpdateStatus(booking.id, 'CANCELLED')}>Cancelled</Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </div> : null}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            {selectedRoom && (
                <BookingModal
                    show={showBookingModal}
                    onHide={() => {
                        setShowBookingModal(false);
                        setSelectedRoom(null);
                    }}
                    room={selectedRoom}
                    hotelId={hotelId}
                />
            )}
            <ConfirmBox
                show={showConfirmBox}
                onHide={() => setShowConfirmBox(false)}
                onConfirm={confirmUpdateStatus}
                modalTitle="Confirm Status Update"
                content={`Are you sure you want to update the booking status to ${newStatus}?`}
                okText="Yes, Update"
            />
        </>
    );
};

export default HotelDetailModal;