package dev.local.myproject.course.repository;

import java.util.List;

import org.locationtech.jts.geom.Point;

import dev.local.myproject.course.entity.Course;
import dev.local.myproject.course.service.CourseService;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class CourseRepository implements PanacheRepository<Course> {

    // Full text seach and triagram similarity based on query using raw SQL - need
    // to suppress warnings here since type cannot be inferred. Need to make sure
    // that
    // pg_trgm extension is installed in PostgreSQL. fts_rank and sim_score could be
    // used
    // to order the results in future based on what is more desired
    @SuppressWarnings("unchecked")
    public List<Course> fullTextAndSimilarityCourseAddressSearch(String address) {
        return getEntityManager().createNativeQuery("""
                SELECT *,
                    ts_rank(search_vector, plainto_tsquery('simple', :term)) AS fts_rank,
                    GREATEST(
                        similarity(address, :term),
                        similarity(city, :term),
                        similarity(postal_code, :term)
                    ) AS sim_score,
                    ts_rank(search_vector, plainto_tsquery('simple', :term)) +
                    GREATEST(
                        similarity(address, :term),
                        similarity(city, :term),
                        similarity(postal_code, :term)
                    ) as combined_score
                FROM course
                WHERE search_vector @@ plainto_tsquery('simple', :term)
                    OR address % :term
                    OR city % :term
                    OR postal_code % :term
                ORDER BY combined_score DESC
                """, Course.class)
                .setParameter("term", address)
                .getResultList();
    }

    @SuppressWarnings("unchecked")
    public List<Object[]> searchNearby(Double latitude, Double longitude, int radius) {
        Point point = CourseService.pointFromLocation(latitude, longitude);

        return getEntityManager().createNativeQuery("""
                SELECT c.name, c.city, c.postal_code, c.address, ST_Distance(c.location, :point) as distance,
                    ST_Y(c.location::geometry) AS latitude, ST_X(c.location::geometry) AS longitude
                FROM course c
                WHERE ST_DWithin(c.location, :point, :radius)
                ORDER BY distance ASC
                """)
                .setParameter("point", point)
                .setParameter("radius", radius)
                .getResultList();
    }
}
