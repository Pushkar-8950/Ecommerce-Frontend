import { MapPin, Navigation, Home, Map, Hash, ArrowRight, Package } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './ArtisanRegisterFourthPage.css';

function ArtisanRegisterFourthPage() {
    const navigate = useNavigate();
    
    // Address State
    const [village, setVillage] = useState("");
    const [pincode, setPincode] = useState("");
    
    // Auto-filled States
    const [stateName, setStateName] = useState("");
    const [district, setDistrict] = useState("");

    // Pickup Address State
    const [sameAddress, setSameAddress] = useState(true);
    const [pickupVillage, setPickupVillage] = useState("");
    const [pickupPincode, setPickupPincode] = useState("");
    const [pickupHouseNumber, setPickupHouseNumber] = useState("");
    const [pickupStateName, setPickupStateName] = useState("");
    const [pickupDistrict, setPickupDistrict] = useState("");

    // Mock function to simulate getting location and auto-filling
    const handleUseCurrentLocation = () => {
        setVillage("Example Village");
        setPincode("110001");
        setStateName("Delhi");
        setDistrict("New Delhi");
    };

    return (
        <div className="Artisan-Register-Fourth-Page">
            <div className="main-container">
                
                <div className="main-heading">
                    <h1>
                        <MapPin size={28} style={{marginRight: '8px', verticalAlign: 'middle', color: '#f59e0b', marginBottom: '4px'}} /> 
                        Address Details
                    </h1>
                </div>

                <div className="input-fields-section">
                    
                    <button className="use-location-button" onClick={handleUseCurrentLocation}>
                        <Navigation size={20} />
                        <span>Use My Current Location</span>
                    </button>

                    <div className="divider-text">OR</div>

                    <div className="input-with-icon">
                        <Home size={24} />
                        <input 
                            type="text" 
                            placeholder="House No. / street / village / colony" 
                            value={village} onChange={(e) => setVillage(e.target.value)}
                        />
                    </div>

                    <div className="input-with-icon">
                        <Hash size={24} />
                        <input 
                            type="text" placeholder="Pincode *" 
                            value={pincode} onChange={(e) => setPincode(e.target.value)}
                        />
                    </div>

                    <div className="auto-fill-row">
                        <div className="input-with-icon disabled-input">
                            <MapPin size={24} />
                            <input type="text" placeholder="District / City" value={district} readOnly />
                        </div>

                        <div className="input-with-icon disabled-input">
                            <Map size={24} />
                            <input type="text" placeholder="State" value={stateName} readOnly />
                        </div>
                    </div>
                    
                    {/* PICKUP ADDRESS SECTION */}
                    <div className="pickup-card">
                        <div className="pickup-card-header">
                            <Package size={28} color="#f59e0b" style={{minWidth: '28px'}} />
                            <h2>Pickup & Drop location</h2>
                        </div>

                        <label className="massive-checkbox">
                            <input 
                                type="checkbox" 
                                checked={sameAddress}
                                onChange={(e) => setSameAddress(e.target.checked)}
                            /> 
                            <span className="checkmark"></span>
                            <span className="checkbox-text">Same as above address</span>
                        </label>

                        {/* PICKUP ADDRESS FORM - SLIDES DOWN IF UNCHECKED */}
                        {!sameAddress && (
                        <div className="pickup-address-section">
                            <div className="input-with-icon">
                                <Home size={24} />
                                <input 
                                    type="text" placeholder="House Number (Optional)" 
                                    value={pickupHouseNumber} onChange={(e) => setPickupHouseNumber(e.target.value)}
                                />
                            </div>

                            <div className="input-with-icon">
                                <Home size={24} />
                                <input 
                                    type="text" placeholder="Village / Colony / Sector *" 
                                    value={pickupVillage} onChange={(e) => setPickupVillage(e.target.value)}
                                />
                            </div>

                            <div className="input-with-icon">
                                <Hash size={24} />
                                <input 
                                    type="text" placeholder="Pincode *" 
                                    value={pickupPincode} onChange={(e) => setPickupPincode(e.target.value)}
                                />
                            </div>

                            <div className="auto-fill-row">
                                <div className="input-with-icon disabled-input">
                                    <MapPin size={24} />
                                    <input type="text" placeholder="District / City" value={pickupDistrict} readOnly />
                                </div>

                                <div className="input-with-icon disabled-input">
                                    <Map size={24} />
                                    <input type="text" placeholder="State" value={pickupStateName} readOnly />
                                </div>
                            </div>

                        </div>
                    )}
                    </div>
                </div>

                <button className="continue-button-section" onClick={() => navigate('/artisan-register-5')}>
                    <span>Continue</span>
                    <ArrowRight size={24} />
                </button>

            </div>
        </div>
    );
}

export default ArtisanRegisterFourthPage;
