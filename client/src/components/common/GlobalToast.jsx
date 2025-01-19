import React from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import { useToast } from '../../context/ToastContext';

const GlobalToast = () => {
    const { toast, hideToast } = useToast();

    return (
        <ToastContainer position="top-end" className="p-3">
            <Toast onClose={hideToast} show={toast.show} delay={3000} autohide>
                <Toast.Header>
                    <strong className="me-auto">Alert</strong>
                </Toast.Header>
                <Toast.Body>{toast.message}</Toast.Body>
            </Toast>
        </ToastContainer>
    );
};

export default GlobalToast;