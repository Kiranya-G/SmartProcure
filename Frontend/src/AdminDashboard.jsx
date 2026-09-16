import { useEffect, useState } from 'react'

import {
    LayoutDashboard,
    FileText,
    User,
    CreditCard,
    LogOut,
    Menu,
    X,
    CheckCircle,
    Clock,
    XCircle,
    IndianRupee,
    ArrowRight
} from 'lucide-react'

import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip
} from 'recharts'

import { useNavigate,useLocation } from 'react-router-dom'

import './AdminDashboard.css'


function AdminDashboard() {

    const navigate = useNavigate()


    const location = useLocation()
    // =========================================================
    // STATE
    // =========================================================

    const [requests, setRequests] = useState([])

    const [payments, setPayments] = useState([])

    const [loading, setLoading] = useState(true)

    const [error, setError] = useState('')

    const [sidebarOpen, setSidebarOpen] = useState(true)


    // =========================================================
    // ADMIN DEPARTMENT
    // =========================================================

    const adminDepartmentId = Number(
        localStorage.getItem('adminDepartmentId')
    )


    // =========================================================
    // FILTER REQUESTS BASED ON ADMIN DEPARTMENT
    // =========================================================

    const departmentRequests = requests.filter(
        request =>
            Number(request.department?.depId) ===
            adminDepartmentId
    )


    // =========================================================
    // KPI VALUES
    // =========================================================

    const totalRequests =
        departmentRequests.length


    const pendingRequests =
        departmentRequests.filter(
            request =>
                request.status ===
                'PENDING_FOR_APPROVAL'
        ).length


    const approvedRequests =
        departmentRequests.filter(
            request =>
                request.status === 'APPROVED'
        ).length


    const rejectedRequests =
        departmentRequests.filter(
            request =>
                request.status === 'REJECTED'
        ).length


    // =========================================================
    // SUCCESSFUL PAYMENTS
    // =========================================================

    const successfulPayments =
        payments.filter(
            payment =>
                String(
                    payment.paymentStatus
                ).toUpperCase() === 'SUCCESS'
        )


    // =========================================================
    // TOTAL PAYMENT
    // =========================================================

    const totalPayment =
        successfulPayments.reduce(
            (total, payment) =>
                total +
                Number(payment.amount || 0),
            0
        )


    // =========================================================
    // MONTH NAMES
    // =========================================================

    const monthNames = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
    ]


    // =========================================================
    // CREATE MONTH-WISE PAYMENT DATA
    // =========================================================


    const createPaymentChartData = () => {
        const monthlyPayments = {}

        // Initialize last 6 months
        const today = new Date()

        for (let i = 5; i >= 0; i--) {
            const date = new Date(
                today.getFullYear(),
                today.getMonth() - i,
                1
            )

            const key =
                `${date.getFullYear()}-${String(
                    date.getMonth() + 1
                ).padStart(2, '0')}`

            monthlyPayments[key] = {
                month: monthNames[date.getMonth()],
                year: date.getFullYear(),
                amount: 0
            }
        }

        // Add successful payment amounts
        successfulPayments.forEach(payment => {
            if (!payment.paymentDate) return

            const date = new Date(payment.paymentDate)

            if (isNaN(date.getTime())) return

            const key =
                `${date.getFullYear()}-${String(
                    date.getMonth() + 1
                ).padStart(2, '0')}`

            if (monthlyPayments[key]) {
                monthlyPayments[key].amount +=
                    Number(payment.amount || 0)
            }
        })

        return Object.values(monthlyPayments).map(item => ({
            month: `${item.month} ${item.year}`,
            amount: item.amount
        }))
    }

    const paymentChartData =
        createPaymentChartData()
    console.log("SUCCESSFUL PAYMENTS:", successfulPayments)
    console.log("PAYMENT CHART DATA:", paymentChartData)

    // =========================================================
    // FETCH DATA
    // =========================================================

    useEffect(() => {

        fetchRequests()

        fetchPayments()

    }, [])


    // =========================================================
    // FETCH REQUESTS
    // =========================================================

    const fetchRequests = async () => {

        try {

            setError('')


            const response =
                await fetch(
                    'http://localhost:8080/api/products'
                )


            if (!response.ok) {

                throw new Error(
                    'Failed to fetch procurement requests'
                )

            }


            const data =
                await response.json()


            console.log(
                'PROCUREMENT REQUESTS:',
                data
            )


            setRequests(data)


        }
        catch (err) {

            console.error(
                'FETCH REQUEST ERROR:',
                err
            )


            setError(
                'Unable to load procurement requests.'
            )

        }
        finally {

            setLoading(false)

        }

    }


    // =========================================================
    // FETCH PAYMENTS
    // =========================================================

    const fetchPayments = async () => {

        try {

            const response =
                await fetch(
                    'http://localhost:8080/api/payments'
                )


            if (!response.ok) {

                throw new Error(
                    'Failed to fetch payments'
                )

            }


            const data =
                await response.json()


            console.log(
                'PAYMENT DATA:',
                data
            )


            setPayments(data)

        }
        catch (err) {

            console.error(
                'PAYMENT FETCH ERROR:',
                err
            )

        }

    }


    // =========================================================
    // LOGOUT
    // =========================================================

    const handleLogout = () => {

        localStorage.removeItem(
            'adminId'
        )

        localStorage.removeItem(
            'adminData'
        )

        localStorage.removeItem(
            'adminDepartmentId'
        )


        navigate('/admin-login')

    }


    // =========================================================
    // FORMAT RUPEES
    // =========================================================

    const formatRupees = amount => {

        return Number(
            amount || 0
        ).toLocaleString(
            'en-IN'
        )

    }


    // =========================================================
    // CUSTOM TOOLTIP
    // =========================================================

    const CustomTooltip = ({
                               active,
                               payload,
                               label
                           }) => {

        if (
            active &&
            payload &&
            payload.length
        ) {

            return (

                <div className="payment-tooltip">

                    <span>
                        {label}
                    </span>

                    <strong>
                        ₹
                        {formatRupees(
                            payload[0].value
                        )}
                    </strong>

                </div>

            )

        }


        return null

    }


    // =========================================================
    // DASHBOARD UI
    // =========================================================

    return (

        <div className="admin-dashboard">


            {/* =================================================
                SIDEBAR
            ================================================= */}

            <aside
                className={
                    `admin-sidebar ${
                        sidebarOpen
                            ? 'open'
                            : 'closed'
                    }`
                }
            >


                {/* BRAND */}

                <div className="admin-brand">

                    <div className="admin-logo">
                        SP
                    </div>


                    {sidebarOpen && (

                        <div className="brand-text">

                            <h2>
                                SmartProcure
                            </h2>

                            <span>
                                Admin Panel
                            </span>

                        </div>

                    )}

                </div>


                {/* NAVIGATION */}

                <nav className="admin-nav">


                    {/* DASHBOARD */}

                    <button
                        className="admin-nav-item active"
                        onClick={() =>
                            navigate(
                                '/admin-dashboard'
                            )
                        }
                    >

                        <LayoutDashboard
                            size={20}
                        />

                        {sidebarOpen && (

                            <span>
                                Dashboard
                            </span>

                        )}

                    </button>


                    {/* REQUESTS */}

                    <button
                        className="admin-nav-item"
                        onClick={() =>
                            navigate(
                                '/admin-requests'
                            )
                        }
                    >

                        <FileText
                            size={20}
                        />

                        {sidebarOpen && (

                            <span>
                                Requests
                            </span>

                        )}

                    </button>




                    {/* PAYMENTS */}

                    <button
                        className="admin-nav-item"
                        onClick={() =>
                            navigate(
                                '/admin-payment-history'
                            )
                        }
                    >

                        <CreditCard
                            size={20}
                        />

                        {sidebarOpen && (

                            <span>
                                Payments
                            </span>

                        )}

                    </button>

                    <button
                        className={`nav-item ${
                            location.pathname === '/admin-profile' ? 'active' : ''
                        }`}
                        onClick={() => navigate('/admin-profile')}
                    >
                        <User size={20} />
                        <span>Profile</span>
                    </button>
                </nav>


                {/* LOGOUT */}

                <button
                    className="admin-logout"
                    onClick={handleLogout}
                >

                    <LogOut
                        size={20}
                    />

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

            <main className="admin-main">


                {/* =================================================
                    HEADER
                ================================================= */}

                <header className="admin-header">


                    <div className="header-left">

                        <button
                            className="menu-button"
                            onClick={() =>
                                setSidebarOpen(
                                    !sidebarOpen
                                )
                            }
                        >

                            {sidebarOpen ? (

                                <X size={21} />

                            ) : (

                                <Menu size={21} />

                            )}

                        </button>


                        <div>

                            <h1>
                                Admin Dashboard
                            </h1>

                            <p>
                                Monitor procurement
                                activities and payments.
                            </p>

                        </div>

                    </div>


                    {/* ADMIN PROFILE */}

                    <div className="admin-profile">

                        <div className="admin-avatar">
                            A
                        </div>


                        <div className="admin-profile-text">

                            <strong>
                                Administrator
                            </strong>

                            <span>
                                ADMIN
                            </span>

                        </div>

                    </div>

                </header>


                {/* =================================================
                    CONTENT
                ================================================= */}

                <div className="admin-content">


                    {/* =================================================
                        KPI CARDS
                    ================================================= */}

                    <section className="admin-stats">


                        {/* TOTAL REQUESTS */}

                        <div className="stat-card">

                            <div className="stat-card-content">

                                <span>
                                    Total Requests
                                </span>

                                <h2>
                                    {totalRequests}
                                </h2>

                                <small>
                                    All procurement requests
                                </small>

                            </div>


                            <div className="stat-icon">

                                <FileText
                                    size={22}
                                />

                            </div>

                        </div>


                        {/* PENDING */}

                        <div className="stat-card pending">

                            <div className="stat-card-content">

                                <span>
                                    Pending Requests
                                </span>

                                <h2>
                                    {pendingRequests}
                                </h2>

                                <small>
                                    Awaiting approval
                                </small>

                            </div>


                            <div className="stat-icon">

                                <Clock
                                    size={22}
                                />

                            </div>

                        </div>


                        {/* APPROVED */}

                        <div className="stat-card approved">

                            <div className="stat-card-content">

                                <span>
                                    Approved Requests
                                </span>

                                <h2>
                                    {approvedRequests}
                                </h2>

                                <small>
                                    Approved procurement
                                </small>

                            </div>


                            <div className="stat-icon">

                                <CheckCircle
                                    size={22}
                                />

                            </div>

                        </div>


                        {/* REJECTED */}

                        <div className="stat-card rejected">

                            <div className="stat-card-content">

                                <span>
                                    Rejected Requests
                                </span>

                                <h2>
                                    {rejectedRequests}
                                </h2>

                                <small>
                                    Rejected procurement
                                </small>

                            </div>


                            <div className="stat-icon">

                                <XCircle
                                    size={22}
                                />

                            </div>

                        </div>

                    </section>


                    {/* =================================================
                        PAYMENT SECTION
                    ================================================= */}

                    <section className="payment-overview">


                        {/* PAYMENT HEADER */}

                        <div className="payment-overview-header">


                            <div className="payment-title">


                                <div className="payment-title-icon">

                                    <IndianRupee
                                        size={21}
                                    />

                                </div>


                                <div>

                                    <h2>
                                        Payment Overview
                                    </h2>

                                    <p>
                                        Track successful procurement
                                        payments over time.
                                    </p>

                                </div>

                            </div>


                            <button
                                className="payment-history-button"
                                onClick={() =>
                                    navigate(
                                        '/admin-payment-history'
                                    )
                                }
                            >

                                View Payment History

                                <ArrowRight
                                    size={17}
                                />

                            </button>

                        </div>


                        {/* =================================================
                            TOTAL PAYMENT
                        ================================================= */}

                        <div className="payment-total-card">


                            <div>

                                <span>
                                    Total Paid
                                </span>

                                <h1>
                                    ₹
                                    {formatRupees(
                                        totalPayment
                                    )}
                                </h1>

                                <p>
                                    Successful transactions
                                </p>

                            </div>


                            <div className="payment-total-icon">

                                <IndianRupee
                                    size={27}
                                />

                            </div>

                        </div>


                        {/* =================================================
                            GRAPH
                        ================================================= */}

                        <div className="payment-chart-container">


                            <div className="chart-header">


                                <div>

                                    <h3>
                                        Payment Trend
                                    </h3>

                                    <p>
                                        Monthly successful
                                        payment amount
                                    </p>

                                </div>


                                <div className="payment-count">

                                    <strong>
                                        {successfulPayments.length}
                                    </strong>

                                    <span>
                                        Transactions
                                    </span>

                                </div>

                            </div>


                            {successfulPayments.length === 0 ? (


                                /* EMPTY STATE */

                                <div className="no-payment-data">

                                    <CreditCard
                                        size={42}
                                    />

                                    <h3>
                                        No successful payments yet
                                    </h3>

                                    <p>
                                        Successful payment
                                        transactions will appear
                                        here.
                                    </p>

                                </div>


                            ) : paymentChartData.length === 0 ? (


                                /* DATE MISSING */

                                <div className="no-payment-data">

                                    <CreditCard
                                        size={42}
                                    />

                                    <h3>
                                        Payment data unavailable
                                    </h3>

                                    <p>
                                        Payment dates are not
                                        available for displaying
                                        the trend.
                                    </p>

                                </div>


                            ) : (


                                /* PROFESSIONAL LINE GRAPH */
                                <div
                                    style={{
                                        width: "100%",
                                        height: "350px",
                                        minWidth: 0
                                    }}
                                >
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart
                                            data={paymentChartData}
                                            margin={{
                                                top: 20,
                                                right: 30,
                                                left: 30,
                                                bottom: 20
                                            }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />

                                            <XAxis
                                                dataKey="month"
                                            />

                                            <YAxis
                                                domain={[0, "auto"]}
                                            />

                                            <Tooltip />

                                            <Line
                                                type="monotone"
                                                dataKey="amount"
                                                stroke="#2563eb"
                                                strokeWidth={4}
                                                dot={{ r: 6 }}
                                                activeDot={{ r: 8 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>


                            )}

                        </div>

                    </section>





                    {/* =================================================
                        LOADING
                    ================================================= */}

                    {loading && (

                        <div className="dashboard-loading">

                            Loading dashboard...

                        </div>

                    )}


                    {/* =================================================
                        ERROR
                    ================================================= */}

                    {error && !loading && (

                        <div className="dashboard-error">

                            {error}

                        </div>

                    )}

                </div>

            </main>

        </div>

    )

}


export default AdminDashboard