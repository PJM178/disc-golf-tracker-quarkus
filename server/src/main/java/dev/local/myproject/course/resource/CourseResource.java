package dev.local.myproject.course.resource;

import dev.local.myproject.course.dto.CourseCreateDto;
import dev.local.myproject.course.service.CourseService;
import io.quarkus.logging.Log;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/courses")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class CourseResource {

    @Inject
    CourseService courseService;

    @POST
    @Path("/new")
    public Response createNewCourse(CourseCreateDto course) {
        CourseCreateDto dto = this.courseService.createNewCourse(course);
        Log.info(dto);

        return Response.ok().build();
    }
}
