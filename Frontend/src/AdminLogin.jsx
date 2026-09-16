import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './AdminLogin.css'

import {
    Mail,
    LockKeyhole,
    Eye,
    EyeOff,
    ShieldCheck,
    BarChart3,
    ClipboardList,
    Circle,
    AlertCircle
} from 'lucide-react'

function AdminLogin() {

    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleLogin = async (e) => {

        e.preventDefault()

        setError('')
        setLoading(true)

        try {

            const response = await fetch(
                'http://localhost:8080/api/admin/login',
                {
                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json'
                    },

                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            )

            const responseText = await response.text()

            console.log('Status:', response.status)
            console.log('Response:', responseText)

            if (response.ok) {

                const adminData = JSON.parse(responseText)

                console.log('LOGGED IN ADMIN:', adminData)
                console.log('ADMIN DEPARTMENT ID:', adminData.department?.depId)

                // Store admin information for dashboard
                localStorage.setItem(
                    'adminData',
                    JSON.stringify(adminData)
                )

                localStorage.setItem(
                    'adminDepartmentId',
                    adminData.department?.depId
                )

                localStorage.setItem(
                    'adminId',
                    adminData.adminId
                )
                navigate('/admin-dashboard')
            }else {

                let errorMessage =
                    'Invalid admin email or password'

                try {

                    const errorData =
                        JSON.parse(responseText)

                    errorMessage =
                        errorData.message ||
                        errorData.error ||
                        errorData.detail ||
                        errorMessage

                } catch {

                    if (responseText) {
                        errorMessage = responseText
                    }

                }

                setError(errorMessage)
            }

        } catch (error) {

            console.error('LOGIN ERROR:', error)

            setError(
                'Unable to connect to the backend. Please try again.'
            )

        } finally {

            setLoading(false)

        }
    }


    return (

        <div className="admin-login-page">

            {/* ================= LEFT SIDE ================= */}

            <section className="admin-login-left">

                <div className="admin-brand">

                    <div className="admin-brand-logo">
                        SP
                    </div>

                    <div>

                        <h2>
                            SmartProcure
                        </h2>

                        <p>
                            Digital Procurement Platform
                        </p>

                    </div>

                </div>


                <div className="admin-left-content">

                    <span className="admin-small-title">
                        ADMINISTRATOR PORTAL
                    </span>

                    <h1>

                        Manage Procurement

                        <br />

                        <span>
                            Smarter & Faster
                        </span>

                    </h1>

                    <p>

                        Access the administration portal to
                        monitor procurement requests, manage
                        approvals and oversee the procurement
                        process.

                    </p>


                    {/* ================= FEATURES ================= */}

                    <div className="admin-features">


                        {/* Procurement Overview */}

                        <div className="admin-feature">

                            <span className="admin-feature-icon">

                                <BarChart3
                                    size={22}
                                    className="admin-icon-chart"
                                />

                            </span>

                            <div>

                                <strong>
                                    Procurement Overview
                                </strong>

                                <p>
                                    Monitor procurement activities
                                </p>

                            </div>

                        </div>


                        {/* Request Management */}

                        <div className="admin-feature">

                            <span className="admin-feature-icon">

                                <ClipboardList
                                    size={22}
                                    className="admin-icon-clipboard"
                                />

                            </span>

                            <div>

                                <strong>
                                    Request Management
                                </strong>

                                <p>
                                    Review and manage requests
                                </p>

                            </div>

                        </div>


                        {/* Secure Administration */}

                        <div className="admin-feature">

                            <span className="admin-feature-icon">

                                <ShieldCheck
                                    size={22}
                                    className="admin-icon-shield"
                                />

                            </span>

                            <div>

                                <strong>
                                    Secure Administration
                                </strong>

                                <p>
                                    Protected admin access
                                </p>

                            </div>

                        </div>

                    </div>

                </div>


                {/* Footer */}

                <div className="admin-left-footer">

                    <Circle
                        size={8}
                        fill="currentColor"
                        className="admin-icon-footer"
                    />

                    Smart • Simple • Efficient

                </div>

            </section>


            {/* ================= RIGHT SIDE ================= */}

            <section className="admin-login-right">

                <div className="admin-login-card">


                    {/* ================= LOGIN HEADER ================= */}

                    <div className="admin-login-header">

                        <div className="admin-login-icon">

                            <ShieldCheck
                                size={30}
                                className="admin-icon-login"
                            />

                        </div>

                        <span className="admin-welcome">
                            ADMINISTRATOR
                        </span>

                        <h1>
                            Welcome Back!
                        </h1>

                        <p>
                            Login to your SmartProcure
                            admin account
                        </p>

                    </div>


                    <form onSubmit={handleLogin}>


                        {/* ================= EMAIL ================= */}

                        <div className="admin-input-group">

                            <label>
                                Email
                            </label>

                            <div className="admin-input-wrapper">

                                <span>

                                    <Mail
                                        size={18}
                                        className="admin-icon-input"
                                    />

                                </span>

                                <input
                                    type="email"
                                    placeholder="Enter admin email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value)
                                        setError('')
                                    }}
                                    required
                                />

                            </div>

                        </div>


                        {/* ================= PASSWORD ================= */}

                        <div className="admin-input-group">

                            <label>
                                Password
                            </label>

                            <div className="admin-input-wrapper">

                                <span>

                                    <LockKeyhole
                                        size={18}
                                        className="admin-icon-input"
                                    />

                                </span>

                                <input
                                    type={
                                        showPassword
                                            ? 'text'
                                            : 'password'
                                    }
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value)
                                        setError('')
                                    }}
                                    required
                                />


                                {/* Eye Button */}

                                <button
                                    type="button"
                                    className="admin-eye-button"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                >

                                    {showPassword ? (

                                        <EyeOff
                                            size={18}
                                            className="admin-icon-eye"
                                        />

                                    ) : (

                                        <Eye
                                            size={18}
                                            className="admin-icon-eye"
                                        />

                                    )}

                                </button>

                            </div>

                        </div>


                        {/* ================= ERROR ================= */}

                        {error && (

                            <div className="admin-login-error">

                                <AlertCircle
                                    size={18}
                                    className="admin-icon-error"
                                />

                                <span>
                                    {error}
                                </span>

                            </div>

                        )}


                        {/* ================= LOGIN BUTTON ================= */}

                        <button
                            type="submit"
                            className="admin-login-button"
                            disabled={loading}
                        >

                            {loading
                                ? 'Logging in...'
                                : 'Admin Login →'}

                        </button>

                    </form>


                    {/* ================= REGISTER ================= */}

                    <div className="admin-register-link">

                        Don't have an admin account?

                        <button
                            type="button"
                            onClick={() =>
                                navigate('/admin-registration')
                            }
                        >

                            Register

                        </button>

                    </div>


                    {/* ================= USER LOGIN ================= */}

                    <div className="admin-user-login">

                        Are you a user?

                        <button
                            type="button"
                            onClick={() =>
                                navigate('/login')
                            }
                        >

                            User Login

                        </button>

                    </div>

                </div>


                {/* Copyright */}

                <div className="admin-copyright">

                    © 2026 Smart Procurement System

                </div>

            </section>

        </div>
    )
}

export default AdminLogin