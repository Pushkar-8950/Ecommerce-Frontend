import { User, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './ArtisanRegisterFirstPage.css';

function ArtisanRegisterFirstPage() {
    const navigate = useNavigate();
    // Assuming the user didn't have a state for fullName originally, I will just add one, but wait, the original code had:
    // <input type="text" placeholder="Enter your full name" /> without a state.
    // Let's match their exact original code for full name.

    return (
        <div className="Artisan-Register-First-Page">
            <div className="main-container">
                <div className="main-heading">
                    <h1>Artisan Register</h1>
                </div>
                <span>Join our community and take your craft to a bigger world</span>

                <div className="input-fields-section">
                    <div className="full-Name-input">
                        <User size={24}/>
                        <input 
                            type="text" placeholder="Enter your full name"
                        />
                    </div>
                </div>

                <button className="continue-button-section" onClick={() => navigate('/artisan-register-2')}>
                    <span>Continue</span>
                    <ArrowRight size={24} />
                </button>
            </div>
        </div>
    );
}

export default ArtisanRegisterFirstPage;
