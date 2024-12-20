const fs = require('fs');
const path = require('path');

// Cesta k souboru config.json
const configPath = path.join(__dirname, 'config.json');

// Funkce pro načtení konfigurace ze souboru config.json
function loadConfig() {
  try {
    const configData = fs.readFileSync(configPath, 'utf-8');
    return JSON.parse(configData);
  } catch (error) {
    console.error(`Chyba při načítání souboru config.json: ${error.message}`);
    process.exit(1); // Ukončí skript s chybovým kódem
  }
}

const isEmailAndConvertToEntities = (input) => {
  // Regulární výraz pro validaci emailové adresy
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Ověření, zda vstup odpovídá emailové adrese
  if (emailRegex.test(input)) {
    // Funkce pro převod textu do HTML entit
    return input
      .split('')
      .map(char => `&#${char.charCodeAt(0)};`)
      .join('');
  } else {
    return input;
  }
};


// Funkce pro rekurzivní procházení adresářů a vyhledávání souborů s příponami .html a .js
function getFiles(dir, fileTypes = ['.html', '.js']) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(filePath, fileTypes)); // Rekurzivní procházení
    } else if (fileTypes.includes(path.extname(file))) {
      results.push(filePath);
    }
  });
  return results;
}

// Funkce pro nahrazení placeholderů ve zvoleném souboru
function replacePlaceholdersInFile(filePath, config) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    // Provede nahrazení pro všechny vlastnosti z config.json
    for (const [key, value] of Object.entries(config)) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      content = content.replace(regex, isEmailAndConvertToEntities(value));
    }
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✓ Nahrazeny vlastnosti v souboru: ${filePath}`);
  } catch (error) {
    console.error(`Chyba při zpracování souboru ${filePath}: ${error.message}`);
  }
}

// Spuštění hlavního skriptu
function main() {
  const config = loadConfig();
  const files = getFiles(__dirname + "/dist");

  if (files.length === 0) {
    console.log('Nenalezeny žádné soubory pro úpravu.');
    return;
  }

  files.forEach((filePath) => {
    replacePlaceholdersInFile(filePath, config);
  });

  console.log('Nahrazení placeholderů dokončeno.');
}

// Spuštění skriptu
main();
