package dev.local.myproject.course.service;

import java.util.List;

import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;

import dev.local.myproject.course.dto.CourseCreateDto;
import dev.local.myproject.course.entity.Course;
import dev.local.myproject.course.model.CourseType;
import dev.local.myproject.course.repository.CourseRepository;
import io.quarkus.logging.Log;
import io.quarkus.panache.common.Parameters;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class CourseService {

    @Inject
    CourseRepository courseRepository;

    @Transactional
    public CourseCreateDto createNewCourse(CourseCreateDto dto) {
        Course course = new Course();
        Log.info(course.createdAt);

        return new CourseCreateDto();
    }

    
    // Factory to generate Points from coordinates
    private static final GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);
    
    // Helper method to create a Point from coordinates
    public static Point pointFromLocation(double lat, double lon) {
        Point point = geometryFactory.createPoint(new Coordinate(lon, lat));

        return point;
    }

    // Create a new course - general course for now, think about what to include from the front
    // and create new method for admin creating courses
    public Course createCourse(String name, double lat, double lon, CourseType courseType,
            String city, String address, String postalCode) {
        Point location = pointFromLocation(lat, lon);
        Course course = new Course();
        course.location = location;
        course.name = name;
        course.courseType = courseType;
        course.city = city;
        course.address = address;
        course.postalCode = postalCode;

        courseRepository.persist(course);

        return course;
    }

    public List<Course> findCoursesByLocationName(String locationName) {
        Log.info("Searching for location: " + locationName);

        List<Course> courses = courseRepository.list(
            "LOWER(city) LIKE :location",
            Parameters.with("location", "%" + locationName.toLowerCase() + "%"));

        return courses;
    }

    public List<Course> findCoursesByAddressFullTextSearch(String searchTerm) {
        // Require searchTerm to be more than 2 characters long since results using
        // full text search can be huge if, e.g., only street numbers are provided and it matches
        if (searchTerm == null || searchTerm.length() < 3) {
            return List.of();
        }

        return courseRepository.fullTextCourseAddressSearch(searchTerm);
    }
}
