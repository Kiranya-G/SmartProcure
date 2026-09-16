
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './AdminPayment.css'

import dummyQR from './assets/qr-code.jpg'

function AdminPayment() {
    const location = useLocation()
    const navigate = useNavigate()

    const adminData = JSON.parse(
        localStorage.getItem('adminData')
    )

    const adminId = adminData?.adminId

    const [paymentMethod, setPaymentMethod] = useState('')
    const [showForm, setShowForm] = useState(false)
    const [showPin, setShowPin] = useState(false)
    const [pin, setPin] = useState('')
    const [pinError, setPinError] = useState('')
    const [paymentSuccess, setPaymentSuccess] = useState(false)
    const [transactionId, setTransactionId] = useState('')

    const {
        productId,
        productName,
        amount
    } = location.state || {}

    if (!productId) {
        return (
            <div className="payment-page">
                <h2>Invalid Payment Request</h2>

                <button
                    onClick={() => navigate('/admin-dashboard')}
                >
                    Back to Dashboard
                </button>
            </div>
        )
    }

    const handleContinue = () => {
        if (!paymentMethod) {
            alert('Please select a payment method')
            return
        }

        setShowForm(true)
    }

    const handlePayment = async () => {

        if (!adminId) {
            alert('Admin information not found')
            return
        }

        if (!pin) {
            alert('Please enter your PIN')
            return
        }

        try {

            const response = await fetch(
                'http://localhost:8080/api/payments/submit',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        productId: productId,
                        adminId: adminId,
                        paymentMethod: paymentMethod,
                        pin: pin
                    })
                }
            )

            const responseText = await response.text()

            if (!response.ok) {
                setPinError('Please enter the correct PIN')
                return
            }

            const payment = JSON.parse(responseText)

            setTransactionId(payment.transactionId)
            setPaymentSuccess(true)

        } catch (error) {

            console.error('PAYMENT ERROR:', error)

            alert(error.message || 'Payment failed')
        }
    }

    return (
        <div className="payment-page">

            {paymentSuccess ? (

                <div className="payment-card success-card">

                    <div className="success-icon">
                        ✓
                    </div>

                    <h1>Payment Successful!</h1>

                    <p className="success-message">
                        Your payment has been successfully completed.
                    </p>

                    <div className="transaction-box">

                        <p>
                            <strong>Product:</strong> {productName}
                        </p>

                        <p>
                            <strong>Product ID:</strong> {productId}
                        </p>

                        <p>
                            <strong>Amount:</strong> ₹{amount}
                        </p>

                        <p>
                            <strong>Transaction ID:</strong> {transactionId}
                        </p>

                    </div>

                    <button
                        className="back-button"
                        onClick={() => navigate('/admin-dashboard')}
                    >
                        Back to Dashboard
                    </button>

                </div>

            ) : (

                <div className="payment-card">

                    <h1>Make Payment</h1>

                    <p className="payment-subtitle">
                        Complete payment for the approved procurement request
                    </p>

                    {/* PAYMENT DETAILS */}

                    <div className="payment-details">

                        <p>
                            <strong>Product:</strong> {productName}
                        </p>

                        <p>
                            <strong>Product ID:</strong> {productId}
                        </p>

                        <p>
                            <strong>Amount:</strong> ₹{amount}
                        </p>

                    </div>

                    {/* PAYMENT METHOD */}

                    {!showForm && (
                        <>
                            <h3>Select Payment Method</h3>

                            <div className="payment-methods">

                                <button
                                    className={
                                        paymentMethod === 'CREDIT_CARD'
                                            ? 'selected-payment'
                                            : ''
                                    }
                                    onClick={() =>
                                        setPaymentMethod('CREDIT_CARD')
                                    }
                                >
                                    💳 Credit Card
                                </button>

                                <button
                                    className={
                                        paymentMethod === 'PHONEPE'
                                            ? 'selected-payment'
                                            : ''
                                    }
                                    onClick={() =>
                                        setPaymentMethod('PHONEPE')
                                    }
                                >
                                    📱 PhonePe
                                </button>

                                <button
                                    className={
                                        paymentMethod === 'UPI'
                                            ? 'selected-payment'
                                            : ''
                                    }
                                    onClick={() =>
                                        setPaymentMethod('UPI')
                                    }
                                >
                                    🔳 UPI / QR
                                </button>

                            </div>

                            <button
                                className="continue-button"
                                onClick={handleContinue}
                            >
                                Continue
                            </button>
                        </>
                    )}

                    {/* CREDIT CARD FORM */}

                    {showForm && paymentMethod === 'CREDIT_CARD' && (
                        <div className="payment-form">

                            <h3>Credit Card Payment</h3>

                            <input
                                type="text"
                                placeholder="Demo Card Holder Name"
                            />

                            <input
                                type="text"
                                placeholder="Demo Card Number"
                            />

                            <div className="form-row">

                                <input
                                    type="text"
                                    placeholder="MM/YY"
                                />

                                <input
                                    type="text"
                                    placeholder="CVV"
                                />

                            </div>

                            <button
                                className="pay-button"
                                onClick={() => setShowPin(true)}
                            >
                                Pay ₹{amount}
                            </button>

                        </div>
                    )}

                    {/* PHONEPE FORM */}

                    {showForm && paymentMethod === 'PHONEPE' && (
                        <div className="payment-form">

                            <h3>PhonePe Payment</h3>

                            <input
                                type="text"
                                placeholder="Demo Phone Number"
                            />

                            <button
                                className="pay-button"
                                onClick={() => setShowPin(true)}
                            >
                                Pay ₹{amount}
                            </button>

                        </div>
                    )}

                    {/* UPI FORM */}

                    {showForm && paymentMethod === 'UPI' && (
                        <div className="payment-form">

                            <h3>UPI / QR Payment</h3>

                            <input
                                type="text"
                                placeholder="Demo UPI ID"
                            />

                            <div className="qr-placeholder">

                                <img
                                    src={dummyQR}
                                    alt="Dummy UPI QR Code"
                                    className="qr-image"
                                />

                                <p>
                                    Scan this QR code to make payment
                                </p>

                            </div>

                            <button
                                className="pay-button"
                                onClick={() => setShowPin(true)}
                            >
                                Pay ₹{amount}
                            </button>

                        </div>
                    )}

                    {/* PIN FORM */}

                    {showPin && (
                        <div className="payment-form">

                            <h3>Enter Payment PIN</h3>

                            <input
                                type="password"
                                placeholder="Enter your PIN"
                                value={pin}
                                onChange={(e) => {
                                    setPin(e.target.value)
                                    setPinError('')
                                }}
                                maxLength="6"
                            />

                            {pinError && (
                                <div className="pin-error">
                                    <span className="pin-error-icon">
                                        ⚠
                                    </span>

                                    <span>
                                        {pinError}
                                    </span>
                                </div>
                            )}

                            <button
                                className="pay-button"
                                onClick={handlePayment}
                            >
                                Confirm Payment ₹{amount}
                            </button>

                        </div>
                    )}

                    <button
                        className="back-button"
                        onClick={() => navigate('/admin-dashboard')}
                    >
                        Back to Dashboard
                    </button>

                </div>
            )}

        </div>
    )
}

export default AdminPayment
