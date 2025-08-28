package dev.local.myproject.course.resource;

import java.util.Arrays;
import java.util.List;

import dev.local.myproject.course.dto.CourseCreateDto;
import dev.local.myproject.course.dto.CourseDto;
import dev.local.myproject.course.entity.Course;
import dev.local.myproject.course.service.CourseService;
import io.quarkus.logging.Log;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
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

    @GET
    @Path("/search")
    public Response searchCoursesByLocation(@QueryParam("location") String location,
            @QueryParam("coordinates") String coordinates) {
        int[] coords = Arrays.stream(coordinates.split(","))
                .mapToInt(Integer::parseInt)
                .toArray();

        Log.infof("This is the searched location: %s", location);
        Log.infof("This is the searched coordinates: %s", Arrays.toString(coords));

        List<Course> coursesInDb = this.courseService.findCoursesByLocationName(location);
        Log.info("courses" + coursesInDb);

        return Response
                .ok(coursesInDb.stream()
                        .map(c -> new CourseDto(c)))
                .build();
    }
}
