package dev.local.myproject.course.repository;

import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;

import dev.local.myproject.course.entity.Course;
import dev.local.myproject.course.model.CourseType;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class CourseRepository implements PanacheRepository<Course> {

    // Factory to generate Points from coordinates
    private static final GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);

    // Helper method to create a Point from coordinates
    public static Point pointFromLocation(double lat, double lon) {
        Point point = geometryFactory.createPoint(new Coordinate(lon, lat));
        point.setSRID(4326);

        return point;
    }

    public Course createCourse(String name, double lat, double lon, CourseType courseType,
            String locationName) {
        Point location = pointFromLocation(lat, lon);
        Course course = new Course();
        course.location = location;
        course.name = name;
        course.courseType = courseType;
        course.locationName = locationName;

        persist(course);

        return course;
    }
}
