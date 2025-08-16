package dev.local.myproject.users.service;

import java.util.Optional;

import dev.local.myproject.users.entity.User;
import dev.local.myproject.users.repository.UserRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

@ApplicationScoped
public class UserService {

    @Inject
    UserRepository userRepository;

    public Optional<User> findByUsername(String username) {
        return userRepository.find("username", username).firstResultOptional();
    }
}
