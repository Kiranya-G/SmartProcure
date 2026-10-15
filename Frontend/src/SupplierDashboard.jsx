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

    Clock,
    FileText
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
    const [approvedRequests, setApprovedRequests] = useState([])


    const [selectedQuotations, setSelectedQuotations] = useState([])
    const [shipmentFilter, setShipmentFilter] = useState('ALL')


    const [selectedRequest, setSelectedRequest] = useState(null);
    const [quotedAmount, setQuotedAmount] = useState('');
    const [availableQuantity, setAvailableQuantity] = useState('');
    const [expectedDeliveryDate, setExpectedDeliveryDate] = useState('');
    const [supplierMessage, setSupplierMessage] = useState('');
    const [quotationMessage, setQuotationMessage] = useState('');
    const [quotationLoading, setQuotationLoading] = useState(false);




    const supplierName =
        localStorage.getItem('supplierName') || 'Supplier'

    const supplierEmail =
        localStorage.getItem('supplierEmail') || ''

    const supplierId =
        localStorage.getItem('supplierId')

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



                const fetchApprovedRequests = async () => {
                    try {
                        const response = await fetch(
                            `http://localhost:8080/api/products/supplier/${supplierId}/approved-requests`
                        );

                        if (!response.ok) {
                            throw new Error(
                                `Failed to fetch approved requests: ${response.status}`
                            );
                        }

                        const data = await response.json();
                        setApprovedRequests(data);
                    } catch (err) {
                        console.error('Error fetching approved requests:', err);
                    }
                };

                fetchApprovedRequests();


                fetchSelectedQuotations();
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





    const fetchSelectedQuotations = async () => {
        const currentSupplierId = localStorage.getItem('supplierId');

        if (!currentSupplierId) {
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:8080/api/quotations/supplier/${currentSupplierId}`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch supplier quotations');
            }

            const data = await response.json();

            const selected = data.filter(
                quotation =>
                    quotation.quotationStatus?.toUpperCase() === 'SELECTED'
            );

            setSelectedQuotations(selected);
        } catch (error) {
            console.error('SELECTED QUOTATIONS ERROR:', error);
        }
    };


    const handleSubmitQuotation = async () => {
        if (!selectedRequest) {
            setQuotationMessage('Please select a request.');
            return;
        }

        const currentSupplierId = localStorage.getItem('supplierId');

        if (!currentSupplierId) {
            setQuotationMessage('Supplier ID not found. Please login again.');
            return;
        }

        const quantity = Number(availableQuantity);
        const price = Number(quotedAmount);

        if (
            quotedAmount.trim() === '' ||
            !Number.isFinite(price) ||
            price <= 0
        ) {
            setQuotationMessage('Enter a valid quoted price.');
            return;
        }

        if (
            availableQuantity.trim() === '' ||
            !Number.isInteger(quantity) ||
            quantity < selectedRequest.numberOfQuantities
        ) {
            setQuotationMessage(
                'Available quantity must be at least the requested quantity.'
            );
            return;
        }

        const today = new Date();
        const localToday = [
            today.getFullYear(),
            String(today.getMonth() + 1).padStart(2, '0'),
            String(today.getDate()).padStart(2, '0')
        ].join('-');

        if (
            !expectedDeliveryDate ||
            expectedDeliveryDate < localToday
        ) {
            setQuotationMessage(
                'Please select today or a future delivery date.'
            );
            return;
        }

        setQuotationLoading(true);
        setQuotationMessage('');

        try {
            const response = await fetch(
                'http://localhost:8080/api/quotations/submit',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        productId: selectedRequest.productId,
                        supplierId: Number(currentSupplierId),
                        quotedAmount: price,
                        availableQuantity: quantity,
                        expectedDeliveryDate: expectedDeliveryDate,
                        supplierMessage: supplierMessage.trim()
                    })
                }
            );

            const responseText = await response.text();

            let result = null;

            try {
                result = responseText ? JSON.parse(responseText) : null;
            } catch {
                result = null;
            }


            if (!response.ok) {
                const errorMessage =
                    result?.message ||
                    result?.error ||
                    responseText ||
                    '';

                if (
                    response.status === 500 &&
                    errorMessage.toLowerCase().includes('already submitted')
                ) {
                    setQuotationMessage(
                        'You have already submitted a quotation for this request.'
                    );
                    setSelectedRequest(null);
                    return;
                }

                throw new Error(
                    errorMessage || `Request failed with status ${response.status}`
                );
            }


            setQuotationMessage('Quotation submitted successfully!');

            await fetchSelectedQuotations();
            setSelectedRequest(null);
            setQuotedAmount('');
            setAvailableQuantity('');
            setExpectedDeliveryDate('');
            setSupplierMessage('');

        } catch (err) {
            console.error('QUOTATION SUBMISSION ERROR:', err);

            setQuotationMessage(
                err.message || 'Unable to submit quotation.'
            );
        } finally {
            setQuotationLoading(false);
        }
    };
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

                    <button
                        className={`supplier-nav-item ${
                            activeView === 'quotations' ? 'active' : ''
                        }`}
                        onClick={() => {
                            setActiveView('quotations')
                            setShipmentFilter('ALL')
                        }}
                    >
                        <FileText size={20} />

                        {sidebarOpen && (
                            <span>Requests & Quotations</span>
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


                {/* REQUESTS & QUOTATIONS */}
                {activeView === 'quotations' && (
                    <section className="supplier-content quotation-page">

                        <div className="quotation-page-header">
                            <div>
                <span className="quotation-eyebrow">
                    SUPPLIER WORKSPACE
                </span>
                                <h2>Requests &amp; Quotations</h2>
                                <p>
                                    Review approved requests and submit your quotation
                                    to the admin.
                                </p>
                            </div>

                            <div className="quotation-count">
                                <FileText size={22} />
                                <div>
                                    <strong>{approvedRequests.length}</strong>
                                    <span>Approved Requests</span>
                                </div>
                            </div>
                        </div>

                        {/* SUCCESS / ERROR MESSAGE */}
                        {quotationMessage && (
                            <div
                                className={`quotation-alert ${
                                    quotationMessage.toLowerCase().includes('success')
                                        ? 'success'
                                        : 'error'
                                }`}
                                role="status"
                            >
                                {quotationMessage}
                            </div>
                        )}

                        {/* APPROVED REQUESTS */}
                        <div className="quotation-section">
                            <div className="quotation-section-heading">
                                <div>
                                    <h3>Approved Requests</h3>
                                    <p>Submit a quotation for each eligible request.</p>
                                </div>
                                <span className="quotation-total">
                    {approvedRequests.length} requests
                </span>
                            </div>

                            {approvedRequests.length === 0 ? (
                                <div className="quotation-empty">
                                    <Package size={34} />
                                    <h3>No approved requests available</h3>
                                    <p>
                                        Approved requests for your supplier account
                                        will appear here.
                                    </p>
                                </div>
                            ) : (
                                <div className="quotation-table-wrapper">
                                    <div className="quotation-table quotation-table-header">
                                        <span>Request / Product</span>
                                        <span>Category</span>
                                        <span>Quantity</span>
                                        <span>Requested Price</span>
                                        <span>Status</span>
                                        <span>Action</span>
                                    </div>

                                    {approvedRequests.map((request) => (
                                        <div
                                            className="quotation-table quotation-request-row"
                                            key={request.productId}
                                        >
                                            <div className="quotation-product-cell">
                                                <div className="quotation-product-icon">
                                                    <Package size={20} />
                                                </div>
                                                <div>
                                                    <strong>
                                                        {request.name || 'Product'}
                                                    </strong>
                                                    <small>
                                                        Request #{request.productId}
                                                    </small>
                                                </div>
                                            </div>

                                            <div className="quotation-cell">
                                                {request.category?.catName || 'N/A'}
                                            </div>

                                            <div className="quotation-cell">
                                                {request.numberOfQuantities ?? 'N/A'}
                                            </div>

                                            <div className="quotation-cell quotation-price">
                                                ₹
                                                {Number(
                                                    request.pricePerProduct || 0
                                                ).toLocaleString('en-IN')}
                                            </div>

                                            <div>
                                <span className="quotation-status approved-status">
                                    <CheckCircle size={14} />
                                    Approved
                                </span>
                                            </div>

                                            <div>
                                                <button
                                                    type="button"
                                                    className="quotation-submit-btn"
                                                    onClick={() => {
                                                        setSelectedRequest(request);
                                                        setQuotedAmount('');
                                                        setAvailableQuantity(
                                                            String(
                                                                request.numberOfQuantities || ''
                                                            )
                                                        );
                                                        setExpectedDeliveryDate('');
                                                        setSupplierMessage('');
                                                        setQuotationMessage('');
                                                    }}
                                                >
                                                    Submit Quotation
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* ADMIN SELECTED QUOTATIONS */}
                        <div className="quotation-section selected-quotation-section">
                            <div className="quotation-section-heading">
                                <div>
                                    <h3>Admin Selected Quotations</h3>
                                    <p>
                                        Quotations selected by the admin are displayed here.
                                    </p>
                                </div>

                                <span className="quotation-total selected-total">
                    {selectedQuotations.length} selected
                </span>
                            </div>

                            {selectedQuotations.length === 0 ? (
                                <div className="quotation-empty compact-empty">
                                    <Clock size={30} />
                                    <h3>No selected quotations yet</h3>
                                    <p>
                                        Your quotation will appear here after the admin
                                        selects it.
                                    </p>
                                </div>
                            ) : (
                                <div className="quotation-table-wrapper">
                                    <div className="quotation-table selected-table-header">
                                        <span>Product</span>
                                        <span>Quotation ID</span>
                                        <span>Quoted Price</span>
                                        <span>Available Qty.</span>
                                        <span>Delivery Date</span>
                                        <span>Status</span>
                                    </div>

                                    {selectedQuotations.map((quotation) => (
                                        <div
                                            className="quotation-table quotation-request-row selected-quotation-row"
                                            key={quotation.quotationId}
                                        >
                                            <div className="quotation-product-cell">
                                                <div className="quotation-product-icon selected-product-icon">
                                                    <CheckCircle size={20} />
                                                </div>
                                                <div>
                                                    <strong>
                                                        {quotation.productName ||
                                                            `Product #${quotation.productId}`}
                                                    </strong>
                                                    <small>
                                                        Request #{quotation.productId || 'N/A'}
                                                    </small>
                                                </div>
                                            </div>

                                            <div className="quotation-cell">
                                                #{quotation.quotationId}
                                            </div>

                                            <div className="quotation-cell quotation-price">
                                                ₹
                                                {Number(
                                                    quotation.quotedAmount || 0
                                                ).toLocaleString('en-IN')}
                                            </div>

                                            <div className="quotation-cell">
                                                {quotation.availableQuantity ?? 'N/A'}
                                            </div>

                                            <div className="quotation-cell">
                                                {quotation.expectedDeliveryDate || 'N/A'}
                                            </div>

                                            <div>
                                <span className="quotation-status selected-status">
                                    <CheckCircle size={14} />
                                    Selected
                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* SUBMIT QUOTATION MODAL */}
                        {selectedRequest && (
                            <div
                                className="quotation-modal-overlay"
                                onClick={() => {
                                    if (!quotationLoading) {
                                        setSelectedRequest(null);
                                        setQuotationMessage('');
                                    }
                                }}
                            >
                                <div
                                    className="quotation-modal"
                                    role="dialog"
                                    aria-modal="true"
                                    aria-labelledby="quotation-modal-title"
                                    onClick={(event) => event.stopPropagation()}
                                >
                                    <div className="quotation-modal-header">
                                        <div>
                            <span className="quotation-eyebrow">
                                REQUEST #{selectedRequest.productId}
                            </span>
                                            <h3 id="quotation-modal-title">
                                                Submit Quotation
                                            </h3>
                                            <p>
                                                Enter your price and delivery details.
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            className="quotation-modal-close"
                                            aria-label="Close quotation form"
                                            disabled={quotationLoading}
                                            onClick={() => {
                                                setSelectedRequest(null);
                                                setQuotationMessage('');
                                            }}
                                        >
                                            <X size={21} />
                                        </button>
                                    </div>

                                    <div className="quotation-request-summary">
                                        <Package size={23} />
                                        <div>
                                            <strong>{selectedRequest.name}</strong>
                                            <span>
                                Required quantity:{' '}
                                                {selectedRequest.numberOfQuantities}
                            </span>
                                        </div>
                                    </div>

                                    <form
                                        className="quotation-form"
                                        onSubmit={(event) => {
                                            event.preventDefault();
                                            handleSubmitQuotation();
                                        }}
                                    >
                                        <div className="quotation-form-grid">
                                            <div className="quotation-form-field">
                                                <label htmlFor="quotedAmount">
                                                    Quoted Price per Item (₹) *
                                                </label>
                                                <input
                                                    id="quotedAmount"
                                                    type="number"
                                                    min="0.01"
                                                    step="0.01"
                                                    placeholder="Enter price per item"
                                                    value={quotedAmount}
                                                    onChange={(event) =>
                                                        setQuotedAmount(event.target.value)
                                                    }
                                                    required
                                                />
                                            </div>

                                            <div className="quotation-form-field">
                                                <label htmlFor="availableQuantity">
                                                    Available Quantity *
                                                </label>
                                                <input
                                                    id="availableQuantity"
                                                    type="number"
                                                    min={selectedRequest.numberOfQuantities}
                                                    step="1"
                                                    placeholder="Enter available quantity"
                                                    value={availableQuantity}
                                                    onChange={(event) =>
                                                        setAvailableQuantity(event.target.value)
                                                    }
                                                    required
                                                />
                                                <small>
                                                    Must be at least{' '}
                                                    {selectedRequest.numberOfQuantities}.
                                                </small>
                                            </div>

                                            <div className="quotation-form-field full-width">
                                                <label htmlFor="expectedDeliveryDate">
                                                    Expected Delivery Date *
                                                </label>
                                                <input
                                                    id="expectedDeliveryDate"
                                                    type="date"
                                                    min={[
                                                        new Date().getFullYear(),
                                                        String(new Date().getMonth() + 1)
                                                            .padStart(2, '0'),
                                                        String(new Date().getDate())
                                                            .padStart(2, '0')
                                                    ].join('-')}
                                                    value={expectedDeliveryDate}
                                                    onChange={(event) =>
                                                        setExpectedDeliveryDate(
                                                            event.target.value
                                                        )
                                                    }
                                                    required
                                                />
                                            </div>

                                            <div className="quotation-form-field full-width">
                                                <label htmlFor="supplierMessage">
                                                    Supplier Remarks
                                                </label>
                                                <textarea
                                                    id="supplierMessage"
                                                    rows={3}
                                                    maxLength={500}
                                                    value={supplierMessage}
                                                    onChange={(event) =>
                                                        setSupplierMessage(event.target.value)
                                                    }
                                                    placeholder="Mention stock, delivery or product details (optional)"
                                                />
                                            </div>
                                        </div>

                                        <div className="quotation-form-actions">
                                            <button
                                                type="button"
                                                className="quotation-cancel-btn"
                                                disabled={quotationLoading}
                                                onClick={() => {
                                                    setSelectedRequest(null);
                                                    setQuotationMessage('');
                                                }}
                                            >
                                                Cancel
                                            </button>

                                            <button
                                                type="submit"
                                                className="quotation-submit-btn modal-submit-btn"
                                                disabled={quotationLoading}
                                            >
                                                {quotationLoading
                                                    ? 'Submitting...'
                                                    : 'Submit Quotation'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
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