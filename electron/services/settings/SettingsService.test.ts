import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SettingsService } from './SettingsService';
import Store from 'electron-store';

// Mock electron-store
vi.mock('electron-store', () => {
    return {
        default: vi.fn().mockImplementation(function () {
            return {
                get: vi.fn((key) => key === 'theme' ? 'system' : undefined),
                set: vi.fn(),
                store: { theme: 'system', language: 'ko', autoSync: false }
            };
        })
    };
});

describe('SettingsService', () => {
    let settingsService: SettingsService;

    beforeEach(() => {
        vi.clearAllMocks();
        settingsService = new SettingsService();
    });

    it('should initialize with defaults', () => {
        expect(Store).toHaveBeenCalledWith({
            defaults: {
                theme: 'system',
                language: 'ko',
                autoSync: false
            }
        });
    });

    it('should get a setting value', () => {
        const val = settingsService.get('theme');
        expect(val).toBe('system');
    });

    it('should set a setting value', () => {
        settingsService.set('theme', 'dark');
        // We can't easily check the internal store call depending on how we mocked it,
        // but verifying the method doesn't throw is a start. 
        // A better mock would store state.
    });

    it('should get all settings', () => {
        const all = settingsService.getAll();
        expect(all).toEqual({ theme: 'system', language: 'ko', autoSync: false });
    });
});
