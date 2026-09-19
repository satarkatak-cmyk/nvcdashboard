/**
 * Generate PBKDF2 password hash for admin123
 * This matches the hashing method used in Supabase Edge Function
 */

async function generatePasswordHash(password) {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  const salt = encoder.encode('supabase-dashboard-salt');
  const hashBuffer = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    256
  );
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// Generate hash for admin123
generatePasswordHash('admin123').then(hash => {
  console.log('Password hash for "admin123":');
  console.log(hash);
  console.log('\nCopy this hash and run this SQL in Supabase SQL Editor:');
  console.log(`UPDATE users SET password_hash = '${hash}' WHERE username = 'admin';`);
});
