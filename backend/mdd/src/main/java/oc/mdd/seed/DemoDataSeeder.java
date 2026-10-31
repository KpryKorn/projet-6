package oc.mdd.seed;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.sql.Timestamp;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

/**
 * Loads a believable set of accounts, articles, comments and reactions so the
 * platform is not
 * empty on first launch. It only runs when {@code app.seed.enabled=true} and
 * does nothing when
 * the demo account already exists. Dates are relative to the launch time, so
 * "this week"
 * always contains recent activity.
 */
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(name = "app.seed.enabled", havingValue = "true")
public class DemoDataSeeder implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(DemoDataSeeder.class);

    private record SeedUser(String username, String bio, int joinedDaysAgo, List<String> subjects) {
    }

    private record SeedPost(String slug, String author, String subject, int hoursAgo, double popularity,
            String title, String content) {
    }

    private record SeedComment(String post, String author, int hoursAfterPost, String text) {
    }

    private static final List<SeedUser> USERS = List.of(
            new SeedUser("alexandre_m", "Développeur full stack : Java côté serveur, Angular côté interface.",
                    30, List.of("JavaScript", "TypeScript", "Angular", "Java", "Rust")),
            new SeedUser("camille_r", "Développeuse front : Angular la semaine, Rust le week-end.", 90,
                    List.of("Angular", "TypeScript", "Rust")),
            new SeedUser("malo", "Backend Java depuis dix ans. J’aime les migrations qui se passent sans surprise.",
                    120,
                    List.of("Java", "Go", "TypeScript")),
            new SeedUser("ines_dev", "TypeScript, accessibilité et café filtre.", 75,
                    List.of("TypeScript", "JavaScript", "React", "Angular")),
            new SeedUser("yanis", "Go, observabilité et pipelines de CI qui restent verts.", 60,
                    List.of("Go", "Rust", "Python")),
            new SeedUser("sofia_k", "Python, données et notebooks qu’on peut relancer.", 45,
                    List.of("Python", "Go", "JavaScript")),
            new SeedUser("hugo_b", "React depuis 2016, Vue par curiosité.", 150,
                    List.of("React", "Vue.js", "JavaScript", "TypeScript")),
            new SeedUser("lea_codes", "Tech lead. J’apprends à dire non aux fonctionnalités et oui aux tests.", 100,
                    List.of("React", "JavaScript", "TypeScript")),
            new SeedUser("noah", "Rust, systèmes embarqués et trop de microcontrôleurs sur le bureau.", 55,
                    List.of("Rust", "Go", "Python")),
            new SeedUser("amelie_t", "C# et .NET. Du DDD, mais sans dogmatisme.", 80,
                    List.of("C#", "Java", "TypeScript")),
            new SeedUser("ravi", "Full stack, SQL d’abord. Je lis les plans d’exécution pour me détendre.", 110,
                    List.of("JavaScript", "Java", "Python", "TypeScript")));

    private static final List<String> DEMO_BOOKMARKS = List.of("structured-clone", "java-n-plus-un", "angular-defer");

    private final JdbcTemplate jdbc;
    private final PasswordEncoder passwordEncoder;
    private final ObjectMapper objectMapper;

    @Value("${app.demo.email}")
    private String demoEmail;

    @Value("${app.demo.password}")
    private String demoPassword;

    @Override
    @Transactional
    public void run(ApplicationArguments args) throws IOException {
        Integer existing = jdbc.queryForObject("SELECT COUNT(*) FROM users WHERE email = ?", Integer.class, demoEmail);
        if (existing != null && existing > 0) {
            log.info("Demo data already present, skipping the seed.");
            return;
        }

        Instant now = Instant.now();
        Map<String, Long> userIds = insertUsers(now);
        Map<String, Long> subjectIds = loadSubjectIds();
        insertSubscriptions(userIds, subjectIds);

        List<SeedPost> posts = loadPosts();
        Map<String, Long> postIds = new HashMap<>();
        Map<String, Instant> postDates = new HashMap<>();
        for (SeedPost post : posts) {
            Instant createdAt = now.minus(Duration.ofHours(post.hoursAgo()));
            Long id = jdbc.queryForObject(
                    "INSERT INTO posts (title, content, author_id, subject_id, created_at) VALUES (?, ?, ?, ?, ?) RETURNING id",
                    Long.class, post.title(), post.content(), userIds.get(post.author()),
                    subjectIds.get(post.subject()), Timestamp.from(createdAt));
            postIds.put(post.slug(), id);
            postDates.put(post.slug(), createdAt);
        }

        insertComments(userIds, postIds, postDates, now);
        insertReactions(posts, userIds, postIds, postDates, now);
        insertDemoBookmarks(userIds, postIds);

        log.info("Demo data loaded: {} accounts, {} articles. Sign in with {}.", userIds.size(), posts.size(),
                demoEmail);
    }

    private Map<String, Long> insertUsers(Instant now) {
        String hash = passwordEncoder.encode(demoPassword);
        Map<String, Long> ids = new LinkedHashMap<>();
        for (SeedUser user : USERS) {
            String email = user.username().equals("alexandre_m") ? demoEmail : user.username() + "@mdd.dev";
            Long id = jdbc.queryForObject(
                    "INSERT INTO users (username, email, password, bio, created_at) VALUES (?, ?, ?, ?, ?) RETURNING id",
                    Long.class, user.username(), email, hash, user.bio(),
                    Timestamp.from(now.minus(Duration.ofDays(user.joinedDaysAgo()))));
            ids.put(user.username(), id);
        }
        return ids;
    }

    private Map<String, Long> loadSubjectIds() {
        Map<String, Long> ids = new HashMap<>();
        jdbc.query("SELECT id, title FROM subjects", rs -> {
            ids.put(rs.getString("title"), rs.getLong("id"));
        });
        return ids;
    }

    private void insertSubscriptions(Map<String, Long> userIds, Map<String, Long> subjectIds) {
        for (SeedUser user : USERS) {
            for (String subject : user.subjects()) {
                jdbc.update("INSERT INTO subscriptions (user_id, subject_id) VALUES (?, ?) ON CONFLICT DO NOTHING",
                        userIds.get(user.username()), subjectIds.get(subject));
            }
        }
    }

    private List<SeedPost> loadPosts() throws IOException {
        List<SeedPost> posts = new ArrayList<>();
        Resource[] resources = new PathMatchingResourcePatternResolver().getResources("classpath:seed/posts/*.md");
        for (Resource resource : resources) {
            String raw = new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
            String name = resource.getFilename();
            posts.add(parsePost(name.substring(0, name.length() - 3), raw));
        }
        posts.sort((a, b) -> Integer.compare(b.hoursAgo(), a.hoursAgo()));
        return posts;
    }

    /**
     * A post file starts with a small header between two lines of three dashes,
     * then the Markdown body.
     */
    private SeedPost parsePost(String slug, String raw) {
        String[] parts = raw.split("(?m)^---\\s*$", 3);
        Map<String, String> meta = new HashMap<>();
        for (String line : parts[1].strip().split("\\R")) {
            int colon = line.indexOf(':');
            meta.put(line.substring(0, colon).strip(), line.substring(colon + 1).strip());
        }
        return new SeedPost(slug, meta.get("author"), meta.get("subject"), Integer.parseInt(meta.get("hoursAgo")),
                Double.parseDouble(meta.get("popularity")), meta.get("title"), parts[2].strip());
    }

    private void insertComments(Map<String, Long> userIds, Map<String, Long> postIds,
            Map<String, Instant> postDates, Instant now) throws IOException {
        Resource resource = new PathMatchingResourcePatternResolver().getResource("classpath:seed/comments.json");
        List<SeedComment> comments = objectMapper.readValue(resource.getInputStream(),
                new TypeReference<List<SeedComment>>() {
                });
        for (SeedComment comment : comments) {
            Instant at = postDates.get(comment.post()).plus(Duration.ofHours(comment.hoursAfterPost()));
            if (at.isAfter(now)) {
                at = now.minus(Duration.ofMinutes(10));
            }
            jdbc.update("INSERT INTO comments (content, author_id, post_id, created_at) VALUES (?, ?, ?, ?)",
                    comment.text(), userIds.get(comment.author()), postIds.get(comment.post()), Timestamp.from(at));
        }
    }

    private void insertReactions(List<SeedPost> posts, Map<String, Long> userIds, Map<String, Long> postIds,
            Map<String, Instant> postDates, Instant now) {
        Random random = new Random(42);
        for (SeedPost post : posts) {
            Instant start = postDates.get(post.slug());
            long windowMinutes = Math.max(Duration.between(start, now).toMinutes(), 30);
            for (Map.Entry<String, Long> user : userIds.entrySet()) {
                boolean isAuthor = user.getKey().equals(post.author());
                if (isAuthor || random.nextDouble() > post.popularity() * 0.9 + 0.05) {
                    continue;
                }
                Instant at = start.plus(Duration.ofMinutes(10 + (long) (random.nextDouble() * windowMinutes)));
                jdbc.update(
                        "INSERT INTO post_reactions (user_id, post_id, created_at) VALUES (?, ?, ?) ON CONFLICT DO NOTHING",
                        user.getValue(), postIds.get(post.slug()), Timestamp.from(at.isAfter(now) ? now : at));
            }
        }
    }

    private void insertDemoBookmarks(Map<String, Long> userIds, Map<String, Long> postIds) {
        for (String slug : DEMO_BOOKMARKS) {
            Long postId = postIds.get(slug);
            if (postId != null) {
                jdbc.update("INSERT INTO bookmarks (user_id, post_id) VALUES (?, ?) ON CONFLICT DO NOTHING",
                        userIds.get("alexandre_m"), postId);
            }
        }
    }
}
