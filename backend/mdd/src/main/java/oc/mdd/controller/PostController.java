package oc.mdd.controller;

import java.util.List;
import java.util.Locale;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import oc.mdd.dto.CommentDto;
import oc.mdd.dto.EngagementDto;
import oc.mdd.dto.PageResponse;
import oc.mdd.dto.PostDto;
import oc.mdd.dto.PostRequestDto;
import oc.mdd.entity.User;
import oc.mdd.service.CommentService;
import oc.mdd.service.PostService;
import oc.mdd.service.PostService.PostFilter;
import oc.mdd.service.PostService.Scope;

@RestController
@RequiredArgsConstructor
@RequestMapping("/posts")
public class PostController {

    private final PostService postService;
    private final CommentService commentService;

    @GetMapping
    public PageResponse<PostDto> listPosts(
            @AuthenticationPrincipal User currentUser,
            @RequestParam(defaultValue = "all") String scope,
            @RequestParam(name = "q", required = false) String query,
            @RequestParam(required = false) Long subjectId,
            @RequestParam(required = false) Long authorId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        PostFilter filter = new PostFilter(parseScope(scope), query, subjectId, authorId);
        return postService.listPosts(currentUser.getId(), filter, page, size);
    }

    private static Scope parseScope(String value) {
        try {
            return Scope.valueOf(value.toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Le type de fil demandé n’existe pas.");
        }
    }

    @GetMapping("/trending")
    public List<PostDto> trending(
            @AuthenticationPrincipal User currentUser,
            @RequestParam(defaultValue = "7") int days,
            @RequestParam(defaultValue = "5") int limit) {
        return postService.trendingPosts(currentUser.getId(), days, limit);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PostDto createPost(@AuthenticationPrincipal User currentUser, @Valid @RequestBody PostRequestDto request) {
        return postService.createPost(currentUser.getId(), request);
    }

    @GetMapping("/{postId}")
    public PostDto getPostById(@AuthenticationPrincipal User currentUser, @PathVariable Long postId) {
        return postService.getPostById(currentUser.getId(), postId);
    }

    @PutMapping("/{postId}")
    public PostDto updatePost(@AuthenticationPrincipal User currentUser, @PathVariable Long postId,
            @Valid @RequestBody PostRequestDto request) {
        return postService.updatePost(currentUser.getId(), postId, request);
    }

    @DeleteMapping("/{postId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePost(@AuthenticationPrincipal User currentUser, @PathVariable Long postId) {
        postService.deletePost(currentUser.getId(), postId);
    }

    @GetMapping("/{postId}/comments")
    public List<CommentDto> getCommentsByPostId(@PathVariable Long postId) {
        return commentService.getCommentsByPostId(postId);
    }

    @PutMapping("/{postId}/reaction")
    public EngagementDto react(@AuthenticationPrincipal User currentUser, @PathVariable Long postId) {
        return postService.addReaction(currentUser.getId(), postId);
    }

    @DeleteMapping("/{postId}/reaction")
    public EngagementDto removeReaction(@AuthenticationPrincipal User currentUser, @PathVariable Long postId) {
        return postService.removeReaction(currentUser.getId(), postId);
    }

    @PutMapping("/{postId}/bookmark")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void bookmark(@AuthenticationPrincipal User currentUser, @PathVariable Long postId) {
        postService.addBookmark(currentUser.getId(), postId);
    }

    @DeleteMapping("/{postId}/bookmark")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeBookmark(@AuthenticationPrincipal User currentUser, @PathVariable Long postId) {
        postService.removeBookmark(currentUser.getId(), postId);
    }
}
