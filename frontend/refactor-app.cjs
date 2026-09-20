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

const files = walkDir('src/app');

files.forEach(file => {
  let c = fs.readFileSync(file, 'utf8');
  let original = c;
  
  if (!c.includes('use client')) {
    c = '"use client";\n' + c;
  }
  
  c = c.replace(/import\s+\{\s*Link\s*\}\s+from\s+['"]react-router-dom['"];/g, 'import Link from "next/link";');
  c = c.replace(/import\s+\{\s*Link,\s*useNavigate\s*\}\s+from\s+['"]react-router-dom['"];/g, 'import Link from "next/link";\nimport { useRouter } from "next/navigation";');
  c = c.replace(/import\s+\{\s*useNavigate,\s*Link\s*\}\s+from\s+['"]react-router-dom['"];/g, 'import Link from "next/link";\nimport { useRouter } from "next/navigation";');
  c = c.replace(/import\s+\{\s*Link,\s*useParams,\s*useNavigate\s*\}\s+from\s+['"]react-router-dom['"];/g, 'import Link from "next/link";\nimport { useRouter, useParams } from "next/navigation";');
  c = c.replace(/import\s+\{\s*useParams,\s*useNavigate\s*\}\s+from\s+['"]react-router-dom['"];/g, 'import { useRouter, useParams } from "next/navigation";');
  c = c.replace(/import\s+\{\s*useParams\s*\}\s+from\s+['"]react-router-dom['"];/g, 'import { useParams } from "next/navigation";');
  c = c.replace(/import\s+\{\s*useNavigate\s*\}\s+from\s+['"]react-router-dom['"];/g, 'import { useRouter } from "next/navigation";');
  c = c.replace(/import\s+\{\s*useSearchParams\s*\}\s+from\s+['"]react-router-dom['"];/g, 'import { useSearchParams } from "next/navigation";');
  
  c = c.replace(/useNavigate\(\)/g, 'useRouter()');
  
  if (original !== c) {
    fs.writeFileSync(file, c);
    console.log('Updated ' + file);
  }
});
