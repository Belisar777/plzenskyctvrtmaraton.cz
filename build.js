const fs = require('fs');
const path = require('path');

// Funkce pro nahrazení obsahu v souborech
const replaceInFiles = (dist, version) => {
  const files = fs.readdirSync(dist).filter(file => file.endsWith('.html'));
  const now = new Date().toISOString().split('T')[0] + 'T01:00:00+00:00';

  console.log('Probíhá náhrada v souborech');

  files.forEach(file => {
    const filePath = path.join(dist, file);
    let content = fs.readFileSync(filePath, 'utf-8');

    // Odstranění linku na w3.css
    content = content.replace(/<link .*href=.*w3.*>/g, '');

    // Úpravy cest
    content = content.replace(/src\/|\/js\//g, '');
    content = content.replace(/\.css/g, '.min.css');
    content = content.replace(/\.js/g, '.min.js');

    // Náhrada verzí a data
    content = content.replace(/{{VERSION}}/g, version);
    content = content.replace(/{{LAST_MOD}}/g, now);

    // Uložení změn
    fs.writeFileSync(filePath, content, 'utf-8');
  });

  // Aktualizace sitemap.xml
  const sitemapPath = path.join(dist, 'sitemap.xml');
  if (fs.existsSync(sitemapPath)) {
    let sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');
    sitemapContent = sitemapContent.replace(/{{LAST_MOD}}/g, now);
    fs.writeFileSync(sitemapPath, sitemapContent, 'utf-8');
  }

  console.log('Náhrada v souborech proběhla');
};

// Spuštění skriptu
const version = process.argv[2];
const distDir = path.join(__dirname, 'dist');

if (!version) {
  console.error('Prosím, zadejte verzi jako argument (např. npm run build:replace-version -- 1.0.0)');
  process.exit(1);
}

replaceInFiles(distDir, version);
