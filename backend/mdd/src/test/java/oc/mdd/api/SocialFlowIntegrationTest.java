package oc.mdd.api;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Runs the real application against a throwaway PostgreSQL, with every Flyway
 * migration applied.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Testcontainers
class SocialFlowIntegrationTest {

    @Container
    @ServiceConnection
    static final PostgreSQLContainer<?> POSTGRES = new PostgreSQLContainer<>("postgres:16-alpine");

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void anonymousRequestsAreRejectedWithA401() throws Exception {
        mockMvc.perform(get("/posts")).andExpect(status().isUnauthorized());
    }

    @Test
    void registrationRejectsAnAlreadyTakenUsername() throws Exception {
        register("ada", "ada@example.com");

        mockMvc.perform(post("/auth/register").contentType(MediaType.APPLICATION_JSON)
                .content(registrationJson("ada", "autre@example.com")))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value("Ce pseudo est déjà utilisé."));
    }

    @Test
    void reactingTwiceCountsOnceAndNeverLeaksEmails() throws Exception {
        register("grace", "grace@example.com");
        String token = login("grace@example.com");

        String body = """
                {"title":"Mon premier article","content":"Du **contenu** en Markdown.","subjectId":1}
                """;
        String created = mockMvc.perform(post("/posts").header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        long postId = objectMapper.readTree(created).get("id").asLong();

        for (int i = 0; i < 2; i++) {
            mockMvc.perform(put("/posts/" + postId + "/reaction").header("Authorization", "Bearer " + token))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.usefulCount").value(1))
                    .andExpect(jsonPath("$.viewerHasReacted").value(true));
        }

        mockMvc.perform(delete("/posts/" + postId + "/reaction").header("Authorization", "Bearer " + token))
                .andExpect(jsonPath("$.usefulCount").value(0));

        String feed = mockMvc.perform(get("/posts?scope=all").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].title").value("Mon premier article"))
                .andReturn().getResponse().getContentAsString();
        assertThat(feed).doesNotContain("grace@example.com");
    }

    @Test
    void anInvalidScopeIsABadRequest() throws Exception {
        register("linus", "linus@example.com");
        String token = login("linus@example.com");

        mockMvc.perform(get("/posts?scope=nope").header("Authorization", "Bearer " + token))
                .andExpect(status().isBadRequest());
    }

    @Test
    void onlyTheAuthorCanDeleteAnArticle() throws Exception {
        register("alan", "alan@example.com");
        register("edsger", "edsger@example.com");
        String alan = login("alan@example.com");
        String edsger = login("edsger@example.com");

        String created = mockMvc.perform(post("/posts").header("Authorization", "Bearer " + alan)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"title\":\"À moi\",\"content\":\"Texte\",\"subjectId\":1}"))
                .andReturn().getResponse().getContentAsString();
        long postId = objectMapper.readTree(created).get("id").asLong();

        mockMvc.perform(delete("/posts/" + postId).header("Authorization", "Bearer " + edsger))
                .andExpect(status().isForbidden());
        mockMvc.perform(delete("/posts/" + postId).header("Authorization", "Bearer " + alan))
                .andExpect(status().isNoContent());
    }

    private void register(String username, String email) throws Exception {
        mockMvc.perform(post("/auth/register").contentType(MediaType.APPLICATION_JSON)
                .content(registrationJson(username, email)));
    }

    private String login(String email) throws Exception {
        String response = mockMvc.perform(post("/auth/login").contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"" + email + "\",\"password\":\"Passw0rd!\"}"))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        JsonNode json = objectMapper.readTree(response);
        return json.get("accessToken").asText();
    }

    private static String registrationJson(String username, String email) {
        return "{\"username\":\"" + username + "\",\"email\":\"" + email + "\",\"password\":\"Passw0rd!\"}";
    }
}
