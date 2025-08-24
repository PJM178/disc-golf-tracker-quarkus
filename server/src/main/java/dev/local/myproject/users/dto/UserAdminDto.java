package dev.local.myproject.users.dto;

import dev.local.myproject.users.entity.User;
import dev.local.myproject.users.model.Role;

public class UserAdminDto {
    public Long id;
    public String username;
    public String password;
    public String firstName;
    public String lastName;
    public Role role;

    public UserAdminDto(Long id, String username, String password) {
        this.id = id;
        this.username = username;
        this.password = password;
    }

    public UserAdminDto(User user) {
        this.id = user.id;
        this.username = user.username;
        this.password = user.password;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.role = user.role;
    }
}
