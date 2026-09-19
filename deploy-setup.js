/**
 * Deployment Setup Helper
 * This script helps configure the application for deployment
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setupDeployment() {
  console.log('========================================');
  console.log('  तैनाथी सेटअप (Deployment Setup)');
  console.log('========================================\n');

  try {
    // Get Supabase project details
    const projectRef = await question('तपाईंको Supabase Project Reference (उदाहरण: abcdefghijklmn): ');
    const anonKey = await question('तपाईंको Supabase Anon Key: ');

    if (!projectRef || !anonKey) {
      console.log('❌ Project reference र anon key आवश्यक छ।');
      rl.close();
      return;
    }

    const supabaseUrl = `https://${projectRef}.supabase.co`;
    const apiUrl = `${supabaseUrl}/functions/v1/api`;

    console.log('\n📝 Configuration अपडेट गर्दै...');

    // Update index.html
    const indexPath = path.join(__dirname, 'index.html');
    let indexContent = fs.readFileSync(indexPath, 'utf8');
    indexContent = indexContent.replace(
      /window\.SUPABASE_URL = 'https:\/\/YOUR_PROJECT_REF\.supabase\.co';/,
      `window.SUPABASE_URL = '${supabaseUrl}';`
    );
    indexContent = indexContent.replace(
      /window\.API_BASE_URL = 'https:\/\/YOUR_PROJECT_REF\.supabase\.co\/functions\/v1\/api';/,
      `window.API_BASE_URL = '${apiUrl}';`
    );
    fs.writeFileSync(indexPath, indexContent);
    console.log('✅ index.html updated');

    // Update login.html
    const loginPath = path.join(__dirname, 'login.html');
    let loginContent = fs.readFileSync(loginPath, 'utf8');
    loginContent = loginContent.replace(
      /window\.SUPABASE_URL = 'https:\/\/YOUR_PROJECT_REF\.supabase\.co';/,
      `window.SUPABASE_URL = '${supabaseUrl}';`
    );
    loginContent = loginContent.replace(
      /window\.API_BASE_URL = 'https:\/\/YOUR_PROJECT_REF\.supabase\.co\/functions\/v1\/api';/,
      `window.API_BASE_URL = '${apiUrl}';`
    );
    fs.writeFileSync(loginPath, loginContent);
    console.log('✅ login.html updated');

    // Update netlify.toml
    const netlifyPath = path.join(__dirname, 'netlify.toml');
    let netlifyContent = fs.readFileSync(netlifyPath, 'utf8');
    netlifyContent = netlifyContent.replace(
      /https:\/\/YOUR_SUPABASE_PROJECT_REF\.supabase\.co\/functions\/v1\/:splat/g,
      `${apiUrl}/:splat`
    );
    netlifyContent = netlifyContent.replace(
      /https:\/\/YOUR_SUPABASE_PROJECT_REF\.supabase\.co/g,
      supabaseUrl
    );
    fs.writeFileSync(netlifyPath, netlifyContent);
    console.log('✅ netlify.toml updated');

    // Update .env.example
    const envExamplePath = path.join(__dirname, '.env.example');
    let envContent = fs.readFileSync(envExamplePath, 'utf8');
    envContent = envContent.replace(/your-project\.supabase\.co/g, `${projectRef}.supabase.co`);
    envContent = envContent.replace(/your_supabase_anon_key/g, anonKey);
    fs.writeFileSync(envExamplePath, envContent);
    console.log('✅ .env.example updated');

    console.log('\n========================================');
    console.log('✅ Setup Complete!');
    console.log('========================================\n');
    console.log('अब तपाईंले गर्नुपर्ने कुराहरू:');
    console.log('1. Supabase Edge Functions deploy गर्नुहोस्:');
    console.log('   supabase functions deploy api');
    console.log('2. GitHub मा code push गर्नुहोस्');
    console.log('3. Netlify मा deploy गर्नुहोस्');
    console.log('4. Netlify environment variables set गर्नुहोस्:');
    console.log(`   SUPABASE_URL=${supabaseUrl}`);
    console.log(`   SUPABASE_ANON_KEY=${anonKey}`);
    console.log(`   API_BASE_URL=${apiUrl}`);
    console.log('\nविस्तृत जानकारीको लागि DEPLOYMENT.md हेर्नुहोस्।\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    rl.close();
  }
}

setupDeployment();
