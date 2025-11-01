package org.example.backendside.Controller;

import org.example.backendside.Model.User;
import org.example.backendside.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {
    @Autowired
    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }


    @GetMapping
    public List<User> getAllUsers() {
        return  userRepository.findAll() ;
    }


    @PostMapping
    public User create(@RequestBody User user){
        return userRepository.save(user);
    }
}
