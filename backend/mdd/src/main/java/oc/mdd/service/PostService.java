package oc.mdd.service;

import java.time.OffsetDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import oc.mdd.dto.EngagementDto;
import oc.mdd.dto.PageResponse;
import oc.mdd.dto.PostDto;
import oc.mdd.dto.PostRequestDto;
import oc.mdd.entity.Post;
import oc.mdd.entity.Subject;
import oc.mdd.entity.User;
import oc.mdd.exception.ForbiddenActionException;
import oc.mdd.repository.EngagementRepository;
import oc.mdd.repository.PostRepository;
import oc.mdd.repository.PostSpecifications;
import oc.mdd.repository.SubjectRepository;
import oc.mdd.repository.UserRepository;

@Service
@RequiredArgsConstructor
@Transactional
public class PostService {

    public enum Scope {
        /** Posts of the topics the viewer follows. */
        SUBSCRIBED,
        /** Every post. */
        ALL,
        /** Posts the viewer bookmarked. */
        SAVED
    }

    public record PostFilter(Scope scope, String query, Long subjectId, Long authorId) {
    }

    private static final int MAX_PAGE_SIZE = 50;

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final SubjectRepository subjectRepository;
    private final EngagementRepository engagementRepository;
    private final PostAssembler assembler;
    private final EntityManager entityManager;

    public PostDto createPost(Long authorId, PostRequestDto request) {
        User author = userRepository.findById(authorId)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur introuvable."));
        Post post = Post.builder()
                .title(request.getTitle().trim())
                .content(request.getContent().trim())
                .author(author)
                .subject(findSubject(request.getSubjectId()))
                .build();
        postRepository.saveAndFlush(post);
        entityManager.refresh(post);
        return assembler.toDto(post, authorId, true);
    }

    public PostDto updatePost(Long viewerId, Long postId, PostRequestDto request) {
        Post post = findOwnedPost(viewerId, postId);
        post.setTitle(request.getTitle().trim());
        post.setContent(request.getContent().trim());
        post.setSubject(findSubject(request.getSubjectId()));
        postRepository.saveAndFlush(post);
        return assembler.toDto(post, viewerId, true);
    }

    public void deletePost(Long viewerId, Long postId) {
        postRepository.delete(findOwnedPost(viewerId, postId));
    }

    @Transactional(readOnly = true)
    public PostDto getPostById(Long viewerId, Long postId) {
        return assembler.toDto(findPost(postId), viewerId, true);
    }

    @Transactional(readOnly = true)
    public PageResponse<PostDto> listPosts(Long viewerId, PostFilter filter, int page, int size) {
        Specification<Post> spec = (root, query, cb) -> cb.conjunction();

        switch (filter.scope()) {
            case SUBSCRIBED -> spec = spec.and(PostSpecifications.inSubjects(subscribedSubjectIds(viewerId)));
            case SAVED -> spec = spec.and(PostSpecifications.inPosts(engagementRepository.findAllBookmarkedPostIds(viewerId)));
            case ALL -> {
            }
        }
        if (filter.subjectId() != null) {
            spec = spec.and(PostSpecifications.hasSubject(filter.subjectId()));
        }
        if (filter.authorId() != null) {
            spec = spec.and(PostSpecifications.hasAuthor(filter.authorId()));
        }
        if (filter.query() != null && !filter.query().isBlank()) {
            spec = spec.and(PostSpecifications.matches(filter.query().trim()));
        }

        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), MAX_PAGE_SIZE),
                Sort.by(Sort.Direction.DESC, "createdAt").and(Sort.by(Sort.Direction.DESC, "id")));
        Page<Post> result = postRepository.findAll(spec, pageable);
        return PageResponse.of(result, posts -> assembler.toDtos(posts, viewerId, false));
    }

    /** The posts that received the most "useful" reactions during the last {@code days} days. */
    @Transactional(readOnly = true)
    public List<PostDto> trendingPosts(Long viewerId, int days, int limit) {
        OffsetDateTime since = OffsetDateTime.now().minusDays(Math.max(days, 1));
        List<Long> ids = engagementRepository.findTopReactedPostIds(since, Math.min(Math.max(limit, 1), 10));
        Map<Long, Post> byId = postRepository.findAllById(ids).stream()
                .collect(Collectors.toMap(Post::getId, Function.identity()));
        List<Post> ordered = ids.stream().map(byId::get).filter(java.util.Objects::nonNull).toList();
        return assembler.toDtos(ordered, viewerId, false);
    }

    public EngagementDto addReaction(Long viewerId, Long postId) {
        requirePost(postId);
        engagementRepository.addReaction(viewerId, postId);
        return new EngagementDto(engagementRepository.countReactions(postId), true);
    }

    public EngagementDto removeReaction(Long viewerId, Long postId) {
        requirePost(postId);
        engagementRepository.removeReaction(viewerId, postId);
        return new EngagementDto(engagementRepository.countReactions(postId), false);
    }

    public void addBookmark(Long viewerId, Long postId) {
        requirePost(postId);
        engagementRepository.addBookmark(viewerId, postId);
    }

    public void removeBookmark(Long viewerId, Long postId) {
        requirePost(postId);
        engagementRepository.removeBookmark(viewerId, postId);
    }

    private Set<Long> subscribedSubjectIds(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur introuvable."));
        Set<Long> ids = new HashSet<>();
        user.getSubscribedSubjects().forEach(subject -> ids.add(subject.getId()));
        return ids;
    }

    private Subject findSubject(Long subjectId) {
        return subjectRepository.findById(subjectId)
                .orElseThrow(() -> new EntityNotFoundException("Ce thème n’existe pas."));
    }

    private Post findPost(Long postId) {
        return postRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("Cet article n’existe pas ou a été supprimé."));
    }

    private void requirePost(Long postId) {
        if (!postRepository.existsById(postId)) {
            throw new EntityNotFoundException("Cet article n’existe pas ou a été supprimé.");
        }
    }

    private Post findOwnedPost(Long viewerId, Long postId) {
        Post post = findPost(postId);
        if (!post.getAuthor().getId().equals(viewerId)) {
            throw new ForbiddenActionException("Vous ne pouvez modifier ou supprimer que vos propres articles.");
        }
        return post;
    }
}
