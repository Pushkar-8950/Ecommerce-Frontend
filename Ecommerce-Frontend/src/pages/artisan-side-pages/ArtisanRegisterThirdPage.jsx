import { Mail, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './ArtisanRegisterThirdPage.css';

function ArtisanRegisterThirdPage() {
    const navigate = useNavigate();
    
    const [emailId, setEmailId] = useState("");
    const [enterEmailIdError, setEnterEmailIdError] = useState(false);
    const [emailOtpSection, setEmailOtpSection] = useState(false);

    function OtpButtonFunctionForEmailID() {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailId)) {
            setEnterEmailIdError(true);
            setEmailOtpSection(false);
            return;
        }
        setEnterEmailIdError(false);
        setEmailOtpSection(true);
    }

    return (
        <div className="Artisan-Register-Third-Page">
            <div className="main-container">
                <div className="main-heading">
                    <h1>Artisan Register</h1>
                </div>
                <span>Join our community and take your craft to a bigger world</span>

                <div className="input-fields-section">
                    <div className="artisan-email-register">
                        <div className="email-id-input">
                            <Mail size={24} />
                            <input 
                                type="text" 
                                placeholder="Enter email id" 
                                value={emailId}
                                onChange={(event) => setEmailId(event.target.value)}
                            />
                        </div>
                        <button className="send-otp-button" onClick={OtpButtonFunctionForEmailID}>Send Otp</button>

                        {enterEmailIdError && 
                            <span className="error-text">Please enter a valid Email ID</span>
                        }

                        {emailOtpSection && 
                            <div className="otp-section">
                                <input type="text" placeholder="_ _ _ _" />
                                <button className="verify-otp-button">Verify</button>
                            </div>
                        }
                    </div>
                </div>

                <button className="continue-button-section" onClick={() => navigate('/artisan-register-4')}>
                    <span>Continue</span>
                    <ArrowRight size={24} />
                </button>
            </div>
        </div>
    );
}

export default ArtisanRegisterThirdPage;
