const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    content = content.replace(/Mocklingo AI/gi, 'SkillScan AI');
    content = content.replace(/Mocklingo/gi, 'SkillScan');
    
    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${filePath}`);
    }
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (!fullPath.includes('node_modules') && !fullPath.includes('.git')) {
                walkDir(fullPath);
            }
        } else {
            if (/\.(js|jsx|json|html|md|css)$/.test(file)) {
                replaceInFile(fullPath);
            }
        }
    }
}

walkDir(path.join(__dirname, 'src'));
replaceInFile(path.join(__dirname, 'index.html'));
console.log('Renaming complete.');
