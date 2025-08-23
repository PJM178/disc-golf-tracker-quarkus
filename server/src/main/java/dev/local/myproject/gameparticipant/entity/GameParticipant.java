package dev.local.myproject.gameparticipant.entity;

import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class GameParticipant {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    public UUID id;
}
