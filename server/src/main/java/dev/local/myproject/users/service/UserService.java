package dev.local.myproject.users.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.hibernate.exception.ConstraintViolationException;

import dev.local.myproject.users.dto.UserLoggedInDto;
import dev.local.myproject.users.dto.UserPublicDto;
import dev.local.myproject.users.dto.UserRegisterDto;
import dev.local.myproject.users.entity.User;
import dev.local.myproject.users.model.Role;
import dev.local.myproject.users.repository.UserRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.PersistenceException;
import jakarta.transaction.Transactional;

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

    public Optional<UserLoggedInDto> loginUser(String username, String password) {
        return this.findByUsernameOptional(username)
            .filter(user -> user.password.equals(password))
            .map(user -> new UserLoggedInDto(username, user.firstName));
    }

    @Transactional
    public UserLoggedInDto createUser(UserRegisterDto dto) {
        try {
            User user = new User();
            user.username = dto.username;
            user.password = dto.password;
            user.firstName = dto.firstName;
            user.lastName = dto.lastName;
            user.role = Role.USER;

            userRepository.persist(user);

            return new UserLoggedInDto(dto.username, dto.firstName);
        } catch (PersistenceException e) {
            Throwable cause = e.getCause();

            if (cause instanceof org.hibernate.exception.ConstraintViolationException) {
                throw new ConstraintViolationException(null, null, null);
            }

            throw e;
        }

    }
}
