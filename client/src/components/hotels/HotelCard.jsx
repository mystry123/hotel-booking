import React, { useState } from 'react';
import { EditIcon, Trash } from 'lucide-react';
import { useMutation } from '@apollo/client';
import { Coffee, MapPin } from 'lucide-react';
import { Card, Button, Badge } from 'react-bootstrap';
import HotelDetailModal from "./modals/HotelDetailModal.jsx";
import { useNavigate } from "react-router-dom";
import { DELETE_HOTEL_MUTATION } from "../../graphql/mutations/hotel.js";
import { useToast } from '../../context/ToastContext';
import {PRIMARY_COLOR, PRIMARY_BORDER_COLOR, SECONDARY_COLOR, SECONDARY_BORDER_COLOR} from '../../constants/colors';
import ShowMoreText from 'react-show-more-text'
/**
 * HotelCard component displays a card with hotel information and actions.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.hotel - The hotel data.
 * @param {string} props.hotel.id - The hotel ID.
 * @param {string} props.hotel.name - The hotel name.
 * @param {string} [props.hotel.address] - The hotel address.
 * @param {string} [props.hotel.description] - The hotel description.
 * @param {Array} [props.hotel.amenities] - The list of hotel amenities.
 * @param {Array} [props.hotel.images] - The list of hotel images.
 * @returns {JSX.Element} The rendered HotelCard component.
 */

const HotelCard = ({ hotel }) => {
    const [showModal, setShowModal] = useState(false);
    const [deleteHotel] = useMutation(DELETE_HOTEL_MUTATION, {
        variables: { id: hotel.id },
        refetchQueries: ['Hotels'],
    });
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const { showToast } = useToast();

    /**
     * Handles the deletion of the hotel.
     */
    const handleDelete = async () => {
        try {
            await deleteHotel();
            showToast('Hotel deleted successfully!');
        } catch (error) {
            showToast(`Error deleting hotel: ${error.message}`);
        }
    };

    const displayImage = hotel.images?.[0] || '/api/placeholder/400/300';

    return (
        <Card className="h-100 border-0 shadow hover:shadow-xl transition-shadow duration-300 ">
            <div className="position-relative">
                {hotel.amenities?.length > 0 && (
                    <div className="position-absolute" style={{ top: '8px', left: '8px', zIndex: 10 }}>
                        <Badge bg="light" className="text-dark opacity-90">
                            <Coffee className="inline-block mr-1" size={16} />
                            {hotel.amenities.length} amenities
                        </Badge>
                    </div>
                )}

                {/* Image Container */}
                <div style={{ position: 'relative', paddingTop: '75%' }}>
                    <img
                        src={displayImage}
                        alt={hotel.name}
                        className="position-absolute"
                        style={{
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }}
                    />
                </div>
            </div>

            <Card.Body className="d-flex flex-column gap-3">
                <Card.Title className="text-xl font-semibold mb-1">
                    {hotel.name}
                </Card.Title>

                {hotel.address && (
                    <div className="flex items-center text-gray-600 mb-1">
                        <MapPin size={16} className="mr-1" />
                        <small>{hotel.address}</small>
                    </div>
                )}

                {hotel.description && (
                    <Card.Text className="text-gray-700 mb-1">
                        <ShowMoreText
                            lines={3}
                            more="Show more"
                            less="Show less"
                            className="content-css"
                            anchorClass="my-anchor-css-class"
                            expanded={false}
                            width={0}
                        >
                            {hotel.description}
                        </ShowMoreText>
                    </Card.Text>
                )}
                <div className="gap-1 mt-auto">
                    {hotel.amenities?.length > 0 && (
                        <div className="mb-1">
                            {hotel.amenities.map((amenity, index) => (
                                <Badge
                                    key={index}
                                    bg="secondary"
                                    className="me-1 mb-1"
                                >
                                    {amenity}
                                </Badge>
                            ))}
                        </div>
                    )}
                    <div className="d-flex align-items-center gap-1 mt-auto">
                        <Button
                            className="flex-grow-1"
                            style={{
                                backgroundColor: PRIMARY_COLOR,
                                borderColor: PRIMARY_BORDER_COLOR
                            }}
                            onClick={() => setShowModal(true)}
                        >
                            {user?.role === "user" ? "Book Now":  "View Details" }
                        </Button>
                        {user?.role === 'admin' && (
                            <>
                                <Button
                                    variant="light"
                                    className="rounded-circle p-2 d-flex align-items-center justify-content-center"
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        backgroundColor: 'white',
                                        borderColor: SECONDARY_BORDER_COLOR
                                    }}
                                    onClick={handleDelete}
                                >
                                    <Trash style={{ color: SECONDARY_COLOR }} />
                                </Button>
                                <Button
                                    variant="light"
                                    className="rounded-circle p-2 d-flex align-items-center justify-content-center"
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        backgroundColor: 'white',
                                        borderColor: SECONDARY_BORDER_COLOR
                                    }}
                                    onClick={() => navigate(`/edithotel/${hotel.id}`)}
                                >
                                    <EditIcon style={{ color: SECONDARY_COLOR }} />
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </Card.Body>
            <HotelDetailModal
                show={showModal}
                onHide={() => setShowModal(false)}
                hotelId={hotel.id}
            />
        </Card>
    );
};

export default HotelCard;