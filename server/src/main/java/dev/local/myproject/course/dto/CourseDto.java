package dev.local.myproject.course.dto;

import dev.local.myproject.course.entity.Course;

public class CourseDto {
    public String name;
    public String locationName;

    public CourseDto(Course course) {
        this.name = course.name;
        this.locationName = course.locationName;
    }
}
