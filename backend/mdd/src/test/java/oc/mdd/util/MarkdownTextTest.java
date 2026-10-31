package oc.mdd.util;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class MarkdownTextTest {

    @Test
    void excerptRemovesMarkdownSyntaxAndCodeBlocks() {
        String markdown = "# Titre\n\nUn **mot** et un [lien](https://exemple.fr).\n\n```js\nconst a = 1;\n```\n\nFin.";

        assertThat(MarkdownText.excerpt(markdown, 200)).isEqualTo("Titre Un mot et un lien. Fin.");
    }

    @Test
    void excerptCutsAtAWordBoundary() {
        String excerpt = MarkdownText.excerpt("alpha beta gamma delta epsilon", 14);

        assertThat(excerpt).isEqualTo("alpha beta…");
    }

    @Test
    void excerptOfNullIsEmpty() {
        assertThat(MarkdownText.excerpt(null, 10)).isEmpty();
    }

    @Test
    void readingTimeIsAtLeastOneMinute() {
        assertThat(MarkdownText.readingMinutes("court")).isEqualTo(1);
        assertThat(MarkdownText.readingMinutes("mot ".repeat(450))).isEqualTo(3);
    }
}
