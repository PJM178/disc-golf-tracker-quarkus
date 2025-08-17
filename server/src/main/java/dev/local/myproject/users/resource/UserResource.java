package dev.local.myproject.users.resource;

import java.util.List;
import java.util.Optional;

import dev.local.myproject.users.dto.UserAdminDto;
import dev.local.myproject.users.dto.UserCredentials;
import dev.local.myproject.users.dto.UserLoggedInDto;
import dev.local.myproject.users.dto.UserPublicDto;
import dev.local.myproject.users.entity.User;
import dev.local.myproject.users.service.UserService;
import io.quarkus.logging.Log;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
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
    @Path("/all")
    public List<UserPublicDto> getAllUsers() {
        List<UserPublicDto> users = userService.getAllUsers();

        return users;
    }

    @POST
    @Path("/login")
    public Response loginUser(UserCredentials userCredentials) {
        Log.infof("User with username %s trying to login", userCredentials.username);

        Optional<User> user = userService.findByUsernameOptional(userCredentials.username);

        if (user.isPresent()) {
            User userInDb = user.get();

            if (userInDb.password.equals(userCredentials.password)) {
                Log.infof("User with username %s successfully logged in", userCredentials.username);

                return Response
                        .ok(new UserLoggedInDto(userCredentials.username, userInDb.firstName))
                        .build();
            } else {
                Log.infof("User with username %s supplied invalid password", userCredentials.username);

                return Response.status(Response.Status.UNAUTHORIZED).build();
            }
        } else {
            Log.infof("User with username %s not found in db", userCredentials.username);

            return Response.status(Response.Status.UNAUTHORIZED).build();
        }
    }
}
