package dev.local.myproject.users.entity;

import dev.local.myproject.users.model.Role;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @Column(nullable = false, unique = true)
    public String username;

    @Column(nullable = false)
    public String password;

    public String firstName;
    public String lastName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    public Role role;

    public User() {
    }

    public User(String username, String password, String firstName, String lastName, Role role) {
        this.username = username;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
    }

    @Override
    public String toString() {
        return "User [id=" + id
                + ", username=" + username
                + ", password=" + password
                + ", firstName=" + firstName
                + ", lastName=" + lastName
                + ", role=" + role
                + "]";
    }
}
