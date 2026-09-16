package com.procurement.service;

import com.procurement.entity.Payment;
import com.procurement.entity.Product;
import com.procurement.entity.Shipment;
import com.procurement.notification.EmailTemplate;
import com.procurement.repository.PaymentRepository;
import com.procurement.repository.ShipmentRepository;

import jakarta.mail.internet.MimeMessage;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class ShipmentService {

    private final ShipmentRepository shipmentRepository;
    private final PaymentRepository paymentRepository;
    private final JavaMailSender mailSender;

    public ShipmentService(
            ShipmentRepository shipmentRepository,
            PaymentRepository paymentRepository,
            JavaMailSender mailSender) {

        this.shipmentRepository = shipmentRepository;
        this.paymentRepository = paymentRepository;
        this.mailSender = mailSender;
    }

    public Shipment createShipment(Long paymentId) {

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() ->
                        new RuntimeException("Payment not found"));

        if (!"SUCCESS".equals(payment.getPaymentStatus())) {
            throw new RuntimeException(
                    "Shipment cannot be created because payment is not successful");
        }

        Product product = payment.getProduct();

        Shipment shipment = new Shipment();

        shipment.setPayment(payment);
        shipment.setProduct(product);

        String trackingNumber = "TRK-" +
                UUID.randomUUID()
                        .toString()
                        .substring(0, 8)
                        .toUpperCase();

        shipment.setTrackingNumber(trackingNumber);

        shipment.setShipmentStatus("PENDING_ACKNOWLEDGEMENT");

        shipment.setShipmentDate(LocalDateTime.now());

        Shipment savedShipment = shipmentRepository.save(shipment);

        // Send shipment email


        return savedShipment;
    }

    private void sendShipmentEmail(
            Payment payment,
            Product product,
            String status) {

        String userEmail = product.getUser().getEmail();
        String userName = product.getUser().getName();

        String supplierEmail = null;
        String supplierName = null;

        String adminEmail = null;
        String adminName = null;

        if (payment.getSupplier() != null) {
            supplierEmail = payment.getSupplier().getEmail();
            supplierName = payment.getSupplier().getName();
        }

        if (payment.getAdmin() != null) {
            adminEmail = payment.getAdmin().getEmail();
            adminName = payment.getAdmin().getName();
        }

        try {

            // ================= USER EMAIL =================

            String userEmailBody =
                    EmailTemplate.shipmentStatusNotification(
                            userName,
                            product.getProductId(),
                            product.getName(),
                            payment.getAmount(),
                            status
                    );

            sendEmail(
                    userEmail,
                    "Shipment Update - " + status,
                    userEmailBody
            );


            // ================= SUPPLIER EMAIL =================

            if (supplierEmail != null) {

                String supplierEmailBody =
                        EmailTemplate.shipmentStatusNotification(
                                supplierName,
                                product.getProductId(),
                                product.getName(),
                                payment.getAmount(),
                                status
                        );

                sendEmail(
                        supplierEmail,
                        "Shipment Update - " + status,
                        supplierEmailBody
                );
            }


            // ================= ADMIN EMAIL =================

            if (adminEmail != null) {

                String adminEmailBody =
                        EmailTemplate.shipmentStatusNotification(
                                adminName,
                                product.getProductId(),
                                product.getName(),
                                payment.getAmount(),
                                status
                        );

                sendEmail(
                        adminEmail,
                        "Shipment Update - " + status,
                        adminEmailBody
                );
            }

        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to send shipment email",
                    e
            );
        }
    }

    private void sendEmail(
            String toEmail,
            String subject,
            String emailBody) {

        if (toEmail == null || toEmail.isBlank()) {
            return;
        }

        try {

            MimeMessage message =
                    mailSender.createMimeMessage();

            MimeMessageHelper helper =
                    new MimeMessageHelper(
                            message,
                            true,
                            "UTF-8"
                    );

            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(emailBody, true);

            mailSender.send(message);

            System.out.println(
                    "EMAIL SENT SUCCESSFULLY TO: " + toEmail
            );

        } catch (Exception e) {

            // Email failure should not stop shipment status update
            System.err.println(
                    "EMAIL FAILED TO: " + toEmail
            );

            System.err.println(
                    "EMAIL ERROR: " + e.getMessage()
            );
        }
    }
    public Shipment updateShipmentStatus(Long shipmentId, String status) {

        Shipment shipment = shipmentRepository.findById(shipmentId)
                .orElseThrow(() ->
                        new RuntimeException("Shipment not found"));

        String newStatus = status.toUpperCase();

        String currentStatus = shipment.getShipmentStatus();

        boolean validTransition =
                (currentStatus.equals("PENDING_ACKNOWLEDGEMENT")
                        && newStatus.equals("ACKNOWLEDGED"))
                        || (currentStatus.equals("ACKNOWLEDGED")
                        && newStatus.equals("PACKED"))
                        || (currentStatus.equals("PACKED")
                        && newStatus.equals("SHIPPED"))
                        || (currentStatus.equals("SHIPPED")
                        && newStatus.equals("DELIVERED"));

        if (!validTransition) {

            throw new RuntimeException(
                    "Invalid status transition from "
                            + currentStatus
                            + " to "
                            + newStatus
            );
        }

        Payment payment = shipment.getPayment();
        Product product = shipment.getProduct();

        // Update shipment status first
        shipment.setShipmentStatus(newStatus);

        if (newStatus.equals("DELIVERED")) {
            shipment.setDeliveryDate(LocalDateTime.now());
        }

        // Save status to database
        Shipment savedShipment =
                shipmentRepository.save(shipment);

        // Send email after database update
        // Email failure will NOT affect shipment status
        sendShipmentEmail(payment, product, newStatus);

        return savedShipment;
    }

    public List<Shipment> getShipmentsBySupplier(Long supplierId) {

        return shipmentRepository
                .findByPayment_Supplier_SupId(supplierId);
    }

    public List<Shipment> getShipmentsBySupplierEmail(String email) {

        return shipmentRepository
                .findByPayment_Supplier_Email(email);
    }

    public List<Shipment> getShipmentsByUser(Long userId) {

        return shipmentRepository
                .findByProduct_User_UserId(userId);
    }
}