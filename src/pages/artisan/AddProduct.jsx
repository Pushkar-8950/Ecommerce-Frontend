import { Link } from "react-router-dom"
import {
    Camera,
    Upload,
    ArrowRight
} from "lucide-react";
import './AddProduct.css';


function AddProduct() {
    return (
        <div className="add-product-page">

            <div className="add-product-box">
                <div className="add-product-box-header">
                    <p>Add image of the Product</p>
                </div>

                <div className="add-product-image-section">
                    <button type='button' className="image-box"
                    onClick={openCamera}>
                        <Camera size={60} />
                    </button>

                    <div className="image-box-button-section">
                        <button className="image-box-take-image-button">
                            <button type='button' className="image-box-take-image-button-container"  onClick={openCamera}>
                                <Camera size={20} />
                                <span>Take Image</span>
                            </button>
                        </button>

                        <button className="image-box-upload-image-button">
                            <button className="image-box-upload-image-button-container">
                                <Upload size={20} />
                                <span>Upload Image</span>
                            </button>
                        </button>
                    </div>

                    
                    <button className="continue-button">
                        <div className="continue-button-content">
                            Continue
                            <ArrowRight size={20} />
                        </div>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AddProduct;