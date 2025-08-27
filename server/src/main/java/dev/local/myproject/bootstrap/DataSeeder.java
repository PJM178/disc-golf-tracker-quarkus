package dev.local.myproject.bootstrap;

import java.util.Optional;

import dev.local.myproject.users.entity.User;
import dev.local.myproject.users.model.Role;
import dev.local.myproject.users.repository.UserRepository;
import io.quarkus.runtime.Startup;
import io.quarkus.runtime.StartupEvent;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

@Startup
@ApplicationScoped
public class DataSeeder {

    @Inject
    UserRepository userRepository;

    @Transactional
    void onStartUp(@Observes StartupEvent ev) {
        Optional<User> existing = userRepository.find("username", "admin").firstResultOptional();

        if (existing.isEmpty()) {
            User admin = new User();
            admin.username = "admin";
            admin.role = Role.ADMIN;
            admin.password = "password";
            userRepository.persist(admin);
        }
    }
}
