package com.procurement.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    private final JavaMailSender mailSender;

    public NotificationService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendTestEmail(String to) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom("springboardprocurement26@gmail.com");
        message.setTo(to);
        message.setSubject("Test Notification - Enterprise Procurement System");

        message.setText(
                "Hello,\n\n" +
                        "This is a test notification from the Enterprise Procurement System.\n\n" +
                        "Email notification is working successfully!\n\n" +
                        "Thank you.\n" +
                        "Enterprise Procurement System Team"
        );

        mailSender.send(message);
    }

    // Reusable HTML notification method
    public void sendNotification(
            String to,
            String subject,
            String htmlContent
    ) throws MessagingException {

        MimeMessage message = mailSender.createMimeMessage();

        MimeMessageHelper helper =
                new MimeMessageHelper(message, true);

        helper.setFrom("springboardprocurement26@gmail.com");
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlContent, true);

        mailSender.send(message);
    }
}