package com.mimingucci.blog.infrastructure.repository.jpa;

import com.mimingucci.blog.infrastructure.repository.entity.BlogEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BlogJpaRepository extends JpaRepository<BlogEntity, Long> {

}
