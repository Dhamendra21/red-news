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

  c = c.replace(/state\s*=>\s*state\.auth/g, 'state => state?.auth || {}');
  c = c.replace(/state\s*=>\s*state\.news/g, 'state => state?.news || {}');
  c = c.replace(/state\s*=>\s*state\.ui/g, 'state => state?.ui || {}');
  c = c.replace(/\(state\)\s*=>\s*state\.auth/g, '(state) => state?.auth || {}');
  c = c.replace(/\(state\)\s*=>\s*state\.news/g, '(state) => state?.news || {}');
  c = c.replace(/\(state\)\s*=>\s*state\.ui/g, '(state) => state?.ui || {}');

  if (original !== c) {
    fs.writeFileSync(file, c);
    console.log('Fixed useSelector in ' + file);
  }
});
