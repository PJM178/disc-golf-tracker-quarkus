package dev.local.myproject.users.dto;

public class UserRegisterDto {
    public String username;
    public String password;
    public String firstName;
    public String lastName;

    @Override
    public String toString() {
        return "UserRegisterDto [username=" + username + ", password=" + password + ", firstName=" + firstName
                + ", lastName=" + lastName + "]";
    }
}
