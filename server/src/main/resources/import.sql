-- INSERT INTO users (uuid, username, password, role)
-- VALUES (
--     '550e8400-e29b-41d4-a716-446655440000',
--     'admin',
--     'password',
--     'ADMIN'
--   );
CREATE EXTENSION IF NOT EXISTS pg_trgm;

ALTER TABLE course
  ADD COLUMN search_vector tsvector
    GENERATED ALWAYS AS (
      setweight(to_tsvector('simple', coalesce(address, '')), 'A') ||
      setweight(to_tsvector('simple', coalesce(city, '')), 'B') ||
      setweight(to_tsvector('simple', coalesce(postal_code, '')), 'C')
    ) STORED;

CREATE INDEX idx_course_search
  ON course
  USING gin (search_vector);