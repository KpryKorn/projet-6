package oc.mdd.service;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import oc.mdd.dto.PostDto;
import oc.mdd.dto.PostRequestDto;
import oc.mdd.entity.Post;
import oc.mdd.entity.Subject;
import oc.mdd.entity.User;
import oc.mdd.mapper.PostMapper;
import oc.mdd.repository.PostRepository;
import oc.mdd.repository.SubjectRepository;
import oc.mdd.repository.UserRepository;

@Service
@RequiredArgsConstructor
@Transactional
public class PostService {
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final SubjectRepository subjectRepository;
    private final PostMapper postMapper;

    public void createPost(String authorEmail, PostRequestDto postRequestDto) {
        if (postRequestDto == null) {
            throw new IllegalArgumentException("PostRequestDto cannot be null");
        }

        User author = userRepository.findByEmail(authorEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Subject subject = subjectRepository.findByTitle(postRequestDto.getSubjectTitle())
                .orElseThrow(() -> new RuntimeException("Subject not found"));

        Post post = Post.builder()
                .title(postRequestDto.getTitle())
                .content(postRequestDto.getContent())
                .author(author)
                .subject(subject)
                .build();

        Post savedPost = postRepository.save(post);
        postMapper.toDto(savedPost);
    }

    public PostDto getPostById(Long postId) {
        if (postId == null) {
            throw new IllegalArgumentException("Post ID cannot be null");
        }

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        return postMapper.toDto(post);
    }

    public List<PostDto> getFeedPosts(String userEmail, Pageable pageable) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Subject> subscribedSubjects = user.getSubscribedSubjects().stream().toList();

        if (subscribedSubjects.isEmpty()) {
            return List.of();
        }

        return postRepository.findBySubjectInOrderByCreatedAtDesc(subscribedSubjects, pageable)
                .stream()
                .map(postMapper::toDto)
                .toList();
    }
}
