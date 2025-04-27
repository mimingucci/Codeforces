package com.mimingucci.user.infrastructure.repository.specification;

import com.mimingucci.user.infrastructure.repository.entity.UserEntity;
import com.mimingucci.user.presentation.dto.request.UserParam;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

public class UserSpecification {
    public static Specification<UserEntity> withParams(UserParam param) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Add rating filter
            if (param.getRating() != null) {
                predicates.add(criteriaBuilder.equal(root.get("rating"), param.getRating()));
            }

            // Add username filter
            if (StringUtils.hasText(param.getUsername())) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("username")),
                        "%" + param.getUsername().toLowerCase() + "%"
                ));
            }

            // Add sorting
            if (StringUtils.hasText(param.getRatingDir())) {
                if ("ASC".equalsIgnoreCase(param.getRatingDir())) {
                    query.orderBy(criteriaBuilder.asc(root.get("rating")));
                } else {
                    query.orderBy(criteriaBuilder.desc(root.get("rating")));
                }
            }

            if (StringUtils.hasText(param.getContributeDir())) {
                if ("ASC".equalsIgnoreCase(param.getContributeDir())) {
                    query.orderBy(criteriaBuilder.asc(root.get("contribute")));
                } else {
                    query.orderBy(criteriaBuilder.desc(root.get("contribute")));
                }
            }

            if (StringUtils.hasText(param.getUsernameDir())) {
                if ("ASC".equalsIgnoreCase(param.getUsernameDir())) {
                    query.orderBy(criteriaBuilder.asc(root.get("username")));
                } else {
                    query.orderBy(criteriaBuilder.desc(root.get("username")));
                }
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
