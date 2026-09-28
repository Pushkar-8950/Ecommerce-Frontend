import { Phone, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './ArtisanRegisterSecondPage.css';

function ArtisanRegisterSecondPage() {
    const navigate = useNavigate();
    
    const [mobileNumber, setMobileNumber] = useState("");
    const [enterMobileNumberError, setEnterMobileNumberError] = useState(false);
    const [mobileOtpSection, setMobileOtpSection] = useState(false);
    const [otp, setOtp] = useState("");

    function OtpButtonFunctionForMobileNumber() {
        if(mobileNumber.length !== 10) {
            setEnterMobileNumberError(true);
            setMobileOtpSection(false);
            return;
        } 
        setEnterMobileNumberError(false);
        setMobileOtpSection(true);
    }

    return (
        <div className="Artisan-Register-Second-Page">
            <div className="main-container">
                <div className="main-heading">
                    <h1>Artisan Register</h1>
                </div>
                <span>Join our community and take your craft to a bigger world</span>

                <div className="input-fields-section">
                    <div className="artisan-mobile-register">
                        <div className="mobile-number-input">
                            <Phone size={24} />
                            <input 
                                type="text" 
                                placeholder="Enter mobile number" 
                                maxLength={10}
                                value={mobileNumber}
                                onChange={(event) => {
                                    const value = event.target.value;
                                    
                                    // Verifying, every input entered by user is a digit or not
                                    if(!/^\d*$/.test(value)){
                                        return;
                                    }

                                    // empty input allowed for deleting
                                    if(value.length == 0){
                                        setMobileNumber(value);
                                        setEnterMobileNumberError(false);
                                        return;
                                    }

                                    // First digit must be 6, 7, 8, or 9
                                    if (!["6", "7", "8", "9"].includes(value[0])) {
                                        setEnterMobileNumberError(true);
                                        return;
                                    }

                                    setEnterMobileNumberError(false);
                                    setMobileNumber(value);
                                }}
                            />
                        </div>
                        <button className="send-otp-button" onClick={OtpButtonFunctionForMobileNumber}>Send Otp</button>

                        {enterMobileNumberError && 
                            <span className="error-text">Please enter a valid mobile Number</span>
                        }

                        {mobileOtpSection && 
                            <div className="otp-section">
                                <input 
                                    type="text" 
                                    placeholder="_ _ _ _" 
                                    maxLength={4}
                                    value={otp}
                                    onChange={(event) => {
                                        const value = event.target.value;
                                    
                                        // Verifying, every input entered by user is a digit or not
                                        if(/^\d*$/.test(value)){
                                            setOtp(value);
                                        }
                                    }}
                                />
                                <button className="verify-otp-button">Verify</button>
                            </div>
                        }
                    </div>
                </div>

                <button className="continue-button-section" onClick={() => navigate('/artisan-register-3')}>
                    <span>Continue</span>
                    <ArrowRight size={24} />
                </button>
            </div>
        </div>
    );
}

export default ArtisanRegisterSecondPage;
