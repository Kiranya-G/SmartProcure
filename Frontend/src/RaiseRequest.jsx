import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
    ShoppingCart,
    Plus,
    Minus,
    Trash2,
    Laptop,
    Smartphone,
    Armchair,
    Table2,
    BookOpen,
    Code2,
    ArrowLeft,
    Package,
    AlertCircle,
    CheckCircle2,
    RefreshCw
} from 'lucide-react'

import './RaiseRequest.css'

function RaiseRequest() {

    const navigate = useNavigate()

    // =====================================================
    // CATEGORIES
    // =====================================================

    const categories = [
        {
            id: 1,
            name: 'Electronics',
            icon: Laptop
        },
        {
            id: 2,
            name: 'Furniture',
            icon: Armchair
        },
        {
            id: 3,
            name: 'Stationery',
            icon: BookOpen
        },
        {
            id: 4,
            name: 'Software',
            icon: Code2
        }
    ]

    // =====================================================
    // PRODUCTS
    // =====================================================

    const products = [
        {
            id: 1,
            name: 'Laptop',
            price: 50000,
            categoryId: 1,
            category: 'Electronics',
            icon: Laptop
        },
        {
            id: 2,
            name: 'Mobile',
            price: 18000,
            categoryId: 1,
            category: 'Electronics',
            icon: Smartphone
        },
        {
            id: 3,
            name: 'Office Chair',
            price: 10000,
            categoryId: 2,
            category: 'Furniture',
            icon: Armchair
        },
        {
            id: 4,
            name: 'Office Table',
            price: 15000,
            categoryId: 2,
            category: 'Furniture',
            icon: Table2
        },
        {
            id: 5,
            name: 'Notebook',
            price: 150,
            categoryId: 3,
            category: 'Stationery',
            icon: BookOpen
        },
        {
            id: 6,
            name: 'Pen Set',
            price: 250,
            categoryId: 3,
            category: 'Stationery',
            icon: BookOpen
        },
        {
            id: 7,
            name: 'Microsoft Office',
            price: 8500,
            categoryId: 4,
            category: 'Software',
            icon: Code2
        },
        {
            id: 8,
            name: 'Antivirus Software',
            price: 3000,
            categoryId: 4,
            category: 'Software',
            icon: Code2
        }
    ]

    // =====================================================
    // STATES
    // =====================================================

    const [selectedCategory, setSelectedCategory] =
        useState('all')

    const [cart, setCart] =
        useState([])

    const [description, setDescription] =
        useState('')

    const [success, setSuccess] =
        useState('')

    const [error, setError] =
        useState('')

    const [loading, setLoading] =
        useState(false)

    const [requests, setRequests] = useState([])

    const [requestFilter, setRequestFilter] =
        useState('ALL')

    const [requestsLoading, setRequestsLoading] =
        useState(false)
    // =====================================================
    // FILTER PRODUCTS
    // =====================================================

    const filteredProducts =
        selectedCategory === 'all'
            ? products
            : products.filter(
                product =>
                    product.categoryId ===
                    Number(selectedCategory)
            )

    // =====================================================
    // ADD TO CART
    // =====================================================

    const addToCart = (product) => {

        setSuccess('')
        setError('')

        const existingProduct =
            cart.find(
                item =>
                    item.id === product.id
            )

        if (existingProduct) {

            setCart(
                cart.map(item =>
                    item.id === product.id
                        ? {
                            ...item,
                            quantity:
                                item.quantity + 1
                        }
                        : item
                )
            )

        } else {

            setCart([
                ...cart,
                {
                    ...product,
                    quantity: 1
                }
            ])
        }
    }

    // =====================================================
    // INCREASE QUANTITY
    // =====================================================

    const increaseQuantity = (id) => {

        setCart(
            cart.map(item =>
                item.id === id
                    ? {
                        ...item,
                        quantity:
                            item.quantity + 1
                    }
                    : item
            )
        )
    }

    // =====================================================
    // DECREASE QUANTITY
    // =====================================================

    const decreaseQuantity = (id) => {

        setCart(
            cart
                .map(item =>
                    item.id === id
                        ? {
                            ...item,
                            quantity:
                                item.quantity - 1
                        }
                        : item
                )
                .filter(
                    item =>
                        item.quantity > 0
                )
        )
    }

    // =====================================================
    // REMOVE FROM CART
    // =====================================================

    const removeFromCart = (id) => {

        setCart(
            cart.filter(
                item =>
                    item.id !== id
            )
        )
    }

    // =====================================================
    // CART ITEM COUNT
    // =====================================================

    const cartItemCount =
        cart.reduce(
            (total, item) =>
                total + item.quantity,
            0
        )

    // =====================================================
    // TOTAL AMOUNT
    // =====================================================

    const totalAmount =
        cart.reduce(
            (total, item) =>
                total +
                item.price *
                item.quantity,
            0
        )


    // =====================================================
// GET CURRENT USER REQUESTS
// =====================================================

    const fetchMyRequests = async () => {

        setRequestsLoading(true)

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
                console.error(
                    'User ID not found in localStorage'
                )

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

            // Only current user's requests
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

            setRequestsLoading(false)

        }
    }

    useEffect(() => {
        fetchMyRequests()
    }, [])

    // =====================================================
    // SUBMIT REQUEST
    // =====================================================


    const handleSubmit = async (e) => {

        e.preventDefault()

        setSuccess('')
        setError('')

        // Check cart

        if (cart.length === 0) {

            setError(
                'Please add at least one product to the cart.'
            )

            return
        }

        // Check description

        if (!description.trim()) {

            setError(
                'Please enter a description.'
            )

            return
        }

        setLoading(true)

        try {

            // Submit every cart item

            for (const item of cart) {

                const requestData = {

                    name:
                    item.name,

                    userId:
                    JSON.parse(localStorage.getItem('user'))?.userId,

                    pricePerProduct:
                        Number(item.price),

                    numberOfQuantities:
                        Number(item.quantity),

                    categoryId:
                        Number(item.categoryId),

                    description:
                        description.trim()
                }

                console.log(
                    'Sending request:',
                    requestData
                )

                const response =
                    await fetch(
                        'http://localhost:8080/api/products/raise-request',
                        {
                            method: 'POST',

                            headers: {
                                'Content-Type':
                                    'application/json'
                            },

                            body:
                                JSON.stringify(
                                    requestData
                                )
                        }
                    )

                const responseText =
                    await response.text()

                let data = {}

                try {

                    data =
                        responseText
                            ? JSON.parse(
                                responseText
                            )
                            : {}

                } catch {

                    data = {}
                }

                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        data.error ||
                        'Unable to submit procurement request.'
                    )
                }

                console.log(
                    'Request submitted:',
                    data
                )
            }

            // SUCCESS

            setSuccess(
                'Procurement request submitted successfully!'
            )

            setCart([])
            setDescription('')

