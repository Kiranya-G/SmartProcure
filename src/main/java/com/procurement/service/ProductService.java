package com.procurement.service;

import com.procurement.dto.RaiseRequestDTO;
import com.procurement.entity.Category;
import com.procurement.entity.Department;
import com.procurement.entity.Product;
import com.procurement.entity.User;
import com.procurement.repository.CategoryRepository;
import com.procurement.repository.DepartmentRepository;
import com.procurement.repository.ProductRepository;
import com.procurement.repository.ShipmentRepository;
import com.procurement.repository.RatingRepository;
import com.procurement.repository.UserRepository;
import com.procurement.repository.OrderRepository;
import com.procurement.notification.EmailTemplate;

import com.procurement.entity.Admin;

import com.procurement.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

import com.procurement.entity.Supplier;
import com.procurement.repository.SupplierRepository;
@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ShipmentRepository shipmentRepository;

    @Autowired
    private RatingRepository ratingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private AdminRepository adminRepository;


    @Autowired
    private SupplierRepository supplierRepository;
    // =========================================================
    // RAISE PROCUREMENT REQUEST
    // =========================================================

    public Product raiseRequest(RaiseRequestDTO request) {

        // -----------------------------------------------------
        // 1. FIND USER
        // -----------------------------------------------------

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );


        // -----------------------------------------------------
        // 2. FIND CATEGORY
        // -----------------------------------------------------

        Category category = categoryRepository
                .findById(request.getCategoryId())
                .orElseThrow(() ->
                        new RuntimeException("Category not found")
                );


        // -----------------------------------------------------
        // 3. GET DEPARTMENT FROM CATEGORY
        // -----------------------------------------------------

        Department department = category.getDepartment();

        if (department == null) {

            throw new RuntimeException(
                    "Department not assigned to this category"
            );
        }


        Long departmentId = department.getDepId();


        System.out.println(
                "=========================================="
        );

        System.out.println(
                "PROCUREMENT REQUEST"
        );

        System.out.println(
                "Category     : " + category.getCatName()
        );

        System.out.println(
                "Category ID  : " + category.getCatId()
        );

        System.out.println(
                "Department   : " + department.getDepName()
        );

        System.out.println(
                "Department ID: " + departmentId
        );

        System.out.println(
                "User         : " + user.getName()
        );

        System.out.println(
                "User Email   : " + user.getEmail()
        );

        System.out.println(
                "=========================================="
        );


        // -----------------------------------------------------
        // 4. CREATE PRODUCT / PROCUREMENT REQUEST
        // -----------------------------------------------------

        Product product = new Product();


        product.setName(
                request.getName()
        );


        product.setUser(
                user
        );


        // Department comes automatically from Category

        product.setDepartment(
                department
        );


        product.setCategory(
                category
        );

        // -----------------------------------------------------
