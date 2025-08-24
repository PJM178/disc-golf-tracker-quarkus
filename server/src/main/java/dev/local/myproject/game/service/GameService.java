package dev.local.myproject.game.service;

import java.util.List;

import dev.local.myproject.course.entity.Course;
import dev.local.myproject.game.entity.Game;
import dev.local.myproject.game.repository.GameRepository;
import dev.local.myproject.users.entity.User;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class GameService {

    @Inject
    GameRepository gameRepository;

    @Transactional
    public Game startNewGame(Course course, List<User> players) {
        return new Game();
    }
}
