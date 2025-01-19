import React from 'react';
import { useQuery } from '@apollo/client';
import HotelCard from '../components/hotels/HotelCard';
import '../index.css';
import {Card, Col, Container, Row} from "react-bootstrap";
import { HOTELS_QUERY } from "../graphql/queries/hotel.js";
import { useToast } from '../context/ToastContext';

const Hotels = () => {
    const { loading, error, data } = useQuery(HOTELS_QUERY);
    const { showToast } = useToast();

    if (loading) return <p>Loading...</p>;
    if (error) {
        showToast(`Error: ${error.message}`);
        return <p>Error: {error.message}</p>;
    }

    const hotels = data.hotels;

    return (
        <div className="min-h-screen  background">
            <Container className="py-5 text-center">
                <h1 className="text-center h2 mb-4">Hotels</h1>
                {hotels.length === 0 ? (
                            <Card className="text-center p-5 bg-light-subtle">
                                <Card.Body>
                                    <h3>No Hotels found</h3>
                                    <p>We're sorry, but we couldn't find any hotels. Please check back later.</p>
                                </Card.Body>
                            </Card>
                ) : (
                    <Row xs={1} md={2} lg={3} className="g-4">
                        {hotels.map(hotel => (
                            <Col key={hotel.id}>
                                <HotelCard hotel={hotel} />
                            </Col>
                        ))}
                    </Row>
                )}
            </Container>
        </div>
    );
};

export default Hotels;