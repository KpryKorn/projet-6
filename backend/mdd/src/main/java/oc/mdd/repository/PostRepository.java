package oc.mdd.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import oc.mdd.entity.Post;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

}
