package oc.mdd.repository;

import java.time.OffsetDateTime;
import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

import oc.mdd.entity.Post;

/**
 * Native queries for the lightweight link tables (reactions, bookmarks) and for the
 * aggregates shown on post cards. Counts are always fetched for a whole page at once.
 */
public interface EngagementRepository extends Repository<Post, Long> {

    interface IdCount {
        Long getId();

        Long getTotal();
    }

    @Query(value = "SELECT post_id AS id, COUNT(*) AS total FROM post_reactions WHERE post_id IN (:postIds) GROUP BY post_id", nativeQuery = true)
    List<IdCount> countReactionsByPost(@Param("postIds") Collection<Long> postIds);

    @Query(value = "SELECT post_id AS id, COUNT(*) AS total FROM comments WHERE post_id IN (:postIds) GROUP BY post_id", nativeQuery = true)
    List<IdCount> countCommentsByPost(@Param("postIds") Collection<Long> postIds);

    @Query(value = "SELECT post_id FROM post_reactions WHERE user_id = :userId AND post_id IN (:postIds)", nativeQuery = true)
    List<Long> findReactedPostIds(@Param("userId") Long userId, @Param("postIds") Collection<Long> postIds);

    @Query(value = "SELECT post_id FROM bookmarks WHERE user_id = :userId AND post_id IN (:postIds)", nativeQuery = true)
    List<Long> findBookmarkedPostIds(@Param("userId") Long userId, @Param("postIds") Collection<Long> postIds);

    @Query(value = "SELECT post_id FROM bookmarks WHERE user_id = :userId ORDER BY created_at DESC", nativeQuery = true)
    List<Long> findAllBookmarkedPostIds(@Param("userId") Long userId);

    @Query(value = "SELECT COUNT(*) FROM post_reactions WHERE post_id = :postId", nativeQuery = true)
    long countReactions(@Param("postId") Long postId);

    @Query(value = "SELECT COUNT(*) FROM post_reactions r JOIN posts p ON p.id = r.post_id WHERE p.author_id = :authorId", nativeQuery = true)
    long countReactionsReceivedByAuthor(@Param("authorId") Long authorId);

    @Query(value = """
            SELECT r.post_id FROM post_reactions r
            WHERE r.created_at >= :since
            GROUP BY r.post_id
            ORDER BY COUNT(*) DESC, MAX(r.created_at) DESC
            LIMIT :limit
            """, nativeQuery = true)
    List<Long> findTopReactedPostIds(@Param("since") OffsetDateTime since, @Param("limit") int limit);

    @Query(value = "SELECT subject_id AS id, COUNT(*) AS total FROM subscriptions GROUP BY subject_id", nativeQuery = true)
    List<IdCount> countFollowersBySubject();

    @Query(value = "SELECT subject_id AS id, COUNT(*) AS total FROM posts GROUP BY subject_id", nativeQuery = true)
    List<IdCount> countPostsBySubject();

    @Modifying
    @Query(value = "INSERT INTO post_reactions (user_id, post_id) VALUES (:userId, :postId) ON CONFLICT DO NOTHING", nativeQuery = true)
    void addReaction(@Param("userId") Long userId, @Param("postId") Long postId);

    @Modifying
    @Query(value = "DELETE FROM post_reactions WHERE user_id = :userId AND post_id = :postId", nativeQuery = true)
    void removeReaction(@Param("userId") Long userId, @Param("postId") Long postId);

    @Modifying
    @Query(value = "INSERT INTO bookmarks (user_id, post_id) VALUES (:userId, :postId) ON CONFLICT DO NOTHING", nativeQuery = true)
    void addBookmark(@Param("userId") Long userId, @Param("postId") Long postId);

    @Modifying
    @Query(value = "DELETE FROM bookmarks WHERE user_id = :userId AND post_id = :postId", nativeQuery = true)
    void removeBookmark(@Param("userId") Long userId, @Param("postId") Long postId);
}
