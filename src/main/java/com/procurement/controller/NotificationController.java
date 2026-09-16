package com.procurement.controller;

import com.procurement.service.NotificationService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notification")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @PostMapping("/test")
    public String sendTestEmail(@RequestParam String email) {

        try {
            notificationService.sendTestEmail(email);
            return "Test email sent successfully";

        } catch (Exception e) {
            e.printStackTrace();
            return "EMAIL ERROR: " + e.getClass().getName()
                    + " - " + e.getMessage();
        }
    }

    @GetMapping("/hello")
    public String hello() {
        return "Notification API is working";

    }



    @PostMapping("/hello")
    public String postHello() {
        return "POST Notification API is working";
    }
}