package oc.mdd.controller;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import oc.mdd.dto.CommentDto;
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
    public CommentDto createComment(@AuthenticationPrincipal User currentUser,
            @Valid @RequestBody CommentRequestDto request) {
        return commentService.createComment(currentUser.getId(), request);
    }

    @DeleteMapping("/{commentId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteComment(@AuthenticationPrincipal User currentUser, @PathVariable Long commentId) {
        commentService.deleteComment(currentUser.getId(), commentId);
    }
}
