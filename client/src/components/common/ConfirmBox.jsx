import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function ConfirmBox({ modalTitle, content, okText, show, onHide, onConfirm }) {
    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>{modalTitle}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p>{content}</p>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="outline-dark" onClick={onHide}>Cancel</Button>
                <Button variant="outline-warning" onClick={onConfirm}>{okText}</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ConfirmBox;