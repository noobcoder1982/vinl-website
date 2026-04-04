package com.yourpackage.repository;

import com.yourpackage.model.entity.SyncSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SyncSessionRepository extends JpaRepository<SyncSession, String> {
}
