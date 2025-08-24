package dev.local.myproject.score.entity;

import dev.local.myproject.common.BaseEntity;
import dev.local.myproject.hole.entity.Hole;
import dev.local.myproject.scorecard.entity.ScoreCard;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;

@Entity
public class Score extends BaseEntity {

    @ManyToOne
    public ScoreCard scoreCard;

    @ManyToOne
    public Hole hole;

    public int strokes;

    public Score () {}

    public Score(ScoreCard scoreCard, Hole hole, int strokes) {
        this.scoreCard = scoreCard;
        this.hole = hole;
        this.strokes = strokes;
    }
}
