import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './AdminProfile.css'

function AdminProfile() {

    const navigate = useNavigate()

    const [adminData, setAdminData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {

        const savedAdmin = localStorage.getItem('adminData')

        console.log('ADMIN PROFILE DATA:', savedAdmin)

        if (!savedAdmin) {
            setLoading(false)
            return
        }

        try {

            const loggedInAdmin = JSON.parse(savedAdmin)

            console.log('COMPLETE ADMIN PROFILE:', loggedInAdmin)

            setAdminData(loggedInAdmin)
            setLoading(false)

        } catch (error) {

            console.error('Unable to read admin details:', error)
            setLoading(false)
        }

    }, [])

    if (loading) {
        return (
            <div className="admin-profile-page">
                <div className="admin-profile-card">
                    <h2>Loading Profile...</h2>
                </div>
            </div>
        )
    }


    if (!adminData) {
        return (
            <div className="admin-profile-page">
                <div className="admin-profile-card">

                    <h2>Profile Not Available</h2>

                    <button
                        className="admin-profile-back-button"
                        onClick={() => navigate('/admin-dashboard')}
                    >
                        Back to Dashboard
                    </button>

                </div>
            </div>
        )
    }


    return (
        <div className="admin-profile-page">

            <div className="admin-profile-card">

                {/* HEADER */}

                <div className="admin-profile-header">

                    <div className="admin-profile-avatar">
                        {adminData.name?.charAt(0)?.toUpperCase() || 'A'}
                    </div>

                    <div>
                        <h1>Admin Profile</h1>
                        <p>SmartProcure Administrator Account</p>
                    </div>

                </div>


                {/* INFORMATION */}

                <div className="admin-profile-info">

                    <div className="admin-profile-field">
                        <label>Name</label>
                        <span>
                            {adminData.name || 'Not available'}
                        </span>
                    </div>


                    <div className="admin-profile-field">
                        <label>Email</label>
                        <span>
                            {adminData.email || 'Not available'}
                        </span>
                    </div>


                    <div className="admin-profile-field">
                        <label>Phone Number</label>
                        <span>
                            {adminData.phoneNumber || 'Not available'}
                        </span>
                    </div>



                    <div className="admin-profile-field">
                        <label>Role</label>
                        <span>
                            {adminData.role || 'ADMIN'}
                        </span>
                    </div>


                    <div className="admin-profile-field">
                        <label>Admin ID</label>
                        <span>
                            {adminData.adminId || 'Not available'}
                        </span>
                    </div>

                </div>


                {/* BACK BUTTON */}

                <button
                    className="admin-profile-back-button"
                    onClick={() => navigate('/admin-dashboard')}
                >
                    Back to Dashboard
                </button>

            </div>

        </div>
    )
}

export default AdminProfile