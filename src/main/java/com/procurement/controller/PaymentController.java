package com.procurement.controller;

import com.procurement.dto.PaymentRequestDTO;
import com.procurement.entity.Payment;
import com.procurement.service.PaymentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.util.List;
@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/submit")
    public ResponseEntity<Payment> makePayment(
            @RequestBody PaymentRequestDTO request) {

        Payment payment = paymentService.makePayment(request);

        return new ResponseEntity<>(payment, HttpStatus.CREATED);
    }
    @GetMapping
    public ResponseEntity<List<Payment>> getAllPayments() {

        List<Payment> payments = paymentService.getAllPayments();

        return ResponseEntity.ok(payments);
    }

    @GetMapping("/supplier/{supplierId}")
    public ResponseEntity<List<Payment>> getPaymentsBySupplier(
            @PathVariable Long supplierId) {

        return ResponseEntity.ok(
                paymentService.getPaymentsBySupplier(supplierId)
        );
    }

    @GetMapping("/download")
    public ResponseEntity<byte[]> downloadPaymentsCsv() {

        byte[] csvBytes = paymentService.downloadPaymentsCsv();

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=payments.csv"
                )
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csvBytes);
    }


    @GetMapping("/download-excel")
    public ResponseEntity<byte[]> downloadPaymentsExcel() {

        byte[] excelBytes = paymentService.downloadPaymentsExcel();

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=payments.xlsx"
                )
                .contentType(
                        MediaType.parseMediaType(
                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        )
                )
                .body(excelBytes);
    }
}