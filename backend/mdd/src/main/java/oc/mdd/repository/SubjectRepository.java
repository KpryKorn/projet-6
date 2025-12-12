package oc.mdd.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import oc.mdd.entity.Subject;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {

}