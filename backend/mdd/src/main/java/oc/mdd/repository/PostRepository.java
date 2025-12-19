package oc.mdd.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import oc.mdd.entity.Post;
import oc.mdd.entity.Subject;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    Page<Post> findBySubjectInOrderByCreatedAtDesc(List<Subject> subjects, Pageable pageable);
}
