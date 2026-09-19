DO $$
DECLARE
    tbl text;
BEGIN
    FOR tbl IN
        SELECT table_name
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND column_name = 'id'
          AND data_type = 'uuid'
          AND table_name IN (
              'ujiri_entries',
              'office_monitoring',
              'dress_time_monitoring',
              'service_survey',
              'investigations',
              'technical_audit',
              'project_monitoring'
          )
        GROUP BY table_name
    LOOP
        EXECUTE format('ALTER TABLE %I DROP CONSTRAINT IF EXISTS %I_pkey;', tbl, tbl);
        EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS __integer_id INTEGER;', tbl);
        EXECUTE format(
            'UPDATE %I AS t SET __integer_id = s.rn FROM (SELECT ctid, row_number() OVER (ORDER BY id) AS rn FROM %I) AS s WHERE t.ctid = s.ctid;',
            tbl,
            tbl
        );
        EXECUTE format('ALTER TABLE %I DROP COLUMN IF EXISTS id;', tbl);
        EXECUTE format('ALTER TABLE %I RENAME COLUMN __integer_id TO id;', tbl);
        EXECUTE format('ALTER TABLE %I ALTER COLUMN id SET NOT NULL;', tbl);
        EXECUTE format('CREATE SEQUENCE IF NOT EXISTS %I_id_seq;', tbl);
        EXECUTE format('ALTER TABLE %I ALTER COLUMN id SET DEFAULT nextval(%L);', tbl, tbl || '_id_seq');
        EXECUTE format('SELECT setval(%L, COALESCE((SELECT MAX(id) FROM %I), 0) + 1, true);', tbl || '_id_seq', tbl);
        EXECUTE format('ALTER TABLE %I ADD PRIMARY KEY (id);', tbl);
    END LOOP;
END $$;
