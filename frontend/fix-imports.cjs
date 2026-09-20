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

  // 1. Fix react-router-dom remaining edge cases
  c = c.replace(/import\s+\{[^}]*\}\s+from\s+['"]react-router-dom['"];?\r?\n/g, match => {
    let replaced = match;
    if (replaced.includes('useNavigate') && replaced.includes('useLocation') && replaced.includes('Link')) {
       return 'import Link from "next/link";\nimport { useRouter, usePathname } from "next/navigation";\n';
    }
    if (replaced.includes('useNavigate') && replaced.includes('useParams')) {
       return 'import { useRouter, useParams } from "next/navigation";\n';
    }
    if (replaced.includes('useNavigate') && replaced.includes('Link')) {
       return 'import Link from "next/link";\nimport { useRouter } from "next/navigation";\n';
    }
    if (replaced.includes('Link') && replaced.includes('useSearchParams')) {
       return 'import Link from "next/link";\nimport { useSearchParams } from "next/navigation";\n';
    }
    if (replaced.includes('Link')) {
       return 'import Link from "next/link";\n';
    }
    if (replaced.includes('useNavigate')) {
       return 'import { useRouter } from "next/navigation";\n';
    }
    return '';
  });

  // 2. Fix Relative Paths
  // Files moved from src/pages/public/XYZ.jsx -> src/app/(public)/XYZ/page.jsx (1 level deeper)
  // Therefore ../../ becomes ../../../
  // Let's do a simple replace for all files inside src/app/
  if (file.includes('src\\app\\') || file.includes('src/app/')) {
      const depth = file.split(path.sep).length;
      
      // If the file is in (public)/[route]/page.jsx, the depth from src is 4
      // src -> app -> (public) -> route -> page.jsx
      // src/pages/public/route.jsx was depth 3
      // We can just statically replace these known bad imports
      
      c = c.replace(/from\s+['"]\.\.\/\.\.\/store/g, 'from "../../../store');
      c = c.replace(/from\s+['"]\.\.\/\.\.\/components/g, 'from "../../../components');
      c = c.replace(/from\s+['"]\.\.\/\.\.\/services/g, 'from "../../../services');
      c = c.replace(/from\s+['"]\.\.\/\.\.\/utils/g, 'from "../../../utils');
  }

  // Edge case for admin edit page
  if (file.includes('edit') && file.includes('[id]')) {
      c = c.replace(/from\s+['"]\.\/AdminNewsCreate['"]/g, 'from "../../../../../components/admin/AdminNewsCreate"'); 
      // wait, AdminNewsCreate is in app/admin/news/create/page.jsx now. 
      // Next.js doesn't allow exporting default from another page like that cleanly if they are both pages.
  }

  if (original !== c) {
    fs.writeFileSync(file, c);
    console.log('Updated ' + file);
  }
});
