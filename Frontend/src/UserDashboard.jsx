import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
    LayoutDashboard,
    FilePlus2,
    FileSpreadsheet,
    LogOut,
    User,
    ClipboardList,
    BarChart3,
    Truck
} from 'lucide-react'

import './UserDashboard.css'


function UserDashboard() {

    const navigate = useNavigate()

    const [userName, setUserName] = useState('User')


    // ================================
    // SHIPMENT TRACKING & RATING
    // ================================

    const [shipments, setShipments] = useState([])
    const [selectedShipment, setSelectedShipment] = useState(null)
    const [showTrackingModal, setShowTrackingModal] = useState(false)

    const [rating, setRating] = useState(0)
    const [feedback, setFeedback] = useState('')
    const [ratingSubmitted, setRatingSubmitted] = useState(false)
    const [ratingLoading, setRatingLoading] = useState(false)

    // ================================
    // GET LOGGED-IN USER
    // ================================

    useEffect(() => {

        const savedUser = localStorage.getItem('user')

        if (savedUser) {

            try {

                const user = JSON.parse(savedUser)

                setUserName(
                    user.name ||
                    user.username ||
                    user.email ||
                    'User'
                )

            } catch (error) {

                console.error(
                    'Unable to read user details:',
                    error
                )

            }

        }

    }, [])


    // ================================
    // GET USER SHIPMENTS
    // ================================

    useEffect(() => {

        const savedUser = localStorage.getItem('user')

        if (!savedUser) {
            return
        }

        try {

            const user = JSON.parse(savedUser)

            if (!user.userId) {
                console.error('User ID not found')
                return
            }

            fetch(
                `http://localhost:8080/api/shipments/user/${user.userId}`
            )
                .then(response => {

                    if (!response.ok) {
                        throw new Error(
                            'Failed to fetch shipments'
                        )
                    }

                    return response.json()
                })
                .then(data => {

                    setShipments(data)

                    console.log(
                        'User shipments:',
                        data
                    )
                })
                .catch(error => {

                    console.error(
                        'Unable to fetch shipments:',
                        error
                    )
                })

        } catch (error) {

            console.error(
                'Unable to read user details:',
                error
            )
        }

    }, [])
    // ================================
    // LOGOUT
    // ================================

    const handleLogout = () => {

        localStorage.removeItem('user')
        localStorage.removeItem('token')
        localStorage.removeItem('role')

        navigate('/login', {
            replace: true
        })

    }


    // ================================
    // DOWNLOAD EXCEL
    // ================================

    const handleDownloadExcel = () => {

        window.location.href =
            'http://localhost:8080/api/products/download-excel'

    }


    return (

        <div className="dashboard-page">


            {/* =================================
                SIDEBAR
            ================================= */}

            <aside className="dashboard-sidebar">


                {/* BRAND */}

                <div className="dashboard-brand">

                    <div className="dashboard-logo">
                        SP
                    </div>

                    <div>

                        <h2>
                            SmartProcure
                        </h2>

                        <span>
                            Procurement Platform
                        </span>

                    </div>

                </div>


                {/* NAVIGATION */}

                <nav className="dashboard-nav">


                    {/* DASHBOARD */}

                    <button
                        className="nav-item active"
                        onClick={() =>
                            navigate('/user-dashboard')
                        }
                    >

                        <LayoutDashboard size={20} />

                        <span>
                            Dashboard
                        </span>

                    </button>


                    {/* RAISE REQUEST */}

                    <button
                        className="nav-item"
                        onClick={() =>
                            navigate('/raise-request')
                        }
                    >

                        <FilePlus2 size={20} />

                        <span>
                            Raise Request
                        </span>

                    </button>


                    {/* DOWNLOAD EXCEL */}

                    <button
                        className="nav-item"
                        onClick={handleDownloadExcel}
                    >

                        <FileSpreadsheet size={20} />

                        <span>
                            Download Excel
                        </span>

                    </button>



                    {/* PROFILE */}

                    <button
                        className="nav-item"
                        onClick={() =>
                            navigate('/user-profile')
                        }
                    >

                        <User size={20} />

                        <span>
                         Profile
                    </span>

                    </button>


                </nav>


                {/* LOGOUT */}

                <button
                    className="logout-button"
                    onClick={handleLogout}
                >

                    <LogOut size={20} />

                    <span>
                        Logout
                    </span>

                </button>


            </aside>



            {/* =================================
                MAIN CONTENT
            ================================= */}

            <main className="dashboard-main">


                {/* =================================
                    HEADER
                ================================= */}

                <header className="dashboard-header">


                    <div>

                        <span className="dashboard-label">
                            USER DASHBOARD
                        </span>


                        <h1>
                            Welcome back, {userName}!
                        </h1>


                        <p>
                            Manage your procurement requests
                            from one place.
                        </p>

                    </div>



                    {/* USER PROFILE */}

                    <div className="user-profile">


                        <div className="profile-icon">

                            <User size={20} />

                        </div>


                        <div>

                            <strong>
                                {userName}
                            </strong>

                            <span>
                                Employee
                            </span>

                        </div>


                    </div>


                </header>



                {/* =================================
                    RAISE REQUEST SECTION
                ================================= */}

                <section className="request-section">


                    <div className="request-icon">

                        <FilePlus2 size={32} />

                    </div>


                    <div className="request-content">


                        <span className="section-label">
                            PROCUREMENT
                        </span>


                        <h2>
                            Raise a New Request
                        </h2>


                        <p>
                            Submit a new procurement request
                            for the products or materials you need.
                        </p>


                        <button
                            className="request-button"
                            onClick={() =>
                                navigate('/raise-request')
                            }
                        >

                            Raise Request

                            <span>
                                →
                            </span>

                        </button>


                    </div>


                </section>



                {/* =================================
                    DOWNLOAD EXCEL SECTION
                ================================= */}

                <section className="csv-section">


                    <div className="csv-icon">

                        <FileSpreadsheet size={32} />

                    </div>


                    <div className="csv-content">


                        <span className="section-label">
                            PROCUREMENT DATA
                        </span>


                        <h2>
                            Download Request Details
                        </h2>


                        <p>
                            Download your procurement request
                            details as an Excel file.
                        </p>


                        <button
                            className="csv-button"
                            onClick={handleDownloadExcel}
                        >

                            <FileSpreadsheet size={17} />

                            <span>
                                Download Excel
                            </span>

                        </button>


                    </div>


                </section>



                {/* =================================
                    INFORMATION CARDS
                ================================= */}

                <section className="info-section">


                    {/* RAISE REQUEST */}

                    <div
                        className="info-card"
                        onClick={() => setShowTrackingModal(true)}
                        style={{ cursor: 'pointer' }}
                    >

                        <div className="info-card-icon">
                            <Truck size={21} />
                        </div>

                        <div>

                            <h3>
                                Request Tracking
                            </h3>

                            <p>
                                Track request and delivery
                                status in one place.
                            </p>

                        </div>

                    </div>









                    {/* REQUEST TRACKING */}



                </section>




                {/* =====================================================
    REQUEST TRACKING MODAL
===================================================== */}

                {showTrackingModal && (
                    <div
                        className="tracking-modal-overlay"
                        onClick={() => {
                            setShowTrackingModal(false)
                            setSelectedShipment(null)
                            setRating(0)
                            setFeedback('')
                            setRatingSubmitted(false)
                        }}
                    >

                        <div
                            className="tracking-modal"
                            onClick={(e) => e.stopPropagation()}
                        >

                            {/* ================= MODAL HEADER ================= */}

                            <div className="tracking-modal-header">

                                <div>
                                    <div className="tracking-modal-label">
                                        REQUEST TRACKING
                                    </div>

                                    <h2>
                                        Shipment Tracking
                                    </h2>

                                    <p>
                                        Track your procurement request and delivery status
                                    </p>
                                </div>

                                <button
                                    className="tracking-close-button"
                                    onClick={() => {
                                        setShowTrackingModal(false)
                                        setSelectedShipment(null)
                                        setRating(0)
                                        setFeedback('')
                                        setRatingSubmitted(false)
                                    }}
                                >
                                    ×
                                </button>

                            </div>


                            {/* =================================================
                SHIPMENT LIST
            ================================================= */}

                            {!selectedShipment && (

                                <div>

                                    {shipments.length === 0 ? (

                                        <div className="shipment-card">
                                            <div>
                                                <div className="shipment-title">
                                                    No shipment requests found
                                                </div>

                                                <div className="shipment-product">
                                                    Your shipment requests will appear here.
                                                </div>
                                            </div>
                                        </div>

                                    ) : (

                                        shipments.map((shipment) => {

                                            const status =
                                                shipment.shipmentStatus?.toUpperCase()

                                            let statusClass = 'status-pending'

                                            if (status === 'ACKNOWLEDGED') {
                                                statusClass = 'status-acknowledged'
                                            } else if (status === 'PACKED') {
                                                statusClass = 'status-packed'
                                            } else if (status === 'SHIPPED') {
                                                statusClass = 'status-shipped'
                                            } else if (status === 'DELIVERED') {
                                                statusClass = 'status-delivered'
                                            }

                                            return (
                                                <div
                                                    key={shipment.shipmentId}
                                                    className="shipment-card"
                                                    onClick={() => {

                                                        setSelectedShipment(shipment)

                                                        setRating(0)
                                                        setFeedback('')
                                                        setRatingSubmitted(false)

                                                    }}
                                                >

                                                    <div>

                                                        <div className="shipment-title">
                                                            Shipment #{shipment.shipmentId}
                                                        </div>

                                                        <div className="shipment-product">

                                                            Product:{' '}

                                                            {shipment.product?.name ||
                                                                'Procurement Request'}

                                                        </div>

                                                        <div className="shipment-tracking">

                                                            Tracking Number:{' '}

                                                            {shipment.trackingNumber ||
                                                                'Not available'}

                                                        </div>

                                                    </div>


                                                    <div>

                                        <span
                                            className={`status-badge ${statusClass}`}
                                        >
                                            {status
                                                    ?.replace(/_/g, ' ')
                                                || 'PENDING'}
                                        </span>

                                                    </div>

                                                </div>
                                            )

                                        })

                                    )}

                                </div>

                            )}


                            {/* =================================================
                SELECTED SHIPMENT DETAILS
            ================================================= */}

                            {selectedShipment && (

                                <div>

                                    {/* BACK BUTTON */}

                                    <button
                                        onClick={() => {

                                            setSelectedShipment(null)

                                            setRating(0)
                                            setFeedback('')
                                            setRatingSubmitted(false)

                                        }}

                                        style={{
                                            border: 'none',
                                            background: 'transparent',
                                            color: '#594bdd',
                                            fontSize: '13px',
                                            fontWeight: '700',
                                            cursor: 'pointer',
                                            marginBottom: '18px',
                                            padding: '0'
                                        }}
                                    >
                                        ← Back to shipments
                                    </button>


                                    {/* ================= SHIPMENT DETAILS ================= */}

                                    <div className="shipment-card">

                                        <div>

                                            <div className="shipment-title">

                                                Shipment #
                                                {selectedShipment.shipmentId}

                                            </div>

                                            <div className="shipment-product">

                                                Product:{' '}

                                                {selectedShipment.product?.name ||
                                                    'Procurement Request'}

                                            </div>

                                            <div className="shipment-tracking">

                                                Tracking Number:{' '}

                                                {selectedShipment.trackingNumber ||
                                                    'Not available'}

                                            </div>

                                        </div>


                                        <div>

                            <span
                                className={`status-badge ${
                                    selectedShipment.shipmentStatus
                                        ?.toUpperCase() ===
                                    'DELIVERED'
                                        ? 'status-delivered'
                                        : selectedShipment.shipmentStatus
                                            ?.toUpperCase() ===
                                        'SHIPPED'
                                            ? 'status-shipped'
                                            : selectedShipment.shipmentStatus
                                                ?.toUpperCase() ===
                                            'PACKED'
                                                ? 'status-packed'
                                                : selectedShipment.shipmentStatus
                                                    ?.toUpperCase() ===
                                                'ACKNOWLEDGED'
                                                    ? 'status-acknowledged'
                                                    : 'status-pending'
                                }`}
                            >

                                {selectedShipment.shipmentStatus
                                        ?.replace(/_/g, ' ')
                                    || 'PENDING'}

                            </span>

                                        </div>

                                    </div>


                                    {/* =================================================
                        AUDIT TRACKING & DELIVERY TIMELINE
                    ================================================= */}

                                    <div className="timeline">

                                        {[
                                            {
                                                label: 'Request Created',
                                                color: 'purple'
                                            },
                                            {
                                                label: 'Admin Approved',
                                                color: 'green'
                                            },
                                            {
                                                label: 'Payment Completed',
                                                color: 'blue'
                                            },
                                            {
                                                label: 'Supplier Acknowledged',
                                                color: 'orange'
                                            },
                                            {
                                                label: 'Packed',
                                                color: 'brown'
                                            },
                                            {
                                                label: 'Shipped',
                                                color: 'blue'
                                            },
                                            {
                                                label: 'Delivered',
                                                color: 'delivered'
                                            }
                                        ].map((step, index) => {

                                            const statusOrder = {

                                                PENDING_ACKNOWLEDGEMENT: 2,

                                                ACKNOWLEDGED: 3,

                                                PACKED: 4,

                                                SHIPPED: 5,

                                                DELIVERED: 6

                                            }

                                            const currentStatus =
                                                selectedShipment.shipmentStatus
                                                    ?.toUpperCase()

                                            const currentStep =
                                                statusOrder[currentStatus] ?? 2

                                            const completed =
                                                index <= currentStep


                                            return (

                                                <div
                                                    key={step.label}
                                                    className={`timeline-item ${
                                                        completed
                                                            ? 'timeline-completed'
                                                            : 'timeline-future'
                                                    } timeline-${step.color}`}
                                                >

                                                    <div className="timeline-dot">

                                                        {completed
                                                            ? '✓'
                                                            : index + 1}

                                                    </div>


                                                    {index !== 6 && (
                                                        <div className="timeline-line"></div>
                                                    )}


                                                    <div className="timeline-content">

                                                        <strong>
                                                            {step.label}
                                                        </strong>

                                                    </div>

                                                </div>

                                            )

                                        })}

                                    </div>


                                    {/* =================================================
                        RATING SECTION
                    ================================================= */}

                                    {selectedShipment.shipmentStatus
                                        ?.toUpperCase() === 'DELIVERED' && (

                                        <div
                                            className={`rating-section ${
                                                ratingSubmitted
                                                    ? 'rating-success'
                                                    : ''
                                            }`}
                                        >

                                            {!ratingSubmitted ? (

                                                <>

                                                    <h3>
                                                        Rate Your Delivery
                                                    </h3>

                                                    <p>
                                                        Your shipment has been delivered.
                                                        Please share your experience.
                                                    </p>


                                                    {/* STAR RATING */}

                                                    <div className="rating-stars">

                                                        {[1, 2, 3, 4, 5].map((star) => (

                                                            <button
                                                                key={star}
                                                                type="button"
                                                                className={`rating-star ${
                                                                    star <= rating
                                                                        ? 'selected'
                                                                        : ''
                                                                }`}
                                                                onClick={() =>
                                                                    setRating(star)
                                                                }
                                                            >
                                                                ★
                                                            </button>

                                                        ))}

                                                    </div>


                                                    {/* FEEDBACK */}

                                                    <textarea
                                                        className="rating-feedback"
                                                        rows="4"
                                                        placeholder="Write your feedback..."
                                                        value={feedback}
                                                        onChange={(e) =>
                                                            setFeedback(e.target.value)
                                                        }
                                                    />


                                                    {/* SUBMIT */}

                                                    <div style={{ marginTop: '15px' }}>

                                                        <button
                                                            className="rating-submit-button"
                                                            disabled={
                                                                rating === 0 ||
                                                                ratingLoading
                                                            }
                                                            onClick={async () => {

                                                                if (rating === 0) {
                                                                    return
                                                                }

                                                                setRatingLoading(true)

                                                                try {

                                                                    const response =
                                                                        await fetch(
                                                                            'http://localhost:8080/api/ratings',
                                                                            {
                                                                                method: 'POST',

                                                                                headers: {
                                                                                    'Content-Type':
                                                                                        'application/json'
                                                                                },

                                                                                body:
                                                                                    JSON.stringify(
                                                                                        {
                                                                                            shipmentId:
                                                                                            selectedShipment.shipmentId,

                                                                                            rating:
                                                                                            rating,

                                                                                            description:
                                                                                            feedback
                                                                                        }
                                                                                    )
                                                                            }
                                                                        )

                                                                    if (!response.ok) {

                                                                        const errorText =
                                                                            await response.text()

                                                                        throw new Error(
                                                                            errorText ||
                                                                            'Failed to submit rating'
                                                                        )

                                                                    }


                                                                    const data =
                                                                        await response.json()

                                                                    console.log(
                                                                        'Rating submitted:',
                                                                        data
                                                                    )

                                                                    setRatingSubmitted(true)

                                                                } catch (error) {

                                                                    console.error(
                                                                        'Rating error:',
                                                                        error
                                                                    )

                                                                    alert(
                                                                        'Unable to submit rating. Please try again.'
                                                                    )

                                                                } finally {

                                                                    setRatingLoading(false)

                                                                }

                                                            }}
                                                        >

                                                            {ratingLoading
                                                                ? 'Submitting...'
                                                                : 'Submit Rating'}

                                                        </button>

                                                    </div>

                                                </>

                                            ) : (

                                                <>

                                                    <h3>
                                                        Thank You! ⭐
                                                    </h3>

                                                    <p>
                                                        Your rating and feedback have been
                                                        submitted successfully.
                                                    </p>

                                                </>

                                            )}

                                        </div>

                                    )}

                                </div>

                            )}

                        </div>

                    </div>
                )}

            </main>


        </div>

    )

}


export default UserDashboard