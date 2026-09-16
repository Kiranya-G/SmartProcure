import { useState } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import './App.css'
import RegistrationSuccess from './RegistrationSuccess'
import UserProfile from "./UserProfile.jsx";

import AdminProfile from './AdminProfile'

import SupplierProfile from './SupplierProfile'

import AdminPayment from './AdminPayment'
import AdminDashboard from './AdminDashboard'
import AdminPaymentHistory from './AdminPaymentHistory'

import SupplierDashboard from './SupplierDashboard'
import SupplierLogin from './SupplierLogin'
import {
  User,
  Mail,
  Phone,
  LockKeyhole,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  FileText,
  Package,
  Truck,
  Briefcase,
  Building2,
  Circle
} from 'lucide-react'

import Login from './Login'
import UserDashboard from './UserDashboard'
import CsvView from './CsvView'
import RaiseRequest from './RaiseRequest'

import AdminRegistration from './AdminRegistration'
import AdminLogin from './AdminLogin'
import AdminRegistrationSuccess from './AdminRegistrationSuccess'

import AdminRequests from './AdminRequests'

function UserRegisterForm() {
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    designation: '',
    departmentId: '',
    password: ''
  })

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleRegister = async (e) => {
    e.preventDefault()

    setError('')
    setMessage('')

    try {
      const response = await fetch(
          'http://localhost:8080/api/auth/register',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              name: formData.name.trim(),
              email: formData.email.trim(),
              phoneNumber: formData.phoneNumber.trim(),
              designation: formData.designation,
              departmentId: Number(formData.departmentId),
              password: formData.password
            })
          }
      )

      const responseText = await response.text()

      console.log('REGISTER STATUS:', response.status)
      console.log('REGISTER RESPONSE:', responseText)

      let data = {}

      try {
        data = responseText
            ? JSON.parse(responseText)
            : {}
      } catch {
        data = {}
      }

      if (response.ok) {

        navigate('/registration-success')

        setFormData({
          name: '',
          email: '',
          phoneNumber: '',
          designation: '',
          departmentId: '',
          password: ''
        })

      } else {

        setError(
            data.message ||
            data.error ||
            'Registration failed. Please try again.'
        )
      }

    } catch (error) {

      console.error('REGISTER ERROR:', error)

      setError(
          'Unable to connect to the backend. Please try again.'
      )
    }
  }

  return (
      <div className="page">

        {/* LEFT SIDE */}
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

              {/* Purchase Order */}
              <div className="order-card">

                <div className="order-top">

                  <div className="document-icon">
                    <FileText
                        size={24}
                        className="icon-document"
                    />
                  </div>

                  <div>
                    <strong>Purchase Order</strong>
                    <span>PO #2026-1084</span>
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
                  Processing Order
                </div>

              </div>

              {/* Package */}
              <div className="package-box">
                <Package
                    size={32}
                    className="icon-package"
                />
              </div>

              {/* Delivery Truck */}
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

              {/* Connection Line */}
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
                Streamlining the journey from purchase request
                to order processing and delivery.
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

        {/* RIGHT SIDE */}
        <section className="right-section">

          <div className="register-card">

            <div className="form-header">

            <span className="welcome">
              WELCOME 👋
            </span>

              <h1>Create your account</h1>

              <p>
                Register to access the Smart Procurement
                & Purchase Order Management System.
              </p>

            </div>

            <form onSubmit={handleRegister}>

              {/* Full Name */}
              <div className="input-group">

                <label>Full Name</label>

                <div className="input-wrapper">

                <span>
                  <User
                      size={18}
                      className="icon-input"
                  />
                </span>

                  <input
                      type="text"
                      name="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                  />

                </div>

              </div>

              {/* Email + Phone */}
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
                        placeholder="Enter email"
                        value={formData.email}
                        onChange={handleChange}
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
                        name="phoneNumber"
                        placeholder="Phone number"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                    />

                  </div>

                </div>

              </div>

              {/* Designation + Department */}
              <div className="input-row">

                <div className="input-group">

                  <label>Designation</label>

                  <div className="input-wrapper">

                  <span>
                    <Briefcase
                        size={18}
                        className="icon-input"
                    />
                  </span>

                    <select
                        name="designation"
                        value={formData.designation}
                        onChange={handleChange}
                    >

                      <option value="" disabled>
                        Select designation
                      </option>

                      <option>Employee</option>
                      <option>Manager</option>
                      <option>Procurement Officer</option>

                    </select>

                  </div>

                </div>

                <div className="input-group">

                  <label>Department ID</label>

                  <div className="input-wrapper">

                  <span>
                    <Building2
                        size={18}
                        className="icon-input"
                    />
                  </span>

                    <input
                        type="number"
                        name="departmentId"
                        placeholder="Department ID"
                        value={formData.departmentId}
                        onChange={handleChange}
                    />

                  </div>

                </div>

              </div>

              {/* Password */}
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
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleChange}
                  />

                  <button
                      type="button"
                      className="eye-button"
                      onClick={() =>
                          setShowPassword(!showPassword)
                      }
                  >

                    {showPassword ? (
                        <EyeOff
                            size={18}
                            className="icon-eye"
                        />
                    ) : (
                        <Eye
                            size={18}
                            className="icon-eye"
                        />
                    )}

                  </button>

                </div>

              </div>

              {/* Terms */}
              <div className="terms">

                <input
                    type="checkbox"
                    id="terms"
                />

                <label htmlFor="terms">
                  I agree to the{' '}
                  <span>
                  Terms & Conditions
                </span>
                </label>

              </div>

              {/* Error */}
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

              {/* Register Button */}
              <button
                  className="register-button"
                  type="submit"
              >
                Create Account
                <span>→</span>
              </button>

            </form>

            <div className="login-link">

              Already have an account?

              <a
                  href="/login"
                  onClick={(e) => {
                    e.preventDefault()
                    navigate('/login')
                  }}
              >
                Login
              </a>

            </div>

          </div>

          <div className="copyright">
            © 2026 Smart Procurement System
          </div>

        </section>

      </div>
  )
}


