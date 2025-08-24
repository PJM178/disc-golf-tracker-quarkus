package dev.local.myproject.gameparticipant.entity;

import dev.local.myproject.common.BaseEntity;
import dev.local.myproject.game.entity.Game;
import dev.local.myproject.scorecard.entity.ScoreCard;
import dev.local.myproject.users.entity.User;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;

@Entity
public class GameParticipant extends BaseEntity {

    @ManyToOne
    public Game game;

    @ManyToOne
    public User user;

    @OneToOne(mappedBy = "participant", cascade = CascadeType.ALL)
    public ScoreCard scorecard;

    public GameParticipant() {}

    public GameParticipant(Game game, User user, ScoreCard scorecard) {
        this.game = game;
        this.user = user;
        this.scorecard = scorecard;
    }
}
