ALTER TABLE USERS ADD COLUMN bio VARCHAR(280);

ALTER TABLE SUBJECTS ADD COLUMN color VARCHAR(7) NOT NULL DEFAULT '#7C5CFF';
ALTER TABLE SUBJECTS ADD COLUMN short_name VARCHAR(4);

UPDATE SUBJECTS SET color = '#F7DF1E', short_name = 'JS' WHERE title = 'JavaScript';
UPDATE SUBJECTS SET color = '#3178C6', short_name = 'TS' WHERE title = 'TypeScript';
UPDATE SUBJECTS SET color = '#4B8BBE', short_name = 'Py' WHERE title = 'Python';
UPDATE SUBJECTS SET color = '#F89820', short_name = 'Jv' WHERE title = 'Java';
UPDATE SUBJECTS SET color = '#DD0031', short_name = 'Ng' WHERE title = 'Angular';
UPDATE SUBJECTS SET color = '#61DAFB', short_name = 'Re' WHERE title = 'React';
UPDATE SUBJECTS SET color = '#42B883', short_name = 'Vu' WHERE title = 'Vue.js';
UPDATE SUBJECTS SET color = '#9B4F96', short_name = 'C#' WHERE title = 'C#';
UPDATE SUBJECTS SET color = '#00ADD8', short_name = 'Go' WHERE title = 'Go';
UPDATE SUBJECTS SET color = '#DEA584', short_name = 'Rs' WHERE title = 'Rust';

CREATE TABLE POST_REACTIONS (
    user_id BIGINT NOT NULL,
    post_id BIGINT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (user_id, post_id),
    CONSTRAINT fk_reactions_user FOREIGN KEY (user_id) REFERENCES USERS(id) ON DELETE CASCADE,
    CONSTRAINT fk_reactions_post FOREIGN KEY (post_id) REFERENCES POSTS(id) ON DELETE CASCADE
);

CREATE TABLE BOOKMARKS (
    user_id BIGINT NOT NULL,
    post_id BIGINT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (user_id, post_id),
    CONSTRAINT fk_bookmarks_user FOREIGN KEY (user_id) REFERENCES USERS(id) ON DELETE CASCADE,
    CONSTRAINT fk_bookmarks_post FOREIGN KEY (post_id) REFERENCES POSTS(id) ON DELETE CASCADE
);

CREATE INDEX idx_posts_created_at ON POSTS(created_at DESC);
CREATE INDEX idx_post_reactions_post_id ON POST_REACTIONS(post_id);
CREATE INDEX idx_post_reactions_created_at ON POST_REACTIONS(created_at);
CREATE INDEX idx_bookmarks_post_id ON BOOKMARKS(post_id);
CREATE INDEX idx_subscriptions_subject_id ON SUBSCRIPTIONS(subject_id);

ALTER TABLE COMMENTS DROP CONSTRAINT fk_comments_author;
ALTER TABLE COMMENTS ADD CONSTRAINT fk_comments_author FOREIGN KEY (author_id) REFERENCES USERS(id) ON DELETE CASCADE;
ALTER TABLE POSTS DROP CONSTRAINT fk_posts_author;
ALTER TABLE POSTS ADD CONSTRAINT fk_posts_author FOREIGN KEY (author_id) REFERENCES USERS(id) ON DELETE CASCADE;
