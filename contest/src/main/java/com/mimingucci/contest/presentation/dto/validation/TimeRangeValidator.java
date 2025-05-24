package com.mimingucci.contest.presentation.dto.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.lang.reflect.Field;
import java.time.Instant;

public class TimeRangeValidator implements ConstraintValidator<ValidTimeRange, Object> {

    private String startTimeFieldName;
    private String endTimeFieldName;
    private String message;

    @Override
    public void initialize(ValidTimeRange constraintAnnotation) {
        startTimeFieldName = constraintAnnotation.startTimeField();
        endTimeFieldName = constraintAnnotation.endTimeField();
        message = constraintAnnotation.message();
    }

    @Override
    public boolean isValid(Object value, ConstraintValidatorContext context) {
        try {
            Field startTimeField = value.getClass().getDeclaredField(startTimeFieldName);
            Field endTimeField = value.getClass().getDeclaredField(endTimeFieldName);

            startTimeField.setAccessible(true);
            endTimeField.setAccessible(true);

            Instant startTime = (Instant) startTimeField.get(value);
            Instant endTime = (Instant) endTimeField.get(value);

            // If either field is null, we'll consider it valid and let other validations handle it
            if (startTime == null || endTime == null) {
                return true;
            }

            // Check that start time is before or equal to end time
            boolean isValid = !startTime.isAfter(endTime);

            if (!isValid) {
                context.disableDefaultConstraintViolation();
                context.buildConstraintViolationWithTemplate(message)
                        .addPropertyNode("endTime")
                        .addConstraintViolation();
            }

            return isValid;

        } catch (NoSuchFieldException | IllegalAccessException e) {
            // If there's an issue accessing fields, log it and return false
            return false;
        }
    }
}
