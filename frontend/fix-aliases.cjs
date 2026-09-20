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

  // Fix unterminated string constants and normalize quotes for imports
  // E.g. import X from "../../../services/api'; => import X from "@/services/api";
  c = c.replace(/import\s+(.*?)\s+from\s+["'](\.*\/[^"']+)["'];?/g, (match, p1, p2) => {
    // p2 is the path, e.g. ../../components/Header
    let newPath = p2;
    if (newPath.includes('/components/')) newPath = '@/components/' + newPath.split('/components/')[1];
    else if (newPath.includes('/store/')) newPath = '@/store/' + newPath.split('/store/')[1];
    else if (newPath.includes('/services/')) newPath = '@/services/' + newPath.split('/services/')[1];
    else if (newPath.includes('/utils/')) newPath = '@/utils/' + newPath.split('/utils/')[1];
    else if (newPath.includes('/hooks/')) newPath = '@/hooks/' + newPath.split('/hooks/')[1];

    return `import ${p1} from "${newPath}";`;
  });

  if (original !== c) {
    fs.writeFileSync(file, c);
    console.log('Fixed aliases in ' + file);
  }
});
