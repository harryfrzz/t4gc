package org.example.backendside.Repository;

import org.example.backendside.Model.UserQuestions;

import org.springframework.data.jpa.repository.JpaRepository;

public interface QuestionRepository extends JpaRepository<UserQuestions, Long> {
}
