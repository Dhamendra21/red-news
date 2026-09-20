const fs = require('fs');
const path = require('path');

function walkDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walkDir(file));
    } else if (file.endsWith('.jsx')) { 
      results.push(file);
    }
  });
  return results;
}

const files = walkDir('src');

files.forEach(file => {
  let c = fs.readFileSync(file, 'utf8');
  let original = c;
  
  // Remove react-helmet-async import
  c = c.replace(/import\s+\{\s*Helmet\s*\}\s+from\s+['"]react-helmet-async['"];?\r?\n/g, '');
  c = c.replace(/import\s+\{\s*HelmetProvider\s*\}\s+from\s+['"]react-helmet-async['"];?\r?\n/g, '');
  
  // Remove <Helmet>...</Helmet> blocks
  c = c.replace(/<Helmet>[\s\S]*?<\/Helmet>/g, '');
  
  // Clean up empty Fragments <></> left behind if Helmet was the only thing
  c = c.replace(/<>\s*<\/>/g, 'null');
  
  if (original !== c) {
    fs.writeFileSync(file, c);
    console.log('Updated ' + file);
  }
});
