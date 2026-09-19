/**
 * Check and create admin user with correct password hash
 * Run this in Supabase SQL Editor
 */

const sqlCommands = `
-- First, check if admin user exists
SELECT * FROM users WHERE username = 'admin';

-- If admin user doesn't exist, create it
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
  status = EXCLUDED.status;

-- Verify the user was created/updated
SELECT id, username, mahashakha, shakha, role, status FROM users WHERE username = 'admin';
`;

console.log('Copy and run this SQL in Supabase SQL Editor:');
console.log(sqlCommands);
