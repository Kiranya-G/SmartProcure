import React from 'react'
import { useNavigate } from 'react-router-dom'
import './SupplierProfile.css'

function SupplierProfile() {

    const navigate = useNavigate()

    const supplierId = localStorage.getItem('supplierId')
    const supplierName = localStorage.getItem('supplierName')
    const supplierEmail = localStorage.getItem('supplierEmail')
    const role = localStorage.getItem('role')

    if (!supplierId || !supplierName) {
        return (
            <div className="supplier-profile-page">

                <div className="supplier-profile-card">

                    <h2>Profile Not Available</h2>

                    <button
                        className="supplier-profile-back-button"
                        onClick={() => navigate('/supplier-dashboard')}
                    >
                        Back to Dashboard
                    </button>

                </div>

            </div>
        )
    }

    return (
        <div className="supplier-profile-page">

            <div className="supplier-profile-card">

                {/* HEADER */}

                <div className="supplier-profile-header">

                    <div className="supplier-profile-avatar">
                        {supplierName.charAt(0).toUpperCase()}
                    </div>

                    <div>
                        <h1>Supplier Profile</h1>
                        <p>SmartProcure Supplier Account</p>
                    </div>

                </div>


                {/* PROFILE INFORMATION */}

                <div className="supplier-profile-info">

                    <div className="supplier-profile-field">
                        <label>Supplier Name</label>

                        <span>
                            {supplierName}
                        </span>
                    </div>


                    <div className="supplier-profile-field">
                        <label>Supplier ID</label>

                        <span>
                            {supplierId}
                        </span>
                    </div>


                    <div className="supplier-profile-field">
                        <label>Email</label>

                        <span>
                            {supplierEmail || 'Not available'}
                        </span>
                    </div>


                    <div className="supplier-profile-field">
                        <label>Role</label>

                        <span>
                            {role || 'SUPPLIER'}
                        </span>
                    </div>

                </div>


                {/* BACK BUTTON */}

                <button
                    className="supplier-profile-back-button"
                    onClick={() => navigate('/supplier-dashboard')}
                >
                    Back to Dashboard
                </button>

            </div>

        </div>
    )
}

export default SupplierProfile