// 한글 포함 파일을 UTF-8 (no BOM) + LF 로 다시 저장
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const files = [
  'README.md', 'VERSION.md', 'CONNECT.md', 'SETUP_NOW.md', 'FRESH_DEPLOY.md',
  'DEPLOY_NOW.md', 'QUICK_START.md', 'DEPLOYMENT_GUIDE.md', 'AUTO_DEPLOY.md', 'TEST_GUIDE.md',
  'deploy.ps1', 'open-delete-pages.ps1', 'open-dashboards.ps1', 'connect-vercel-render.ps1',
];

files.forEach((f) => {
  const filePath = path.join(root, f);
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, { encoding: 'utf8' });
  content = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  fs.writeFileSync(filePath, content, { encoding: 'utf8', flag: 'w' });
  console.log('OK', f);
});

console.log('Done.');
