import fs from 'fs';
import path from 'path';

const generate = async () => {
  const baseDir = path.join(__dirname, '../', 'projects', 'thousand-functions', 'src');
  const indexFile = path.join(baseDir, 'index.ts');

  // Create directories if they don't exist
  await fs.promises.mkdir(baseDir, { recursive: true });
  // Clean up the directory
  const files = await fs.promises.readdir(baseDir);
  for (const file of files) {
    const filePath = path.join(baseDir, file);
    if (file !== 'index.ts') {
      await fs.promises.unlink(filePath);
    }
  }

  let indexContent = '';

  for (let i = 1; i <= 1000; i++) {
    const fileName = `function${i}.ts`;
    const filePath = path.join(baseDir, fileName);
    const functionName = `myFunction${i}`;

    const fileContent = `export const ${functionName} = () => {
  console.log('Hello from function ${i}!');
};
`;

    await fs.promises.writeFile(filePath, fileContent);

    indexContent += `export * from './${fileName.replace('.ts', '')}';\n`;
  }

  await fs.promises.writeFile(indexFile, indexContent);
};

generate().catch((err) => {
  console.error('Error generating files:', err);
});
