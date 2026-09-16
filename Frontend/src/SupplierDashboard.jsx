import { useEffect, useState } from 'react'
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    CreditCard,
     User,
    LogOut,
    Menu,
    X,
    Truck,
    CheckCircle,

    Clock
} from 'lucide-react'
import { useNavigate,useLocation } from 'react-router-dom'
import './SupplierDashboard.css'

function SupplierDashboard() {

    const navigate = useNavigate()

    const location = useLocation()
    const [sidebarOpen, setSidebarOpen] = useState(true)

    const [payments, setPayments] = useState([])
    const [shipments, setShipments] = useState([])

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const [selectedPayment, setSelectedPayment] = useState(null)

    const [ratings, setRatings] = useState([])

    const [activeView, setActiveView] = useState('dashboard')
    const [shipmentFilter, setShipmentFilter] = useState('ALL')





    const supplierName =
        localStorage.getItem('supplierName') || 'Supplier'

    const supplierEmail =
        localStorage.getItem('supplierEmail') || ''

    const supplierId = '11'

    // =========================================================
    // FETCH PAYMENTS + SHIPMENTS
    // =========================================================

    useEffect(() => {

        const fetchSupplierData = async () => {

            try {

                if (!supplierId) {
                    setError(
                        'Supplier ID not found. Please login again.'
                    )

                    setLoading(false)
                    return
                }


                // =================================================
                // FETCH PAYMENTS
                // =================================================

                const paymentResponse = await fetch(
                    `http://localhost:8080/api/payments/supplier/${supplierId}`
                )

                if (!paymentResponse.ok) {
                    throw new Error(
                        'Failed to fetch supplier payments'
                    )
                }

                const paymentData =
                    await paymentResponse.json()


                // =================================================
                // ONLY SUCCESS PAYMENTS
                // =================================================

                const successPayments =
                    paymentData.filter(
                        payment =>
                            payment.paymentStatus?.toUpperCase()
                            === 'SUCCESS'
                    )


                // =================================================
                // FETCH SHIPMENTS
                // =================================================

                const shipmentResponse = await fetch(
                    `http://localhost:8080/api/shipments/supplier/${supplierId}`
                )

                if (!shipmentResponse.ok) {
                    throw new Error(
                        'Failed to fetch supplier shipments'
                    )
                }

                const shipmentData =
                    await shipmentResponse.json()


                console.log(
                    'SUPPLIER PAYMENTS:',
                    successPayments
                )

                console.log(
                    'SUPPLIER SHIPMENTS:',
                    shipmentData
                )


                // =================================================
// FETCH SUPPLIER RATINGS
// =================================================

                const ratingResponse = await fetch(
                    `http://localhost:8080/api/ratings/supplier/${supplierId}`
                )

                if (!ratingResponse.ok) {
                    throw new Error(
                        'Failed to fetch supplier ratings'
                    )
                }

                const ratingData =
                    await ratingResponse.json()

                console.log(
                    'SUPPLIER RATINGS:',
                    ratingData
                )

                setRatings(ratingData)

                // =================================================
                // COMBINE PAYMENT + SHIPMENT
                // =================================================

                const combinedData =
                    successPayments.map(payment => {

                        const shipment =
                            shipmentData.find(
                                shipment =>
                                    shipment.payment?.paymentId
                                    === payment.paymentId
                            )

                        return {
                            ...payment,
                            shipment: shipment || null
                        }

                    })


                console.log(
                    'COMBINED SUPPLIER DATA:',
                    combinedData
                )


                setPayments(combinedData)
                setShipments(shipmentData)

            } catch (error) {

                console.error(
                    'SUPPLIER DATA FETCH ERROR:',
                    error
                )

                setError(
                    'Unable to load supplier requests.'
                )

            } finally {

                setLoading(false)

            }

        }


        fetchSupplierData()

    }, [supplierId])



    // =========================================================
    // LOGOUT
    // =========================================================

    const handleLogout = () => {

        localStorage.removeItem('supplierId')
        localStorage.removeItem('supplierName')
        localStorage.removeItem('supplierEmail')
        localStorage.removeItem('role')

        navigate('/supplier-login')
    }


    // =========================================================
    // VIEW DETAILS
    // =========================================================

    const handleViewDetails = (payment) => {

        setSelectedPayment(payment)

    }


    // =========================================================
    // CLOSE DETAILS
    // =========================================================

    const closeDetails = () => {

        setSelectedPayment(null)

    }


    // =========================================================
    // GET SHIPMENT STATUS
    // =========================================================

    const getShipmentStatus = (payment) => {

        if (
            payment.shipment &&
            payment.shipment.shipmentStatus
        ) {

            return payment.shipment.shipmentStatus

        }

        return 'PENDING_ACKNOWLEDGEMENT'
    }


    // =========================================================
    // GET STATUS LABEL
    // =========================================================

    const getStatusLabel = (status) => {

        switch (status) {

            case 'PENDING_ACKNOWLEDGEMENT':
                return 'Pending Acknowledgement'

            case 'ACKNOWLEDGED':
                return 'Acknowledged'

            case 'PACKED':
                return 'Packed'

            case 'SHIPPED':
                return 'Shipped'

            case 'DELIVERED':
                return 'Delivered'

            default:
                return 'Pending Acknowledgement'

        }

    }


    // =========================================================
    // GET NEXT STATUS
    // =========================================================

    const getNextStatus = (currentStatus) => {

        switch (currentStatus) {

            case 'PENDING_ACKNOWLEDGEMENT':
                return 'ACKNOWLEDGED'

            case 'ACKNOWLEDGED':
                return 'PACKED'

            case 'PACKED':
                return 'SHIPPED'

            case 'SHIPPED':
                return 'DELIVERED'

            default:
                return null

        }

    }


    // =========================================================
    // GET ACTION BUTTON LABEL
    // =========================================================

    const getActionLabel = (status) => {

        switch (status) {

            case 'PENDING_ACKNOWLEDGEMENT':
                return 'ACKNOWLEDGE'

            case 'ACKNOWLEDGED':
                return 'PACK'

            case 'PACKED':
                return 'SHIP'

            case 'SHIPPED':
                return 'DELIVER'

            default:
                return 'DELIVERED'

        }

    }


    // =========================================================
    // STATUS ICON
    // =========================================================

    const getStatusIcon = (status) => {

        switch (status) {

            case 'PENDING_ACKNOWLEDGEMENT':
                return <Clock size={20} />

            case 'ACKNOWLEDGED':
                return <CheckCircle size={20} />

            case 'PACKED':
                return <Package size={20} />

            case 'SHIPPED':
                return <Truck size={20} />

            case 'DELIVERED':
                return <CheckCircle size={20} />

            default:
                return <Clock size={20} />

        }

    }


    // =========================================================
    // UPDATE SHIPMENT STATUS
    // =========================================================

    const handleShipmentStatusUpdate = async (payment) => {

        try {

            const shipment =
                payment.shipment


            // =================================================
            // CHECK SHIPMENT
            // =================================================

            if (!shipment?.shipmentId) {

                alert(
                    'Shipment not found for this request.'
                )

                return
            }


            // =================================================
            // CURRENT STATUS
            // =================================================

            const currentStatus =
                getShipmentStatus(payment)


            // =================================================
            // NEXT STATUS
            // =================================================

            const nextStatus =
                getNextStatus(currentStatus)


            if (!nextStatus) {

                return

            }


            console.log(
                'UPDATING SHIPMENT:',
                shipment.shipmentId,
                currentStatus,
                '→',
                nextStatus
            )


            // =================================================
            // BACKEND REQUEST
            // =================================================

            const response = await fetch(
                `http://localhost:8080/api/shipments/${shipment.shipmentId}/status?status=${nextStatus}`,
                {
                    method: 'PUT'
                }
            )


            const responseText =
                await response.text()


            console.log(
                'SHIPMENT STATUS RESPONSE:',
                response.status,
                responseText
            )


            if (!response.ok) {

                throw new Error(
                    responseText ||
                    `HTTP ${response.status}`
                )

            }


            const updatedShipment =
                JSON.parse(responseText)


            // =================================================
            // UPDATE PAYMENT LIST
            // =================================================

            setPayments(prevPayments =>

                prevPayments.map(item => {

                    if (
                        item.paymentId
                        === payment.paymentId
                    ) {

                        return {
                            ...item,
                            shipment:
                            updatedShipment
                        }

                    }

                    return item

                })

            )


            // =================================================
            // UPDATE SELECTED PAYMENT
            // =================================================

            setSelectedPayment(prev => {

                if (
                    prev &&
                    prev.paymentId
                    === payment.paymentId
                ) {

                    return {
                        ...prev,
                        shipment:
                        updatedShipment
                    }

                }

                return prev

            })


            // =================================================
            // SUCCESS MESSAGE
            // =================================================

            alert(
                `Shipment status updated to ${nextStatus}`
            )

        } catch (error) {

            console.error(
                'SHIPMENT STATUS UPDATE ERROR:',
                error
            )

            alert(
                `Failed to update shipment status: ${error.message}`
            )

        }

    }



    // =========================================================
// FILTER SUPPLIER REQUESTS
// =========================================================

    const getFilteredPayments = () => {

        if (shipmentFilter === 'ALL') {
            return payments
        }

        return payments.filter(payment => {

            const status =
                getShipmentStatus(payment)

            return status === shipmentFilter

        })
    }



    // =========================================================
    // DOWNLOAD FULL DELIVERED REQUEST DETAILS
    // =========================================================



    const downloadAllDeliveredDetails = () => {

        const deliveredPayments = payments.filter(
            payment => getShipmentStatus(payment) === 'DELIVERED'
        )

        if (deliveredPayments.length === 0) {
            alert('No delivered requests available for download.')
            return
        }

        const headers = [
            'Product',
            'Product ID',
            'Quantity',
            'Payment ID',
            'Transaction ID',
            'Amount',
            'Payment Status',
            'Shipment ID',
            'Tracking Number',
            'Shipment Status',
            'Rating',
            'Feedback'
        ]

        const dataRows = deliveredPayments.map(payment => {

            const product = payment?.product
            const shipment = payment?.shipment

            const productRating = ratings.find(
                rating =>
                    rating.productId === product?.productId
            )

            return [
                product?.name || 'N/A',

                product?.productId || 'N/A',

                product?.numberOfQuantities || 'N/A',

                payment?.paymentId || 'N/A',

                payment?.transactionId || 'N/A',

                payment?.amount != null
                    ? `₹${Number(payment.amount).toLocaleString('en-IN')}`
                    : 'N/A',

                payment?.paymentStatus || 'N/A',

                shipment?.shipmentId || 'N/A',

                shipment?.trackingNumber || 'N/A',

                getShipmentStatus(payment),

                productRating?.rating
                    ? `${productRating.rating}/5`
                    : 'Not Rated',

                productRating?.description || 'No Feedback'
            ]
        })

        const csvContent = [
            headers,
            ...dataRows
        ]
            .map(row =>
                row
                    .map(value =>
                        `"${String(value).replace(/"/g, '""')}"`
                    )
                    .join(',')
            )
            .join('\n')

        const blob = new Blob(
            [csvContent],
            {
                type: 'text/csv;charset=utf-8;'
            }
        )

        const url = URL.createObjectURL(blob)

        const link = document.createElement('a')

        link.href = url

        link.download =
            'All_Delivered_Request_Details.csv'

        document.body.appendChild(link)

        link.click()

        document.body.removeChild(link)

        URL.revokeObjectURL(url)
    }
    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div className="supplier-dashboard">


            {/* =================================================
                SIDEBAR
            ================================================= */}

            <aside
                className={`supplier-sidebar ${
                    sidebarOpen
                        ? 'open'
                        : 'closed'
                }`}
            >

                <div className="supplier-brand">

                    <div className="supplier-logo">
                        SP
                    </div>

                    {sidebarOpen && (

                        <div>

                            <h2>
                                SmartProcure
                            </h2>

                            <span>
                                Supplier Panel
                            </span>

                        </div>

                    )}

                </div>


                <nav className="supplier-nav">

                    {/* DASHBOARD */}

                    <button
                        className={`supplier-nav-item ${
                            activeView === 'dashboard'
                                ? 'active'
                                : ''
                        }`}
                        onClick={() => {
                            setActiveView('dashboard')
                            setShipmentFilter('ALL')
                        }}
                    >

                        <LayoutDashboard size={20} />

                        {sidebarOpen && (
                            <span>
                                Dashboard
                            </span>
                        )}

                    </button>



                    {/* ORDERS */}

                    <button
                        className={`supplier-nav-item ${
                            activeView === 'orders'
                                ? 'active'
                                : ''
                        }`}
                        onClick={() => {
                            setActiveView('orders')
                            setShipmentFilter('ALL')
                        }}
                    >

                        <ShoppingCart size={20} />

                        {sidebarOpen && (
                            <span>
                                Orders
                            </span>
                        )}

                    </button>


                    {/* PAYMENTS */}

                    <button
                        className={`supplier-nav-item ${
                            activeView === 'payments'
                                ? 'active'
                                : ''
                        }`}
                        onClick={() => {
                            setActiveView('payments')
                            setShipmentFilter('ALL')
                        }}
                    >

                        <CreditCard size={20} />

                        {sidebarOpen && (
                            <span>
                                Payments
                            </span>
                        )}

                    </button>

                    <button
                        className={`supplier-nav-item ${
                            activeView === 'shipment-process'
                                ? 'active'
                                : ''
                        }`}
                        onClick={() => {
                            setActiveView('shipment-process')
                            setShipmentFilter('ALL')
                        }}
                    >
                        <Truck size={20} />
                        {sidebarOpen && <span>Shipment Process</span>}
                    </button>

                    <button
                        className={`nav-item ${
                            location.pathname === '/supplier-profile'
                                ? 'active'
                                : ''
                        }`}
                        onClick={() => navigate('/supplier-profile')}
                    >
                        <User size={20} />
                        <span>Profile</span>
                    </button>


                </nav>


                {/* LOGOUT */}

                <button
                    className="supplier-logout"
                    onClick={handleLogout}
                >

                    <LogOut size={20} />

                    {sidebarOpen && (
                        <span>
                            Logout
                        </span>
                    )}

                </button>

            </aside>


            {/* =================================================
                MAIN
            ================================================= */}

            <main className="supplier-main">


                {/* HEADER */}

                <header className="supplier-header">

                    <button
                        className="supplier-menu-button"
                        onClick={() =>
                            setSidebarOpen(
                                !sidebarOpen
                            )
                        }
                    >

                        {sidebarOpen
                            ? <X size={22} />
                            : <Menu size={22} />
                        }

                    </button>


                    <div>

                        <h1>
                            Supplier Dashboard
                        </h1>

                        <p>
                            Manage your assigned procurement
                            requests and shipments.
                        </p>

                    </div>


                    <div className="supplier-profile">

                        <div className="supplier-avatar">

                            {supplierName
                                .charAt(0)
                                .toUpperCase()}

                        </div>

                        <div>

                            <strong>
                                {supplierName}
                            </strong>

                            <span>
                                SUPPLIER
                            </span>

                        </div>

                    </div>

                </header>


                {/* WELCOME */}


                {activeView === 'dashboard' && (
                <section className="supplier-welcome">

                    <div>

                        <span className="welcome-label">
                            SUPPLIER PORTAL
                        </span>

                        <h2>
                            Welcome back, {supplierName}! 👋
                        </h2>

                        <p>
                            Track your assigned requests,
                            shipments and payments.
                        </p>

                    </div>


                    <div className="welcome-icon">

                        <Truck size={55} />

                    </div>

                </section>
                )}


                {/* =================================================
                    KPI CARDS
                ================================================= */}

                {activeView === 'dashboard' && (
                <section className="supplier-stats">


                    {/* TOTAL */}

                    <div className="supplier-stat-card">

                        <div className="supplier-stat-icon">
                            <Package size={25} />
                        </div>

                        <div>

                            <span>
                                My Requests
                            </span>

                            <h2>
                                {payments.length}
                            </h2>

                            <small>
                                Successfully paid requests
                            </small>

                        </div>

                    </div>


                    {/* ACTIVE */}

                    <div className="supplier-stat-card pending">

                        <div className="supplier-stat-icon">
                            <ShoppingCart size={25} />
                        </div>

                        <div>

                            <span>
                                Active Orders
                            </span>

                            <h2>
                                {
                                    payments.filter(
                                        payment =>
                                            getShipmentStatus(
                                                payment
                                            ) !== 'DELIVERED'
                                    ).length
                                }
                            </h2>

                            <small>
                                Orders in progress
                            </small>

                        </div>

                    </div>


                    {/* COMPLETED */}

                    <div className="supplier-stat-card approved">

                        <div className="supplier-stat-icon">
                            <CheckCircle size={25} />
                        </div>

                        <div>

                            <span>
                                Completed
                            </span>

                            <h2>
                                {
                                    payments.filter(
                                        payment =>
                                            getShipmentStatus(
                                                payment
                                            ) === 'DELIVERED'
                                    ).length
                                }
                            </h2>

                            <small>
                                Delivered orders
                            </small>

                        </div>

                    </div>


                    {/* TOTAL PAYMENT */}

                    <div className="supplier-stat-card payment">

                        <div className="supplier-stat-icon">
                            <CreditCard size={25} />
                        </div>

                        <div>

                            <span>
                                Total Payments
                            </span>

                            <h2>
                                ₹
                                {
                                    payments
                                        .reduce(
                                            (
                                                total,
                                                payment
                                            ) =>
                                                total +
                                                Number(
                                                    payment.amount
                                                    || 0
                                                ),
                                            0
                                        )
                                        .toLocaleString(
                                            'en-IN'
                                        )
                                }
                            </h2>

                            <small>
                                Successful payments
                            </small>

                        </div>

                    </div>

                </section>
                )}


                {/* =================================================
                    MY SHIPMENT REQUESTS
                ================================================= */}

                {(activeView === 'orders' || activeView === 'shipment-process') && (
                    <section className="supplier-section">

                        <div className="supplier-section-header">
                            <div>
                                <h2>My Shipment Requests</h2>
                                <p>
                                    Only successfully paid requests assigned to you are shown here.
                                </p>
                            </div>

                            <button
                                className="download-details-btn"
                                onClick={downloadAllDeliveredDetails}
                            >
                                Download All Details
                            </button>
                        </div>


                    {/* LOADING */}

                    {loading && (

                        <p>
                            Loading supplier requests...
                        </p>

                    )}


                    {/* ERROR */}

                    {error && (

                        <p>
                            {error}
                        </p>

                    )}


                    {/* EMPTY */}

                    {!loading &&
                        !error &&
                        payments.length === 0 && (

                            <p>
                                No successful payment requests
                                found for this supplier.
                            </p>

                        )}

                        {!loading &&
                            !error &&
                            payments.length > 0 &&
                            getFilteredPayments().length === 0 && (

                                <p>
                                    No requests found for this shipment stage.
                                </p>

                            )}


                    {/* =================================================
                             REQUEST LIST - HORIZONTAL

                        ================================================= */}

                    {!loading &&
                        !error &&
                        getFilteredPayments().length > 0 && (

                            <div className="supplier-request-list">

                                {getFilteredPayments().map((payment) => {

                                    const shipmentStatus =
                                        getShipmentStatus(payment)

                                    const productRating =
                                        ratings.find(
                                            rating =>
                                                rating.productId
                                                === payment.product?.productId
                                        )

                                    return (

                                        <div
                                            className="supplier-request-row"
                                            key={payment.paymentId}
                                        >

                                            {/* PRODUCT */}

                                            <div className="shipment-column product-column">

                            <span className="column-label">
                                Product
                            </span>

                                                <strong>
                                                    {payment.product?.name || 'Product'}
                                                </strong>

                                            </div>


                                            {/* PAYMENT ID */}

                                            <div className="shipment-column">

                            <span className="column-label">
                                Payment ID
                            </span>

                                                <strong>
                                                    #{payment.paymentId}
                                                </strong>

                                            </div>


                                            {/* AMOUNT */}

                                            <div className="shipment-column">

                            <span className="column-label">
                                Amount
                            </span>

                                                <strong>
                                                    ₹
                                                    {Number(
                                                        payment.amount || 0
                                                    ).toLocaleString('en-IN')}
                                                </strong>

                                            </div>


                                            {/* PAYMENT STATUS */}

                                            <div className="shipment-column">

                            <span className="column-label">
                                Payment
                            </span>

                                                <span className="small-success-btn">
                                ✓ SUCCESS
                            </span>

                                            </div>


                                            {/* SHIPMENT STATUS */}

                                            <div className="shipment-column">

                            <span className="column-label">
                                Shipment
                            </span>

                                                <span
                                                    className={`shipment-status-btn ${shipmentStatus.toLowerCase()}`}
                                                >
                                {getStatusLabel(shipmentStatus)}
                            </span>

                                            </div>



                                            {/* CUSTOMER RATING */}




                                            <div className="shipment-column">

                                                <span className="column-label">
                                                    Customer Rating
                                                </span>

                                                {productRating ? (

                                                    <div className="customer-rating">

                                                        <div className="customer-rating-stars">

                                                            {'★'.repeat(
                                                                productRating.rating || 0
                                                            )}

                                                            {'☆'.repeat(
                                                                5 - (productRating.rating || 0)
                                                            )}

                                                        </div>

                                                        <span className="customer-rating-value">

                                                            {productRating.rating}/5
                                                        </span>

                                                        <span
                                                            className="customer-rating-feedback"
                                                            title={
                                                                productRating.description
                                                                || 'No feedback'
                                                            }
                                                        >
                                                            {productRating.description || 'No feedback'}
                                                        </span>

                                                    </div>

                                                ) : (

                                                    <span
                                                        className="customer-rating-badge">Not Rated
                                                    </span>

                                                )}

                                            </div>

                                            {/* ACTION */}

                                            <div className="shipment-actions">

                                                {shipmentStatus !== 'DELIVERED' && (

                                                    <button
                                                        className="shipment-action-btn small-action"
                                                        onClick={() =>
                                                            handleShipmentStatusUpdate(
                                                                payment
                                                            )
                                                        }
                                                    >

                                                        {getStatusIcon(
                                                            shipmentStatus
                                                        )}

                                                        {getActionLabel(
                                                            shipmentStatus
                                                        )}

                                                    </button>

                                                )}


                                                {shipmentStatus === 'DELIVERED' && (
                                                    <div className="delivered-actions">

                                                        <button
                                                            className="shipment-completed-btn small-action"
                                                            disabled
                                                        >
                                                            <CheckCircle size={15} />
                                                            DELIVERED
                                                        </button>

                                                    </div>


                                                )}




                                                  </div>
                                        </div>

                                    )

                                })}

                            </div>

                        )}
                </section>

                )}



                {/* =================================================
    PAYMENTS
================================================= */}

                {activeView === 'payments' && (

                    <section className="supplier-section">

                        <div className="supplier-section-header">

                            <div>

                                <h2>
                                    All Paid Requests
                                </h2>

                                <p>
                                    All successfully paid requests assigned to you.
                                </p>

                            </div>

                        </div>


                        {payments.length === 0 ? (

                            <p>
                                No successful payment requests found.
                            </p>

                        ) : (

                            <div className="supplier-request-list">

                                {payments.map((payment) => (

                                    <div
                                        className="supplier-request-row"
                                        key={payment.paymentId}
                                    >

                                        <div className="shipment-column product-column">

                            <span className="column-label">
                                Product
                            </span>

                                            <strong>
                                                {payment.product?.name || 'Product'}
                                            </strong>

                                        </div>


                                        <div className="shipment-column">

                            <span className="column-label">
                                Payment ID
                            </span>

                                            <strong>
                                                #{payment.paymentId}
                                            </strong>

                                        </div>


                                        <div className="shipment-column">

                            <span className="column-label">
                                Amount
                            </span>

                                            <strong>
                                                ₹
                                                {Number(
                                                    payment.amount || 0
                                                ).toLocaleString('en-IN')}
                                            </strong>

                                        </div>


                                        <div className="shipment-column">

                            <span className="column-label">
                                Payment Status
                            </span>

                                            <span className="small-success-btn">
                                ✓ SUCCESS
                            </span>

                                        </div>


                                        <div className="shipment-column">

                            <span className="column-label">
                                Shipment
                            </span>

                                            <span
                                                className={`shipment-status-btn ${
                                                    getShipmentStatus(payment).toLowerCase()
                                                }`}
                                            >
                                {getStatusLabel(
                                    getShipmentStatus(payment)
                                )}
                            </span>

                                        </div>

                                    </div>

                                ))}

                            </div>

                        )}

                    </section>

                )}


                {/* =================================================
                    SUPPLIER INFORMATION
                ================================================= */}

                {/* =================================================
    SUPPLIER INFORMATION + SHIPMENT PROCESS
================================================= */}

                {(activeView === 'dashboard' ||
                    activeView === 'shipment-process') && (

                    <section className="supplier-section shipment-workspace">

                        {/* =================================================
            SUPPLIER INFORMATION - DASHBOARD ONLY
        ================================================= */}

                        {activeView === 'dashboard' && (
                            <>
                                <div className="supplier-section-header">

                                    <div>

                                        <h2>
                                            Supplier Information
                                        </h2>

                                        <p>
                                            Your registered supplier account details.
                                        </p>

                                    </div>

                                </div>


                                <div className="supplier-info-card">

                                    <div className="info-item">

                        <span>
                            Supplier ID
                        </span>

                                        <strong>
                                            {supplierId}
                                        </strong>

                                    </div>


                                    <div className="info-item">

                        <span>
                            Supplier Name
                        </span>

                                        <strong>
                                            {supplierName}
                                        </strong>

                                    </div>


                                    <div className="info-item">

                        <span>
                            Email Address
                        </span>

                                        <strong>
                                            {supplierEmail}
                                        </strong>

                                    </div>


                                    <div className="info-item">

                        <span>
                            Account Status
                        </span>

                                        <strong className="active-status">
                                            ● Active
                                        </strong>

                                    </div>

                                </div>
                            </>
                        )}


                        {/* =================================================
            SHIPMENT PROCESS
        ================================================= */}

                        {activeView === 'shipment-process' && (

                            <div className="shipment-process-panel">

                                <div className="supplier-section-header">

                                    <div>

                                        <h2>
                                            Shipment Process
                                        </h2>

                                        <p>
                                            Click a stage to view those requests.
                                        </p>

                                    </div>

                                </div>


                                {/* ALL */}

                                <button
                                    className={
                                        shipmentFilter === 'ALL'
                                            ? 'process-filter active'
                                            : 'process-filter'
                                    }
                                    onClick={() =>
                                        setShipmentFilter('ALL')
                                    }
                                >

                                    <Package size={22} />

                                    <div>

                                        <strong>
                                            All Requests
                                        </strong>

                                        <span>
                            {payments.length} requests
                        </span>

                                    </div>

                                </button>


                                {/* PENDING ACKNOWLEDGEMENT */}

                                <button
                                    className={
                                        shipmentFilter ===
                                        'PENDING_ACKNOWLEDGEMENT'
                                            ? 'process-filter active'
                                            : 'process-filter'
                                    }
                                    onClick={() =>
                                        setShipmentFilter(
                                            'PENDING_ACKNOWLEDGEMENT'
                                        )
                                    }
                                >

                                    <Clock size={22} />

                                    <div>

                                        <strong>
                                            Acknowledge Request
                                        </strong>

                                        <span>
                            {
                                payments.filter(
                                    payment =>
                                        getShipmentStatus(
                                            payment
                                        ) ===
                                        'PENDING_ACKNOWLEDGEMENT'
                                ).length
                            } requests
                        </span>

                                    </div>

                                </button>


                                {/* ACKNOWLEDGED */}

                                <button
                                    className={
                                        shipmentFilter === 'ACKNOWLEDGED'
                                            ? 'process-filter active'
                                            : 'process-filter'
                                    }
                                    onClick={() =>
                                        setShipmentFilter('ACKNOWLEDGED')
                                    }
                                >

                                    <CheckCircle size={22} />

                                    <div>

                                        <strong>
                                            Acknowledged
                                        </strong>

                                        <span>
                            {
                                payments.filter(
                                    payment =>
                                        getShipmentStatus(
                                            payment
                                        ) === 'ACKNOWLEDGED'
                                ).length
                            } requests
                        </span>

                                    </div>

                                </button>


                                {/* PACKED */}

                                <button
                                    className={
                                        shipmentFilter === 'PACKED'
                                            ? 'process-filter active'
                                            : 'process-filter'
                                    }
                                    onClick={() =>
                                        setShipmentFilter('PACKED')
                                    }
                                >

                                    <Package size={22} />

                                    <div>

                                        <strong>
                                            Packed Request
                                        </strong>

                                        <span>
                            {
                                payments.filter(
                                    payment =>
                                        getShipmentStatus(
                                            payment
                                        ) === 'PACKED'
                                ).length
                            } requests
                        </span>

                                    </div>

                                </button>


                                {/* SHIPPED */}

                                <button
                                    className={
                                        shipmentFilter === 'SHIPPED'
                                            ? 'process-filter active'
                                            : 'process-filter'
                                    }
                                    onClick={() =>
                                        setShipmentFilter('SHIPPED')
                                    }
                                >

                                    <Truck size={22} />

                                    <div>

                                        <strong>
                                            Shipped Request
                                        </strong>

                                        <span>
                            {
                                payments.filter(
                                    payment =>
                                        getShipmentStatus(
                                            payment
                                        ) === 'SHIPPED'
                                ).length
                            } requests
                        </span>

                                    </div>

                                </button>


                                {/* DELIVERED */}

                                <button
                                    className={
                                        shipmentFilter === 'DELIVERED'
                                            ? 'process-filter active'
                                            : 'process-filter'
                                    }
                                    onClick={() =>
                                        setShipmentFilter('DELIVERED')
                                    }
                                >

                                    <CheckCircle size={22} />

                                    <div>

                                        <strong>
                                            Delivered Request
                                        </strong>

                                        <span>
                            {
                                payments.filter(
                                    payment =>
                                        getShipmentStatus(
                                            payment
                                        ) === 'DELIVERED'
                                ).length
                            } requests
                        </span>

                                    </div>

                                </button>

                            </div>

                        )}

                    </section>

                )}
            </main>


            {/* =================================================
                DETAILS MODAL
            ================================================= */}

            {selectedPayment && (

                <div
                    className="details-modal-overlay"
                    onClick={closeDetails}
                >

                    <div
                        className="details-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >

                        <div className="details-modal-header">

                            <div>

                                <h2>
                                    Request Details
                                </h2>

                                <p>
                                    Complete procurement details
                                </p>

                            </div>


                            <button
                                onClick={closeDetails}
                            >

                                <X size={22} />

                            </button>

                        </div>


                        {/* PRODUCT DETAILS */}

                        <div className="details-block">

                            <h3>
                                Product Information
                            </h3>

                            <p>
                                <strong>
                                    Product:
                                </strong>{' '}
                                {
                                    selectedPayment
                                        .product?.name
                                    || 'N/A'
                                }
                            </p>

                            <p>
                                <strong>
                                    Product ID:
                                </strong>{' '}
                                {
                                    selectedPayment
                                        .product?.productId
                                    || 'N/A'
                                }
                            </p>

                            <p>
                                <strong>
                                    Quantity:
                                </strong>{' '}
                                {
                                    selectedPayment
                                        .product
                                        ?.numberOfQuantities
                                    || 'N/A'
                                }
                            </p>

                        </div>


                        {/* PAYMENT DETAILS */}

                        <div className="details-block">

                            <h3>
                                Payment Information
                            </h3>

                            <p>
                                <strong>
                                    Payment ID:
                                </strong>{' '}
                                {
                                    selectedPayment.paymentId
                                }
                            </p>

                            <p>
                                <strong>
                                    Transaction ID:
                                </strong>{' '}
                                {
                                    selectedPayment
                                        .transactionId
                                    || 'N/A'
                                }
                            </p>

                            <p>
                                <strong>
                                    Amount:
                                </strong>{' '}
                                ₹
                                {
                                    Number(
                                        selectedPayment.amount
                                        || 0
                                    ).toLocaleString(
                                        'en-IN'
                                    )
                                }
                            </p>

                            <p>
                                <strong>
                                    Payment Method:
                                </strong>{' '}
                                {
                                    selectedPayment
                                        .paymentMethod
                                    || 'N/A'
                                }
                            </p>

                            <p>
                                <strong>
                                    Payment Status:
                                </strong>{' '}

                                <span className="success-text">

                                    {
                                        selectedPayment
                                            .paymentStatus
                                    }

                                </span>

                            </p>

                        </div>


                        {/* SUPPLIER DETAILS */}

                        <div className="details-block">

                            <h3>
                                Supplier Information
                            </h3>

                            <p>
                                <strong>
                                    Supplier ID:
                                </strong>{' '}
                                {supplierId}
                            </p>

                            <p>
                                <strong>
                                    Supplier Name:
                                </strong>{' '}
                                {supplierName}
                            </p>

                            <p>
                                <strong>
                                    Supplier Email:
                                </strong>{' '}
                                {supplierEmail}
                            </p>

                        </div>


                        {/* SHIPMENT DETAILS */}

                        <div className="details-block">

                            <h3>
                                Shipment Information
                            </h3>

                            <p>
                                <strong>
                                    Shipment ID:
                                </strong>{' '}

                                {
                                    selectedPayment
                                        .shipment
                                        ?.shipmentId
                                    || 'Not available'
                                }

                            </p>

                            <p>
                                <strong>
                                    Tracking Number:
                                </strong>{' '}

                                {
                                    selectedPayment
                                        .shipment
                                        ?.trackingNumber
                                    || 'Not available'
                                }

                            </p>

                            <p>
                                <strong>
                                    Current Status:
                                </strong>{' '}

                                {
                                    getStatusLabel(
                                        getShipmentStatus(
                                            selectedPayment
                                        )
                                    )
                                }

                            </p>

                        </div>


                        <button
                            className="close-details-btn"
                            onClick={closeDetails}
                        >
                            Close
                        </button>

                    </div>

                </div>

            )}

        </div>

    )

}

export default SupplierDashboard