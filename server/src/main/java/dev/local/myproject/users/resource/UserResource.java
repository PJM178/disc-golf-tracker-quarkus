package dev.local.myproject.users.resource;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.hibernate.exception.ConstraintViolationException;

import dev.local.myproject.users.dto.UserAdminDto;
import dev.local.myproject.users.dto.UserCredentials;
import dev.local.myproject.users.dto.UserLoggedInDto;
import dev.local.myproject.users.dto.UserPublicDto;
import dev.local.myproject.users.dto.UserRegisterDto;
import dev.local.myproject.users.entity.User;
import dev.local.myproject.users.service.UserService;
import io.quarkus.logging.Log;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.CookieParam;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.HeaderParam;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.NewCookie;
import jakarta.ws.rs.core.Response;

@Path("/users")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class UserResource {

    @Inject
    UserService userService;

    @GET
    @Path("/{username}")
    public Response getUserByUsername(@PathParam("username") String username) {
        Log.info("Fetching user with username: " + username);

        Optional<User> user = userService.findByUsernameOptional(username);

        return user
                .map(u -> new UserAdminDto(user.get()))
                .map(dto -> Response.ok(dto).build())
                .orElse(Response.status(Response.Status.NOT_FOUND).build());
    }

    @GET
    @Path("/check/{username}")
    public Response checkIfUsernameIsTaken(@PathParam("username") String username) {
        Log.info("Checking username availability: " + username);

        Optional<User> user = userService.findByUsernameOptional(username);
        boolean available = user.isEmpty();

        return Response.ok(Map.of("available", available)).build();
    }

    // This is used in Next.js server component doing SSR so cookie cannot be send
    // with credentials
    @GET
    @Path("/me")
    public Response loginUserUsingCookie(@HeaderParam("Authorization") String token) {
        Log.info("This is the header: " + token);

        if (token == null) {
            return Response.status(Response.Status.UNAUTHORIZED).build();
        }

        // This should be JWT or something similar that is decoded for the username, id,
        // etc. and
        // authenticated
        String usernameFromToken = token.split(" ")[1];

        return Response.ok(new UserPublicDto(usernameFromToken)).build();
    }

    @GET
    @Path("/all")
    public List<UserPublicDto> getAllUsers() {
        List<UserPublicDto> users = userService.getAllUsers();

        return users;
    }

    @POST
    @Path("/login")
    public Response loginUser(UserCredentials userCredentials) {
        return userService.loginUser(userCredentials.username, userCredentials.password)
                .map(userDto -> {
                    Log.infof("User with username %s successfully logged in", userCredentials.username);

                    NewCookie cookie = new NewCookie.Builder("token")
                            .value(userDto.username)
                            .path("/")
                            .maxAge(3600)
                            .httpOnly(true)
                            .secure(false)
                            .build();

                    return Response.ok(userDto)
                            .cookie(cookie)
                            .build();
                })
                .orElseGet(() -> {
                    Log.infof("User with username %s failed to log in", userCredentials.username);

                    return Response.status(Response.Status.UNAUTHORIZED)
                            .entity(Map.of("message", "Invalid username or password"))
                            .build();
                });
    }

    // Add logout side effects here
    @POST
    @Path("/logout")
    public Response logoutUser(@CookieParam("token") String token) {
        Log.info("this is token: " + token);

        NewCookie cookie = new NewCookie.Builder("token")
                .value("")
                .path("/")
                .maxAge(0)
                .httpOnly(true)
                .secure(false)
                .build();

        return Response.ok()
                .cookie(cookie)
                .build();
    }

    @POST
    @Path("/register")
    public Response registerUser(UserRegisterDto dto) {
        try {
            UserLoggedInDto createdUser = userService.createUser(dto);

            return Response.status(Response.Status.CREATED)
                    .entity(createdUser)
                    .build();
        } catch (ConstraintViolationException e) {
            return Response.status(Response.Status.CONFLICT)
                    .entity(Map.of("message", "Resource conflict"))
                    .build();
        }
    }
}
