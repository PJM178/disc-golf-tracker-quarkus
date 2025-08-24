package dev.local.myproject.hole.entity;

import dev.local.myproject.common.BaseEntity;
import dev.local.myproject.course.entity.Course;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;

@Entity
public class Hole extends BaseEntity {

    @ManyToOne
    public Course course;

    public String name;

    @Column(length = 1000)
    public String description;

    public int number;
    public int par;

    public Hole() {
    }

    public Hole(Course course, int number, int par) {
        this.course = course;
        this.number = number;
        this.par = par;
    }
}
