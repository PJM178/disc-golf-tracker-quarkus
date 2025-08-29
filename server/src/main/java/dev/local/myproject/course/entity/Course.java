package dev.local.myproject.course.entity;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.locationtech.jts.geom.Point;

import dev.local.myproject.common.BaseEntity;
import dev.local.myproject.course.model.CourseType;
import dev.local.myproject.hole.entity.Hole;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Index;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "course", indexes = {
        @Index(name = "idx_course_uuid", columnList = "uuid")
})
public class Course extends BaseEntity {

    @Column(nullable = false, unique = true)
    public UUID uuid = UUID.randomUUID();

    @Column(nullable = false, unique = true)
    public String name;

    @Column(nullable = false)
    public String city;

    @Column(nullable = false)
    public String address;

    @Column(nullable = false)
    public String postalCode;

    @Column(columnDefinition = "GEOGRAPHY(Point, 4326)")
    public Point location;

    @Column(length = 1000)
    public String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    public CourseType courseType;

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL)
    public List<Hole> holes = new ArrayList<>();

    public Course() {
    }

    public Course(String name, Point location) {
        this.name = name;
        this.location = location;
    }

    @Override
    public String toString() {
        return "Course [uuid=" + uuid + ", name=" + name + ", locationName=" + city + ", location=" + location
                + ", description=" + description + ", courseType=" + courseType + ", holes=" + holes + "]";
    }
}
