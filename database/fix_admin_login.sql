-- Align the live Supabase admin user with the same PBKDF2 hash used by the Netlify auth function.
-- Default login: username = admin, password = admin123

INSERT INTO users (username, password_hash, mahashakha, shakha, role, status)
VALUES (
  'admin',
  '42a1591948f587333ae9f59924dc8c8e23ce741b42be79c7e09d3d59a4a671b6',
  'प्रशासन तथा सूचना सङ्कलन महाशाखा',
  'प्रशासन, योजना तथा अनुगमन शाखा',
  'admin',
  'active'
)
ON CONFLICT (username) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  status = EXCLUDED.status,
  mahashakha = EXCLUDED.mahashakha,
  shakha = EXCLUDED.shakha,
  role = EXCLUDED.role;

SELECT id, username, mahashakha, shakha, role, status
FROM users
WHERE username = 'admin';
