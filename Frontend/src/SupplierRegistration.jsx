
import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
    User,
    Mail,
    Phone,
    LockKeyhole,
    FileText,
    Package,
    Truck,
    Circle,
    Building2,
    Briefcase,
    AlertCircle
} from 'lucide-react'
import './App.css'

function SupplierRegistration() {
    const navigate = useNavigate()

    const [categories, setCategories] = useState([])
    const [loadingCategories, setLoadingCategories] = useState(true)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')

    const [form, setForm] = useState({
        name: '',
        phone: '',
        address: '',
        email: '',
        gstNumber: '',
        password: '',
        categoryId: ''
    })

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const response = await fetch(
                    'http://localhost:8080/api/categories'
                )

                if (!response.ok) {
                    throw new Error('Unable to load categories')
                }

                const data = await response.json()
                setCategories(data)
            } catch {
                setError('Unable to load categories. Please check the backend.')
            } finally {
                setLoadingCategories(false)
            }
        }

        loadCategories()
    }, [])

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleRegister = async (e) => {
        e.preventDefault()
        setError('')
        setMessage('')
        setLoading(true)

        try {
            const response = await fetch(
                'http://localhost:8080/api/suppliers',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        ...form,
                        categoryId: Number(form.categoryId)
                    })
                }
            )

            const responseText = await response.text()
            let data = {}

            try {
                data = responseText ? JSON.parse(responseText) : {}
            } catch {
                data = {}
            }

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    data.error ||
                    'Supplier registration failed.'
                )
            }

            setMessage(
                'Registration successful! Supplier ID: ' + data.supId
            )

            setTimeout(() => {
                navigate('/supplier-login')
            }, 2000)
        } catch (err) {
            setError(err.message || 'Unable to connect to the backend.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="page">

            {/* LEFT SIDE - SAME DESIGN AS USER / ADMIN */}

            <section className="left-section">
                <div className="brand">
                    <div className="brand-logo">SP</div>

                    <div>
                        <h2>SmartProcure</h2>
                        <p>Digital Procurement Platform</p>
                    </div>
                </div>

                <div className="left-content">
                    <div className="procurement-visual">
                        <div className="glow glow-one"></div>
                        <div className="glow glow-two"></div>

                        <div className="order-card">
                            <div className="order-top">
                                <div className="document-icon">
                                    <FileText
                                        size={24}
                                        className="icon-document"
                                    />
                                </div>

                                <div>
                                    <strong>Supplier Registration</strong>
                                    <span>SmartProcure Portal</span>
                                </div>
                            </div>

                            <div className="document-line large"></div>
                            <div className="document-line"></div>
                            <div className="document-line short"></div>

                            <div className="order-status">
                                <Circle
                                    size={8}
                                    fill="currentColor"
                                    className="icon-status"
                                />
                                Supplier Onboarding
                            </div>
                        </div>

                        <div className="package-box">
                            <Package
                                size={32}
                                className="icon-package"
                            />
                        </div>

                        <div className="truck-card">
                            <div className="truck-icon">
                                <Truck
                                    size={32}
                                    className="icon-truck"
                                />
                            </div>

                            <div className="road">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>

                        <div className="flow-line">
                            <div className="flow-dot"></div>
                            <div className="flow-dot"></div>
                            <div className="flow-dot"></div>
                        </div>
                    </div>

                    <div className="project-title">
                        <span className="small-title">
                            ENTERPRISE PROCUREMENT SYSTEM
                        </span>

                        <h1>
                            Smart Procurement &
                            <br />
                            <span>Purchase Order</span>
                            <br />
                            Management System
                        </h1>

                        <p>
                            Register your company and join the
                            SmartProcure supplier network.
                        </p>
                    </div>
                </div>

                <div className="left-footer">
                    <Circle
                        size={8}
                        fill="currentColor"
                        className="icon-footer"
                    />
                    Smart • Simple • Efficient
                </div>
            </section>

            {/* RIGHT SIDE - REGISTRATION FORM */}

            <section className="right-section">
                <div className="register-card">

                    <div className="form-header">
                        <span className="welcome">
                            WELCOME 👋
                        </span>

                        <h1>Supplier Registration</h1>

                        <p>
                            Register your company to access
                            the SmartProcure platform.
                        </p>
                    </div>

                    <form onSubmit={handleRegister}>

                        <div className="input-group">
                            <label>Company Name</label>

                            <div className="input-wrapper">
                                <span>
                                    <Building2
                                        size={18}
                                        className="icon-input"
                                    />
                                </span>

                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Enter company name"
                                    value={form.name}
                                    onChange={handleChange}
                                    minLength={3}
                                    maxLength={50}
                                    required
                                />
                            </div>
                        </div>

                        <div className="input-row">
                            <div className="input-group">
                                <label>Email</label>

                                <div className="input-wrapper">
                                    <span>
                                        <Mail
                                            size={18}
                                            className="icon-input"
                                        />
                                    </span>

                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Company email"
                                        value={form.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <label>Phone Number</label>

                                <div className="input-wrapper">
                                    <span>
                                        <Phone
                                            size={18}
                                            className="icon-input"
                                        />
                                    </span>

                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="10-digit number"
                                        value={form.phone}
                                        onChange={handleChange}
                                        pattern="[6-9][0-9]{9}"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Company Address</label>

                            <div className="input-wrapper">
                                <span>
                                    <Building2
                                        size={18}
                                        className="icon-input"
                                    />
                                </span>

                                <input
                                    type="text"
                                    name="address"
                                    placeholder="Enter company address"
                                    value={form.address}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="input-row">
                            <div className="input-group">
                                <label>GST Number</label>

                                <div className="input-wrapper">
                                    <span>
                                        <FileText
                                            size={18}
                                            className="icon-input"
                                        />
                                    </span>

                                    <input
                                        type="text"
                                        name="gstNumber"
                                        placeholder="GST number"
                                        value={form.gstNumber}
                                        onChange={handleChange}
                                        pattern="[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}"
                                        title="Enter a valid GST number using capital letters"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <label>Product Category</label>

                                <div className="input-wrapper">
                                    <span>
                                        <Briefcase
                                            size={18}
                                            className="icon-input"
                                        />
                                    </span>

                                    <select
                                        name="categoryId"
                                        value={form.categoryId}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">
                                            {loadingCategories
                                                ? 'Loading...'
                                                : 'Select category'}
                                        </option>

                                        {categories.map(category => (
                                            <option
                                                key={category.catId}
                                                value={category.catId}
                                            >
                                                {category.catName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Password</label>

                            <div className="input-wrapper">
                                <span>
                                    <LockKeyhole
                                        size={18}
                                        className="icon-input"
                                    />
                                </span>

                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Create a password"
                                    value={form.password}
                                    onChange={handleChange}
                                    minLength={8}
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="register-error">
                                <span className="error-icon">
                                    <AlertCircle
                                        size={18}
                                        className="icon-error"
                                    />
                                </span>
                                <span>{error}</span>
                            </div>
                        )}

                        {message && (
                            <div className="registration-success">
                                {message}
                            </div>
                        )}

                        <button
                            className="register-button"
                            type="submit"
                            disabled={loading || loadingCategories}
                        >
                            {loading ? 'Registering...' : 'Create Account'}
                            <span>→</span>
                        </button>
                    </form>

                    <div className="login-link">
                        Already registered?{' '}
                        <Link to="/supplier-login">
                            Login
                        </Link>
                    </div>
                </div>

                <div className="copyright">
                    © 2026 Smart Procurement System
                </div>
            </section>
        </div>
    )
}

export default SupplierRegistration