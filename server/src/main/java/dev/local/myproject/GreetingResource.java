package dev.local.myproject;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path("/hello")
public class GreetingResource {

    public static class TestMessage {
        public String message;

        public TestMessage(String message) {
            this.message = message;
        }
    }

    @GET
    @Path("/test")
    @Produces(MediaType.APPLICATION_JSON)
    public TestMessage hello() {
        return new TestMessage("This is test hello");
    }
}
