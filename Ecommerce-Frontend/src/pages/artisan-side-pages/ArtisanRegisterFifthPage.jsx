import { ArrowRight, Building2, BadgeCheck, CreditCard } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './ArtisanRegisterFifthPage.css';

function ArtisanRegisterFifthPage() {
    const navigate = useNavigate();
    
    // null = not selected, true = YES, false = NO
    const [hasGST, setHasGST] = useState(null);
    
    // GST State
    const [gstin, setGstin] = useState("");
    const [isVerified, setIsVerified] = useState(false);

    // PAN State
    const [panCard, setPanCard] = useState("");
    const [isPanVerified, setIsPanVerified] = useState(false);

    const handleYesClick = () => {
        setHasGST(true);
    };

    const handleNoClick = () => {
        setHasGST(false);
    };

    const handleVerifyGSTIN = () => {
        if (gstin.length > 5) {
            setIsVerified(true);
        }
    };

    const handleVerifyPAN = () => {
        if (panCard.length === 10) {
            setIsPanVerified(true);
        }
    };

    return (
        <div className="Artisan-Register-Fifth-Page">
            <div className="main-container">
                
                <div className="main-heading">
                    <h1>Do you have a GSTIN?</h1>
                </div>
                <span>GSTIN helps us verify your business details.</span>

                <div className="simple-options-section">
                    <button 
                        className={`simple-option-btn ${hasGST === true ? 'selected' : ''}`}
                        onClick={handleYesClick}
                    >
                        <div className="radio-circle">
                            {hasGST === true && <div className="radio-dot"></div>}
                        </div>
                        <span>Yes</span>
                    </button>

                    <button 
                        className={`simple-option-btn ${hasGST === false ? 'selected' : ''}`}
                        onClick={handleNoClick}
                    >
                        <div className="radio-circle">
                            {hasGST === false && <div className="radio-dot"></div>}
                        </div>
                        <span>No</span>
                    </button>
                </div>

                {hasGST === true && (
                    <div className="gstin-input-section">
                        <div className="input-with-icon">
                            <Building2 size={24} />
                            <input 
                                type="text" 
                                placeholder="Enter your GSTIN" 
                                value={gstin}
                                onChange={(e) => setGstin(e.target.value.toUpperCase())}
                                disabled={isVerified}
                                maxLength={15}
                            />
                        </div>

                        {isVerified && (
                            <div className="verification-status">
                                <BadgeCheck size={16} />
                                <span>Verified Successfully</span>
                            </div>
                        )}

                        {!isVerified && (
                            <button className="verify-button" onClick={handleVerifyGSTIN}>
                                Verify GSTIN
                            </button>
                        )}
                        
                        {isVerified && (
                            <button className="continue-button-section" onClick={() => navigate('/artisan-register-6')}>
                                <span>Continue to Bank Details</span>
                                <ArrowRight size={24} />
                            </button>
                        )}
                    </div>
                )}

                {hasGST === false && (
                    <div className="gstin-input-section">
                        <div className="input-with-icon">
                            <CreditCard size={24} />
                            <input 
                                type="text" 
                                placeholder="Enter your PAN Card Number" 
                                value={panCard}
                                onChange={(e) => setPanCard(e.target.value.toUpperCase())}
                                disabled={isPanVerified}
                                maxLength={10}
                            />
                        </div>

                        {isPanVerified && (
                            <div className="verification-status">
                                <BadgeCheck size={16} />
                                <span>Verified Successfully</span>
                            </div>
                        )}

                        {!isPanVerified && (
                            <button className="verify-button" onClick={handleVerifyPAN}>
                                Verify PAN
                            </button>
                        )}
                        
                        {isPanVerified && (
                            <button className="continue-button-section" onClick={() => navigate('/artisan-register-6')}>
                                <span>Continue to Bank Details</span>
                                <ArrowRight size={24} />
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ArtisanRegisterFifthPage;
