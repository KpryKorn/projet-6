package oc.mdd.controller;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import oc.mdd.dto.PostDto;
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

    @GetMapping("/feed")
    @ResponseStatus(HttpStatus.OK)
    public List<PostDto> getFeedPosts(@AuthenticationPrincipal User currentUser,
            @PageableDefault(size = 20) Pageable pageable) {
        return postService.getFeedPosts(currentUser.getEmail(), pageable);
    }

    @GetMapping("/{postId}")
    @ResponseStatus(HttpStatus.OK)
    public PostDto getPostById(@PathVariable Long postId) {
        return postService.getPostById(postId);
    }
}
