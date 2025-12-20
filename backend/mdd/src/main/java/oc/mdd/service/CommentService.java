package oc.mdd.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import oc.mdd.dto.CommentDto;
import oc.mdd.dto.CommentRequestDto;
import oc.mdd.entity.Comment;
import oc.mdd.entity.Post;
import oc.mdd.entity.User;
import oc.mdd.mapper.CommentMapper;
import oc.mdd.repository.CommentRepository;
import oc.mdd.repository.PostRepository;
import oc.mdd.repository.UserRepository;

@Service
@Transactional
@RequiredArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final CommentMapper commentMapper;

    public void createComment(String userEmail, CommentRequestDto commentRequestDto) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new EntityNotFoundException("User with email " + userEmail + " not found"));

        Post post = postRepository.findById(commentRequestDto.getPostId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Post with id " + commentRequestDto.getPostId() + " not found"));

        Comment comment = Comment.builder()
                .content(commentRequestDto.getContent())
                .author(user)
                .post(post)
                .build();

        commentRepository.save(comment);
    }

    public List<CommentDto> getCommentsByPostId(Long postId) {
        List<Comment> comments = commentRepository.findByPostId(postId);
        if (comments.isEmpty()) {
            postRepository.findById(postId)
                    .orElseThrow(() -> new EntityNotFoundException("Post with id " + postId + " not found"));
        }

        return comments.stream()
                .map(commentMapper::toDto)
                .toList();
    }
}
