package com.procurement.repository;

import com.procurement.entity.AccountDetails;
import com.procurement.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AccountDetailsRepository
        extends JpaRepository<AccountDetails, Long> {

    Optional<AccountDetails> findByAdmin(Admin admin);

    boolean existsByAdmin(Admin admin);
}