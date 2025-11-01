package org.example.backendside.Model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Table(name = "users")
@Entity
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id;
    private String email;
    private String name;

    public User(){}
    public User(String email, String name) {
        this.name= name;
        this.email = email;

    }

}
