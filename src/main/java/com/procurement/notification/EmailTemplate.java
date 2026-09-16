package com.procurement.notification;

public class EmailTemplate {

    public static String requestSubmittedNotification(
            String userName,
            Long productId,
            String productName,
            double totalPrice) {

        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                
                    <style>
                        body {
                            margin: 0;
                            padding: 0;
                            background-color: #f4f7fb;
                            font-family: Arial, Helvetica, sans-serif;
                        }
                
                        .container {
                            width: 100%%;
                            max-width: 600px;
                            margin: 30px auto;
                            background-color: #ffffff;
                            border-radius: 12px;
                            overflow: hidden;
                            box-shadow: 0 4px 15px rgba(0,0,0,0.08);
                        }
                
                        .header {
                            background: linear-gradient(135deg, #2563eb, #4f46e5);
                            padding: 30px;
                            text-align: center;
                            color: white;
                        }
                
                        .header h1 {
                            margin: 0;
                            font-size: 25px;
                        }
                
                        .header p {
                            margin: 8px 0 0;
                            font-size: 14px;
                            opacity: 0.9;
                        }
                
                        .content {
                            padding: 30px;
                            color: #333333;
                        }
                
                        .success-icon {
                            text-align: center;
                            font-size: 45px;
                            margin-bottom: 10px;
                            color: #16a34a;
                        }
                
                        .content h2 {
                            text-align: center;
                            color: #1f2937;
                            margin-bottom: 10px;
                        }
                
                        .content p {
                            font-size: 15px;
                            line-height: 1.6;
                        }
                
                        .details {
                            margin-top: 25px;
                            border: 1px solid #e5e7eb;
                            border-radius: 10px;
                            overflow: hidden;
                        }
                
                        .row {
                            display: flex;
                            align-items: center;
                            padding: 16px 20px;
                            border-bottom: 1px solid #e5e7eb;
                        }
                
                        .row:last-child {
                            border-bottom: none;
                        }
                
                        .label {
                            color: #6b7280;
                            font-weight: bold;
                            width: 50%%;
                        }
                
                        .value {
                            color: #111827;
                            font-weight: 600;
                            width: 50%%;
                            text-align: right;
                        }
                
                        .status {
                            color: #b45309;
                            background-color: #fef3c7;
                            padding: 6px 14px;
                            border-radius: 20px;
                            font-size: 13px;
                            font-weight: bold;
                            display: inline-block;
                        }
                
                        .price {
                            color: #2563eb;
                            font-size: 17px;
                            font-weight: bold;
                        }
                
                        .info-box {
                            margin-top: 25px;
                            padding: 15px;
                            background-color: #eff6ff;
                            border-left: 4px solid #2563eb;
                            border-radius: 6px;
                            color: #374151;
                        }
                
                        .footer {
                            background-color: #f8fafc;
                            text-align: center;
                            padding: 20px;
                            color: #6b7280;
                            font-size: 12px;
                        }
                    </style>
                </head>
                
                <body>
                
                    <div class="container">
                
                        <div class="header">
                            <h1>Smart Procurement & Purchase Order Management System</h1>
                            <p>Procurement Management System</p>
                        </div>
                
                        <div class="content">
                
                            <div class="success-icon">✓</div>
                
                            <h2>Request Submitted Successfully</h2>
                
                            <p>
                                Hello <strong>%s</strong>,
                            </p>
                
                            <p>
                                Your procurement request has been successfully
                                submitted and is now waiting for admin approval.
                            </p>
                
                            <div class="details">
                
                                <div class="row">
                                    <span class="label">Request ID</span>
                                    <span class="value">#%s</span>
                                </div>
                
                                <div class="row">
                                    <span class="label">Product</span>
                                    <span class="value">%s</span>
                                </div>
                
                                <div class="row">
                                    <span class="label">Total Price</span>
                                    <span class="value price">₹ %.2f</span>
                                </div>
                
                                <div class="row">
                                    <span class="label">Status</span>
                                    <span class="value">
                                        <span class="status">PENDING</span>
                                    </span>
                                </div>
                
                            </div>
                
                            <div class="info-box">
                                Your request has been sent to the admin
                                for approval. You will receive another email
                                once the status is updated.
                            </div>
                
                            <p style="margin-top: 25px;">
                                Thank you for using our
                                <strong>Smart Procurement & Purchase Order Management System</strong>.
                            </p>
                
                        </div>
                
                        <div class="footer">
                            © 2026 Smart Procurement & Purchase Order Management System<br>
                            This is an automated notification. Please do not reply.
                        </div>
                
                    </div>
                
                </body>
                </html>
                """.formatted(
                userName,
                productId,
                productName,
                totalPrice
        );
    }

    public static String adminRequestNotification(
            String adminName,
            Long productId,
            String productName,
            String userName,
            String userEmail,
            String departmentName,
            double totalPrice,
            int quantity,
            String description) {

        return """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">

                <style>

                    body {
                        margin: 0;
                        padding: 0;
                        background-color: #f4f7fb;
                        font-family: Arial, Helvetica, sans-serif;
                    }

                    .container {
                        width: 100%%;
                        max-width: 650px;
                        margin: 30px auto;
                        background-color: #ffffff;
                        border-radius: 12px;
                        overflow: hidden;
                        box-shadow: 0 4px 15px rgba(0,0,0,0.08);
                    }

                    .header {
                        background: linear-gradient(135deg, #7c3aed, #4f46e5);
                        padding: 30px;
                        text-align: center;
                        color: white;
                    }

                    .header h1 {
                        margin: 0;
                        font-size: 24px;
                    }

                    .header p {
                        margin: 8px 0 0;
                        font-size: 14px;
                        opacity: 0.9;
                    }

                    .content {
                        padding: 30px;
                        color: #333333;
                    }

                    .icon {
                        text-align: center;
                        font-size: 45px;
                        margin-bottom: 10px;
                    }

                    .content h2 {
                        text-align: center;
                        color: #1f2937;
                        margin-bottom: 15px;
                    }

                    .content p {
                        font-size: 15px;
                        line-height: 1.6;
                    }

                    .details {
                        margin-top: 25px;
                        border: 1px solid #e5e7eb;
                        border-radius: 10px;
                        overflow: hidden;
                    }

                    .row {
                        display: flex;
                        align-items: center;
                        padding: 15px 20px;
                        border-bottom: 1px solid #e5e7eb;
                    }

                    .row:last-child {
                        border-bottom: none;
                    }

                    .label {
                        color: #6b7280;
                        font-weight: bold;
                        width: 45%%;
                    }

                    .value {
                        color: #111827;
                        font-weight: 600;
                        width: 55%%;
                        text-align: right;
                    }

                    .price {
                        color: #2563eb;
                        font-size: 17px;
                        font-weight: bold;
                    }

                    .status {
                        color: #b45309;
                        background-color: #fef3c7;
                        padding: 6px 14px;
                        border-radius: 20px;
                        font-size: 13px;
                        font-weight: bold;
                        display: inline-block;
                    }

                    .info-box {
                        margin-top: 25px;
                        padding: 15px;
                        background-color: #eff6ff;
                        border-left: 4px solid #4f46e5;
                        border-radius: 6px;
                        color: #374151;
                    }

                    .description-box {
                        margin-top: 20px;
                        padding: 15px;
                        background-color: #f8fafc;
                        border: 1px solid #e5e7eb;
                        border-radius: 8px;
                    }

                    .description-title {
                        font-weight: bold;
                        color: #374151;
                        margin-bottom: 8px;
                    }

                    .description {
                        color: #4b5563;
                        line-height: 1.5;
                    }

                    .footer {
                        background-color: #f8fafc;
                        text-align: center;
                        padding: 20px;
                        color: #6b7280;
                        font-size: 12px;
                    }

                </style>
            </head>

            <body>

                <div class="container">

                    <div class="header">
                        <h1>Smart Procurement & Purchase Order Management System</h1>
                        <p>Admin Procurement Request Notification</p>
                    </div>

                    <div class="content">

                        <div class="icon">📋</div>

                        <h2>New Procurement Request</h2>

                        <p>
                            Hello <strong>%s</strong>,
                        </p>

                        <p>
                            A new procurement request has been submitted
                            by a user in your department and requires your approval.
                        </p>

                        <div class="details">

                            <div class="row">
                                <span class="label">Request ID</span>
                                <span class="value">#%s</span>
                            </div>

                            <div class="row">
                                <span class="label">Requester Name</span>
                                <span class="value">%s</span>
                            </div>

                            <div class="row">
                                <span class="label">Requester Email</span>
                                <span class="value">%s</span>
                            </div>

                            <div class="row">
                                <span class="label">Department</span>
                                <span class="value">%s</span>
                            </div>

                            <div class="row">
                                <span class="label">Product</span>
                                <span class="value">%s</span>
                            </div>

                            <div class="row">
                                <span class="label">Quantity</span>
                                <span class="value">%s</span>
                            </div>

                            <div class="row">
                                <span class="label">Total Price</span>
                                <span class="value price">₹ %.2f</span>
                            </div>

                            <div class="row">
                                <span class="label">Status</span>
                                <span class="value">
                                    <span class="status">PENDING</span>
                                </span>
                            </div>

                        </div>

                        <div class="description-box">

                            <div class="description-title">
                                Request Description
                            </div>

                            <div class="description">
                                %s
                            </div>

                        </div>

                        <div class="info-box">

                            Please login to the Smart Procurement
                            & Purchase Order Management System to review
                            and approve or reject this request.

                        </div>

                        <p style="margin-top: 25px;">

                            Thank you for using our
                            <strong>Smart Procurement & Purchase Order Management System</strong>.

                        </p>

                    </div>

                    <div class="footer">

                        © 2026 Smart Procurement & Purchase Order Management System
                        <br>

                        This is an automated notification.
                        Please do not reply.

                    </div>

                </div>

            </body>
            </html>
            """.formatted(
                adminName,
                productId,
                userName,
                userEmail,
                departmentName,
                productName,
                quantity,
                totalPrice,
                description != null ? description : "No description provided"
        );
    }

    public static String statusUpdateNotification(
            String userName,
            Long productId,
            String productName,
            double totalPrice,
            String status) {

        boolean approved = status.equalsIgnoreCase("APPROVED");

        String title = approved
                ? "Request Approved Successfully"
                : "Request Rejected";

        String message = approved
                ? "Your procurement request has been approved by the admin."
                : "Your procurement request has been rejected by the admin.";

        String icon = approved ? "✓" : "✕";

        String statusColor = approved ? "#15803d" : "#b91c1c";
        String statusBackground = approved ? "#dcfce7" : "#fee2e2";
        String headerStart = approved ? "#16a34a" : "#dc2626";
        String headerEnd = approved ? "#059669" : "#b91c1c";

        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                
                    <style>
                        body {
                            margin: 0;
                            padding: 0;
                            background-color: #f4f7fb;
                            font-family: Arial, Helvetica, sans-serif;
                        }
                
                        .container {
                            width: 100%%;
                            max-width: 600px;
                            margin: 30px auto;
                            background-color: #ffffff;
                            border-radius: 12px;
                            overflow: hidden;
                            box-shadow: 0 4px 15px rgba(0,0,0,0.08);
                        }
                
                        .header {
                            background: linear-gradient(135deg, %s, %s);
                            padding: 30px;
                            text-align: center;
                            color: white;
                        }
                
                        .header h1 {
                            margin: 0;
                            font-size: 25px;
                        }
                
                        .header p {
                            margin: 8px 0 0;
                            font-size: 14px;
                            opacity: 0.9;
                        }
                
                        .content {
                            padding: 30px;
                            color: #333333;
                        }
                
                        .status-icon {
                            text-align: center;
                            font-size: 45px;
                            font-weight: bold;
                            color: %s;
                            margin-bottom: 10px;
                        }
                
                        .content h2 {
                            text-align: center;
                            color: #1f2937;
                            margin-bottom: 10px;
                        }
                
                        .content p {
                            font-size: 15px;
                            line-height: 1.6;
                        }
                
                        .details {
                            margin-top: 25px;
                            border: 1px solid #e5e7eb;
                            border-radius: 10px;
                            overflow: hidden;
                        }
                
                        .row {
                            display: flex;
                            align-items: center;
                            padding: 16px 20px;
                            border-bottom: 1px solid #e5e7eb;
                        }
                
                        .row:last-child {
                            border-bottom: none;
                        }
                
                        .label {
                            color: #6b7280;
                            font-weight: bold;
                            width: 50%%;
                        }
                
                        .value {
                            color: #111827;
                            font-weight: 600;
                            width: 50%%;
                            text-align: right;
                        }
                
                        .status {
                            color: %s;
                            background-color: %s;
                            padding: 6px 14px;
                            border-radius: 20px;
                            font-size: 13px;
                            font-weight: bold;
                            display: inline-block;
                        }
                
                        .price {
                            color: #2563eb;
                            font-size: 17px;
                            font-weight: bold;
                        }
                
                        .info-box {
                            margin-top: 25px;
                            padding: 15px;
                            background-color: #f8fafc;
                            border-left: 4px solid %s;
                            border-radius: 6px;
                            color: #374151;
                        }
                
                        .footer {
                            background-color: #f8fafc;
                            text-align: center;
                            padding: 20px;
                            color: #6b7280;
                            font-size: 12px;
                        }
                    </style>
                </head>
                
                <body>
                
                    <div class="container">
                
                        <div class="header">
                            <h1>Smart Procurement & Purchase Order Management System</h1>
                            <p>Procurement Management System</p>
                        </div>
                
                        <div class="content">
                
                            <div class="status-icon">%s</div>
                
                            <h2>%s</h2>
                
                            <p>
                                Hello <strong>%s</strong>,
                            </p>
                
                            <p>
                                %s
                            </p>
                
                            <div class="details">
                
                                <div class="row">
                                    <span class="label">Request ID</span>
                                    <span class="value">#%s</span>
                                </div>
                
                                <div class="row">
                                    <span class="label">Product</span>
                                    <span class="value">%s</span>
                                </div>
                
                                <div class="row">
                                    <span class="label">Total Price</span>
                                    <span class="value price">₹ %.2f</span>
                                </div>
                
                                <div class="row">
                                    <span class="label">Status</span>
                                    <span class="value">
                                        <span class="status">%s</span>
                                    </span>
                                </div>
                
                            </div>
                
                            <div class="info-box">
                                %s
                            </div>
                
                            <p style="margin-top: 25px;">
                                Thank you for using our
                                <strong>Smart Procurement & Purchase Order Management System</strong>.
                            </p>
                
                        </div>
                
                        <div class="footer">
                            © 2026 Smart Procurement & Purchase Order Management System<br>
                            This is an automated notification. Please do not reply.
                        </div>
                
                    </div>
                
                </body>
                </html>
                """.formatted(
                headerStart,
                headerEnd,
                statusColor,
                statusColor,
                statusBackground,
                statusColor,
                icon,
                title,
                userName,
                message,
                productId,
                productName,
                totalPrice,
                status,
                message
        );
    }

    public static String shipmentStatusNotification(
            String userName,
            Long productId,
            String productName,
            double totalPrice,
            String status) {

        String title;
        String message;
        String icon;
        String statusColor;
        String statusBackground;
        String headerStart;
        String headerEnd;

        if (status.equalsIgnoreCase("PACKED")) {

            title = "Order Packed Successfully";
            message = "Your order has been packed and is ready for shipment.";
            icon = "📦";

            statusColor = "#1d4ed8";
            statusBackground = "#dbeafe";
            headerStart = "#2563eb";
            headerEnd = "#4f46e5";

        } else if (status.equalsIgnoreCase("SHIPPED")) {

            title = "Order Shipped";
            message = "Your order has been shipped and is on its way to you.";
            icon = "🚚";

            statusColor = "#b45309";
            statusBackground = "#fef3c7";
            headerStart = "#f59e0b";
            headerEnd = "#d97706";

        } else if (status.equalsIgnoreCase("DELIVERED")) {

            title = "Order Delivered Successfully";
            message = "Your order has been delivered successfully. We hope you enjoy your purchase!";
            icon = "✓";

            statusColor = "#15803d";
            statusBackground = "#dcfce7";
            headerStart = "#16a34a";
            headerEnd = "#059669";

        } else {

            title = "Shipment Status Update";
            message = "Your shipment status has been updated.";
            icon = "📦";

            statusColor = "#475569";
            statusBackground = "#e2e8f0";
            headerStart = "#475569";
            headerEnd = "#334155";
        }

        return """
                 <!DOCTYPE html>
                 <html>
                 <head>
                     <meta charset="UTF-8">
                     <meta name="viewport" content="width=device-width, initial-scale=1.0">
                
                     <style>
                
                         body {
                             margin: 0;
                             padding: 0;
                             background-color: #f4f7fb;
                             font-family: Arial, Helvetica, sans-serif;
                         }
                
                         .container {
                             width: 100%%;
                             max-width: 600px;
                             margin: 30px auto;
                             background-color: #ffffff;
                             border-radius: 12px;
                             overflow: hidden;
                             box-shadow: 0 4px 15px rgba(0,0,0,0.08);
                         }
                
                         .header {
                             background: linear-gradient(135deg, %s, %s);
                             padding: 30px;
                             text-align: center;
                             color: white;
                         }
                
                         .header h1 {
                             margin: 0;
                             font-size: 25px;
                         }
                
                         .header p {
                             margin: 8px 0 0;
                             font-size: 14px;
                             opacity: 0.9;
                         }
                
                         .content {
                             padding: 30px;
                             color: #333333;
                         }
                
                         .status-icon {
                             text-align: center;
                             font-size: 45px;
                             margin-bottom: 10px;
                         }
                
                         .content h2 {
                             text-align: center;
                             color: #1f2937;
                             margin-bottom: 10px;
                         }
                
                         .content p {
                             font-size: 15px;
                             line-height: 1.6;
                         }
                
                         .details {
                             margin-top: 25px;
                             border: 1px solid #e5e7eb;
                             border-radius: 10px;
                             overflow: hidden;
                         }
                
                         .row {
                             display: flex;
                             align-items: center;
                             padding: 16px 20px;
                             border-bottom: 1px solid #e5e7eb;
                         }
                
                         .row:last-child {
                             border-bottom: none;
                         }
                
                         .label {
                             color: #6b7280;
                             font-weight: bold;
                             width: 50%%;
                         }
                
                         .value {
                             color: #111827;
                             font-weight: 600;
                             width: 50%%;
                             text-align: right;
                         }
                
                         .status {
                             color: %s;
                             background-color: %s;
                             padding: 6px 14px;
                             border-radius: 20px;
                             font-size: 13px;
                             font-weight: bold;
                             display: inline-block;
                         }
                
                         .price {
                             color: #2563eb;
                             font-size: 17px;
                             font-weight: bold;
                         }
                
                         .info-box {
                             margin-top: 25px;
                             padding: 15px;
                             background-color: #f8fafc;
                             border-left: 4px solid %s;
                             border-radius: 6px;
                             color: #374151;
                         }
                
                         .footer {
                             background-color: #f8fafc;
                             text-align: center;
                             padding: 20px;
                             color: #6b7280;
                             font-size: 12px;
                         }
                
                     </style>
                 </head>
                
                 <body>
                
                     <div class="container">
                
                         <div class="header">
                             <h1>Smart Procurement & Purchase Order Management System</h1>
                             <p>Shipment Tracking Notification</p>
                         </div>
                
                         <div class="content">
                
                             <div class="status-icon">%s</div>
                
                             <h2>%s</h2>
                
                             <p>
                                 Hello <strong>%s</strong>,
                             </p>
                
                             <p>
                                 %s
                             </p>
                
                             <div class="details">
                
                                 <div class="row">
                                     <span class="label">Product ID</span>
                                     <span class="value">#%s</span>
                                 </div>
                
                                 <div class="row">
                                     <span class="label">Product</span>
                                     <span class="value">%s</span>
                                 </div>
                
                                 <div class="row">
                                     <span class="label">Total Price</span>
                                     <span class="value price">₹ %s</span>
                                 </div>
                
                                 <div class="row">
                                     <span class="label">Shipment Status</span>
                                     <span class="value">
                                         <span class="status">%s</span>
                                     </span>
                                 </div>
                
                             </div>
                
                             <div class="info-box">
                                 %s
                             </div>
                
                             <p style="margin-top: 25px;">
                                 Thank you for using our
                                 <strong>Smart Procurement & Purchase Order Management System</strong>.
                             </p>
                
                         </div>
                
                         <div class="footer">
                             © 2026 Smart Procurement & Purchase Order Management System<br>
                             This is an automated notification. Please do not reply.
                         </div>
                
                     </div>
                
                 </body>
                 </html>
               """.formatted(
                                   headerStart,
                                   headerEnd,
                                   statusColor,
                                   statusBackground,
                                   statusColor,
                                   icon,
                                   title,
                                   userName,
                                   message,
                                   productId,
                                   productName,
                                   String.format("%.2f", totalPrice),
                                   status,
                                   message
                           );
    }
    public static String paymentSuccessfulNotification(
            String userName,
            Long paymentId,
            String transactionId,
            String productName,
            String supplierName,
            double amount,
            String paymentDate) {

        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                
                    <style>
                
                        body {
                            margin: 0;
                            padding: 0;
                            background-color: #f4f7fb;
                            font-family: Arial, Helvetica, sans-serif;
                        }
                
                        .container {
                            width: 100%%;
                            max-width: 600px;
                            margin: 30px auto;
                            background-color: #ffffff;
                            border-radius: 12px;
                            overflow: hidden;
                            box-shadow: 0 4px 15px rgba(0,0,0,0.08);
                        }
                
                        .header {
                            background: linear-gradient(135deg, #16a34a, #059669);
                            padding: 30px;
                            text-align: center;
                            color: white;
                        }
                
                        .header h1 {
                            margin: 0;
                            font-size: 25px;
                        }
                
                        .header p {
                            margin: 8px 0 0;
                            font-size: 14px;
                            opacity: 0.9;
                        }
                
                        .content {
                            padding: 30px;
                            color: #333333;
                        }
                
                        .success-icon {
                            text-align: center;
                            font-size: 45px;
                            color: #16a34a;
                            margin-bottom: 10px;
                        }
                
                        .content h2 {
                            text-align: center;
                            color: #1f2937;
                            margin-bottom: 10px;
                        }
                
                        .content p {
                            font-size: 15px;
                            line-height: 1.6;
                        }
                
                        .details {
                            margin-top: 25px;
                            border: 1px solid #e5e7eb;
                            border-radius: 10px;
                            overflow: hidden;
                        }
                
                        .row {
                            display: flex;
                            align-items: center;
                            padding: 16px 20px;
                            border-bottom: 1px solid #e5e7eb;
                        }
                
                        .row:last-child {
                            border-bottom: none;
                        }
                
                        .label {
                            color: #6b7280;
                            font-weight: bold;
                            width: 50%%;
                        }
                
                        .value {
                            color: #111827;
                            font-weight: 600;
                            width: 50%%;
                            text-align: right;
                        }
                
                        .transaction {
                            color: #2563eb;
                            font-weight: bold;
                        }
                
                        .price {
                            color: #16a34a;
                            font-size: 17px;
                            font-weight: bold;
                        }
                
                        .status {
                            color: #15803d;
                            background-color: #dcfce7;
                            padding: 6px 14px;
                            border-radius: 20px;
                            font-size: 13px;
                            font-weight: bold;
                            display: inline-block;
                        }
                
                        .info-box {
                            margin-top: 25px;
                            padding: 15px;
                            background-color: #f0fdf4;
                            border-left: 4px solid #16a34a;
                            border-radius: 6px;
                            color: #374151;
                        }
                
                        .footer {
                            background-color: #f8fafc;
                            text-align: center;
                            padding: 20px;
                            color: #6b7280;
                            font-size: 12px;
                        }
                
                    </style>
                </head>
                
                <body>
                
                    <div class="container">
                
                        <div class="header">
                            <h1>Smart Procurement & Purchase Order Management System</h1>
                            <p>Payment Confirmation</p>
                        </div>
                
                        <div class="content">
                
                            <div class="success-icon">✓</div>
                
                            <h2>Payment Successful</h2>
                
                            <p>
                                Hello <strong>%s</strong>,
                            </p>
                
                            <p>
                                Your payment has been successfully processed.
                                Thank you for using our Smart Procurement & Purchase Order Management System.
                            </p>
                
                            <div class="details">
                
                                <div class="row">
                                    <span class="label">Payment ID</span>
                                    <span class="value">#%s</span>
                                </div>
                
                                <div class="row">
                                    <span class="label">Transaction ID</span>
                                    <span class="value transaction">%s</span>
                                </div>
                
                                <div class="row">
                                    <span class="label">Product</span>
                                    <span class="value">%s</span>
                                </div>
                
                                <div class="row">
                                    <span class="label">Supplier</span>
                                    <span class="value">%s</span>
                                </div>
                
                                <div class="row">
                                    <span class="label">Amount</span>
                                    <span class="value price">₹ %.2f</span>
                                </div>
                
                                <div class="row">
                                    <span class="label">Payment Date</span>
                                    <span class="value">%s</span>
                                </div>
                
                                <div class="row">
                                    <span class="label">Status</span>
                                    <span class="value">
                                        <span class="status">SUCCESS</span>
                                    </span>
                                </div>
                
                            </div>
                
                            <div class="info-box">
                                ✓ Your payment has been confirmed successfully.
                                Your order will now proceed to the shipment process.
                            </div>
                
                            <p style="margin-top: 25px;">
                                Thank you for choosing
                                <strong>Smart Procurement & Purchase Order Management System</strong>.
                            </p>
                
                        </div>
                
                        <div class="footer">
                            © 2026 Smart Procurement & Purchase Order Management System<br>
                            This is an automated notification. Please do not reply.
                        </div>
                
                    </div>
                
                </body>
                </html>
                """.formatted(
                userName,
                paymentId,
                transactionId,
                productName,
                supplierName,
                amount,
                paymentDate
        );
    }

    public static String orderTrackingNotification(
            String userName,
            Long orderId,
            String productName,
            double amount,
            String status,
            String updatedAt) {

        String title;
        String message;
        String icon;
        String statusColor;
        String statusBackground;
        String headerStart;
        String headerEnd;

        if (status.equalsIgnoreCase("PACKED")) {

            title = "Order Packed Successfully";
            message = "Your order has been packed and is ready for shipment.";
            icon = "📦";

            statusColor = "#1d4ed8";
            statusBackground = "#dbeafe";
            headerStart = "#2563eb";
            headerEnd = "#4f46e5";

        } else if (status.equalsIgnoreCase("SHIPPED")) {

            title = "Order Shipped";
            message = "Your order has been shipped and is on its way to you.";
            icon = "🚚";

            statusColor = "#b45309";
            statusBackground = "#fef3c7";
            headerStart = "#f59e0b";
            headerEnd = "#d97706";

        } else if (status.equalsIgnoreCase("DELIVERED")) {

            title = "Order Delivered Successfully";
            message = "Your order has been delivered successfully. We hope you enjoy your purchase!";
            icon = "✓";

            statusColor = "#15803d";
            statusBackground = "#dcfce7";
            headerStart = "#16a34a";
            headerEnd = "#059669";

        } else {

            title = "Order Status Updated";
            message = "Your order status has been updated.";
            icon = "📦";

            statusColor = "#475569";
            statusBackground = "#e2e8f0";
            headerStart = "#475569";
            headerEnd = "#334155";
        }

        return """
                <!DOCTYPE html>
                <html>
                <head>
                
                    <meta charset="UTF-8">
                
                    <style>
                
                        body {
                            margin: 0;
                            padding: 0;
                            background-color: #f4f7fb;
                            font-family: Arial, Helvetica, sans-serif;
                        }
                
                        .container {
                            width: 100%%;
                            max-width: 600px;
                            margin: 30px auto;
                            background-color: #ffffff;
                            border-radius: 12px;
                            overflow: hidden;
                            box-shadow: 0 4px 15px rgba(0,0,0,0.08);
                        }
                
                        .header {
                            background: linear-gradient(
                                135deg,
                                %s,
                                %s
                            );
                            padding: 30px;
                            text-align: center;
                            color: white;
                        }
                
                        .header h1 {
                            margin: 0;
                            font-size: 25px;
                        }
                
                        .header p {
                            margin: 8px 0 0;
                            font-size: 14px;
                            opacity: 0.9;
                        }
                
                        .content {
                            padding: 30px;
                            color: #333333;
                        }
                
                        .status-icon {
                            text-align: center;
                            font-size: 45px;
                            margin-bottom: 10px;
                        }
                
                        .content h2 {
                            text-align: center;
                            color: #1f2937;
                            margin-bottom: 10px;
                        }
                
                        .content p {
                            font-size: 15px;
                            line-height: 1.6;
                        }
                
                        .details {
                            margin-top: 25px;
                            border: 1px solid #e5e7eb;
                            border-radius: 10px;
                            overflow: hidden;
                        }
                
                        .row {
                            display: flex;
                            align-items: center;
                            padding: 16px 20px;
                            border-bottom: 1px solid #e5e7eb;
                        }
                
                        .row:last-child {
                            border-bottom: none;
                        }
                
                        .label {
                            color: #6b7280;
                            font-weight: bold;
                            width: 50%%;
                        }
                
                        .value {
                            color: #111827;
                            font-weight: 600;
                            width: 50%%;
                            text-align: right;
                        }
                
                        .price {
                            color: #2563eb;
                            font-size: 17px;
                            font-weight: bold;
                        }
                
                        .status {
                            color: %s;
                            background-color: %s;
                            padding: 6px 14px;
                            border-radius: 20px;
                            font-size: 13px;
                            font-weight: bold;
                            display: inline-block;
                        }
                
                        .info-box {
                            margin-top: 25px;
                            padding: 15px;
                            background-color: #f8fafc;
                            border-left: 4px solid %s;
                            border-radius: 6px;
                            color: #374151;
                        }
                
                        .footer {
                            background-color: #f8fafc;
                            text-align: center;
                            padding: 20px;
                            color: #6b7280;
                            font-size: 12px;
                        }
                
                    </style>
                
                </head>
                
                <body>
                
                    <div class="container">
                
                        <div class="header">
                
                            <h1>Smart Procurement & Purchase Order Management System</h1>
                
                            <p>Order Tracking Notification</p>
                
                        </div>
                
                        <div class="content">
                
                            <div class="status-icon">
                                %s
                            </div>
                
                            <h2>%s</h2>
                
                            <p>
                                Hello <strong>%s</strong>,
                            </p>
                
                            <p>%s</p>
                
                            <div class="details">
                
                                <div class="row">
                                    <span class="label">Order ID</span>
                                    <span class="value">#%s</span>
                                </div>
                
                                <div class="row">
                                    <span class="label">Product</span>
                                    <span class="value">%s</span>
                                </div>
                
                                <div class="row">
                                    <span class="label">Amount</span>
                                    <span class="value price">₹ %.2f</span>
                                </div>
                
                                <div class="row">
                                    <span class="label">Status</span>
                
                                    <span class="value">
                                        <span class="status">%s</span>
                                    </span>
                                </div>
                
                                <div class="row">
                                    <span class="label">Updated At</span>
                                    <span class="value">%s</span>
                                </div>
                
                            </div>
                
                            <div class="info-box">
                                %s
                            </div>
                
                            <p style="margin-top: 25px;">
                                Thank you for using our
                                <strong>Smart Procurement & Purchase Order Management System</strong>.
                            </p>
                
                        </div>
                
                        <div class="footer">
                
                            © 2026 Smart Procurement & Purchase Order Management System
                            <br>
                            This is an automated notification.
                            Please do not reply.
                
                        </div>
                
                    </div>
                
                </body>
                
                </html>
                """.formatted(
                headerStart,       // 1
                headerEnd,         // 2
                statusColor,       // 3
                statusBackground,  // 4
                statusColor,       // 5
                icon,              // 6
                title,             // 7
                userName,          // 8
                message,           // 9
                orderId,           // 10
                productName,       // 11
                amount,            // 12
                status,            // 13
                updatedAt,         // 14
                message            // 15
        );
    }
}