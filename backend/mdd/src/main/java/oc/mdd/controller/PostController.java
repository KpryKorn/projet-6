package oc.mdd.controller;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import oc.mdd.dto.PostRequestDto;
import oc.mdd.entity.User;
import oc.mdd.service.PostService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/posts")
public class PostController {

    private final PostService postService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void createPost(@AuthenticationPrincipal User currentUser, @RequestBody PostRequestDto postRequestDto) {
        postService.createPost(currentUser.getEmail(), postRequestDto);
    }
}
