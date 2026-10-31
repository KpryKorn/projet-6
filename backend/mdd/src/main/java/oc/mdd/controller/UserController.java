package oc.mdd.controller;

import java.util.List;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import oc.mdd.dto.ProfileDto;
import oc.mdd.dto.SubjectDto;
import oc.mdd.dto.UserDto;
import oc.mdd.dto.UserRequestDto;
import oc.mdd.entity.User;
import oc.mdd.service.SubscriptionService;
import oc.mdd.service.UserService;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final SubscriptionService subscriptionService;

    @GetMapping("/me")
    public UserDto me(@AuthenticationPrincipal User currentUser) {
        return userService.getUserById(currentUser.getId());
    }

    @PatchMapping("/me")
    public UserDto updateMe(@AuthenticationPrincipal User currentUser, @Valid @RequestBody UserRequestDto request) {
        return userService.patchUser(currentUser.getId(), request);
    }

    @GetMapping("/me/subscriptions")
    public List<SubjectDto> getMySubscriptions(@AuthenticationPrincipal User currentUser) {
        return subscriptionService.getUserSubscribedSubjects(currentUser.getId());
    }

    @GetMapping("/{id}")
    public ProfileDto getProfile(@PathVariable Long id) {
        return userService.getProfile(id);
    }
}
