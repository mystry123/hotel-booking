import React from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useMutation, gql } from '@apollo/client';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { LOGIN_MUTATION } from "../graphql/mutations/auth.js";
import { useToast } from '../context/ToastContext';
import loginSchema from '../validationSchemas/loginSchema';
import '../index.css'

const Login = () => {
    const [login, { loading, error }] = useMutation(LOGIN_MUTATION);
    const { login: authLogin } = useAuth();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const { data } = await login({
                variables: {
                    input: values
                }
            });
            authLogin(data.login.user, data.login.token);
            showToast('Login successful!');
            navigate('/');
        } catch (err) {
            showToast(`Login error: ${err.message}`);
            console.error('Login error:', err);
        }
        setSubmitting(false);
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light background">
            <div className="bg-white p-4 rounded shadow-lg w-100" style={{ maxWidth: '400px' }}>
                <div className="text-center mb-4">
                    <h2 className="h3 font-weight-bold text-dark">Welcome Back</h2>
                    <p className="text-muted mt-2">Sign in to your account</p>
                </div>

                {error && (
                    <Alert variant="danger">
                        {error.message}
                    </Alert>
                )}

                <Formik
                    initialValues={{ email: '', password: '' }}
                    validationSchema={loginSchema}
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

                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div className="form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="remember"
                                    />
                                    <label className="form-check-label small text-muted" htmlFor="remember">
                                        Remember me
                                    </label>
                                </div>
                                <a href="/forgot-password" className="text-sm text-primary">
                                    Forgot password?
                                </a>
                            </div>

                            <Button
                                variant="primary"
                                type="submit"
                                disabled={isSubmitting || loading}
                                className="w-100"
                            >
                                {loading ? 'Signing in...' : 'Sign in'}
                            </Button>

                            <div className="text-center mt-4">
                                <p className="small text-muted">
                                    Don't have an account?{' '}
                                    <a href="/register" className="text-primary">
                                        Sign up
                                    </a>
                                </p>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default Login;