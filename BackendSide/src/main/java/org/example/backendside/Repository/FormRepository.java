package org.example.backendside.Repository;

import org.example.backendside.Model.UserForms;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FormRepository extends JpaRepository<UserForms, Long> {
    Optional<UserForms> findByShareableLink(String shareableLink);
}