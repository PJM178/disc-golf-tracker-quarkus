package dev.local.myproject.game.resource;

import java.util.List;

import dev.local.myproject.game.entity.Game;
import dev.local.myproject.game.service.GameService;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path("/games")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class GameResource {

    @Inject
    GameService gameService;

    @POST
    @Path("/start/{courseId}")
    public Game startGame(@PathParam("courseId") Long courseId, List<Long> userIds) {
        return new Game();
    }
}
