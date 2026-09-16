import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './AdminRegistration.css'

import {
    User,
    Mail,
    Phone,
    Building2,
    LockKeyhole,
    Eye,
    EyeOff,
    FileText,
    Package,
    Truck,
    Circle,
    AlertCircle
} from 'lucide-react'

function AdminRegistration() {

    const navigate = useNavigate()

    const [showPassword, setShowPassword] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        departmentId: '',
        password: ''
    })

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })

        setErrorMessage('')
    }

    const handleRegister = async (e) => {
        e.preventDefault()

        setErrorMessage('')

        try {

            const response = await fetch(
                'http://localhost:8080/api/admin/register',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: formData.name,
                        email: formData.email,
                        phoneNumber: formData.phoneNumber,
                        password: formData.password,
                        departmentId: Number(formData.departmentId)
                    })
                }
            )

            const responseText = await response.text()

            console.log('Status:', response.status)
            console.log('Response:', responseText)

            if (response.ok) {

                setFormData({
                    name: '',
                    email: '',
                    phoneNumber: '',
                    departmentId: '',
                    password: ''
                })

                navigate('/admin-registration-success')

            } else {

                let errorMessage = 'Admin registration failed'

                try {

                    const errorData = JSON.parse(responseText)

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

                setErrorMessage(errorMessage)
            }

        } catch (error) {

            console.error('FETCH ERROR:', error)

            setErrorMessage(
                'Unable to connect to the backend. Please try again.'
            )
        }
    }

    return (

        <div className="admin-page">

            {/* ================= LEFT SECTION ================= */}

            <section className="left-section">

                {/* Brand */}

                <div className="brand">

                    <div className="brand-logo">
                        SP
                    </div>

                    <div>
                        <h2>SmartProcure</h2>
                        <p>Digital Procurement Platform</p>
                    </div>

                </div>


                <div className="left-content">

                    <div className="procurement-visual">

                        <div className="glow glow-one"></div>
                        <div className="glow glow-two"></div>


                        {/* ================= PURCHASE ORDER ================= */}

                        <div className="order-card">

                            <div className="order-top">

                                <div className="document-icon">

                                    <FileText
                                        size={24}
                                        className="admin-icon-document"
                                    />

                                </div>

                                <div>

                                    <strong>
                                        Purchase Order
                                    </strong>

                                    <span>
                                        PO #2026-1084
                                    </span>

                                </div>

                            </div>


                            <div className="document-line large"></div>
                            <div className="document-line"></div>
                            <div className="document-line short"></div>


                            <div className="order-status">

                                <Circle
                                    size={8}
                                    fill="currentColor"
                                    className="admin-icon-status"
                                />

                                Processing Order

                            </div>

                        </div>


                        {/* ================= PACKAGE ================= */}

                        <div className="package-box">

                            <Package
                                size={32}
                                className="admin-icon-package"
                            />

                        </div>


                        {/* ================= DELIVERY TRUCK ================= */}

                        <div className="truck-card">

                            <div className="truck-icon">

                                <Truck
                                    size={32}
                                    className="admin-icon-truck"
                                />

                            </div>

                            <div className="road">

                                <span></span>
                                <span></span>
                                <span></span>

                            </div>

                        </div>


                        {/* ================= CONNECTION LINE ================= */}

                        <div className="flow-line">

                            <div className="flow-dot"></div>
                            <div className="flow-dot"></div>
                            <div className="flow-dot"></div>

                        </div>

                    </div>


                    {/* Project Title */}

                    <div className="project-title">

                        <span className="small-title">
                            ENTERPRISE PROCUREMENT SYSTEM
                        </span>

                        <h1>

                            Smart Procurement &

                            <br />

                            <span>
                                Purchase Order
                            </span>

                            <br />

                            Management System

                        </h1>

                        <p>

                            Streamlining the journey from purchase request
                            to order processing and delivery.

                        </p>

                    </div>

                </div>


                {/* Footer */}

                <div className="left-footer">

                    <Circle
                        size={8}
                        fill="currentColor"
                        className="admin-icon-footer"
                    />

                    Smart • Simple • Efficient

                </div>

            </section>


            {/* ================= RIGHT SECTION ================= */}

            <section className="admin-right-section">

                <div className="admin-register-card">


                    {/* ================= FORM HEADER ================= */}

                    <div className="admin-form-header">

                        <span className="admin-welcome">
                            ADMINISTRATION 👨‍💼
                        </span>

                        <h1>
                            Create your admin account
                        </h1>

                        <p>

                            Register to manage the Smart Procurement
                            & Purchase Order Management System.

                        </p>

                    </div>


                    <form onSubmit={handleRegister}>


                        {/* ================= FULL NAME ================= */}

                        <div className="admin-input-group">

                            <label>
                                Full Name
                            </label>

                            <div className="admin-input-wrapper">

                                <span>

                                    <User
                                        size={18}
                                        className="admin-icon-input"
                                    />

                                </span>

                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Enter your full name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                        </div>


                        {/* ================= EMAIL + PHONE ================= */}

                        <div className="admin-input-row">


                            {/* Email */}

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
                                        name="email"
                                        placeholder="Enter email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>

                            </div>


                            {/* Phone */}

                            <div className="admin-input-group">

                                <label>
                                    Phone Number
                                </label>

                                <div className="admin-input-wrapper">

                                    <span>

                                        <Phone
                                            size={18}
                                            className="admin-icon-input"
                                        />

                                    </span>

                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        placeholder="Phone number"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>

                            </div>

                        </div>


                        {/* ================= DEPARTMENT ================= */}

                        <div className="admin-input-group">

                            <label>
                                Department ID
                            </label>

                            <div className="admin-input-wrapper">

                                <span>

                                    <Building2
                                        size={18}
                                        className="admin-icon-input"
                                    />

                                </span>

                                <input
                                    type="number"
                                    name="departmentId"
                                    placeholder="Department ID"
                                    value={formData.departmentId}
                                    onChange={handleChange}
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
                                    name="password"
                                    placeholder="Create a password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />


                                {/* Eye Button */}

                                <button
                                    type="button"
                                    className="admin-eye-button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
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


                        {/* ================= TERMS ================= */}

                        <div className="admin-terms">

                            <input
                                type="checkbox"
                                id="adminTerms"
                                required
                            />

                            <label htmlFor="adminTerms">

                                I agree to the{' '}

                                <span>
                                    Terms & Conditions
                                </span>

                            </label>

                        </div>


                        {/* ================= ERROR ================= */}

                        {errorMessage && (

                            <div className="admin-form-error">

                                <AlertCircle
                                    size={18}
                                    className="admin-icon-error"
                                />

                                <span>
                                    {errorMessage}
                                </span>

                            </div>

                        )}


                        {/* ================= REGISTER ================= */}

                        <button
                            className="admin-register-button"
                            type="submit"
                        >

                            Create Admin Account

                            <span>
                                →
                            </span>

                        </button>

                    </form>


                    {/* ================= LOGIN ================= */}

                    <div className="admin-login-link">

                        Already have an admin account?

                        <button
                            type="button"
                            onClick={() =>
                                navigate('/admin-login')
                            }
                        >

                            Login

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

export default AdminRegistration