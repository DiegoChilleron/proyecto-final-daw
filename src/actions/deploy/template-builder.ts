import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { promises as fs } from 'fs';
import { copyDir, directoryExists, writeFile, removeDir } from './file-utils';
import { generateEnvContent } from './env-generator';

const execAsync = promisify(exec);

const TEMPLATES_DIR = path.join(process.cwd(), 'templates');
export const BUILDS_DIR = path.join(TEMPLATES_DIR, 'builds');
export const SOURCES_DIR = path.join(TEMPLATES_DIR, 'sources');

export async function findTemplateSource(templateType: string, templateSlug: string): Promise<string | null> {
    const exactPath = path.join(SOURCES_DIR, templateType, templateSlug);
    if (await directoryExists(exactPath)) {
        return exactPath;
    }

    const typePath = path.join(SOURCES_DIR, templateType);
    try {
        const templates = await fs.readdir(typePath);
        const first = templates.find(t => !t.startsWith('.'));
        return first ? path.join(typePath, first) : null;
    } catch {
        return null;
    }
}

export async function prepareBuildDirectory(sourceDir: string, subdomain: string): Promise<string> {
    const buildDir = path.join(BUILDS_DIR, subdomain);

    if (await directoryExists(buildDir)) {
        await removeDir(buildDir);
    }

    await copyDir(sourceDir, buildDir);
    return buildDir;
}

export async function configureEnvironment(buildDir: string, siteConfig: Record<string, unknown>): Promise<void> {
    const envContent = generateEnvContent(siteConfig);
    await writeFile(path.join(buildDir, '.env'), envContent);
    await writeFile(path.join(buildDir, '.env.local'), envContent);
}

export async function buildProject(buildDir: string): Promise<void> {
    const cleanEnv = {
        PATH: process.env.PATH,
        HOME: process.env.HOME,
        NODE_ENV: 'production' as const,
    } as NodeJS.ProcessEnv;

    await execAsync('npm install --legacy-peer-deps', { cwd: buildDir, env: cleanEnv });
    await execAsync('npm run build', { cwd: buildDir, env: cleanEnv });
}

export async function getOutputDirectory(buildDir: string): Promise<string | null> {
    const outDir = path.join(buildDir, 'out');
    return (await directoryExists(outDir)) ? outDir : null;
}
