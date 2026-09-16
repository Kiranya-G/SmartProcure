package com.procurement.service;

import com.procurement.dto.PaymentRequestDTO;
import com.procurement.entity.*;
import com.procurement.repository.*;
import org.springframework.stereotype.Service;

import com.procurement.notification.EmailTemplate;

import java.util.List;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final ProductRepository productRepository;


    private final ShipmentService shipmentService;
    private final AdminRepository adminRepository;
    private final AccountDetailsRepository accountDetailsRepository;

    private final NotificationService notificationService;

    private final OrderService orderService;


    public PaymentService(
            PaymentRepository paymentRepository,
            ProductRepository productRepository,

            AdminRepository adminRepository,
            AccountDetailsRepository accountDetailsRepository,
            NotificationService notificationService,
            OrderService orderService,
            ShipmentService shipmentService) {

        this.paymentRepository = paymentRepository;
        this.productRepository = productRepository;

        this.adminRepository = adminRepository;
        this.accountDetailsRepository = accountDetailsRepository;
        this.notificationService = notificationService;
        this.orderService = orderService;
        this.shipmentService = shipmentService;

    }

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    public List<Payment> getPaymentsBySupplier(Long supplierId) {
        return paymentRepository.findBySupplier_SupId(supplierId);
    }
    public byte[] downloadPaymentsCsv() {

        StringBuilder csv = new StringBuilder();

        csv.append("Transaction ID,Product,Category,Supplier,Amount,Payment Date,Status\n");

        List<Payment> payments = paymentRepository.findAll();

        for (Payment payment : payments) {

            csv.append(payment.getTransactionId()).append(",");
            csv.append(payment.getProduct().getName()).append(",");
            csv.append(payment.getProduct().getCategory().getCatName()).append(",");
            csv.append(payment.getSupplier().getName()).append(",");
            csv.append(payment.getAmount()).append(",");
            csv.append(payment.getPaymentDate()).append(",");
            csv.append(payment.getPaymentStatus()).append("\n");
        }

        return csv.toString().getBytes(java.nio.charset.StandardCharsets.UTF_8);
    }

    public byte[] downloadPaymentsExcel() {

        try {
            org.apache.poi.xssf.usermodel.XSSFWorkbook workbook =
                    new org.apache.poi.xssf.usermodel.XSSFWorkbook();

            org.apache.poi.ss.usermodel.Sheet sheet =
                    workbook.createSheet("Payments");

            // Header
            org.apache.poi.ss.usermodel.Row header =
                    sheet.createRow(0);

            header.createCell(0).setCellValue("Transaction ID");
            header.createCell(1).setCellValue("Product");
            header.createCell(2).setCellValue("Category");
            header.createCell(3).setCellValue("Supplier");
            header.createCell(4).setCellValue("Amount");
            header.createCell(5).setCellValue("Payment Date");
            header.createCell(6).setCellValue("Status");

            List<Payment> payments = paymentRepository.findAll();

            int rowNum = 1;

            for (Payment payment : payments) {

                org.apache.poi.ss.usermodel.Row row =
                        sheet.createRow(rowNum++);

                row.createCell(0).setCellValue(
                        payment.getTransactionId());

                row.createCell(1).setCellValue(
                        payment.getProduct().getName());

                row.createCell(2).setCellValue(
                        payment.getProduct()
                                .getCategory()
                                .getCatName());

                row.createCell(3).setCellValue(
                        payment.getSupplier().getName());

                row.createCell(4).setCellValue(
                        payment.getAmount().doubleValue());

                row.createCell(5).setCellValue(
                        payment.getPaymentDate().toString());

                row.createCell(6).setCellValue(
                        payment.getPaymentStatus());
            }

            // Auto size columns
            for (int i = 0; i < 7; i++) {
                sheet.autoSizeColumn(i);
            }

            java.io.ByteArrayOutputStream outputStream =
                    new java.io.ByteArrayOutputStream();

            workbook.write(outputStream);
            workbook.close();

            return outputStream.toByteArray();

        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to generate Excel file", e);
        }
    }

    public Payment makePayment(PaymentRequestDTO request) {

        Admin admin = adminRepository.findById(request.getAdminId())
                .orElseThrow(() ->
                        new RuntimeException("Admin not found"));

        AccountDetails accountDetails =
                accountDetailsRepository.findByAdmin(admin)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Account details not found for this admin"));

        if (!accountDetails.getPin().equals(request.getPin())) {
            throw new RuntimeException(
                    "Wrong pin kindly enter the correct pin");
        }

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() ->
                        new RuntimeException("Product not found"));

        // Check whether supplier is assigned to this request
        if (product.getSupplier() == null) {
            throw new RuntimeException(
                    "Supplier is not assigned to this request");
        }

        Supplier supplier = product.getSupplier();

        // Check duplicate payment
        Payment existingPayment =
                paymentRepository.findByProduct_ProductId(
                        product.getProductId()
                ).orElse(null);

        if (existingPayment != null) {
            throw new RuntimeException(
                    "Payment already completed for this request"
            );
        }

        Payment payment = new Payment();

        payment.setProduct(product);
        payment.setSupplier(supplier);
        payment.setAdmin(admin);
        payment.setPaymentMethod(request.getPaymentMethod());

        payment.setAccountHolderName(
                accountDetails.getAccountHolderName()
        );

        payment.setAccountNumber(
                accountDetails.getAccountNumber()
        );

        payment.setIfscCode(
                accountDetails.getIfscCode()
        );

        payment.setAmount(product.getTotalPrice());

        String transactionId = "TXN-" +
                UUID.randomUUID()
                        .toString()
                        .substring(0, 8)
                        .toUpperCase();

        payment.setTransactionId(transactionId);

        payment.setPaymentStatus("SUCCESS");

        payment.setPaymentDate(LocalDateTime.now());

        Payment savedPayment =
                paymentRepository.save(payment);

        // Create Order after successful payment
        Order order =
                orderService.createOrderFromPayment(savedPayment);

        // Create Shipment after successful payment
        Shipment shipment =
                shipmentService.createShipment(
                        savedPayment.getPaymentId()
                );

        String subject =
                "Payment Successful - Enterprise Procurement System";

        String htmlContent =
                EmailTemplate.paymentSuccessfulNotification(
                        product.getUser().getName(),
                        savedPayment.getPaymentId(),
                        savedPayment.getTransactionId(),
                        product.getName(),
                        supplier.getName(),
                        savedPayment.getAmount(),
                        savedPayment.getPaymentDate().toString()
                );

        try {

            // Send email to user
            notificationService.sendNotification(
                    product.getUser().getEmail(),
                    subject,
                    htmlContent
            );

            // Send email to supplier
            notificationService.sendNotification(
                    supplier.getEmail(),
                    subject,
                    htmlContent
            );

            // Send email to admin
            notificationService.sendNotification(
                    admin.getEmail(),
                    subject,
                    htmlContent
            );

        } catch (Exception e) {

            System.out.println(
                    "Payment email notification failed: "
                            + e.getMessage()
            );
        }

        return savedPayment;
    }
}