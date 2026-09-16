import { useNavigate } from 'react-router-dom'

function RegistrationSuccess() {
    const navigate = useNavigate()

    return (
        <div className="success-page">

            <div className="success-box">

                <div className="success-icon">
                    🎉
                </div>

                <h1>Registration Successful!</h1>

                <p>
                    Your account has been created successfully.
                </p>

                <p className="success-message">
                    Welcome to SmartProcure!
                </p>

                <button
                    className="success-button"
                    onClick={() => navigate('/login')}
                >
                    Go to Login →
                </button>

            </div>

        </div>
    )
}

export default RegistrationSuccess