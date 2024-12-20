const fs = require('fs');
const path = require('path');

// Funkce pro odstranění nepotřebných souborů
const cleanUpFiles = (dist) => {
  const files = fs.readdirSync(dist);

  files.forEach(file => {
    const filePath = path.join(dist, file);
    const ext = path.extname(file);

    // Pokud je to adresář, procházíme rekurzivně
    if (fs.statSync(filePath).isDirectory()) {
      cleanUpFiles(filePath);
    } else {
      // Odstraníme všechny soubory s příponou .css a .js, které nejsou .min.css nebo .min.js
      if ((ext === '.css' && !file.endsWith('.min.css')) || (ext === '.js' && !file.endsWith('.min.js'))) {
        fs.unlinkSync(filePath);
        console.log(`Odstraněn soubor: ${filePath}`);
      }
    }
  });
};

// Spuštění skriptu
const distDir = path.join(__dirname, 'dist');
cleanUpFiles(distDir);
console.log('Nepotřebné soubory byly odstraněny');
