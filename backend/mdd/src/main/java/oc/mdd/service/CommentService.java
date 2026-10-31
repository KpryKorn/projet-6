package oc.mdd.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import oc.mdd.dto.CommentDto;
import oc.mdd.dto.CommentRequestDto;
import oc.mdd.entity.Comment;
import oc.mdd.entity.Post;
import oc.mdd.entity.User;
import oc.mdd.exception.ForbiddenActionException;
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
    private final EntityManager entityManager;

    public CommentDto createComment(Long userId, CommentRequestDto request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur introuvable."));
        Post post = postRepository.findById(request.getPostId())
                .orElseThrow(() -> new EntityNotFoundException("Cet article n’existe pas ou a été supprimé."));

        Comment comment = Comment.builder()
                .content(request.getContent().trim())
                .author(user)
                .post(post)
                .build();
        commentRepository.saveAndFlush(comment);
        entityManager.refresh(comment);
        return toDto(comment);
    }

    @Transactional(readOnly = true)
    public List<CommentDto> getCommentsByPostId(Long postId) {
        if (!postRepository.existsById(postId)) {
            throw new EntityNotFoundException("Cet article n’existe pas ou a été supprimé.");
        }
        return commentRepository.findByPostIdOrderByCreatedAtAsc(postId).stream()
                .map(this::toDto)
                .toList();
    }

    public void deleteComment(Long userId, Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new EntityNotFoundException("Ce commentaire n’existe pas ou a été supprimé."));
        if (!comment.getAuthor().getId().equals(userId)) {
            throw new ForbiddenActionException("Vous ne pouvez supprimer que vos propres commentaires.");
        }
        commentRepository.delete(comment);
    }

    private CommentDto toDto(Comment comment) {
        return CommentDto.builder()
                .id(comment.getId())
                .postId(comment.getPost().getId())
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt())
                .author(PostAssembler.toAuthor(comment.getAuthor()))
                .build();
    }
}
