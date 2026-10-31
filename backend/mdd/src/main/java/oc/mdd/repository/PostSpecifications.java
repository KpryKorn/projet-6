package oc.mdd.repository;

import java.util.Collection;

import org.springframework.data.jpa.domain.Specification;

import oc.mdd.entity.Post;

public final class PostSpecifications {

    private PostSpecifications() {
    }

    public static Specification<Post> inSubjects(Collection<Long> subjectIds) {
        return (root, query, cb) -> subjectIds.isEmpty()
                ? cb.disjunction()
                : root.get("subject").get("id").in(subjectIds);
    }

    public static Specification<Post> inPosts(Collection<Long> postIds) {
        return (root, query, cb) -> postIds.isEmpty()
                ? cb.disjunction()
                : root.get("id").in(postIds);
    }

    public static Specification<Post> hasSubject(Long subjectId) {
        return (root, query, cb) -> cb.equal(root.get("subject").get("id"), subjectId);
    }

    public static Specification<Post> hasAuthor(Long authorId) {
        return (root, query, cb) -> cb.equal(root.get("author").get("id"), authorId);
    }

    public static Specification<Post> matches(String term) {
        String pattern = "%" + term.toLowerCase().replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_") + "%";
        return (root, query, cb) -> cb.or(
                cb.like(cb.lower(root.get("title")), pattern, '\\'),
                cb.like(cb.lower(root.get("content")), pattern, '\\'));
    }
}
