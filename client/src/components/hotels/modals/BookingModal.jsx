import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useFormik } from 'formik';
import { CREATE_BOOKING } from '../../../graphql/mutations/booking';
import { useToast } from '../../../context/ToastContext';
import {validationSchema} from "../../../validationSchemas/bookingschema.js";

const BookingModal = ({ show, onHide, room, hotelId }) => {
    const { showToast } = useToast();

    const [createBooking, { loading }] = useMutation(CREATE_BOOKING, {
        onCompleted: () => {
            onHide();
            showToast('Booking created successfully!');
        },
        onError: (error) => {
            showToast(`Error: ${error.message}`);
        },
    });

    const formik = useFormik({
        initialValues: {
            startDate: '',
            endDate: '',
            guestCount: 1,
            specialRequests: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            const totalPrice = calculateTotalPrice(values.startDate, values.endDate);

            try {
                await createBooking({
                    variables: {
                        input: {
                            roomId: room.id,
                            startDate: values.startDate,
                            endDate: values.endDate,
                            guestCount: parseInt(values.guestCount),
                            specialRequests: values.specialRequests,
                            totalPrice
                        }
                    },
                    refetchQueries: ['GetHotelDetails']
                });
            } catch (err) {
                showToast('Failed to create booking. Please try again.');
            }
        },
    });

    const calculateTotalPrice = (startDate, endDate) => {
        if (!startDate || !endDate) return 0;
        const start = new Date(startDate);
        const end = new Date(endDate);
        const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        return nights * room.price;
    };

    return (
        <Modal
            show={show}
            onHide={onHide}
            size="md"
            aria-labelledby="booking-modal"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="booking-modal">
                    Book {room.roomType}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={formik.handleSubmit}>
                    <div className="mb-3 p-3 bg-light rounded">
                        <div className="mb-2">
                            <strong>Room Details</strong>
                        </div>
                        <div>Room Type: {room.roomType}</div>
                        <div>Room ID: {room.id}</div>
                        <div>Price per night: ₹{room.price}</div>
                    </div>

                    <Form.Group className="mb-3">
                        <Form.Label>Check-in Date :</Form.Label>
                        <DatePicker
                            selected={formik.values.startDate}
                            onChange={(date) => formik.setFieldValue('startDate', date)}
                            minDate={new Date()}
                            dateFormat="yyyy-MM-dd"
                            className="form-control"
                            required
                        />
                        {formik.touched.startDate && formik.errors.startDate ? (
                            <div className="text-danger">{formik.errors.startDate}</div>
                        ) : null}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Check-out Date :</Form.Label>
                        <DatePicker
                            selected={formik.values.endDate}
                            onChange={(date) => formik.setFieldValue('endDate', date)}
                            minDate={formik.values.startDate || new Date()}
                            dateFormat="yyyy-MM-dd"
                            className="form-control"
                            required
                        />
                        {formik.touched.endDate && formik.errors.endDate ? (
                            <div className="text-danger">{formik.errors.endDate}</div>
                        ) : null}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Number of Guests</Form.Label>
                        <Form.Control
                            type="number"
                            name="guestCount"
                            value={formik.values.guestCount}
                            onChange={formik.handleChange}
                            min="1"
                            max="10"
                            required
                        />
                        {formik.touched.guestCount && formik.errors.guestCount ? (
                            <div className="text-danger">{formik.errors.guestCount}</div>
                        ) : null}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Special Requests</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="specialRequests"
                            value={formik.values.specialRequests}
                            onChange={formik.handleChange}
                            rows={3}
                            placeholder="Any special requests or requirements?"
                        />
                    </Form.Group>

                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div>
                            <strong>Price per night:</strong> ₹{room.price}
                        </div>
                        <div>
                            <strong>Total Price:</strong> ₹{calculateTotalPrice(formik.values.startDate, formik.values.endDate)}
                        </div>
                    </div>

                    <div className="d-flex justify-content-end gap-2">
                        <Button variant="secondary" onClick={onHide}>
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            type="submit"
                            disabled={loading}
                            style={{
                                backgroundColor: '#F27851',
                                borderColor: '#F27851'
                            }}
                        >
                            {loading ? 'Booking...' : 'Confirm Booking'}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default BookingModal;