import { useRef, useState, useEffect } from "react";
import { Camera, Upload, ArrowRight, Sparkles } from "lucide-react";
import './AddProduct.css';

function AddProduct() {

    const [cameraOpen, setCameraOpen] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);

    const videoRef = useRef(null);
    const streamRef = useRef(null);

    // Take permission from user for the camera
    const openCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: { ideal: "environment" },
                },
                audio: false,
            });

            streamRef.current = stream;

            setCameraOpen(true);
        } catch (error) {
            console.error("Unable to access camera:", error);
        }
    };

    // Capture Image
    const captureImage = () => {
        const video = videoRef.current;

        if (!video) {
            return;
        }

        const canvas = document.createElement("canvas");

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const context = canvas.getContext("2d");

        if (!context) {
            return;
        }

        context.drawImage(
            video,
            0,
            0,
            canvas.width,
            canvas.height
        );

        canvas.toBlob((blob) => {
            if (!blob) {
            return;
            }

            const imageUrl = URL.createObjectURL(blob);

            setCapturedImage({
            blob,
            preview: imageUrl,
            });

            stopCamera();
            setCameraOpen(false);
        }, "image/jpeg", 0.95);
    };

    // Stop the camera
    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => {
            track.stop();
            });

            streamRef.current = null;
        }
    };
    useEffect(() => {
        if (cameraOpen && videoRef.current && streamRef.current) {
            videoRef.current.srcObject = streamRef.current;
        }
    }, [cameraOpen]);


    return (
        <div className="add-product-page">
            {/* Soft background ripples (toned down for simplicity) */}
            <div className="bg-ripple ripple-1"></div>
            
            <div className="add-product-box">
                <div className="add-product-box-header">
                    <div className="header-badge">
                        <Sparkles size={16} />
                        <span>Step 1</span>
                    </div>
                    <p>Add Product Photo</p>
                </div>

                <div className="add-product-image-section">
                    
                        {cameraOpen ? (
                            <div className="camera-section">
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    className="camera-preview"
                                />
                                <div className="action-buttons-group">
                                    <button
                                        type="button"
                                        className="simple-btn primary-simple"
                                        onClick={captureImage}
                                    >
                                        <span className="btn-content">
                                            <Camera size={24} />
                                            Capture Photo
                                        </span>
                                    </button>
                                </div>
                            </div>
                        ) : capturedImage ? (
                            <div className="captured-image-section">
                                <img
                                    src={capturedImage.preview}
                                    alt="Captured product"
                                    className="captured-preview-img"
                                />
                                <div className="action-buttons-group">
                                    <button
                                        type="button"
                                        className="simple-btn secondary-simple"
                                        onClick={openCamera}
                                    >
                                        <span className="btn-content">
                                            <Camera size={20} />
                                            Retake Image
                                        </span>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="clear-lens-container">
                                    <button type="button" className="image-box-clear" onClick={openCamera}>
                                        <div className="image-box-content">
                                            <Camera size={64} className="camera-icon-clear" />
                                            <span className="tap-text">Tap to Camera</span>
                                        </div>
                                    </button>
                                </div>

                                <div className="action-buttons-group">
                                    <button
                                        type="button"
                                        className="simple-btn primary-simple"
                                        onClick={openCamera}
                                    >
                                        <span className="btn-content">
                                            <Camera size={24} />
                                            Take Photo Now
                                        </span>
                                    </button>

                                    <button
                                        type="button"
                                        className="simple-btn secondary-simple"
                                    >
                                        <span className="btn-content">
                                            <Upload size={24} />
                                            Choose from Gallery
                                        </span>
                                    </button>
                                </div>
                            </>
                        )}

                    </div>
                    
                    <button className="solid-continue-btn">
                        <span className="btn-text">Continue</span>
                        <div className="arrow-circle-simple">
                            <ArrowRight size={20} />
                        </div>
                    </button>
                    
                </div>
            </div>
    );
}

export default AddProduct;