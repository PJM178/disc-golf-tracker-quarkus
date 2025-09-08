package dev.local.myproject.course.dto;

import java.util.UUID;

import dev.local.myproject.course.entity.Course;

public class CourseLocationDto {

    public UUID uuid;
    public String name;
    public String city;
    public String postalCode;
    public String address;
    public double distanceToUserCoordinates;
    public double lat;
    public double lon;

    public CourseLocationDto(UUID uuid, String name, String city, String postalCode, String address,
            double distanceToUserCoordinates, double latitude, double longitude) {
        this.uuid = uuid;
        this.name = name;
        this.city = city;
        this.postalCode = postalCode;
        this.address = address;
        this.distanceToUserCoordinates = distanceToUserCoordinates;
        this.lat = latitude;
        this.lon = longitude;
    }

    public CourseLocationDto(Course course, Double latitude, Double longitude) {
        this.name = course.name;
        this.city = course.city;
        this.postalCode = course.postalCode;
        this.address = course.address;
        this.lat = latitude;
        this.lon = longitude;
    }

    public CourseLocationDto(Course course) {
        this.uuid = course.uuid;
        this.name = course.name;
        this.city = course.city;
        this.postalCode = course.postalCode;
        this.address = course.address;
    }

    @Override
    public String toString() {
        return "CourseLocationDto [name=" + name + ", city=" + city + ", postalCode=" + postalCode + ", address="
                + address + ", distanceToUserCoordinates=" + distanceToUserCoordinates + ", lat=" + lat + ", lon=" + lon
                + "]";
    }
}
