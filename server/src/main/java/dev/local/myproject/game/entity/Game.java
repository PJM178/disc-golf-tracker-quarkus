package dev.local.myproject.game.entity;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;

import dev.local.myproject.common.BaseEntity;
import dev.local.myproject.course.entity.Course;
import dev.local.myproject.gameparticipant.entity.GameParticipant;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "game", indexes = {
        @Index(name = "idx_game_uuid", columnList = "uuid")
})
public class Game extends BaseEntity {

    @Column(nullable = false, unique = true)
    public UUID uuid = UUID.randomUUID();

    public String name;

    @CreationTimestamp
    public Instant startTime;

    public Instant endTime;

    @ManyToOne
    public Course course;

    @OneToMany(mappedBy = "game", cascade = CascadeType.ALL)
    public List<GameParticipant> participants = new ArrayList<>();

    public Game() {}

    public Game(Course course) {
        this.course = course;
    }

}
