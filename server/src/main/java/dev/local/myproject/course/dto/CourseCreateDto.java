package dev.local.myproject.course.dto;

import dev.local.myproject.course.model.CourseType;

public class CourseCreateDto {

    public String name;
    public CourseType courseType;
    public int holes;

    public CourseCreateDto() {
    }

    public CourseCreateDto(String name, CourseType courseType, int holes) {
        this.name = name;
        this.courseType = courseType;
        this.holes = holes;
    }

    @Override
    public String toString() {
        return "CourseCreateDto [name=" + name +
                ", courseType=" + courseType +
                ", holes=" + this.holes +
                "]";
    }
}
