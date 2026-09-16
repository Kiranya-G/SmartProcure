import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
    LockKeyhole,
    User,
    ShieldCheck,
    Eye,
    EyeOff,
    AlertCircle
} from 'lucide-react'

import './Login.css'


function Login() {

    const navigate = useNavigate()


    // =====================================================
    // LOGIN TYPE
    // =====================================================

    const [loginType, setLoginType] =
        useState('user')


    // =====================================================
    // FORM STATES
    // =====================================================

    const [email, setEmail] =
        useState('')

    const [password, setPassword] =
        useState('')

    const [showPassword, setShowPassword] =
        useState(false)

    const [error, setError] =
        useState('')

    const [loading, setLoading] =
        useState(false)


    // =====================================================
    // LOGIN
    // =====================================================

    const handleLogin = async (e) => {

        e.preventDefault()

        setError('')
        setLoading(true)


        try {

            // =================================================
            // USER LOGIN
            // =================================================

            if (loginType === 'user') {

                const response =
                    await fetch(
                        'http://localhost:8080/api/auth/login',
                        {
                            method: 'POST',

                            headers: {
                                'Content-Type':
                                    'application/json'
                            },

                            body: JSON.stringify({

                                email:
                                    email.trim(),

                                password:
                                password

                            })
                        }
                    )


                const responseText =
                    await response.text()


                console.log(
                    'User Status:',
                    response.status
                )

                console.log(
                    'User Response:',
                    responseText
                )


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


                // =================================================
                // LOGIN SUCCESS
                // =================================================

                if (response.ok) {

                    console.log(
                        'User Login Data:',
                        data
                    )


                    if (data.role === 'USER') {


                        // =========================================
                        // SAVE COMPLETE USER DETAILS
                        // =========================================

                        localStorage.setItem(
                            'user',
                            JSON.stringify(data)
                        )


                        localStorage.setItem(
                            'role',
                            'USER'
                        )


                        // =========================================
                        // SAVE USER ID
                        // =========================================

                        localStorage.setItem(
                            'userId',
                            String(data.userId)
                        )


                        // =========================================
                        // SAVE USER EMAIL
                        // =========================================

                        localStorage.setItem(
                            'userEmail',
                            data.email
                        )


                        // =========================================
                        // DEBUG
                        // =========================================

                        console.log(
                            'Logged-in User ID:',
                            data.userId
                        )

                        console.log(
                            'Logged-in User Email:',
                            data.email
                        )


                        // =========================================
                        // GO TO USER DASHBOARD
                        // =========================================

                        navigate(
                            '/user-dashboard',
                            {
                                replace: true
                            }
                        )


                    } else {

                        setError(
                            'Invalid user account'
                        )
                    }


                } else {

                    setError(
                        data.message ||
                        data.error ||
                        'Invalid email or password'
                    )
                }


                // =================================================
                // ADMIN LOGIN
                // =================================================

            } else {

                const response =
                    await fetch(
                        'http://localhost:8080/api/admin/login',
                        {
                            method: 'POST',

                            headers: {
                                'Content-Type':
                                    'application/json'
                            },

                            body: JSON.stringify({

                                email:
                                    email.trim(),

                                password:
                                password

                            })
                        }
                    )


                const responseText =
                    await response.text()


                console.log(
                    'Admin Status:',
                    response.status
                )

                console.log(
                    'Admin Response:',
                    responseText
                )


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


                if (response.ok) {

                    localStorage.setItem(
                        'role',
                        'ADMIN'
                    )


                    navigate(
                        '/admin-dashboard',
                        {
                            replace: true
                        }
                    )


                } else {

                    setError(
                        data.message ||
                        data.error ||
                        'Invalid admin email or password'
                    )
                }
            }


        } catch (error) {

            console.error(
                'LOGIN ERROR:',
                error
            )


            setError(
                'Unable to connect to the backend. Please try again.'
            )


        } finally {

            setLoading(false)
        }
    }


    // =====================================================
    // CHANGE LOGIN TYPE
    // =====================================================

    const changeLoginType = (type) => {

        setLoginType(type)

        setEmail('')

        setPassword('')

        setError('')

        setShowPassword(false)
    }


    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="login-page">

            <div className="login-box">


                {/* LOGIN ICON */}

                <div className="login-icon">

                    <LockKeyhole
                        size={32}
                    />

                </div>


                {/* TITLE */}

                <h1>
                    Welcome Back!
                </h1>


                <p className="login-subtitle">
                    Login to your SmartProcure account
                </p>


                {/* USER / ADMIN BUTTONS */}

                <div className="login-role-buttons">


                    <button
                        type="button"
                        className={
                            loginType === 'user'
                                ? 'role-button active'
                                : 'role-button'
                        }
                        onClick={() =>
                            changeLoginType('user')
                        }
                    >

                        <User size={18} />

                        <span>
                            User
                        </span>

                    </button>


                    <button
                        type="button"
                        className={
                            loginType === 'admin'
                                ? 'role-button active'
                                : 'role-button'
                        }
                        onClick={() =>
                            changeLoginType('admin')
                        }
                    >

                        <ShieldCheck size={18} />

                        <span>
                            Admin
                        </span>

                    </button>

                </div>


                {/* LOGIN TYPE */}

                <h2 className="login-type-title">

                    {loginType === 'user'
                        ? 'USER LOGIN'
                        : 'ADMIN LOGIN'}

                </h2>


                {/* FORM */}

                <form onSubmit={handleLogin}>


                    {/* EMAIL */}

                    <div className="login-input-group">

                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            placeholder={
                                loginType === 'user'
                                    ? 'Enter your email'
                                    : 'Enter admin email'
                            }
                            value={email}
                            onChange={(e) => {

                                setEmail(
                                    e.target.value
                                )

                                setError('')

                            }}
                            required
                        />

                    </div>


                    {/* PASSWORD */}

                    <div className="login-input-group">

                        <label>
                            Password
                        </label>


                        <div className="login-password-wrapper">

                            <input
                                type={
                                    showPassword
                                        ? 'text'
                                        : 'password'
                                }
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => {

                                    setPassword(
                                        e.target.value
                                    )

                                    setError('')

                                }}
                                required
                            />


                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(
                                        !showPassword
                                    )
                                }
                                className="login-eye-button"
                            >

                                {showPassword
                                    ? <EyeOff size={18} />
                                    : <Eye size={18} />
                                }

                            </button>

                        </div>

                    </div>


                    {/* ERROR */}

                    {error && (

                        <div className="login-error">

                            <AlertCircle
                                size={18}
                            />

                            <span>
                                {error}
                            </span>

                        </div>

                    )}


                    {/* LOGIN BUTTON */}

                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >

                        {loading
                            ? 'Logging in...'
                            : loginType === 'user'
                                ? 'User Login →'
                                : 'Admin Login →'
                        }

                    </button>

                </form>


                {/* REGISTER */}

                <div className="register-link">

                    {loginType === 'user'
                        ? "Don't have a user account?"
                        : "Don't have an admin account?"
                    }

                    {' '}

                    <button
                        type="button"
                        onClick={() => {

                            if (
                                loginType ===
                                'user'
                            ) {

                                navigate('/')

                            } else {

                                navigate(
                                    '/admin-registration'
                                )

                            }

                        }}
                    >
                        Register
                    </button>

                </div>


                {/* FOOTER */}

                <div className="login-footer">

                    {loginType === 'user'
                        ? 'Are you an admin?'
                        : 'Are you a user?'
                    }

                    {' '}

                    <button
                        type="button"
                        onClick={() =>
                            changeLoginType(
                                loginType === 'user'
                                    ? 'admin'
                                    : 'user'
                            )
                        }
                    >

                        {loginType === 'user'
                            ? 'Admin Login'
                            : 'User Login'
                        }

                    </button>

                </div>

            </div>

        </div>
    )
}


export default Login