import { useEffect, useState } from 'react'
import { CreditCard, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import './AdminDashboard.css'

function AdminPaymentHistory() {

    const navigate = useNavigate()

    const [payments, setPayments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        fetchPayments()
    }, [])

    const fetchPayments = async () => {

        try {

            setLoading(true)
            setError('')

            const response = await fetch(
                'http://localhost:8080/api/payments'
            )

            if (!response.ok) {
                throw new Error('Failed to fetch payment history')
            }

            const data = await response.json()

            console.log('PAYMENT HISTORY:', data)

            setPayments(data)

        } catch (err) {

            console.error('PAYMENT HISTORY ERROR:', err)

            setError('Unable to load payment history.')

        } finally {

            setLoading(false)

        }
    }

    return (
        <div className="admin-dashboard">

            {/* MAIN CONTENT */}

            <main className="admin-main">

                {/* HEADER */}

                <header className="admin-header">

                    <button
                        className="menu-button"
                        onClick={() => navigate('/admin-dashboard')}
                    >
                        <ArrowLeft size={22} />
                    </button>

                    <div>
                        <h1>Payment History</h1>

                        <p>
                            View all payments completed by administrators.
                        </p>
                    </div>

                    <div className="admin-profile">

                        <div className="admin-avatar">
                            A
                        </div>

                        <div>
                            <strong>Administrator</strong>
                            <span>ADMIN</span>
                        </div>

                    </div>

                </header>


                {/* PAYMENT HISTORY */}

                <section className="admin-section">

                    <div className="section-header">

                        <div>

                            <h2>All Payments</h2>

                            <p>
                                Complete history of payments made in the system.
                            </p>

                        </div>

                    </div>


                    {/* LOADING */}

                    {loading && (

                        <div className="empty-state">

                            <p>
                                Loading payment history...
                            </p>

                        </div>

                    )}


                    {/* ERROR */}

                    {!loading && error && (

                        <div className="empty-state">

                            <CreditCard size={42} />

                            <h3>
                                Unable to load payments
                            </h3>

                            <p>
                                {error}
                            </p>

                        </div>

                    )}


                    {/* NO PAYMENTS */}

                    {!loading &&
                        !error &&
                        payments.length === 0 && (

                            <div className="empty-state">

                                <CreditCard size={42} />

                                <h3>
                                    No payment history
                                </h3>

                                <p>
                                    Payments will appear here after an
                                    administrator completes a payment.
                                </p>

                            </div>

                        )}


                    {/* PAYMENT TABLE */}

                    {!loading &&
                        !error &&
                        payments.length > 0 && (

                            <div className="requests-table-wrapper">

                                <table className="requests-table">

                                    <thead>

                                    <tr>

                                        <th>
                                            Payment ID
                                        </th>

                                        <th>
                                            Transaction ID
                                        </th>

                                        <th>
                                            Product
                                        </th>

                                        <th>
                                            Amount
                                        </th>

                                        <th>
                                            Payment Method
                                        </th>

                                        <th>
                                            Payment Date & Time
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                    </tr>

                                    </thead>


                                    <tbody>

                                    {payments.map((payment) => (

                                        <tr
                                            key={payment.paymentId}
                                        >

                                            <td>
                                                #{payment.paymentId}
                                            </td>

                                            <td>
                                                {payment.transactionId}
                                            </td>

                                            <td>
                                                {payment.product?.name || 'N/A'}
                                            </td>

                                            <td>
                                                ₹{payment.amount}
                                            </td>

                                            <td>
                                                {payment.paymentMethod || 'N/A'}
                                            </td>

                                            <td>
                                                {payment.paymentDate
                                                    ? new Date(
                                                        payment.paymentDate
                                                    ).toLocaleString(
                                                        'en-IN'
                                                    )
                                                    : 'N/A'}
                                            </td>

                                            <td>

                                                    <span className="payment-success-status">
                                                        {payment.paymentStatus}
                                                    </span>

                                            </td>

                                        </tr>

                                    ))}

                                    </tbody>

                                </table>

                            </div>

                        )}

                </section>

            </main>

        </div>
    )
}

export default AdminPaymentHistory