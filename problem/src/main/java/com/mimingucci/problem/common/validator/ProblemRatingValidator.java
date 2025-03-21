package com.mimingucci.problem.common.validator;

import com.mimingucci.problem.common.constant.ValidProblemRating;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class ProblemRatingValidator implements ConstraintValidator<ValidProblemRating, Integer> {

    private static final int MIN_RATING = 500;
    private static final int MAX_RATING = 3500;
    private static final int INCREMENT = 100;

    @Override
    public boolean isValid(Integer rating, ConstraintValidatorContext context) {
        if (rating == null) {
            return true; // Rating can be null
        }

        // Check if the rating is within the valid range
        if (rating < MIN_RATING || rating > MAX_RATING) {
            return false;
        }

        // Check if the rating increments by 100
        return (rating - MIN_RATING) % INCREMENT == 0;
    }
}