// AUTOMATIC SUPPLIER ASSIGNMENT
// Temporary: All requests go to Supplier ID 1
// -----------------------------------------------------

        Supplier supplier =
                supplierRepository.findById(11L)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Default supplier not found"
                                )
                        );

        product.setSupplier(supplier);

        product.setPricePerProduct(
                request.getPricePerProduct()
        );


        product.setNumberOfQuantities(
                request.getNumberOfQuantities()
        );


        product.setDescription(
                request.getDescription()
        );


        // -----------------------------------------------------
        // 5. CALCULATE TOTAL PRICE
        // -----------------------------------------------------

        double totalPrice =
                request.getPricePerProduct()
                        *
                        request.getNumberOfQuantities();


        product.setTotalPrice(
                totalPrice
        );


        // -----------------------------------------------------
        // 6. DEFAULT STATUS
        // -----------------------------------------------------

        product.setStatus(
                "PENDING_FOR_APPROVAL"
        );


        product.setCreatedDate(
                LocalDateTime.now()
        );


        product.setUpdateDate(
                LocalDateTime.now()
        );


        // -----------------------------------------------------
        // 7. SAVE REQUEST
        // -----------------------------------------------------

        Product savedProduct =
                productRepository.save(product);


        // =====================================================
        // 8. SEND EMAIL TO USER
        // =====================================================

        try {

            String userEmailContent =
                    EmailTemplate.requestSubmittedNotification(
                            user.getName(),
                            savedProduct.getProductId(),
                            savedProduct.getName(),
                            savedProduct.getTotalPrice()
                    );


            notificationService.sendNotification(
                    user.getEmail(),
                    "Procurement Request Submitted",
                    userEmailContent
            );


            System.out.println(
                    "USER EMAIL SENT SUCCESSFULLY"
            );

            System.out.println(
                    "User Email: " + user.getEmail()
            );


        } catch (Exception e) {

            System.out.println(
                    "========== USER EMAIL ERROR =========="
            );

            e.printStackTrace();

            System.out.println(
                    "======================================"
            );
        }


        // =====================================================
        // 9. FIND ADMIN BASED ON DEPARTMENT
        // =====================================================

        System.out.println(
                "Searching ADMIN for Department ID: "
                        + departmentId
        );


        User departmentAdmin =
                userRepository
                        .findByDepartment_DepIdAndDesignation(
                                departmentId,
                                "ADMIN"
                        )
                        .orElse(null);


        // =====================================================
        // 10. SEND EMAIL TO DEPARTMENT ADMIN
        // =====================================================

        if (departmentAdmin != null) {

            System.out.println(
                    "=========================================="
            );

            System.out.println(
                    "DEPARTMENT ADMIN FOUND"
            );

            System.out.println(
                    "Admin Name : "
                            + departmentAdmin.getName()
            );

            System.out.println(
                    "Admin Email: "
                            + departmentAdmin.getEmail()
            );

            System.out.println(
                    "Department : "
                            + department.getDepName()
            );

            System.out.println(
                    "=========================================="
            );




            try {

                String adminEmailContent =
                        EmailTemplate.adminRequestNotification(
                                departmentAdmin.getName(),
                                savedProduct.getProductId(),
                                savedProduct.getName(),
                                user.getName(),
                                user.getEmail(),
                                department.getDepName(),
                                savedProduct.getTotalPrice(),
                                savedProduct.getNumberOfQuantities(),
                                savedProduct.getDescription()
                        );


                notificationService.sendNotification(
                        departmentAdmin.getEmail(),
                        "New Procurement Request - "
                                + department.getDepName(),
                        adminEmailContent
                );


                System.out.println(
                        "ADMIN EMAIL SENT SUCCESSFULLY"
                );

                System.out.println(
                        "Admin Email: "
                                + departmentAdmin.getEmail()
                );


            } catch (Exception e) {

                System.out.println(
                        "========== ADMIN EMAIL ERROR =========="
                );

                e.printStackTrace();

                System.out.println(
                        "======================================="
                );
            }


        } else {

            // -------------------------------------------------
            // NO ADMIN FOUND
            // -------------------------------------------------

            System.out.println(
                    "=========================================="
            );

            System.out.println(
                    "NO ADMIN FOUND"
            );

            System.out.println(
                    "Department ID: "
                            + departmentId
            );

            System.out.println(
                    "Department Name: "
                            + department.getDepName()
            );

            System.out.println(
                    "Required Designation: ADMIN"
            );

            System.out.println(
                    "=========================================="
            );
        }


        // -----------------------------------------------------
        // 11. RETURN SAVED PRODUCT
        // -----------------------------------------------------

        return savedProduct;
    }


    // =========================================================
    // UPDATE REQUEST STATUS
    // APPROVED / REJECTED
    // =========================================================

    public Product updateStatus(
            Long productId,
            String status,
            Long adminId) {

        // -----------------------------------------------------
        // 1. FIND PRODUCT
        // -----------------------------------------------------

        Product product =
                productRepository.findById(productId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Product not found"
                                )
                        );

        // -----------------------------------------------------
        // 2. VALIDATE STATUS
        // -----------------------------------------------------

        if (!status.equals("APPROVED")
                &&
                !status.equals("REJECTED")) {

            throw new RuntimeException(
                    "Status must be APPROVED or REJECTED"
            );
        }

        // -----------------------------------------------------
        // 3. CHECK CURRENT STATUS
        // -----------------------------------------------------

        if (!"PENDING_FOR_APPROVAL".equals(
                product.getStatus()
        )) {

            throw new RuntimeException(
                    "Request is not pending for approval"
            );
        }

        // -----------------------------------------------------
        // 4. UPDATE STATUS
        // -----------------------------------------------------

        product.setStatus(status);

        product.setUpdateDate(
                LocalDateTime.now()
        );

        // -----------------------------------------------------
        // 5. SAVE
        // -----------------------------------------------------

        Product updatedProduct =
                productRepository.save(product);

        // -----------------------------------------------------
        // 6. SEND STATUS EMAIL TO USER
        // -----------------------------------------------------

        User user =
                product.getUser();

        String emailContent =
                EmailTemplate.statusUpdateNotification(
                        user.getName(),
                        product.getProductId(),
                        product.getName(),
                        product.getTotalPrice(),
                        status
                );

        try {

            notificationService.sendNotification(
                    user.getEmail(),
                    "Procurement Request - " + status,
                    emailContent
            );

            System.out.println(
                    "Status notification sent successfully to: "
                            + user.getEmail()
            );

        } catch (Exception e) {

            System.out.println(
                    "========== STATUS EMAIL ERROR =========="
            );

            e.printStackTrace();

            System.out.println(
                    "========================================"
            );
        }

        return updatedProduct;
    }

    // =========================================================
    // GET ALL PROCUREMENT REQUESTS
    // =========================================================

    public List<Product> getAllRequests() {

        return productRepository.findAll();

    }


    // =========================================================
    // DOWNLOAD CSV
    // =========================================================

    public byte[] downloadRequestsCsv() {

        StringBuilder csv =
                new StringBuilder();


        csv.append(
                "Request ID,User Name,User Email,Product,Category,"
                        + "Department,Price Per Product,Quantity,Total Price,"
                        + "Status,Description,Created Date,Updated Date\n"
        );


        List<Product> products =
                productRepository.findAll();


        for (Product product : products) {

            csv.append(
                    product.getProductId()
            ).append(",");

            csv.append(
                    product.getUser().getName()
            ).append(",");

            csv.append(
                    product.getUser().getEmail()
            ).append(",");

            csv.append(
                    product.getName()
            ).append(",");

            csv.append(
                    product.getCategory().getCatName()
            ).append(",");

            csv.append(
                    product.getDepartment().getDepName()
            ).append(",");

            csv.append(
                    product.getPricePerProduct()
            ).append(",");

            csv.append(
                    product.getNumberOfQuantities()
            ).append(",");

            csv.append(
                    product.getTotalPrice()
            ).append(",");

            csv.append(
                    product.getStatus()
            ).append(",");

            csv.append(
                    product.getDescription()
            ).append(",");

            csv.append(
                    product.getCreatedDate()
            ).append(",");

            csv.append(
                    product.getUpdateDate()
            ).append("\n");
        }


        return csv.toString()
                .getBytes(
                        java.nio.charset.StandardCharsets.UTF_8
                );
    }


    // =========================================================
    // DOWNLOAD EXCEL
    // =========================================================

    public byte[] downloadRequestsExcel() {

        try {

            org.apache.poi.xssf.usermodel.XSSFWorkbook workbook =
                    new org.apache.poi.xssf.usermodel.XSSFWorkbook();


            org.apache.poi.ss.usermodel.Sheet sheet =
                    workbook.createSheet(
                            "Procurement Requests"
                    );


            // -------------------------------------------------
            // HEADER
            // -------------------------------------------------

            org.apache.poi.ss.usermodel.Row header =
                    sheet.createRow(0);


            header.createCell(0)
                    .setCellValue("Req ID");

            header.createCell(1)
                    .setCellValue("User");

            header.createCell(2)
                    .setCellValue("Email");

            header.createCell(3)
                    .setCellValue("Product");

            header.createCell(4)
                    .setCellValue("Department");

            header.createCell(5)
                    .setCellValue("Quantity");

            header.createCell(6)
                    .setCellValue("Request Status");

            header.createCell(7)
                    .setCellValue("Delivery Status");

            header.createCell(8)
                    .setCellValue("Rating");

            header.createCell(9)
                    .setCellValue("Feedback");

            header.createCell(10)
                    .setCellValue("Created Date");


            // -------------------------------------------------
            // GET PRODUCTS
            // -------------------------------------------------

            List<Product> products =
                    productRepository.findAll();


            int rowNum = 1;


            for (Product product : products) {

                org.apache.poi.ss.usermodel.Row row =
                        sheet.createRow(rowNum++);


                row.createCell(0)
                        .setCellValue(
                                product.getProductId()
                        );


                row.createCell(1)
                        .setCellValue(
                                product.getUser().getName()
                        );


                row.createCell(2)
                        .setCellValue(
                                product.getUser().getEmail()
                        );


                row.createCell(3)
                        .setCellValue(
                                product.getName()
                        );


                row.createCell(4)
                        .setCellValue(
                                product.getDepartment().getDepName()
                        );


                row.createCell(5)
                        .setCellValue(
                                product.getNumberOfQuantities()
                        );


                row.createCell(6)
                        .setCellValue(
                                product.getStatus()
                        );


                // -------------------------------------------------
                // DELIVERY STATUS
                // -------------------------------------------------

                List<com.procurement.entity.Order> orders =
                        orderRepository.findAllByProduct_ProductId(
                                product.getProductId()
                        );

                if (!orders.isEmpty()) {

                    // Take the latest order
                    com.procurement.entity.Order order =
                            orders.get(orders.size() - 1);

                    row.createCell(7)
                            .setCellValue(
                                    order.getStatus() != null
                                            ? order.getStatus()
                                            : "Not Available"
                            );

                } else {

                    row.createCell(7)
                            .setCellValue(
                                    "Not Available"
                            );
                }


                // -------------------------------------------------
                // RATING AND FEEDBACK
                // -------------------------------------------------





                List<com.procurement.entity.Rating> ratings =
                        ratingRepository.findAllByProductId(
                                product.getProductId()
                        );

                if (!ratings.isEmpty()) {

                    // Take the latest rating
                    com.procurement.entity.Rating rating =
                            ratings.get(ratings.size() - 1);

                    row.createCell(8)
                            .setCellValue(
                                    rating.getRating() != null
                                            ? rating.getRating()
                                            : 0
                            );

                    row.createCell(9)
                            .setCellValue(
                                    rating.getDescription() != null
                                            ? rating.getDescription()
                                            : ""
                            );

                } else {

                    row.createCell(8)
                            .setCellValue("Not Rated");

                    row.createCell(9)
                            .setCellValue("No Feedback");
                }
                // -------------------------------------------------
                // CREATED DATE
                // -------------------------------------------------

                row.createCell(10)
                        .setCellValue(
                                product.getCreatedDate() != null
                                        ? product.getCreatedDate().toString()
                                        : ""
                        );
            }


            // -------------------------------------------------
            // AUTO SIZE
            // -------------------------------------------------

            for (int i = 0; i <= 10; i++) {

                sheet.autoSizeColumn(i);

            }


            // -------------------------------------------------
            // WRITE EXCEL
            // -------------------------------------------------

            java.io.ByteArrayOutputStream outputStream =
                    new java.io.ByteArrayOutputStream();


            workbook.write(
                    outputStream
            );


            workbook.close();


            return outputStream.toByteArray();


        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to generate Excel file",
                    e
            );
        }
    }
    // =========================================================
// ASSIGN SUPPLIER TO PROCUREMENT REQUEST
// =========================================================

    public Product assignSupplier(
            Long productId,
            Long supplierId) {

        // 1. Find procurement request
        Product product =
                productRepository.findById(productId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Product / Request not found"
                                )
                        );

        // 2. Find supplier
        Supplier supplier =
                supplierRepository.findById(supplierId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Supplier not found"
                                )
                        );

        // 3. Supplier assignment
        product.setSupplier(supplier);

        // 4. Update date
        product.setUpdateDate(
                LocalDateTime.now()
        );

        // 5. Save assignment
        return productRepository.save(product);
    }

    public List<Product> getRequestsBySupplier(Long supplierId) {

        return productRepository.findBySupplier_SupId(supplierId);

    }
}