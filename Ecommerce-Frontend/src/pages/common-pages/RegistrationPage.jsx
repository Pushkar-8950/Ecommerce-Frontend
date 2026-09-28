import {ShoppingBag, Hammer} from "lucide-react"
import {useNavigate} from 'react-router-dom'
import './RegistrationPage.css';

function RegistrationPage() {
    const navigate = useNavigate()
    
    return(
        <div className="registration-page">
            
            <div className="main-div">

                <div className="choose-category-div">
                    <h1>Let's get you started</h1>
                </div>

                <div className="buttons-section">  

                    <span className="joining-statement">I want to join as :</span> 

                    <div className="buttons-row">
                        
                        <button className="buyer-button" onClick={() => navigate('/buyer-register')}>
                            <ShoppingBag size={30}/>
                            <span>Buyer</span>
                        </button>

                        <button className="artisan-button" onClick={() => navigate('/artisan-register-1')}>
                            <Hammer size={30}/>
                        <span>Artisan</span>
                    </button>

                    </div>
            </div>
            </div>

        </div>
    )
};

export default RegistrationPage;