function RegisterPage() {

  const [role, setRole] = useState('admin')

  return (
      <div className="registration-page-wrapper">

        {/* USER / ADMIN SWITCH */}
        <div className="role-switcher">

          <button
              type="button"
              className={`role-button ${
                  role === 'user' ? 'active' : ''
              }`}
              onClick={() => setRole('user')}
          >

            <User
                size={18}
                className="icon-role-user"
            />

            <span>USER</span>

          </button>

          <button
              type="button"
              className={`role-button ${
                  role === 'admin' ? 'active' : ''
              }`}
              onClick={() => setRole('admin')}
          >

            <ShieldCheck
                size={18}
                className="icon-role-admin"
            />

            <span>ADMIN</span>

          </button>

        </div>

        {/* DEFAULT = ADMIN */}
        {role === 'admin' ? (
            <AdminRegistration />
        ) : (
            <UserRegisterForm />
        )}

      </div>
  )
}


function App() {

  return (
      <BrowserRouter>

        <Routes>

          <Route
              path="/"
              element={<RegisterPage />}
          />

          <Route
              path="/registration-success"
              element={<RegistrationSuccess />}
          />

          <Route
              path="/login"
              element={<Login />}
          />

          <Route
              path="/user-dashboard"
              element={<UserDashboard />}
          />

          <Route
              path="/csv-view"
              element={<CsvView />}
          />

          <Route
              path="/admin-registration"
              element={<AdminRegistration />}
          />

          <Route
              path="/admin-registration-success"
              element={<AdminRegistrationSuccess />}
          />

          <Route
              path="/admin-login"
              element={<AdminLogin />}
          />

          <Route
              path="/supplier-login"
              element={<SupplierLogin />}
          />
          <Route
              path="/raise-request"
              element={<RaiseRequest />}
          />

          <Route
              path="/admin-dashboard"
              element={<AdminDashboard />}
          />
          <Route
              path="/admin-profile"
              element={<AdminProfile />}
          />

          <Route
              path="/admin-payment"
              element={<AdminPayment />}
          />

          <Route
              path="/admin-requests"
              element={<AdminRequests />}
          />

          <Route
              path="/admin-payment-history"
              element={<AdminPaymentHistory />}
          />

          <Route
              path="/supplier-dashboard"
              element={<SupplierDashboard />}
          />
          <Route
            path="/supplier-profile"
            element={<SupplierProfile />}
           />
          <Route
            path="/user-profile"
            element={<UserProfile />}
            />


        </Routes>

      </BrowserRouter>
  )
}

export default App