// Refresh request list
            await fetchMyRequests()

        } catch (error) {

            console.error(
                'Procurement request error:',
                error
            )

            setError(
                error.message ||
                'Unable to connect to the backend. Please try again.'
            )

        } finally {

            setLoading(false)
        }
    }

    // =====================================================
    // FORMAT PRICE
    // =====================================================

    const formatPrice = (price) => {

        return price.toLocaleString(
            'en-IN',
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        )
    }

    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="raise-request-page">

            {/* TOP BAR */}

            <div className="raise-request-top">

                <button
                    className="back-button"
                    onClick={() =>
                        navigate('/user-dashboard')
                    }
                >

                    <ArrowLeft size={18} />

                    Back to Dashboard

                </button>

                <div className="cart-top-icon">

                    <ShoppingCart size={22} />

                    {cartItemCount > 0 && (

                        <span>
                            {cartItemCount}
                        </span>

                    )}

                </div>

            </div>

            {/* HEADER */}

            <div className="shopping-header">

                <div>

                    <span className="raise-request-label">
                        PROCUREMENT STORE
                    </span>

                    <h1>
                        What do you need?
                    </h1>

                    <p>
                        Browse products and add the items
                        you need to your procurement cart.
                    </p>

                </div>

            </div>

            {/* CATEGORY SECTION */}

            <div className="category-section">

                <h2>
                    Categories
                </h2>

                <div className="category-list">

                    {/* ALL PRODUCTS */}

                    <button
                        type="button"
                        className={`category-button ${
                            selectedCategory === 'all'
                                ? 'active'
                                : ''
                        }`}
                        onClick={() =>
                            setSelectedCategory('all')
                        }
                    >

                        <Package size={20} />

                        <span>
                            All Products
                        </span>

                    </button>

                    {/* CATEGORIES */}

                    {categories.map(category => {

                        const Icon =
                            category.icon

                        return (

                            <button
                                type="button"
                                key={category.id}
                                className={`category-button ${
                                    selectedCategory ===
                                    category.id
                                        ? 'active'
                                        : ''
                                }`}
                                onClick={() =>
                                    setSelectedCategory(
                                        category.id
                                    )
                                }
                            >

                                <Icon size={20} />

                                <span>
                                    {category.name}
                                </span>

                            </button>

                        )
                    })}

                </div>

            </div>

            {/* MAIN CONTENT */}

            <div className="shopping-layout">

                {/* PRODUCTS */}

                <div className="products-section">

                    <div className="products-header">

                        <div>

                            <h2>
                                Products
                            </h2>

                            <p>
                                {filteredProducts.length}
                                {' '}
                                products available
                            </p>

                        </div>

                    </div>

                    <div className="product-grid">

                        {filteredProducts.map(product => {

                            const Icon =
                                product.icon

                            const cartItem =
                                cart.find(
                                    item =>
                                        item.id ===
                                        product.id
                                )

                            return (

                                <div
                                    className="product-card"
                                    key={product.id}
                                >

                                    {/* PRODUCT ICON */}

                                    <div className="product-image">

                                        <Icon size={48} />

                                    </div>

                                    {/* PRODUCT INFO */}

                                    <div className="product-info">

                                        <span className="product-category">
                                            {product.category}
                                        </span>

                                        <h3>
                                            {product.name}
                                        </h3>

                                        <div className="product-price">

                                            ₹
                                            {formatPrice(
                                                product.price
                                            )}

                                        </div>

                                    </div>

                                    {/* CART CONTROL */}

                                    {cartItem ? (

                                        <div className="product-cart-control">

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    decreaseQuantity(
                                                        product.id
                                                    )
                                                }
                                            >

                                                <Minus size={16} />

                                            </button>

                                            <span>
                                                {
                                                    cartItem.quantity
                                                }
                                            </span>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    increaseQuantity(
                                                        product.id
                                                    )
                                                }
                                            >

                                                <Plus size={16} />

                                            </button>

                                        </div>

                                    ) : (

                                        <button
                                            type="button"
                                            className="add-cart-button"
                                            onClick={() =>
                                                addToCart(
                                                    product
                                                )
                                            }
                                        >

                                            <ShoppingCart
                                                size={17}
                                            />

                                            Add to Cart

                                        </button>

                                    )}

                                </div>

                            )
                        })}

                    </div>

                </div>

                {/* CART */}

                <div className="cart-section">

                    {/* CART HEADER */}

                    <div className="cart-header">

                        <div>

                            <h2>
                                Your Cart
                            </h2>

                            <p>
                                {cartItemCount}
                                {' '}
                                item
                                {cartItemCount !== 1
                                    ? 's'
                                    : ''}
                            </p>

                        </div>

                        <ShoppingCart size={24} />

                    </div>

                    {/* EMPTY CART */}

                    {cart.length === 0 ? (

                        <div className="empty-cart">

                            <ShoppingCart size={42} />

                            <h3>
                                Your cart is empty
                            </h3>

                            <p>
                                Add products from the
                                catalog to continue.
                            </p>

                        </div>

                    ) : (

                        <>

                            {/* CART ITEMS */}

                            <div className="cart-items">

                                {cart.map(item => (

                                    <div
                                        className="cart-item"
                                        key={item.id}
                                    >

                                        <div className="cart-item-icon">

                                            {(() => {

                                                const Icon =
                                                    item.icon

                                                return (
                                                    <Icon
                                                        size={24}
                                                    />
                                                )

                                            })()}

                                        </div>

                                        <div className="cart-item-details">

                                            <h4>
                                                {item.name}
                                            </h4>

                                            <p>
                                                ₹
                                                {formatPrice(
                                                    item.price
                                                )}
                                            </p>

                                            <div className="quantity-control">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        decreaseQuantity(
                                                            item.id
                                                        )
                                                    }
                                                >

                                                    <Minus size={14} />

                                                </button>

                                                <span>
                                                    {item.quantity}
                                                </span>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        increaseQuantity(
                                                            item.id
                                                        )
                                                    }
                                                >

                                                    <Plus size={14} />

                                                </button>

                                            </div>

                                        </div>

                                        <div className="cart-item-right">

                                            <strong>

                                                ₹
                                                {formatPrice(
                                                    item.price *
                                                    item.quantity
                                                )}

                                            </strong>

                                            <button
                                                type="button"
                                                className="remove-cart-button"
                                                onClick={() =>
                                                    removeFromCart(
                                                        item.id
                                                    )
                                                }
                                            >

                                                <Trash2 size={16} />

                                            </button>

                                        </div>

                                    </div>

                                ))}

                            </div>

                            {/* REQUEST DETAILS */}

                            <div className="request-details">

                                <h3>
                                    Request Details
                                </h3>

                                <div className="raise-input-group">

                                    <label>
                                        Description
                                    </label>

                                    <textarea
                                        placeholder="Explain why these products are required..."
                                        value={description}
                                        onChange={(e) =>
                                            setDescription(
                                                e.target.value
                                            )
                                        }
                                    />

                                </div>

                            </div>

                            {/* TOTAL */}

                            <div className="cart-total">

                                <span>
                                    Total Amount
                                </span>

                                <strong>

                                    ₹
                                    {formatPrice(
                                        totalAmount
                                    )}

                                </strong>

                            </div>

                            {/* SUCCESS */}

                            {success && (

                                <div className="request-success">

                                    <CheckCircle2 size={18} />

                                    <span>
                                        {success}
                                    </span>

                                </div>

                            )}

                            {/* ERROR */}

                            {error && (

                                <div className="request-error">

                                    <AlertCircle size={18} />

                                    <span>
                                        {error}
                                    </span>

                                </div>

                            )}

                            {/* SUBMIT */}

                            <button
                                type="button"
                                className="raise-submit-button"
                                disabled={loading}
                                onClick={handleSubmit}
                            >

                                {loading ? (
                                    'Submitting...'
                                ) : (
                                    <>
                                        Raise Request
                                        <span>→</span>
                                    </>
                                )}

                            </button>

                        </>

                    )}

                </div>

            </div>


            {/* =====================================================
    MY REQUESTS
===================================================== */}

            <section className="my-requests-section">

                <div className="my-requests-header">

                    <div>
            <span className="raise-request-label">
                REQUEST HISTORY
            </span>

                        <h2>
                            My Requests
                        </h2>

                        <p>
                            View and track all your procurement requests.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="refresh-button"
                        onClick={fetchMyRequests}
                        disabled={requestsLoading}
                    >
                        <RefreshCw
                            size={16}
                            className={
                                requestsLoading
                                    ? 'refresh-spin'
                                    : ''
                            }
                        />

                        Refresh
                    </button>

                </div>


                {/* FILTER BUTTONS */}

                <div className="request-filter-list">

                    <button
                        className={
                            requestFilter === 'ALL'
                                ? 'request-filter active'
                                : 'request-filter'
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
                                ? 'request-filter active'
                                : 'request-filter'
                        }
                        onClick={() =>
                            setRequestFilter('APPROVED')
                        }
                    >
                        Approved Requests
                    </button>


                    <button
                        className={
                            requestFilter === 'PENDING_FOR_APPROVAL'
                                ? 'request-filter active'
                                : 'request-filter'
                        }
                        onClick={() =>
                            setRequestFilter(
                                'PENDING_FOR_APPROVAL'
                            )
                        }
                    >
                        Pending Requests
                    </button>


                    <button
                        className={
                            requestFilter === 'REJECTED'
                                ? 'request-filter active'
                                : 'request-filter'
                        }
                        onClick={() =>
                            setRequestFilter('REJECTED')
                        }
                    >
                        Rejected Requests
                    </button>

                </div>


                {/* REQUEST LIST */}

                {requestsLoading ? (

                    <div className="requests-message">
                        Loading your requests...
                    </div>

                ) : requests.filter(request =>
                    requestFilter === 'ALL'
                        ? true
                        : request.status === requestFilter
                ).length === 0 ? (

                    <div className="requests-message">
                        No requests found.
                    </div>

                ) : (

                    <div className="requests-list">

                        {requests
                            .filter(request =>
                                requestFilter === 'ALL'
                                    ? true
                                    : request.status === requestFilter
                            )
                            .map(request => (

                                <div
                                    className="request-history-card"
                                    key={request.productId}
                                >

                                    <div className="request-history-icon">
                                        <Package size={24} />
                                    </div>


                                    <div className="request-history-info">

                                        <h3>
                                            {request.name}
                                        </h3>

                                        <p>
                                            {request.description}
                                        </p>

                                        <div className="request-meta">

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

                                        </div>

                                    </div>


                                    <div className="request-history-status">

                            <span
                                className={`status-badge ${
                                    request.status
                                        ?.toLowerCase()
                                        .replaceAll(
                                            '_',
                                            '-'
                                        )
                                }`}
                            >
                                {request.status}
                            </span>

                                    </div>

                                </div>

                            ))}

                    </div>

                )}

            </section>
        </div>
    )
}

export default RaiseRequest