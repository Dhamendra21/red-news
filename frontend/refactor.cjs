const fs = require('fs');
const path = require('path');

const components = [
  'NewsCard.jsx', 
  'BreakingNewsTicker.jsx', 
  'PrivateRoute.jsx', 
  'Layout.jsx', 
  'Header.jsx', 
  'Footer.jsx', 
  'AdminLayout.jsx'
];

const dirs = [
  'news', 
  'home', 
  'common', 
  'common', 
  'common', 
  'common', 
  'admin'
];

components.forEach((comp, i) => {
  const p = path.join('src', 'components', dirs[i], comp);
  if(fs.existsSync(p)) {
    let c = fs.readFileSync(p, 'utf8');
    
    // Add use client
    if (!c.includes('use client')) {
      c = '"use client";\n' + c;
    }
    
    // Replace react-router-dom imports
    c = c.replace(/import\s+\{\s*Link\s*\}\s+from\s+['"]react-router-dom['"];/g, 'import Link from "next/link";');
    c = c.replace(/import\s+\{\s*Link,\s*useNavigate\s*\}\s+from\s+['"]react-router-dom['"];/g, 'import Link from "next/link";\nimport { useRouter } from "next/navigation";');
    c = c.replace(/import\s+\{\s*Outlet,\s*Link,\s*useLocation,\s*useNavigate\s*\}\s+from\s+['"]react-router-dom['"];/g, 'import Link from "next/link";\nimport { usePathname, useRouter } from "next/navigation";');
    c = c.replace(/import\s+\{\s*Outlet\s*\}\s+from\s+['"]react-router-dom['"];/g, '');
    c = c.replace(/import\s+\{\s*Link,\s*useLocation,\s*useNavigate\s*\}\s+from\s+['"]react-router-dom['"];/g, 'import Link from "next/link";\nimport { usePathname, useRouter } from "next/navigation";');
    
    // Replace hooks
    c = c.replace(/useNavigate\(\)/g, 'useRouter()');
    c = c.replace(/useLocation\(\)/g, '{ pathname: usePathname() }');
    
    // Replace Outlet with children
    c = c.replace(/export default function Layout\(\)/g, 'export default function Layout({ children })');
    c = c.replace(/<Outlet \/>/g, '{children}');
    
    fs.writeFileSync(p, c);
    console.log('Updated ' + comp);
  }
});
