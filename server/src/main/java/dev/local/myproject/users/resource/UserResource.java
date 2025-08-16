package dev.local.myproject.users.resource;

import java.util.Optional;

import dev.local.myproject.users.entity.User;
import dev.local.myproject.users.model.UserDto;
import dev.local.myproject.users.service.UserService;
import io.quarkus.logging.Log;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
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

        Optional<User> user = userService.findByUsername(username);

        return user
            .map(u -> new UserDto(u.username))
            .map(dto -> Response.ok(dto).build())
            .orElse(Response.status(Response.Status.NOT_FOUND).build());
    }
}
