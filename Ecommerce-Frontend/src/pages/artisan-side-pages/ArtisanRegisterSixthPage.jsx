import { Building, User, Hash, Eye, EyeOff, AlertCircle, ArrowRight, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './ArtisanRegisterSixthPage.css';

function ArtisanRegisterSixthPage() {
    const navigate = useNavigate();
    
    const [accountName, setAccountName] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [confirmAccount, setConfirmAccount] = useState("");
    const [ifscCode, setIfscCode] = useState("");

    const [showAccount, setShowAccount] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const isAccountMatch = confirmAccount.length > 0 && accountNumber === confirmAccount;
    const isAccountMismatch = confirmAccount.length > 0 && accountNumber !== confirmAccount;
    
    // Basic IFSC format check (4 letters, 0, 6 alphanumeric)
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    const isIfscValid = ifscCode.length > 0 ? ifscRegex.test(ifscCode) : true;
    const isIfscComplete = ifscCode.length === 11 && ifscRegex.test(ifscCode);

    const canContinue = accountName.length > 2 && accountNumber.length >= 8 && isAccountMatch && isIfscComplete;

    const handleIfscChange = (e) => {
        setIfscCode(e.target.value.toUpperCase());
    };

    return (
        <div className="Artisan-Register-Sixth-Page">
            <div className="main-container">
                
                <div className="main-heading">
                    <Building size={32} color="#f59e0b" />
                    <h1>Bank Details</h1>
                </div>
                
                <span className="subtitle">Enter the bank account where you want to receive money</span>

                <div className="input-fields-section">
                    
                    {/* Account Holder Name */}
                    <div className="input-group">
                        <label className="input-label">Account Holder Name</label>
                        <div className="input-with-icon">
                            <User size={24} />
                            <input 
                                type="text" 
                                placeholder="" 
                                value={accountName}
                                onChange={(e) => setAccountName(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Account Number */}
                    <div className="input-group">
                        <label className="input-label">Bank Account Number</label>
                        <div className="input-with-icon">
                            <Hash size={24} />
                            <input 
                                type={showAccount ? "text" : "password"} 
                                placeholder="Enter your account number" 
                                value={accountNumber}
                                onChange={(e) => setAccountNumber(e.target.value)}
                            />
                            <button className="eye-button" onClick={() => setShowAccount(!showAccount)}>
                                {showAccount ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Account Number */}
                    <div className="input-group">
                        <label className="input-label">Confirm Account Number</label>
                        <div className={`input-with-icon ${isAccountMismatch ? 'error' : ''}`}>
                            <Hash size={24} />
                            <input 
                                type={showConfirm ? "text" : "password"} 
                                placeholder="Enter account number again" 
                                value={confirmAccount}
                                onChange={(e) => setConfirmAccount(e.target.value)}
                            />
                            <button className="eye-button" onClick={() => setShowConfirm(!showConfirm)}>
                                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {isAccountMismatch && (
                            <span className="error-text">
                                <AlertCircle size={14} /> Account numbers do not match
                            </span>
                        )}
                    </div>

                    {/* IFSC Code */}
                    <div className="input-group">
                        <label className="input-label">IFSC Code</label>
                        <div className={`input-with-icon ${!isIfscValid && ifscCode.length === 11 ? 'error' : ''}`}>
                            <Building size={24} />
                            <input 
                                type="text" 
                                placeholder="" 
                                value={ifscCode}
                                onChange={handleIfscChange}
                                maxLength={11}
                            />
                        </div>
                        {!isIfscValid && ifscCode.length === 11 && (
                            <span className="error-text">
                                <AlertCircle size={14} /> Invalid IFSC code format
                            </span>
                        )}
                    </div>
                </div>

                <div className="security-message">
                    <ShieldCheck size={20} />
                    <span>Your bank details are securely protected.</span>
                </div>

                <button 
                    className="continue-button-section" 
                    disabled={!canContinue}
                    onClick={() => navigate('/artisan-register-7')}
                >
                    <span>Continue</span>
                    <ArrowRight size={24} />
                </button>

            </div>
        </div>
    );
}

export default ArtisanRegisterSixthPage;
