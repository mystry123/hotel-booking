import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { useToast } from '../../../context/ToastContext';

const FileUploadModal = ({ isOpen, onClose, onUpload }) => {
    const [uploads, setUploads] = useState([]);
    const { showToast } = useToast();

    const onDrop = (acceptedFiles) => {
        const newUploads = acceptedFiles.map(file => ({
            file,
            progress: 0,
            id: Math.random().toString(36).substring(7)
        }));

        setUploads(prev => [...prev, ...newUploads]);

        newUploads.forEach(upload => {
            let progress = 0;
            const interval = setInterval(() => {
                progress += 5;
                setUploads(prev =>
                    prev.map(u =>
                        u.id === upload.id
                            ? { ...u, progress }
                            : u
                    )
                );

                if (progress >= 100) {
                    clearInterval(interval);
                    onUpload?.(upload.file);
                    showToast('File uploaded successfully!');
                }
            }, 100);
        });
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.gif']
        },
        multiple: true
    });

    const handleClose = () => {
        onClose();
        setTimeout(() => {
            setUploads([]);
        }, 300);
    };

    if (!isOpen) return null;

    return (
        <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Upload Your Files</h5>
                        <button type="button" className="btn-close" onClick={handleClose}></button>
                    </div>
                    <div className="modal-body">
                        <div
                            {...getRootProps()}
                            className={`border border-dashed rounded p-4 mb-4 cursor-pointer ${isDragActive ? 'border-primary bg-light' : 'border-secondary'}`}
                        >
                            <input {...getInputProps()} />
                            <div className="text-center">
                                <Upload className="mb-2" />
                                <p>{isDragActive ? "Drop your files here" : "Drag files here or browse files to upload"}</p>
                                <p className="text-muted">You can select multiple files</p>
                            </div>
                        </div>

                        {uploads.length > 0 && (
                            <div className="overflow-auto" style={{ maxHeight: '200px' }}>
                                {uploads.map(upload => (
                                    <div key={upload.id} className="mb-3">
                                        <div className="d-flex justify-content-between align-items-center mb-1">
                                            <span className="text-truncate" style={{ maxWidth: '150px' }}>{upload.file.name}</span>
                                            <span>{upload.progress}%</span>
                                        </div>
                                        <div className="progress">
                                            <div
                                                className="progress-bar"
                                                role="progressbar"
                                                style={{ width: `${upload.progress}%` }}
                                                aria-valuenow={upload.progress}
                                                aria-valuemin="0"
                                                aria-valuemax="100"
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={handleClose}>Close</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FileUploadModal;