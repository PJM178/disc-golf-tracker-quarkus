package dev.local.myproject.course.resource;

import java.util.UUID;

import dev.local.myproject.course.dto.CourseSearchTextCursorDto;
import dev.local.myproject.course.dto.CoursesLocationCursorDto;
import dev.local.myproject.course.service.CourseService;
import io.quarkus.logging.Log;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.MediaType;

@RequestScoped
@Path("")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class CourseSearchResource {

    private static final String DEFAULT_SEARCH_RADIUS = "1000000";

    @Inject
    CourseService courseService;

    @GET
    @Path("/location")
    public Response searchByLocation(
            @QueryParam("lat") Double latitude,
            @QueryParam("lon") Double longitude,
            @QueryParam("radius") @DefaultValue(DEFAULT_SEARCH_RADIUS) int radius,
            @QueryParam("cursorDistance") Double cursorDistance,
            @QueryParam("cursorUuid") UUID cursorUuid,
            @QueryParam("limit") @DefaultValue("10") int limit) {
        CoursesLocationCursorDto results = courseService.findCoursesByCoordinates(latitude,
                longitude, radius,
                cursorDistance, cursorUuid, limit);

        Log.info("Courses found in DB using user coordinates: " + results);

        return Response
                .ok(results)
                .build();
    }

    @GET
    @Path("/text")
    public Response searchByText(
            @QueryParam("query") String query,
            @QueryParam("cursorUuid") UUID cursorUuid,
            @QueryParam("limit") int limit) {
        CourseSearchTextCursorDto results = courseService.findCoursesByAddress(query);

        Log.info("Courses found in DB using full text search and triagram similarity: " + results);

        return Response
                .ok(results)
                .build();
    }
}
