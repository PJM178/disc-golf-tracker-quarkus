package dev.local.myproject.users.dto;

public class UserLoggedInDto {
    public String username;
    public String firstName;

    public UserLoggedInDto(String username, String firstName) {
        this.username = username;
        this.firstName = firstName;
}
}
