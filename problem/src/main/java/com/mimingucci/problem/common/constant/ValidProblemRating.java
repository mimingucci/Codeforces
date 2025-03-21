package com.mimingucci.problem.common.constant;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ ElementType.FIELD, ElementType.PARAMETER })
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = ProblemRatingValidator.class)
public @interface ValidProblemRating {
    String message() default "Invalid problem rating. Rating must be between 500 and 3500 and increment by 100.";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}