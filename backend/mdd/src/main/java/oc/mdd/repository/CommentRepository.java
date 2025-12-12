package oc.mdd.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import oc.mdd.entity.Comment;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

}
