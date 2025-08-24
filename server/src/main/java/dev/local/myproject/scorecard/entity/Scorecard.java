package dev.local.myproject.scorecard.entity;

import java.util.ArrayList;
import java.util.List;

import dev.local.myproject.common.BaseEntity;
import dev.local.myproject.gameparticipant.entity.GameParticipant;
import dev.local.myproject.score.entity.Score;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;

@Entity
public class ScoreCard extends BaseEntity {

    @OneToOne
    public GameParticipant participant;

    @OneToMany(mappedBy = "scoreCard", cascade = CascadeType.ALL)
    public List<Score> scores = new ArrayList<>();

    public ScoreCard() {}

    public ScoreCard(GameParticipant participant) {
        this.participant = participant;
    }
}
