package dev.local.myproject.users.dto;

public class UserAdminDto {
    public Long id;
    public String username;
    public String password;

    public UserAdminDto(Long id, String username, String password) {
        this.id = id;
        this.username = username;
        this.password = password;
    }
}
