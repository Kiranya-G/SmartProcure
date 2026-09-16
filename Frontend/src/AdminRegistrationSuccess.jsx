import { useNavigate } from 'react-router-dom'
import './AdminRegistrationSuccess.css'

function AdminRegistrationSuccess() {

    const navigate = useNavigate()

    return (

        <div className="admin-success-page">

            <div className="admin-success-card">

                <div className="admin-success-icon">
                    ✓
                </div>

                <h1>
                    Registration Successful!
                </h1>

                <p>
                    Your admin account has been created successfully.
                </p>

                <p className="admin-success-subtext">
                    You can now login and manage the
                    Smart Procurement System.
                </p>

                <button
                    className="admin-success-button"
                    onClick={() => navigate('/admin-login')}
                >
                    Continue to Admin Login →
                </button>

            </div>

        </div>

    )
}

export default AdminRegistrationSuccess