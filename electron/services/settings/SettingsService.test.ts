import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SettingsService } from './SettingsService';
import Store from 'electron-store';

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
        expect(settingsService.get('theme')).toBe('system');
    });

    it('should set a setting value', () => {
        settingsService.set('theme', 'dark');
    });

    it('should get all settings', () => {
        const all = settingsService.getAll();
        expect(all).toEqual({ theme: 'system', language: 'ko', autoSync: false });
    });
});
