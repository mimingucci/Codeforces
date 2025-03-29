package com.mimingucci.contest.presentation.api.impl;

import com.mimingucci.contest.application.ContestApplicationService;
import com.mimingucci.contest.common.constant.PathConstants;
import com.mimingucci.contest.presentation.api.ContestController;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = PathConstants.API_V1_CONTEST)
public class ContestControllerImpl implements ContestController {
    private final ContestApplicationService service;


}
