import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './UserProfile.css'

function UserProfile() {

    const navigate = useNavigate()

    const [userData, setUserData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {

        const savedUser = localStorage.getItem('user')

        if (!savedUser) {
            setLoading(false)
            return
        }

        try {

            const loggedInUser = JSON.parse(savedUser)

            console.log('Logged in user:', loggedInUser)

            const userId = loggedInUser.userId

            if (!userId) {
                console.error('User ID not found')
                setLoading(false)
                return
            }

            fetch(`http://localhost:8080/api/users/${userId}`)
                .then(response => {

                    if (!response.ok) {
                        throw new Error('Failed to fetch user details')
                    }

                    return response.json()
                })
                .then(data => {

                    console.log('COMPLETE USER PROFILE:', data)

                    setUserData(data)
                    setLoading(false)
                })
                .catch(error => {

                    console.error('Error loading profile:', error)
                    setLoading(false)
                })

        } catch (error) {

            console.error('Unable to read user details:', error)
            setLoading(false)
        }

    }, [])


    if (loading) {
        return (
            <div className="profile-page">
                <div className="profile-card">
                    <h2>Loading Profile...</h2>
                </div>
            </div>
        )
    }


    if (!userData) {
        return (
            <div className="profile-page">
                <div className="profile-card">

                    <h2>Profile Not Available</h2>

                    <button
                        className="profile-back-button"
                        onClick={() => navigate('/user-dashboard')}
                    >
                        Back to Dashboard
                    </button>

                </div>
            </div>
        )
    }


    return (
        <div className="profile-page">

            <div className="profile-card">

                {/* HEADER */}

                <div className="profile-header">

                    <div className="profile-avatar">
                        {userData.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>

                    <div>
                        <h1>My Profile</h1>
                        <p>SmartProcure User Account</p>
                    </div>

                </div>


                {/* PROFILE INFORMATION */}

                <div className="profile-info">

                    <div className="profile-field">
                        <label>Name</label>
                        <span>{userData.name || 'Not available'}</span>
                    </div>


                    <div className="profile-field">
                        <label>Email</label>
                        <span>{userData.email || 'Not available'}</span>
                    </div>


                    <div className="profile-field">
                        <label>Phone Number</label>
                        <span>
                            {userData.phoneNumber || 'Not available'}
                        </span>
                    </div>


                    <div className="profile-field">
                        <label>Designation</label>
                        <span>
                            {userData.designation || 'Not available'}
                        </span>
                    </div>





                    <div className="profile-field">
                        <label>Role</label>
                        <span>
                            {userData.role || 'USER'}
                        </span>
                    </div>

                </div>


                {/* BACK BUTTON */}

                <button
                    className="profile-back-button"
                    onClick={() => navigate('/user-dashboard')}
                >
                    Back to Dashboard
                </button>

            </div>

        </div>
    )
}

export default UserProfile