package org.example.backendside.Repository;

import org.example.backendside.Model.UserResponses;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ResponseRepository extends JpaRepository<UserResponses, Long> {
    List<UserResponses> findByFormId(Long formId);
}
