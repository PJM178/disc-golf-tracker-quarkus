package dev.local.myproject.course.dto;

import java.util.UUID;

import dev.local.myproject.course.entity.Course;

public class CourseDto {
    public UUID uuid;
    public String name;
    public String city;
    public String postalCode;
    public String address;

    public CourseDto(Course course) {
        this.uuid = course.uuid;
        this.name = course.name;
        this.city = course.city;
        this.postalCode = course.postalCode;
        this.address = course.address;
    }

    public CourseDto(UUID uuid, String name, String city, String postalCode, String address) {
        this.uuid = uuid;
        this.name = name;
        this.city = city;
        this.postalCode = postalCode;
        this.address = address;
    }
}
