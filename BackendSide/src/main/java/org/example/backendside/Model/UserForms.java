package org.example.backendside.Model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "forms")
public class UserForms {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String formName;
    private String formDescription;

    @Column(unique = true)
    private String shareableLink; // ⭐ ADD THIS FIELD

    @OneToMany(mappedBy = "userForms", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<UserQuestions> userQuestions;
}