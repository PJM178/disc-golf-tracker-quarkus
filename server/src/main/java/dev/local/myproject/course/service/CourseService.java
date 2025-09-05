package dev.local.myproject.course.service;

import java.util.List;
import java.util.UUID;

import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;

import dev.local.myproject.course.dto.CourseCreateDto;
import dev.local.myproject.course.dto.CourseLocationDto;
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

    // Create a new course - general course for now, think about what to include
    // from the front
    // and create new method for admin creating courses
    @Transactional
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

    public List<CourseLocationDto> findCoursesByAddress(String searchTerm) {
        // Require searchTerm to be more than 2 characters long since results using
        // full text search can be huge if, e.g., only street numbers are provided and
        // it matches
        if (searchTerm == null || searchTerm.length() < 3) {
            return List.of();
        }

        return courseRepository.fullTextAndSimilarityCourseAddressSearch(searchTerm)
                .stream()
                .map(course -> new CourseLocationDto(course))
                .toList();
    }

    public List<CourseLocationDto> findCoursesByCoordinates(Double latitude, Double longitude, int radius) {
        return courseRepository.searchNearby(latitude, longitude, radius)
                .stream()
                .map(row -> {
                    String name = String.valueOf(row[0]);
                    String city = String.valueOf(row[1]);
                    String postalCode = String.valueOf(row[2]);
                    String address = String.valueOf(row[3]);
                    double distanceToUserCoordinates = (double) row[4];
                    double lat = (double) row[5];
                    double lon = (double) row[6];
                    UUID uuid = (UUID) row[7];

                    return new CourseLocationDto(uuid, name, city, postalCode, address, distanceToUserCoordinates, lat, lon);
                })
                .toList();
    }
}
