package dev.local.myproject;

import java.util.Map;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path("/hello")
public class GreetingResource {

    @GET
    @Path("/test")
    @Produces(MediaType.APPLICATION_JSON)
    public Map<String, String> hello() {
        return Map.of("message", "This is test hello");
    }
}
