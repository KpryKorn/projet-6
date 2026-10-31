package oc.mdd.util;

import java.util.regex.Pattern;

public final class MarkdownText {

    private static final Pattern FENCED_CODE = Pattern.compile("(?s)```.*?```");
    private static final Pattern INLINE_CODE = Pattern.compile("`([^`]*)`");
    private static final Pattern LINK = Pattern.compile("!?\\[([^\\]]*)]\\([^)]*\\)");
    private static final Pattern SYNTAX = Pattern.compile("(?m)^\\s{0,3}(#{1,6}|>|[-*+]|\\d+\\.)\\s+|[*_~]{1,3}");
    private static final Pattern WHITESPACE = Pattern.compile("\\s+");
    private static final int WORDS_PER_MINUTE = 200;

    private MarkdownText() {
    }

    /** A plain text preview, cut at a word boundary. Fenced code blocks are skipped. */
    public static String excerpt(String markdown, int maxLength) {
        if (markdown == null) {
            return "";
        }
        String text = FENCED_CODE.matcher(markdown).replaceAll(" ");
        text = INLINE_CODE.matcher(text).replaceAll("$1");
        text = LINK.matcher(text).replaceAll("$1");
        text = SYNTAX.matcher(text).replaceAll("");
        text = WHITESPACE.matcher(text).replaceAll(" ").trim();
        if (text.length() <= maxLength) {
            return text;
        }
        int cut = text.lastIndexOf(' ', maxLength);
        return text.substring(0, cut > maxLength / 2 ? cut : maxLength).stripTrailing() + "…";
    }

    public static int readingMinutes(String markdown) {
        if (markdown == null || markdown.isBlank()) {
            return 1;
        }
        int words = WHITESPACE.split(markdown.trim()).length;
        return Math.max(1, (int) Math.ceil(words / (double) WORDS_PER_MINUTE));
    }
}
