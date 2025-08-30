package dev.local.myproject.course.repository;

import java.util.List;

import dev.local.myproject.course.entity.Course;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class CourseRepository implements PanacheRepository<Course> {

    // Full text seach based on query using raw SQL - need to suppress warnings here
    // since type cannot
    // be inferred
    @SuppressWarnings("unchecked")
    public List<Course> fullTextCourseAddressSearch(String address) {
        return getEntityManager().createNativeQuery("""
                  SELECT *, ts_rank(search_vector, plainto_tsquery('simple', :term)) AS rank
                    FROM course
                    WHERE search_vector @@ plainto_tsquery('simple', :term)
                    ORDER BY rank DESC
                """, Course.class)
                .setParameter("term", address)
                .getResultList();
    }
}
    