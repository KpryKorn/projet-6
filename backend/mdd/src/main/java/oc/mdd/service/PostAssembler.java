package oc.mdd.service;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import oc.mdd.dto.AuthorDto;
import oc.mdd.dto.PostDto;
import oc.mdd.entity.Post;
import oc.mdd.entity.User;
import oc.mdd.mapper.SubjectMapper;
import oc.mdd.repository.EngagementRepository;
import oc.mdd.repository.EngagementRepository.IdCount;
import oc.mdd.util.MarkdownText;

/** Builds post DTOs for a whole page with a fixed number of queries, whatever the page size. */
@Component
@RequiredArgsConstructor
public class PostAssembler {

    private static final int EXCERPT_LENGTH = 220;

    private final EngagementRepository engagementRepository;
    private final SubjectMapper subjectMapper;

    public static AuthorDto toAuthor(User user) {
        return AuthorDto.builder()
                .id(user.getId())
                .username(user.getRealUsername())
                .bio(user.getBio())
                .build();
    }

    public PostDto toDto(Post post, Long viewerId, boolean withContent) {
        return toDtos(List.of(post), viewerId, withContent).get(0);
    }

    public List<PostDto> toDtos(List<Post> posts, Long viewerId, boolean withContent) {
        if (posts.isEmpty()) {
            return List.of();
        }
        List<Long> ids = posts.stream().map(Post::getId).toList();
        Map<Long, Long> reactions = toMap(engagementRepository.countReactionsByPost(ids));
        Map<Long, Long> comments = toMap(engagementRepository.countCommentsByPost(ids));
        Set<Long> reacted = new HashSet<>(engagementRepository.findReactedPostIds(viewerId, ids));
        Set<Long> bookmarked = new HashSet<>(engagementRepository.findBookmarkedPostIds(viewerId, ids));

        return posts.stream()
                .map(post -> PostDto.builder()
                        .id(post.getId())
                        .title(post.getTitle())
                        .excerpt(MarkdownText.excerpt(post.getContent(), EXCERPT_LENGTH))
                        .content(withContent ? post.getContent() : null)
                        .readingMinutes(MarkdownText.readingMinutes(post.getContent()))
                        .createdAt(post.getCreatedAt())
                        .author(toAuthor(post.getAuthor()))
                        .subject(subjectMapper.toDto(post.getSubject()))
                        .usefulCount(reactions.getOrDefault(post.getId(), 0L))
                        .commentCount(comments.getOrDefault(post.getId(), 0L))
                        .viewerHasReacted(reacted.contains(post.getId()))
                        .viewerHasBookmarked(bookmarked.contains(post.getId()))
                        .build())
                .toList();
    }

    private static Map<Long, Long> toMap(List<IdCount> rows) {
        Map<Long, Long> map = new HashMap<>();
        rows.forEach(row -> map.put(row.getId(), row.getTotal()));
        return map;
    }
}
