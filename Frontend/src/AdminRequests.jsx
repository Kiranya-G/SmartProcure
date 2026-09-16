import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import './AdminRequests.css'


function AdminRequests() {

    const navigate = useNavigate()

    const [requests, setRequests] = useState([])
    const [payments, setPayments] = useState([])
    const [loading, setLoading] = useState(true)

    const adminDepartmentId = Number(
        localStorage.getItem('adminDepartmentId')
    )

    // --------------------------------------------------
    // FETCH DATA
    // --------------------------------------------------

    useEffect(() => {
        fetchRequests()
        fetchPayments()
    }, [])

    // --------------------------------------------------
    // FETCH REQUESTS
    // --------------------------------------------------

    const fetchRequests = async () => {

        try {

            setLoading(true)

            const response = await fetch(
                'http://localhost:8080/api/products'
            )

            if (!response.ok) {
                throw new Error('Failed to fetch requests')
            }

            const data = await response.json()

            console.log(
                'ADMIN DEPARTMENT ID:',
                adminDepartmentId
            )

            console.log(
                'REQUEST DATA:',
                data
            )

            // Show only requests belonging
            // to this admin's department
            const departmentRequests = data.filter(
                request =>
                    Number(request.department?.depId) ===
                    adminDepartmentId
            )

            setRequests(departmentRequests)

        } catch (error) {

            console.error(
                'REQUEST FETCH ERROR:',
                error
            )

        } finally {

            setLoading(false)

        }
    }

    // --------------------------------------------------
    // FETCH PAYMENTS
    // --------------------------------------------------

    const fetchPayments = async () => {

        try {

            const response = await fetch(
                'http://localhost:8080/api/payments'
            )

            if (!response.ok) {
                throw new Error('Failed to fetch payments')
            }

            const data = await response.json()

            console.log(
                'PAYMENT DATA:',
                data
            )

            setPayments(data)

        } catch (error) {

            console.error(
                'PAYMENT FETCH ERROR:',
                error
            )

        }
    }

    // --------------------------------------------------
    // APPROVE / REJECT REQUEST
    // --------------------------------------------------

    const updateRequestStatus = async (
        productId,
        status
    ) => {

        try {

            const adminId =
                localStorage.getItem('adminId')

            console.log('STATUS UPDATE REQUEST:', {
                productId,
                status,
                adminId
            })

            const response = await fetch(
                `http://localhost:8080/api/products/${productId}/status`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        status: status,
                        adminId: Number(adminId)
                    })
                }
            )

            const responseText =
                await response.text()

            console.log(
                'STATUS UPDATE RESPONSE:',
                response.status,
                responseText
            )

            if (!response.ok) {

                throw new Error(
                    responseText ||
                    `HTTP ${response.status}`
                )

            }

            alert(
                status === 'APPROVED'
                    ? 'Request approved successfully!'
                    : 'Request rejected successfully!'
            )

            await fetchRequests()

        } catch (error) {

            console.error(
                'STATUS UPDATE ERROR:',
                error
            )

            alert(
                `Failed to update request status: ${error.message}`
            )
        }
    }
    // --------------------------------------------------
    // CHECK PAYMENT STATUS
    // --------------------------------------------------

    const getPaymentForRequest = (productId) => {

        return payments.find(
            payment =>
                Number(payment.product?.productId) ===
                Number(productId)
        )
    }

    // --------------------------------------------------
    // PAGE UI
    // --------------------------------------------------

    return (

        <div className="admin-requests-page">

            {/* HEADER */}

            <div className="requests-header">

                <button
                    className="back-button"
                    onClick={() =>
                        navigate('/admin-dashboard')
                    }
                >
                    <ArrowLeft size={20} />
                    Back to Dashboard
                </button>

                <h1>
                    Procurement Requests
                </h1>

                <p>
                    View and manage all procurement requests
                    for your department.
                </p>

            </div>


            {/* REQUEST CARD */}

            <div className="requests-card">

                {loading ? (

                    <p>
                        Loading requests...
                    </p>

                ) : requests.length === 0 ? (

                    <p>
                        No procurement requests found.
                    </p>

                ) : (

                    <div className="requests-table-wrapper">

                        <table className="requests-table">

                            {/* TABLE HEADER */}

                            <thead>

                            <tr>

                                <th>Request ID</th>

                                <th>User</th>

                                <th>Product</th>

                                <th>Quantity</th>

                                <th>Total Price</th>

                                <th>Supplier</th>

                                <th>Status</th>

                                <th>Payment Status</th>

                                <th>Action</th>

                            </tr>

                            </thead>


                            {/* TABLE BODY */}

                            <tbody>

                            {requests.map(
                                request => {

                                    const payment =
                                        getPaymentForRequest(
                                            request.productId
                                        )

                                    return (

                                        <tr
                                            key={
                                                request.productId
                                            }
                                        >

                                            {/* REQUEST ID */}

                                            <td>
                                                #
                                                {
                                                    request.productId
                                                }
                                            </td>


                                            {/* USER */}

                                            <td>
                                                {
                                                    request.user?.name ||
                                                    'Unknown User'
                                                }
                                            </td>


                                            {/* PRODUCT */}

                                            <td>
                                                {
                                                    request.name ||
                                                    'N/A'
                                                }
                                            </td>


                                            {/* QUANTITY */}

                                            <td>
                                                {
                                                    request.numberOfQuantities ||
                                                    0
                                                }
                                            </td>


                                            {/* TOTAL PRICE */}

                                            <td>
                                                ₹
                                                {
                                                    Number(
                                                        request.totalPrice || 0
                                                    ).toLocaleString(
                                                        'en-IN'
                                                    )
                                                }
                                            </td>


                                            {/* SUPPLIER */}

                                            <td>

                                                {request.supplier ? (

                                                    request.supplier.name

                                                ) : (

                                                    <span>
                                                            Not Assigned
                                                        </span>

                                                )}

                                            </td>


                                            {/* REQUEST STATUS */}

                                            <td>

                                                    <span
                                                        className={`status-badge ${
                                                            String(
                                                                request.status || ''
                                                            ).toUpperCase()
                                                        }`}
                                                    >
                                                        {
                                                            request.status
                                                        }
                                                    </span>

                                            </td>


                                            {/* PAYMENT STATUS */}

                                            <td>

                                                {payment &&
                                                String(
                                                    payment.paymentStatus || ''
                                                ).toUpperCase() ===
                                                'SUCCESS' ? (

                                                    <span className="payment-success-status">
                                                            SUCCESS
                                                        </span>

                                                ) : (

                                                    <span className="payment-pending-status">
                                                            NOT PAID
                                                        </span>

                                                )}

                                            </td>


                                            {/* ACTION */}

                                            <td>

                                                {/* PENDING */}

                                                {request.status ===
                                                    'PENDING_FOR_APPROVAL' && (

                                                        <div className="action-buttons">

                                                            <button
                                                                className="approve-button"
                                                                onClick={() =>
                                                                    updateRequestStatus(
                                                                        request.productId,
                                                                        'APPROVED'
                                                                    )
                                                                }
                                                            >
                                                                Approve
                                                            </button>


                                                            <button
                                                                className="reject-button"
                                                                onClick={() =>
                                                                    updateRequestStatus(
                                                                        request.productId,
                                                                        'REJECTED'
                                                                    )
                                                                }
                                                            >
                                                                Reject
                                                            </button>

                                                        </div>

                                                    )}


                                                {/* APPROVED */}

                                                {request.status ===
                                                    'APPROVED' && (

                                                        <button
                                                            className="make-payment-button"
                                                            onClick={() =>
                                                                navigate(
                                                                    '/admin-payment',
                                                                    {
                                                                        state: {
                                                                            productId:
                                                                            request.productId,

                                                                            productName:
                                                                            request.name,

                                                                            amount:
                                                                            request.totalPrice,

                                                                            supplierId:
                                                                            request.supplier?.supId
                                                                        }
                                                                    }
                                                                )
                                                            }
                                                        >
                                                            Make Payment
                                                        </button>

                                                    )}


                                                {/* REJECTED */}

                                                {request.status ===
                                                    'REJECTED' && (

                                                        <span className="completed-text">
                                                            Completed
                                                        </span>

                                                    )}

                                            </td>

                                        </tr>

                                    )

                                }
                            )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>

    )
}

export default AdminRequests