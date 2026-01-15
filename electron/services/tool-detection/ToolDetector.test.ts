import { ToolDetector } from './ToolDetector';
import fs from 'fs/promises';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import os from 'os';
import child_process from 'child_process';

vi.mock('fs/promises');
vi.mock('os');
vi.mock('child_process');

describe('ToolDetector', () => {
    let detector: ToolDetector;
    const mockStat = fs.stat as Mock;
    const mockHomedir = os.homedir as Mock;
    const mockExec = child_process.exec as unknown as Mock;

    beforeEach(() => {
        detector = new ToolDetector();
        vi.clearAllMocks();
        mockHomedir.mockReturnValue('/Users/testuser');

        // Default exec behavior: command not found
        mockExec.mockImplementation((_cmd: string, callback: any) => {
            callback(new Error('Command not found'), { stdout: '', stderr: '' });
        });
    });

    it('should detect Cursor when App directory exists', async () => {
        mockStat.mockImplementation((path: string) => {
            if (path.includes('Cursor.app')) return Promise.resolve({ isDirectory: () => true });
            return Promise.reject(new Error('Not found'));
        });

        const results = await detector.detect();
        const cursor = results.find(r => r.id === 'cursor');

        expect(cursor).toBeDefined();
        expect(cursor!.isInstalled).toBe(true);
        expect(cursor!.paths.app).toContain('Cursor.app');
    });

    it('should detect CLI tools when valid command exists', async () => {
        mockExec.mockImplementation((cmd: string, callback: any) => {
            if (cmd.startsWith('which claude')) {
                // Pass standard 3-args: error, stdout, stderr
                callback(null, '/usr/local/bin/claude', '');
            } else if (cmd.includes('--version')) {
                callback(null, '1.0.0', '');
            } else {
                callback(new Error('Not found'), '', '');
            }
        });

        const results = await detector.detect();
        const claudeVal = results.find(r => r.id === 'claude-code');

        expect(claudeVal).toBeDefined();
        expect(claudeVal!.isInstalled).toBe(true);
        expect(claudeVal!.paths.bin).toBe('/usr/local/bin/claude');
        expect(claudeVal!.version).toBe('1.0.0');
    });

    it('should return config path even if not installed', async () => {
        mockStat.mockImplementation((path: string) => {
            if (path.includes('Application Support/Cursor')) return Promise.resolve({ isDirectory: () => true });
            return Promise.reject(new Error('Not found'));
        });

        const results = await detector.detect();
        const cursor = results.find(r => r.id === 'cursor');

        expect(cursor).toBeDefined();
        // isInstalled should be false if only config exists (based on our strategy decision)
        expect(cursor!.isInstalled).toBe(false);
        expect(cursor!.paths.config).toContain('Application Support/Cursor');
    });

    it('should return null from getCached() before detect() is called', () => {
        expect(detector.getCached()).toBeNull();
    });

    it('should return cached results after detect() is called', async () => {
        mockStat.mockImplementation((path: string) => {
            if (path.includes('Cursor.app')) return Promise.resolve({ isDirectory: () => true });
            return Promise.reject(new Error('Not found'));
        });

        await detector.detect();
        const cached = detector.getCached();

        expect(cached).not.toBeNull();
        expect(cached).toHaveLength(12); // SUPPORTED_TOOLS count
        const cursor = cached!.find(r => r.id === 'cursor');
        expect(cursor?.isInstalled).toBe(true);
    });
});
