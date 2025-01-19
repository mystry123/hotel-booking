import React, { useState, useEffect } from 'react';
import { Formik, FieldArray } from 'formik';
import { Form, Button, Card, Row, Col, Badge, Dropdown } from 'react-bootstrap';
import { Plus, X, Building, BedDouble } from 'lucide-react';
import FileUploadModal from '../components/hotels/modals/ImageUpload.jsx';
import { useMutation, useQuery, gql } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';
import { GET_HOTEL_QUERY_FOR_ADMIN } from '../graphql/queries/hotel.js';
import {CREATE_ROOM_MUTATION, UPDATE_ROOM_MUTATION} from "../graphql/mutations/room.js";
import {CREATE_HOTEL_MUTATION, UPDATE_HOTEL_MUTATION} from "../graphql/mutations/hotel.js";
import {useToast} from "../context/ToastContext.jsx";
import HotelSchema from '../validationSchemas/hotelSchema';
import {FilePreviewList} from '../components/hotels/FilePreviewList.jsx';
import '../index.css'




const HotelForm = () => {
    const [amenityInput, setAmenityInput] = useState('');
    const [featureInput, setFeatureInput] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { hotelId } = useParams();
   const { showToast } = useToast();
    const { data: hotelData, loading: loadingHotel, error: errorHotel } = useQuery(GET_HOTEL_QUERY_FOR_ADMIN, {
        variables: { id: hotelId },
        skip: !hotelId
    });

    const [createHotel, { loading: creatingHotel, error: createHotelError }] = useMutation(CREATE_HOTEL_MUTATION);
    const [updateHotel, { loading: updatingHotel, error: updateHotelError }] = useMutation(UPDATE_HOTEL_MUTATION);
    const [createRoom, { loading: creatingRoom, error: createRoomError }] = useMutation(CREATE_ROOM_MUTATION);
    const [updateRoom, { loading: updatingRoom, error: updateRoomError }] = useMutation(UPDATE_ROOM_MUTATION);

    const [initialValues, setInitialValues] = useState({
    name: '',
    description: '',
    price: '',
    availableRooms: '',
    amenities: [],
    images: [],
    address: '',
    phoneNumber: '',
    rooms: []
});
useEffect(() => {
    if (hotelData) {
        const { hotel } = hotelData;
        setUploadedFiles(hotel.images);
        setInitialValues({
            name: hotel.name,
            description: hotel.description,
            price: hotel.price,
            availableRooms: hotel.rooms.length,
            amenities: hotel.amenities,
            images: hotel.images,
            address: hotel.address,
            phoneNumber: hotel.phoneNumber,
            rooms: hotel.rooms.map(room => ({
                id: room.id,
                roomType: room.roomType,
                price: room.price,
                features: room.features
            }))
        });
    }
}, [hotelData]);

    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
    const MAX_FILES = 12;

    const validateFiles = (files, existingFiles = []) => {
        // Check for total number of files
        const totalFiles = files.length + existingFiles.length;
        if (totalFiles > MAX_FILES) {

            return false;
        }

        // Check each new file
        for (const file of files) {
            // Skip if it's a string (existing URL)
            if (typeof file === 'string') continue;

            // Check file size
            if (file.size > MAX_FILE_SIZE) {
               showToast(`File "${file.name}" is too large`);
                return false;
            }

            // Check if it's an image
            if (!file.type.startsWith('image/')) {
                showToast(`File "${file.name}" is not an image`);
                return false;
            }
        }

        return true;
    };

    const handleFileUpload = (file) => {
        setUploadedFiles(prev => [...prev, file]);
       showToast(`File "${file.name}" uploaded successfully`);
    };

    const handleDeleteFile = (indexToDelete) => {
        setUploadedFiles(prev => prev.filter((_, index) => index !== indexToDelete));
    };

    const handleSubmit = async (values, { setSubmitting }) => {
        setIsLoading(true);

        if (!validateFiles(uploadedFiles)) {
            setIsLoading(false);
            setSubmitting(false);
            return;
        }

        // Upload files first
        let uploadedUrls = [];
        const filesFromCloudinary = [];

        if (uploadedFiles.length > 0) {
            try {
                // Process each file for upload
                const uploadPromises = uploadedFiles.map(async (file) => {
                    // If the file is already a URL (previously uploaded), keep it
                    if (typeof file === 'string') {
                        filesFromCloudinary.push(file);
                        return null;
                    }

                    // Create FormData for each file
                    const data = new FormData();
                    data.append('file', file);
                    data.append('upload_preset', 'kartalucia');
                    data.append('cloud_name', 'dulvlbprk');
                    data.append('resource_type', 'auto');

                    // Upload to Cloudinary
                    const response = await fetch(
                        'http://api.cloudinary.com/v1_1/dulvlbprk/image/upload',
                        {
                            method: 'POST',
                            mode: "cors",
                            body: data,
                            headers: {
                                'Accept': 'application/json'
                            }
                        }
                    );

                    if (!response.ok) {
                        showToast(`File "${file.name}" upload failed`);
                        setIsLoading(false);
                        setSubmitting(false);
                        return;
                    }

                    const responseData = await response.json();
                    return responseData?.secure_url;
                });

                const results = await Promise.all(uploadPromises);
                // Filter out null values (from existing URLs) and add to uploadedUrls
                uploadedUrls = results.filter(url => url !== null);

                showToast('Files uploaded successfully');
            } catch (error) {
              showToast('Upload failed');
                setIsLoading(false);
                setSubmitting(false);
                return;
            }
        }

        // Update form values with uploaded file URLs
        values.images = [...filesFromCloudinary, ...uploadedUrls];

        try {
            if (hotelId) {
                // Update hotel
                await updateHotel({
                    variables: {
                        id: hotelId,
                        input: {
                            name: values.name,
                            description: values.description,
                            price: values.price,
                            amenities: values.amenities,
                            availableRooms: values.availableRooms,
                            images: values.images,
                            address: values.address,
                            phoneNumber: values.phoneNumber
                        }
                    }
                });

                // Update rooms
                const roomPromises = values.rooms.map(room => {

                    console.log('room', room);
                    if (room.id) {
                        return updateRoom({
                            variables: {
                                id: room.id,
                                input: {
                                    roomType: room.roomType,
                                    price: room.price,
                                    features: room.features
                                }
                            }
                        });
                    } else {
                        return createRoom({
                            variables: {
                                input: {
                                    hotelId: hotelId,
                                    roomType: room.roomType,
                                    price: room.price,
                                    features: room.features
                                }
                            }
                        });
                    }
                });

                await Promise.all(roomPromises);
            } else {
                // Create hotel
                const { data: hotelData } = await createHotel({
                    variables: {
                        input: {
                            name: values.name,
                            description: values.description,
                            price: values.price,
                            amenities: values.amenities,
                            availableRooms: values.availableRooms,
                            images: values.images,
                            address: values.address,
                            phoneNumber: values.phoneNumber
                        }
                    }
                });

                // Create rooms
                const roomPromises = values.rooms.map(room => createRoom({
                    variables: {
                        input: {
                            hotelId: hotelData.createHotel.id,
                            roomType: room.roomType,
                            price: room.price,
                            features: room.features
                        }
                    }
                }));

                await Promise.all(roomPromises);
            }

           showToast('Hotel saved successfully');
        } catch (error) {
              showToast(`Error saving hotel: ${error.message}`);
        }
        setIsLoading(false);
        setSubmitting(false);
        navigate('/hotels');
    };

    return (
        <div className="  background">
            <Card className="container shadow-sm">
                <Card.Body>
                    <div className="d-flex align-items-center mb-4">
                        <Building className="text-info me-2" size={24} />
                        <h2 className="mb-0">{hotelId ? 'Update Hotel' : 'Add New Hotel'}</h2>
                    </div>

                    <Formik
                        initialValues={initialValues}
                        validationSchema={HotelSchema}
                        onSubmit={handleSubmit}
                        enableReinitialize
                    >
                        {({
                              handleSubmit,
                              handleChange,
                              values,
                              touched,
                              errors,
                              isSubmitting
                          }) => (
                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Hotel Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="name"
                                                value={values.name}
                                                onChange={handleChange}
                                                isInvalid={touched.name && errors.name}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.name}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>

                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Base Price</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="price"
                                                value={values.price}
                                                onChange={handleChange}
                                                isInvalid={touched.price && errors.price}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.price}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        name="description"
                                        value={values.description}
                                        onChange={handleChange}
                                    />
                                </Form.Group>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Available Rooms</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="availableRooms"
                                                value={values.availableRooms}
                                                onChange={handleChange}
                                                isInvalid={touched.availableRooms && errors.availableRooms}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.availableRooms}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>

                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Phone Number</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="phoneNumber"
                                                value={values.phoneNumber}
                                                onChange={handleChange}
                                                isInvalid={touched.phoneNumber && errors.phoneNumber}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.phoneNumber}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3">
                                    <Form.Label>Address</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="address"
                                        value={values.address}
                                        onChange={handleChange}
                                        isInvalid={touched.address && errors.address}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.address}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Images</Form.Label>
                                    <div className="flex !justify-between items-center mr-5">
                                        {/* Display uploaded files */}
                                        <FilePreviewList
                                            files={uploadedFiles}
                                            onDelete={handleDeleteFile}
                                            setIsModalOpen={setIsModalOpen}
                                        />

                                        {/* File Upload Modal */}
                                        <FileUploadModal
                                            isOpen={isModalOpen}
                                            onClose={() => setIsModalOpen(false)}
                                            onUpload={handleFileUpload}
                                        />
                                    </div>
                                    {touched.images && errors.images && (
                                        <div className="text-danger mt-1">
                                            <small>{errors.images}</small>
                                        </div>
                                    )}
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Amenities</Form.Label>
                                    <FieldArray name="amenities">
                                        {({ push, remove }) => (
                                            <div>
                                                <div className="d-flex gap-2 mb-2">
                                                    <Form.Control
                                                        type="text"
                                                        value={amenityInput}
                                                        onChange={(e) => setAmenityInput(e.target.value)}
                                                        placeholder="Add amenity"
                                                    />
                                                    <Button
                                                        variant="outline-info"
                                                        onClick={() => {
                                                            if (amenityInput.trim()) {
                                                                push(amenityInput.trim());
                                                                setAmenityInput('');
                                                            }
                                                        }}
                                                    >
                                                        <Plus size={16} />
                                                    </Button>
                                                </div>
                                                <div className="d-flex gap-2 flex-wrap">
                                                    {values.amenities.map((amenity, index) => (
                                                        <Badge
                                                            key={index}
                                                            bg="light"
                                                            text="dark"
                                                            className="d-flex align-items-center gap-1 p-2"
                                                        >
                                                            {amenity}
                                                            <X
                                                                size={14}
                                                                className="cursor-pointer"
                                                                onClick={() => remove(index)}
                                                            />
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </FieldArray>
                                </Form.Group>

                                <Card className="mb-3 bg-light">
                                    <Card.Body>
                                        <div className="d-flex align-items-center mb-3">
                                            <BedDouble className="text-info me-2" size={24} />
                                            <h4 className="mb-0">Rooms</h4>
                                        </div>

                                        <FieldArray name="rooms">
                                            {({ push, remove }) => (
                                                <div>
                                                    {values.rooms.map((room, index) => (
                                                        <Card key={index} className="mb-3">
                                                            <Card.Body>
                                                                <div className="d-flex justify-content-between align-items-center mb-3">
                                                                    <h5 className="mb-0">Room {index + 1}</h5>
                                                                    <Button
                                                                        variant="outline-danger"
                                                                        size="sm"
                                                                        onClick={() => remove(index)}
                                                                    >
                                                                        <X size={16} />
                                                                    </Button>
                                                                </div>

                                                                <Row>
                                                                    <Col md={6}>
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Label>Room Type</Form.Label>
                                                                            <Form.Select
                                                                                name={`rooms.${index}.roomType`}
                                                                                value={room.roomType}
                                                                                onChange={handleChange}
                                                                            >
                                                                                <option value="">Select Room Type</option>
                                                                                <option value="Single">Single</option>
                                                                                <option value="Double">Double</option>
                                                                                <option value="Suite">Suite</option>
                                                                                <option value="Family">Family</option>
                                                                            </Form.Select>
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col md={6}>
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Label>Price</Form.Label>
                                                                            <Form.Control
                                                                                type="number"
                                                                                name={`rooms.${index}.price`}
                                                                                value={room.price}
                                                                                onChange={handleChange}
                                                                            />
                                                                        </Form.Group>
                                                                    </Col>
                                                                </Row>

                                                                <FieldArray name={`rooms.${index}.features`}>
                                                                    {({ push: pushFeature, remove: removeFeature }) => (
                                                                        <div>
                                                                            <Form.Label>Features</Form.Label>
                                                                            <div className="d-flex gap-2 mb-2">
                                                                                <Form.Control
                                                                                    type="text"
                                                                                    value={featureInput}
                                                                                    onChange={(e) => setFeatureInput(e.target.value)}
                                                                                    placeholder="Add feature"
                                                                                />
                                                                                <Button
                                                                                    variant="outline-info"
                                                                                    onClick={() => {
                                                                                        if (featureInput.trim()) {
                                                                                            pushFeature(featureInput.trim());
                                                                                            setFeatureInput('');
                                                                                        }
                                                                                    }}
                                                                                >
                                                                                    <Plus size={16} />
                                                                                </Button>
                                                                            </div>
                                                                            <div className="d-flex gap-2 flex-wrap">
                                                                                {room.features?.map((feature, featureIndex) => (
                                                                                    <Badge
                                                                                        key={featureIndex}
                                                                                        bg="light"
                                                                                        text="dark"
                                                                                        className="d-flex align-items-center gap-1 p-2"
                                                                                    >
                                                                                        {feature}
                                                                                        <X
                                                                                            size={14}
                                                                                            className="cursor-pointer"
                                                                                            onClick={() => removeFeature(featureIndex)}
                                                                                        />
                                                                                    </Badge>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </FieldArray>
                                                            </Card.Body>
                                                        </Card>
                                                    ))}

                                                    <Button
                                                        variant="outline-info"
                                                        className="w-100"
                                                        onClick={() => push({
                                                            roomType: '',
                                                            price: '',
                                                            features: []
                                                        })}
                                                    >
                                                        <Plus size={16} className="me-2" />
                                                        Add Room
                                                    </Button>
                                                </div>
                                            )}
                                        </FieldArray>
                                    </Card.Body>
                                </Card>

                                <div className="d-flex justify-content-end gap-2">
                                    <Button variant="outline-secondary" onClick={() => navigate('/hotels')}>Cancel</Button>
                                    <Button
                                        type="submit"
                                        variant="outline-info"
                                        disabled={isSubmitting || isLoading}
                                    >
                                        {isSubmitting || isLoading ? 'Saving...' : 'Save Hotel'}
                                    </Button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </Card.Body>
            </Card>
        </div>
    );
};

export default HotelForm;