package dev.local.myproject.common;

import java.time.Instant;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;

@MappedSuperclass
public abstract class BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @CreationTimestamp
    @Column(updatable = false, nullable = false)
    public Instant createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    public Instant updatedAt;

    public Long createdBy;
    public Long updatedBy;
    public Instant deletedAt;
    public Long deletedBy;
}
