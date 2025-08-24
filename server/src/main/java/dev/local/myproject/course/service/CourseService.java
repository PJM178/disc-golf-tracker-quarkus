package dev.local.myproject.course.service;

import dev.local.myproject.course.dto.CourseCreateDto;
import dev.local.myproject.course.entity.Course;
import dev.local.myproject.course.repository.CourseRepository;
import io.quarkus.logging.Log;
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
}
