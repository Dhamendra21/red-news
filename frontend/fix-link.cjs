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
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) { 
      results.push(file);
    }
  });
  return results;
}

const files = walkDir('src');

files.forEach(file => {
  let c = fs.readFileSync(file, 'utf8');
  let original = c;

  // Replace <Link to="..."> and <Link to={...}> with href
  // Since we imported Link from next/link, we need href.
  c = c.replace(/<Link\s+to=/g, '<Link href=');

  if (original !== c) {
    fs.writeFileSync(file, c);
    console.log('Fixed Link props in ' + file);
  }
});
