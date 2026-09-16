
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './SupplierLogin.css'

function SupplierLogin() {

    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const handleLogin = async (e) => {

        e.preventDefault()

        setError('')
        setLoading(true)

        try {

            const response = await fetch(
                'http://localhost:8080/api/auth/supplier-login',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: email.trim(),
                        password: password
                    })
                }
            )

            const data = await response.json()

            if (response.ok) {

                localStorage.setItem(
                    'supplierId',
                    data.supplierId
                )

                localStorage.setItem(
                    'supplierName',
                    data.name
                )

                localStorage.setItem(
                    'supplierEmail',
                    data.email
                )

                localStorage.setItem(
                    'role',
                    data.role
                )

                navigate('/supplier-dashboard')

            } else {

                setError(
                    data.message ||
                    'Invalid email or password'
                )
            }

        } catch (error) {

            console.error('SUPPLIER LOGIN ERROR:', error)

            setError(
                'Unable to connect to the backend. Please try again.'
            )

        } finally {

            setLoading(false)
        }
    }

    return (
        <div className="supplier-login-page">

            <div className="supplier-login-container">

                {/* LEFT SIDE */}

                <div className="supplier-login-left">

                    <div className="supplier-login-brand">

                        <div className="supplier-login-logo">
                            SP
                        </div>

                        <div>
                            <h2>SmartProcure</h2>
                            <span>Supplier Portal</span>
                        </div>

                    </div>

                    <div className="supplier-login-content">

                        <span className="supplier-login-badge">
                            SUPPLIER PORTAL
                        </span>

                        <h1>
                            Manage Your
                            <br />
                            <span>Procurement Requests</span>
                        </h1>

                        <p>
                            Track assigned requests, manage shipments,
                            monitor payments and update delivery status
                            from one place.
                        </p>

                        <div className="supplier-login-features">

                            <div className="supplier-feature">
                                <span>✓</span>
                                <p>View assigned procurement requests</p>
                            </div>

                            <div className="supplier-feature">
                                <span>✓</span>
                                <p>Manage shipment process</p>
                            </div>

                            <div className="supplier-feature">
                                <span>✓</span>
                                <p>Track payments and deliveries</p>
                            </div>

                        </div>

                    </div>

                    <div className="supplier-login-footer">
                        © 2026 SmartProcure · Supplier Management System
                    </div>

                </div>


                {/* RIGHT SIDE */}

                <div className="supplier-login-right">

                    <div className="supplier-login-card">

                        <div className="supplier-login-heading">

                            <div className="supplier-login-icon">
                                🚚
                            </div>

                            <h2>Supplier Login</h2>

                            <p>
                                Sign in to access your supplier dashboard
                            </p>

                        </div>


                        <form onSubmit={handleLogin}>

                            {/* EMAIL */}

                            <div className="supplier-input-group">

                                <label>Email Address</label>

                                <div className="supplier-input-wrapper">

                                    <span className="input-icon">
                                        ✉
                                    </span>

                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        required
                                    />

                                </div>

                            </div>


                            {/* PASSWORD */}

                            <div className="supplier-input-group">

                                <label>Password</label>

                                <div className="supplier-input-wrapper">

                                    <span className="input-icon">
                                        🔒
                                    </span>

                                    <input
                                        type={
                                            showPassword
                                                ? 'text'
                                                : 'password'
                                        }
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        required
                                    />

                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() =>
                                            setShowPassword(
                                                !showPassword
                                            )
                                        }
                                    >
                                        {showPassword ? '🙈' : '👁'}
                                    </button>

                                </div>

                            </div>


                            {/* ERROR */}

                            {error && (

                                <div className="supplier-login-error">
                                    ⚠ {error}
                                </div>

                            )}


                            {/* LOGIN BUTTON */}

                            <button
                                type="submit"
                                className="supplier-login-button"
                                disabled={loading}
                            >
                                {loading
                                    ? 'Logging in...'
                                    : 'Login to Supplier Portal →'}
                            </button>

                        </form>


                        <div className="supplier-login-divider">
                            <span>SECURE ACCESS</span>
                        </div>

                        <p className="supplier-login-note">
                            🔐 Your supplier account information is securely
                            protected.
                        </p>

                    </div>

                </div>

            </div>

        </div>
    )
}

export default SupplierLogin

