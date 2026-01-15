import path from 'path';
import fs from 'fs/promises';
import os from 'os';
import { exec } from 'child_process';
import { ToolDetectionResult } from '../../../shared/api';
import { SUPPORTED_TOOLS } from './ToolDefinitions';

const LOG_FILE = path.resolve(process.cwd(), 'tool-detection-debug.log');

async function logToFile(message: string) {
    const timestamp = new Date().toISOString();
    const logLine = `[${timestamp}] ${message}\n`;
    try {
        await fs.appendFile(LOG_FILE, logLine);
    } catch (e) {
        console.error('Failed to write to log file:', e);
    }
}

export class ToolDetector {
    private cachedResults: ToolDetectionResult[] | null = null;

    getCached(): ToolDetectionResult[] | null {
        return this.cachedResults;
    }

    private execPromise(command: string): Promise<{ stdout: string; stderr: string }> {
        return new Promise((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                } else {
                    resolve({ stdout: stdout as string, stderr: stderr as string });
                }
            });
        });
    }

    async detect(): Promise<ToolDetectionResult[]> {
        await logToFile(`[ToolDetector] Starting detection. Tool definitions count: ${SUPPORTED_TOOLS.length}`);
        await logToFile(`[ToolDetector] Current PATH: ${process.env.PATH}`);
        
        console.log(`[ToolDetector] Starting detection. Tool definitions count: ${SUPPORTED_TOOLS.length}`);
        console.log(`[ToolDetector] Current PATH: ${process.env.PATH}`);
        
        const results: ToolDetectionResult[] = [];
        const homeDir = os.homedir();

        for (const tool of SUPPORTED_TOOLS) {
            await logToFile(`[ToolDetector] Checking tool: ${tool.name}`);
            console.log(`[ToolDetector] Checking tool: ${tool.name}`);
            
            const result: ToolDetectionResult = {
                id: tool.id,
                name: tool.name,
                type: tool.type,
                isInstalled: false,
                paths: {}
            };

            // 1. App Bundle Detection (Mac)
            if (tool.detection.macAppPath) {
                for (const appPath of tool.detection.macAppPath) {
                    const resolvedPath = appPath.replace('~', homeDir);
                    await logToFile(`[ToolDetector] Checking macAppPath: ${resolvedPath}`);
                    console.log(`[ToolDetector] Checking macAppPath: ${resolvedPath}`);
                    
                    const exists = await this.checkDirectoryExists(resolvedPath);
                    await logToFile(`[ToolDetector] Exists: ${exists}`);
                    console.log(`[ToolDetector] Exists: ${exists}`);
                    
                    if (exists) {
                        result.isInstalled = true;
                        result.paths.app = resolvedPath;
                        await logToFile(`[ToolDetector] ✓ Found ${tool.name} at ${resolvedPath}`);
                        console.log(`[ToolDetector] ✓ Found ${tool.name} at ${resolvedPath}`);
                        break;
                    }
                }
            }

            // 2. CLI Detection
            if (tool.detection.cliCommand) {
                try {
                    // Check existence using shell to load user's PATH
                    const shell = process.env.SHELL || '/bin/zsh';
                    await this.execPromise(`${shell} -lc 'which ${tool.detection.cliCommand}'`);
                    result.paths.bin = await this.getCommandPath(tool.detection.cliCommand);
                    result.isInstalled = true;

                    // Try to get version
                    try {
                        const { stdout } = await this.execPromise(`${shell} -lc '${tool.detection.cliCommand} --version'`);
                        result.version = stdout.trim();
                    } catch (e) {
                        console.debug(`[ToolDetector] Version check failed for ${tool.name}:`, e);
                    }
                } catch (e) {
                    const error = e as Error;
                    console.warn(`[ToolDetector] CLI check failed for ${tool.name}:`, error.message || String(e));
                }
            }

            // 3. Config Directory Detection
            if (tool.detection.configDirSuffix) {
                const configPath = path.join(homeDir, 'Library', 'Application Support', tool.detection.configDirSuffix);
                if (await this.checkDirectoryExists(configPath)) {
                    // Note: We don't set isInstalled=true JUST based on config dir, 
                    // as it might be leftover from uninstallation. 
                    // But we DO return the path if found.
                    result.paths.config = configPath;
                }
            }

            console.log(`[ToolDetector] Result for ${tool.name}:`, { isInstalled: result.isInstalled, paths: result.paths });
            results.push(result);
        }

        console.log(`[ToolDetector] Detection complete. Found ${results.filter(r => r.isInstalled).length} installed tools.`);
        this.cachedResults = results;
        return results;
    }

    private async checkDirectoryExists(dirPath: string): Promise<boolean> {
        try {
            const stats = await fs.stat(dirPath);
            const isDir = stats.isDirectory();
            await logToFile(`[ToolDetector] checkDirectoryExists: ${dirPath} -> exists=${true}, isDirectory=${isDir}`);
            console.log(`[ToolDetector] checkDirectoryExists: ${dirPath} -> exists=${true}, isDirectory=${isDir}`);
            return isDir;
        } catch (error) {
            const err = error as any;
            await logToFile(`[ToolDetector] checkDirectoryExists: ${dirPath} -> error=${err.code || err.message}`);
            console.log(`[ToolDetector] checkDirectoryExists: ${dirPath} -> error=${err.code || err.message}`);
            return false;
        }
    }

    private async getCommandPath(command: string): Promise<string> {
        try {
            const shell = process.env.SHELL || '/bin/zsh';
            const { stdout } = await this.execPromise(`${shell} -lc 'which ${command}'`);
            return stdout.trim();
        } catch {
            return '';
        }
    }
}
