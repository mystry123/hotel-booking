import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import {Container, Row, Col, Card} from 'react-bootstrap';
import HotelCard from '../components/hotels/HotelCard';
import '../index.css';
import { HOTELS_QUERY } from "../graphql/queries/hotel.js";
import { useToast } from '../context/ToastContext';

const Home = () => {
    const { loading, error, data } = useQuery(HOTELS_QUERY);
    const { showToast } = useToast();

    useEffect(() => {
        if (error) {
            showToast(`Error: ${error.message}`);
        }
    }, [error, showToast]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const featuredHotels = data.hotels;

    return (
        <div className="min-h-screen background">
            <div className="pt-16">
                <header className="vh-80">
                    <div className="row container-fluid ">
                        <div className="col-lg-6 d-flex ms-5 justify-content-center align-items-start flex-column">
                            <h2 style={{
                                fontSize: "60px",
                                fontFamily: "Merriweather, serif",
                                fontWeight: "400",
                                fontStyle: "normal"
                            }}>
                                Find Your Perfect Stay
                            </h2>
                            <p className="my-4">
                                Discover handpicked hotels and luxury accommodations worldwide.
                                <br/>
                                Book with confidence and enjoy memorable stays.
                            </p>
                            <button type="button" className="my-4 btn btn-outline-secondary btn-lg">
                                <a href="/hotels" style={{textDecoration: "none", color: "inherit"}}>
                                    Explore Now
                                </a>
                            </button>
                        </div>
                        <div className="col-lg-5 d-flex justify-content-center align-items-start flex-column vh-100">
                            <img src="/3d-rendering-money-tree.jpg" alt="Outdoor Swimming Pool" className="ms-4 p-0"
                                 width="100%"/>
                        </div>
                    </div>
                </header>

                <section className="py-16 bg-gray-50">
                    <Container className="py-5">

                        {featuredHotels.length === 0 ? (
                            <Card className="text-center p-5 bg-light-subtle">
                                <Card.Body>
                                    <h3>No Hotels found</h3>
                                    <p>We're sorry, but we couldn't find any hotels. Please check back later.</p>
                                </Card.Body>
                            </Card>
                        ) : (
                            <>
                            <h1 className="text-center h2 mb-4">Hotels</h1>
                            <Row xs={1} md={2} lg={3} className="g-4">
                                {featuredHotels.map(hotel => (
                                    <Col key={hotel.id}>
                                        <HotelCard hotel={hotel}/>
                                    </Col>
                                ))}
                            </Row>
                            </>
                        )}
                    </Container>
                </section>
            </div>
        </div>
    );
};

export default Home;