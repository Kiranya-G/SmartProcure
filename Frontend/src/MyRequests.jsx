import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    ArrowLeft,
    ClipboardList,
    RefreshCw,
    Package,
    AlertCircle
} from 'lucide-react'

import './MyRequests.css'


function MyRequests() {

    const navigate = useNavigate()

    const [requests, setRequests] = useState([])
    const [requestFilter, setRequestFilter] = useState('ALL')
    const [loading, setLoading] = useState(false)


    // ============================================
    // FETCH CURRENT USER REQUESTS
    // ============================================

    const fetchMyRequests = async () => {

        setLoading(true)

        try {

            const savedUser =
                localStorage.getItem('user')

            if (!savedUser) {
                setRequests([])
                return
            }

            const user =
                JSON.parse(savedUser)

            const currentUserId =
                Number(user.userId)

            if (!currentUserId) {
                setRequests([])
                return
            }

            const response =
                await fetch(
                    'http://localhost:8080/api/products'
                )

            if (!response.ok) {
                throw new Error(
                    'Unable to fetch requests'
                )
            }

            const data =
                await response.json()

            // Only logged-in user's requests
            const myRequests =
                data.filter(
                    request =>
                        Number(
                            request.user?.userId
                        ) === currentUserId
                )

            setRequests(myRequests)

        } catch (error) {

            console.error(
                'Unable to load requests:',
                error
            )

        } finally {

            setLoading(false)

        }
    }


    // ============================================
    // LOAD REQUESTS
    // ============================================

    useEffect(() => {

        fetchMyRequests()

    }, [])


    // ============================================
    // FORMAT PRICE
    // ============================================

    const formatPrice = (price) => {

        return Number(price || 0).toLocaleString(
            'en-IN',
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        )
    }


    // ============================================
    // FILTER REQUESTS
    // ============================================

    const filteredRequests =
        requests.filter(request =>

            requestFilter === 'ALL'
                ? true
                : request.status === requestFilter

        )


    // ============================================
    // STATUS CLASS
    // ============================================

    const getStatusClass = (status) => {

        return (
            status
                ?.toLowerCase()
                .replaceAll('_', '-') ||
            'pending-for-approval'
        )

    }


    // ============================================
    // UI
    // ============================================

    return (

        <div className="my-requests-page">

            {/* =================================
                TOP BAR
            ================================= */}

            <div className="my-requests-top">

                <button
                    className="my-requests-back-button"
                    onClick={() =>
                        navigate('/user-dashboard')
                    }
                >

                    <ArrowLeft size={18} />

                    Back to Dashboard

                </button>


                <ClipboardList size={24} />

            </div>


            {/* =================================
                HEADER
            ================================= */}

            <div className="my-requests-header">

                <div>

                    <span className="my-requests-label">
                        PROCUREMENT
                    </span>

                    <h1>
                        My Requests
                    </h1>

                    <p>
                        View and track all your procurement
                        requests in one place.
                    </p>

                </div>


                <button
                    className="my-requests-refresh"
                    onClick={fetchMyRequests}
                    disabled={loading}
                >

                    <RefreshCw
                        size={16}
                        className={
                            loading
                                ? 'my-requests-refresh-spin'
                                : ''
                        }
                    />

                    Refresh

                </button>

            </div>


            {/* =================================
                FILTERS
            ================================= */}

            <div className="my-requests-filters">

                <button
                    className={
                        requestFilter === 'ALL'
                            ? 'my-filter active'
                            : 'my-filter'
                    }
                    onClick={() =>
                        setRequestFilter('ALL')
                    }
                >
                    All Requests
                </button>


                <button
                    className={
                        requestFilter === 'APPROVED'
                            ? 'my-filter active'
                            : 'my-filter'
                    }
                    onClick={() =>
                        setRequestFilter('APPROVED')
                    }
                >
                    Approved
                </button>


                <button
                    className={
                        requestFilter === 'PENDING_FOR_APPROVAL'
                            ? 'my-filter active'
                            : 'my-filter'
                    }
                    onClick={() =>
                        setRequestFilter(
                            'PENDING_FOR_APPROVAL'
                        )
                    }
                >
                    Pending
                </button>


                <button
                    className={
                        requestFilter === 'REJECTED'
                            ? 'my-filter active'
                            : 'my-filter'
                    }
                    onClick={() =>
                        setRequestFilter('REJECTED')
                    }
                >
                    Rejected
                </button>

            </div>


            {/* =================================
                REQUEST LIST
            ================================= */}

            {loading ? (

                <div className="my-requests-message">

                    Loading your requests...

                </div>

            ) : filteredRequests.length === 0 ? (

                <div className="my-requests-empty">

                    <ClipboardList size={46} />

                    <h2>
                        No Requests Found
                    </h2>

                    <p>
                        You don't have any procurement
                        requests in this category.
                    </p>

                    <button
                        onClick={() =>
                            navigate('/raise-request')
                        }
                    >
                        Raise a Request
                    </button>

                </div>

            ) : (

                <div className="my-requests-list">

                    {filteredRequests.map(request => (

                        <div
                            className="my-request-card"
                            key={request.productId}
                        >

                            {/* PRODUCT ICON */}

                            <div className="my-request-icon">

                                <Package size={28} />

                            </div>


                            {/* REQUEST DETAILS */}

                            <div className="my-request-details">

                                <span className="my-request-category">

                                    {request.category?.name ||
                                        'Procurement Request'}

                                </span>


                                <h2>
                                    {request.name}
                                </h2>


                                <p>
                                    {request.description ||
                                        'No description provided.'}
                                </p>


                                <div className="my-request-meta">

                                    <span>
                                        Quantity:
                                        {' '}
                                        {request.numberOfQuantities}
                                    </span>


                                    <span>
                                        Price:
                                        {' '}
                                        ₹
                                        {formatPrice(
                                            request.totalPrice ||
                                            request.pricePerProduct *
                                            request.numberOfQuantities
                                        )}
                                    </span>


                                    <span>
                                        Request ID:
                                        {' '}
                                        #{request.productId}
                                    </span>

                                </div>

                            </div>


                            {/* STATUS */}

                            <div className="my-request-status">

                                <span
                                    className={`my-status-badge ${
                                        getStatusClass(
                                            request.status
                                        )
                                    }`}
                                >

                                    {request.status
                                        ?.replaceAll(
                                            '_',
                                            ' '
                                        )}

                                </span>

                            </div>

                        </div>

                    ))}

                </div>

            )}


        </div>

    )
}


export default MyRequests