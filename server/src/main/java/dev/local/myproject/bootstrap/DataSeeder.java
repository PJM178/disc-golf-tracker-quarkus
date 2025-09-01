package dev.local.myproject.bootstrap;

import java.util.Optional;

import dev.local.myproject.course.entity.Course;
import dev.local.myproject.course.model.CourseType;
import dev.local.myproject.course.repository.CourseRepository;
import dev.local.myproject.course.service.CourseService;
import dev.local.myproject.users.entity.User;
import dev.local.myproject.users.model.Role;
import dev.local.myproject.users.repository.UserRepository;
import io.quarkus.runtime.Startup;
import io.quarkus.runtime.StartupEvent;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

@Startup
@ApplicationScoped
public class DataSeeder {

    @Inject
    UserRepository userRepository;

    @Inject
    CourseService courseService;

    @Inject
    CourseRepository courseRepository;

    void onStartUp(@Observes StartupEvent ev) {
        this.seedUsers();
        this.seedCourses();
    }

    @Transactional
    void seedUsers() {
        Optional<User> existingUser = userRepository.find("username", "admin").firstResultOptional();

        if (existingUser.isEmpty()) {
            User admin = new User();
            admin.username = "admin";
            admin.role = Role.ADMIN;
            admin.password = "password";
            userRepository.persist(admin);
        }
    }

    void seedCourses() {
        Optional<Course> existingCourse = courseRepository.find("name", "Kaihun frisbeegolfpuisto").firstResultOptional();

        if (existingCourse.isEmpty()) {
            this.courseService.createCourse("Kaihun frisbeegolfpuisto", 61.666544, 27.279732, CourseType.OFFICIAL, "Mikkeli", "Saimaankatu 2", "50100");
            this.courseService.createCourse("Mikkelin frisbeegolfpuisto", 61.666544, 27.279732, CourseType.OFFICIAL, "Mikkeli", "Kalevankankaantie 3-5", "50120");
            this.courseService.createCourse("Rantakylän Frisbeegolfpuisto", 61.666544, 27.279732, CourseType.OFFICIAL, "Mikkeli", "Kunnanmäki 3", "50600");
            this.courseService.createCourse("Xamk - Mikkelin kampuksen frisbeegolfpuisto", 61.666544, 27.279732, CourseType.OFFICIAL, "Mikkeli", "Tarkk'ampujankuja", "50100");
        }
    }
}
