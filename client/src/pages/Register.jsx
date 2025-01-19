import React, {useState} from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { Formik } from 'formik';
import { useMutation, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';
import {SIGNUP_MUTATION} from "../graphql/mutations/auth.js";
import {useToast} from "../context/ToastContext.jsx";
import  registerSchema  from '../validationSchemas/registerSchema';
import '../index.css';
const Register = () => {
    const [register, { loading, error }] = useMutation(SIGNUP_MUTATION);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();
    const { showToast } = useToast();
    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const { data } = await register({
                variables: {
                    input: {
                        name: values.name,
                        email: values.email,
                        password: values.password,
                        role: isAdmin ? 'admin' : 'user'
                    }
                }
            });
            showToast('Account created successfully!');
            navigate('/login');
        } catch (err) {
            showToast(err.message);
        }
        setSubmitting(false);
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bs-tooltip-auto background ">
            <div className="bg-white p-4 rounded shadow-lg w-100" style={{ maxWidth: '400px' }}>
                <div className="text-center mb-4">
                    <h2 className="h3 font-weight-bold text-dark">Create Account</h2>
                    <p className="text-muted mt-2">Join us today and get started</p>
                </div>

                {error && (
                    <Alert variant="danger">
                        {error.message}
                    </Alert>
                )}

                <Formik
                    initialValues={{
                        name: '',
                        email: '',
                        password: '',
                        confirmPassword: ''
                    }}
                    validationSchema={registerSchema}
                    onSubmit={handleSubmit}
                >
                    {({
                          values,
                          errors,
                          touched,
                          handleChange,
                          handleBlur,
                          handleSubmit,
                          isSubmitting,
                      }) => (
                        <Form onSubmit={handleSubmit}>
                            <div className="form-group mb-3">
                                <label className="small font-weight-medium text-muted mb-1">
                                    Name
                                </label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    placeholder="John Doe"
                                    value={values.name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isInvalid={touched.name && errors.name}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.name}
                                </Form.Control.Feedback>
                            </div>

                            <div className="form-group mb-3">
                                <label className="small font-weight-medium text-muted mb-1">
                                    Email Address
                                </label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    placeholder="john.doe@example.com"
                                    value={values.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isInvalid={touched.email && errors.email}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.email}
                                </Form.Control.Feedback>
                            </div>

                            <div className="form-group mb-3">
                                <label className="small font-weight-medium text-muted mb-1">
                                    Password
                                </label>
                                <div className="position-relative">
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        placeholder="••••••••"
                                        value={values.password}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        isInvalid={touched.password && errors.password}
                                    />
                                    <Eye className="position-absolute" style={{ right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#6c757d' }} size={20} />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.password}
                                    </Form.Control.Feedback>
                                </div>
                            </div>

                            <div className="form-group mb-3">
                                <label className="small font-weight-medium text-muted mb-1">
                                    Confirm Password
                                </label>
                                <Form.Control
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="••••••••"
                                    value={values.confirmPassword}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isInvalid={touched.confirmPassword && errors.confirmPassword}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.confirmPassword}
                                </Form.Control.Feedback>
                            </div>

                            <Button
                                variant="primary"
                                type="submit"
                                disabled={isSubmitting || loading}
                                className="w-100"
                            >
                                {loading ? 'Creating account...' : 'Create Account'}
                            </Button>

                            <div className="text-center mt-3">
                                <p className="small text-muted">
                                    Already have an account?{' '}   <a href="/login" className="text-primary">
                                    Sign in
                                </a>
                                </p>
                            </div>
                            {!isAdmin && (
                                <div className="text-center mt-3">
                                    <p className="small text-muted text-primary ">
                                        <a onClick={() => setIsAdmin(!isAdmin)} className="text-primary">
                                            Register as admin
                                        </a>
                                    </p>
                                </div>
                            )}
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default Register;