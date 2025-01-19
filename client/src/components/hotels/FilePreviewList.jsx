import {Button} from "react-bootstrap";
import {X} from "lucide-react";
import React from "react";

export const FilePreviewList = ({ files, onDelete, setIsModalOpen }) => {
    return (
        <div onClick={() => setIsModalOpen(true)} className="bg-light text-dark border border-secondary rounded p-4 mb-4 w-100" style={{ minHeight: "40px" }}>
            {files.length === 0 && <div className="d-flex justify-content-between align-items-center w-100">
                <span>Click here to upload images</span>
            </div>}
            <div className="row row-cols-6 g-2">
                {files.map((file, index) => (
                    <div key={index} className="col position-relative bg-white p-2 rounded shadow-sm w-40 ">
                        {/* Preview */}
                        <div className="ratio ratio-16x9 bg-light overflow-hidden rounded">
                            <img
                                src={typeof file === 'string' ? file : URL.createObjectURL(file)}
                                alt={file.name}
                                className="w-40 h-40 object-cover"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "/placeholder-image.png"; // Add a placeholder image path
                                }}
                            />
                        </div>

                        {/* Delete Button */}
                        <Button
                            onClick={() => onDelete(index)}
                            className="btn btn-danger position-absolute top-0 end-0 p-1 opacity-100 hover-opacity-100 transition-opacity rounded-5"
                        >
                            <X size={16} />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
};