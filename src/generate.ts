import fs from 'fs';
import path from 'path';

// Project types and configuration
interface ProjectConfig {
  name: string;
  basePath: string;
  count: number;
  generateFileContent: (index: number) => string;
  getFileName: (index: number) => string;
}

// Utility functions
const createDirectoryIfNotExists = async (dirPath: string) => {
  await fs.promises.mkdir(dirPath, { recursive: true });
};

const cleanDirectory = async (dirPath: string, excludeFiles: string[] = []) => {
  const files = await fs.promises.readdir(dirPath);
  for (const file of files) {
    if (!excludeFiles.includes(file)) {
      await fs.promises.unlink(path.join(dirPath, file));
    }
  }
};

const generateIndexFile = async (
  files: { index: number; fileName: string }[],
  outputPath: string
) => {
  const indexContent = files
    .map(({ fileName }) => `export * from './${fileName.replace('.ts', '')}';`)
    .join('\n');
  await fs.promises.writeFile(outputPath, indexContent + '\n');
};

// Content generators
const generateSimpleFunction = (index: number): string => {
  const functionName = `myFunction${index}`;
  return `export const ${functionName} = () => {
  console.log('Hello from function ${index}!');
};
`;
};

const generateTypedFunction = (index: number): string => {
  const functionName = `myFunction${index}`;
  const interfaceName = `Options${index}`;
  
  // Generate interface with 50 optional attributes
  let interfaceContent = `interface ${interfaceName} {\n`;
  for (let i = 1; i <= 50; i++) {
    interfaceContent += `  prop${i}?: string;\n`;
  }
  interfaceContent += '}\n\n';
  
  return `${interfaceContent}export const ${functionName} = (options?: ${interfaceName}) => {
  console.log('Hello from function ${index}!', options);
};
`;
};

// Project generator
const generateProject = async (config: ProjectConfig) => {
  const { name, basePath, count, generateFileContent, getFileName } = config;
  
  console.log(`Generating project: ${name}`);
  const projectDir = path.join(basePath, name, 'src');
  const indexFilePath = path.join(projectDir, 'index.ts');
  
  try {
    // Setup directory
    await createDirectoryIfNotExists(projectDir);
    await cleanDirectory(projectDir, ['index.ts']);
    
    const generatedFiles: { index: number; fileName: string }[] = [];
    
    // Generate function files
    for (let i = 1; i <= count; i++) {
      const fileName = getFileName(i);
      const filePath = path.join(projectDir, fileName);
      const fileContent = generateFileContent(i);

      await fs.promises.writeFile(filePath, fileContent);
      generatedFiles.push({ index: i, fileName });
    }
    
    // Generate index file
    await generateIndexFile(generatedFiles, indexFilePath);
    
    console.log(`Successfully generated ${count} files for ${name}`);
  } catch (error) {
    console.error(`Error generating project ${name}:`, error);
    throw error;
  }
};

// Main function
const generate = async () => {
  const basePath = path.join(__dirname, '../', 'projects');
  
  const projects: ProjectConfig[] = [
    {
      name: 'thousand-functions',
      basePath,
      count: 1000,
      generateFileContent: generateSimpleFunction,
      getFileName: (index) => `function${index}.ts`
    },
    {
      name: 'thousand-typed-functions',
      basePath,
      count: 1000,
      generateFileContent: generateTypedFunction,
      getFileName: (index) => `function${index}.ts`
    }
  ];
  
  for (const project of projects) {
    await generateProject(project);
  }
};

generate().catch((err) => {
  console.error('Error generating files:', err);
  process.exit(1);
});
