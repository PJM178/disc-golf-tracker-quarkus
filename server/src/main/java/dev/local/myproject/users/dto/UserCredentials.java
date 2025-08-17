package dev.local.myproject.users.dto;

public class UserCredentials {
    public String username;
    public String password;

    public UserCredentials () {}

    public UserCredentials(String username, String password) {
        this.username = username;
        this.password = password;
    }

    @Override
    public String toString() {
        return "UserCredentials [username=" + username + ", password=" + password + "]";
    }
}
