package oc.mdd.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import oc.mdd.dto.SubjectDto;
import oc.mdd.entity.User;
import oc.mdd.service.SubjectService;
import oc.mdd.service.SubscriptionService;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequiredArgsConstructor
@RequestMapping("/subjects")
public class SubjectController {
    private final SubjectService subjectService;
    private final SubscriptionService subscriptionService;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<SubjectDto> getAllSubjects() {
        return subjectService.getAllSubjects();
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public SubjectDto getSubjectById(@PathVariable Long id) {
        return subjectService.getSubjectById(id);
    }

    @PostMapping("/{id}/subscribe")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void subscribeToSubject(@AuthenticationPrincipal User user,
            @PathVariable("id") Long subjectId) {
        subscriptionService.subscribeUserToSubject(user.getId(), subjectId);
    }

    @DeleteMapping("/{id}/unsubscribe")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void unsubscribeFromSubject(@AuthenticationPrincipal User user,
            @PathVariable("id") Long subjectId) {
        subscriptionService.unsubscribeUserFromSubject(user.getId(), subjectId);
    }
}
