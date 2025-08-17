package dev.local.myproject.users.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import dev.local.myproject.users.dto.UserPublicDto;
import dev.local.myproject.users.entity.User;
import dev.local.myproject.users.repository.UserRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

@ApplicationScoped
public class UserService {

    @Inject
    UserRepository userRepository;

    public Optional<User> findByUsernameOptional(String username) {
        return userRepository.find("username", username).firstResultOptional();
    }

    public List<UserPublicDto> getAllUsers() {
        return userRepository.listAll()
                .stream()
                .map(u -> new UserPublicDto(u.username))
                .collect(Collectors.toList());
    }
}
