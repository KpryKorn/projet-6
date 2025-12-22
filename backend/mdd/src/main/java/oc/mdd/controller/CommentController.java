package oc.mdd.controller;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import oc.mdd.dto.CommentRequestDto;
import oc.mdd.entity.User;
import oc.mdd.service.CommentService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/comments")
public class CommentController {

    private final CommentService commentService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void createComment(@AuthenticationPrincipal User currentUser,
            @RequestBody CommentRequestDto commentRequestDto) {
        commentService.createComment(currentUser.getEmail(), commentRequestDto);
    }
}
