package com.yourpackage.repository;

import com.yourpackage.model.entity.SessionMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SessionMemberRepository extends JpaRepository<SessionMember, Long> {
}
