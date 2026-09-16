import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './CsvView.css'

function CsvView() {

    const navigate = useNavigate()

    const [csvData, setCsvData] = useState([])
    const [filteredData, setFilteredData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [search, setSearch] = useState('')

    useEffect(() => {

        const fetchCsvData = async () => {

            try {

                const response = await fetch(
                    'http://localhost:8080/api/products/download'
                )

                if (!response.ok) {
                    throw new Error('Unable to fetch CSV file')
                }

                const csvText = await response.text()

                const rows = csvText
                    .trim()
                    .split('\n')
                    .map(row => row.split(','))

                const headers = rows[0]

                const data = rows.slice(1).map(row => {

                    const object = {}

                    headers.forEach((header, index) => {

                        object[header.trim()] =
                            row[index]?.trim() || ''

                    })

                    return object
                })

                setCsvData(data)
                setFilteredData(data)

            } catch (error) {

                console.error(error)

                setError(
                    'Unable to load procurement requests from the backend.'
                )

            } finally {

                setLoading(false)

            }
        }

        fetchCsvData()

    }, [])


    // ================= SEARCH =================

    useEffect(() => {

        const searchText = search.toLowerCase().trim()

        if (!searchText) {

            setFilteredData(csvData)
            return

        }

        const filtered = csvData.filter(row =>

            Object.values(row).some(value =>
                value.toLowerCase().includes(searchText)
            )

        )

        setFilteredData(filtered)

    }, [search, csvData])


    // ================= FORMAT VALUE =================

    const formatValue = (header, value) => {

        if (!value) {
            return '-'
        }

        // Format amount
        if (
            header === 'Price Per Product' ||
            header === 'Total Price'
        ) {

            const amount = Number(value)

            if (!isNaN(amount)) {

                return `₹${amount.toLocaleString(
                    'en-IN',
                    {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    }
                )}`
            }
        }


        // Format dates
        if (
            header === 'Created Date' ||
            header === 'Updated Date'
        ) {

            const date = new Date(value)

            if (!isNaN(date.getTime())) {

                return date.toLocaleString(
                    'en-IN',
                    {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    }
                )
            }
        }


        return value
    }


    // ================= STATUS =================

    const getStatusClass = (status) => {

        switch (status) {

            case 'APPROVED':
                return 'status-approved'

            case 'PENDING_FOR_APPROVAL':
                return 'status-pending'

            case 'REJECTED':
                return 'status-rejected'

            case 'ACTIVE':
                return 'status-active'

            default:
                return 'status-default'
        }
    }


    return (

        <div className="csv-page">

            {/* ================= SIDEBAR ================= */}

            <aside className="csv-sidebar">

                <div className="csv-brand">

                    <div className="csv-logo">
                        SP
                    </div>

                    <div>
                        <h2>SmartProcure</h2>

                        <span>
                            Procurement Platform
                        </span>
                    </div>

                </div>


                <nav className="csv-nav">

                    <button
                        className="csv-nav-item"
                        onClick={() =>
                            navigate('/user-dashboard')
                        }
                    >
                        🏠
                        <span>Dashboard</span>
                    </button>


                    <button
                        className="csv-nav-item active"
                    >
                        📄
                        <span>Requests</span>
                    </button>

                </nav>


                <button
                    className="csv-logout"
                    onClick={() =>
                        navigate('/login')
                    }
                >
                    🚪
                    <span>Logout</span>
                </button>

            </aside>


            {/* ================= MAIN ================= */}

            <main className="csv-main">

                {/* HEADER */}

                <div className="csv-header">

                    <div>

                        <span className="csv-label">
                            PROCUREMENT DATA
                        </span>

                        <h1>
                            Procurement Requests
                        </h1>

                        <p>
                            View all procurement requests
                            from the SmartProcure system.
                        </p>

                    </div>


                    <button
                        className="back-button"
                        onClick={() =>
                            navigate('/user-dashboard')
                        }
                    >
                        ← Dashboard
                    </button>

                </div>


                {/* FILE CARD */}

                <div className="csv-file-card">

                    <div className="file-icon">
                        📊
                    </div>


                    <div className="file-details">

                        <h3>
                            procurement_requests.csv
                        </h3>

                        <p>
                            Live data retrieved from the
                            SmartProcure backend
                        </p>

                    </div>


                    <div className="file-status">
                        CSV
                    </div>

                </div>


                {/* TABLE CARD */}

                <div className="csv-table-card">

                    <div className="table-header">

                        <div>

                            <h2>
                                All Requests
                            </h2>

                            <p>
                                {loading
                                    ? 'Loading requests...'
                                    : `Showing ${filteredData.length} of ${csvData.length} requests`
                                }
                            </p>

                        </div>


                        {/* SEARCH */}

                        <div className="csv-search">

                            🔍

                            <input
                                type="text"
                                placeholder="Search requests..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                            />

                        </div>

                    </div>


                    {/* LOADING */}

                    {loading && (

                        <div className="csv-message">

                            Loading procurement requests...

                        </div>

                    )}


                    {/* ERROR */}

                    {error && (

                        <div className="csv-error">

                            {error}

                        </div>

                    )}


                    {/* EMPTY */}

                    {!loading &&
                        !error &&
                        filteredData.length === 0 && (

                            <div className="csv-message">

                                No matching requests found.

                            </div>

                        )}


                    {/* TABLE */}

                    {!loading &&
                        !error &&
                        filteredData.length > 0 && (

                            <div className="table-wrapper">

                                <table>

                                    <thead>

                                    <tr>

                                        {Object.keys(
                                            filteredData[0]
                                        ).map(header => (

                                            <th key={header}>
                                                {header}
                                            </th>

                                        ))}

                                    </tr>

                                    </thead>


                                    <tbody>

                                    {filteredData.map(
                                        (row, index) => (

                                            <tr key={index}>

                                                {Object.keys(row).map(
                                                    header => (

                                                        <td
                                                            key={header}
                                                        >

                                                            {header === 'Status' ? (

                                                                <span
                                                                    className={`status-badge ${getStatusClass(
                                                                        row[header]
                                                                    )}`}
                                                                >
                                                                        {row[header]}
                                                                    </span>

                                                            ) : (

                                                                formatValue(
                                                                    header,
                                                                    row[header]
                                                                )

                                                            )}

                                                        </td>

                                                    )
                                                )}

                                            </tr>

                                        )
                                    )}

                                    </tbody>

                                </table>

                            </div>

                        )}

                </div>

            </main>

        </div>
    )
}

export default CsvView