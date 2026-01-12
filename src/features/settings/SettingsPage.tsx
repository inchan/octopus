import { useState, useEffect } from 'react';
import { SettingsSchema } from '@shared/types';

export const SettingsPage = () => {
    const [settings, setSettings] = useState<Partial<SettingsSchema>>({});
    const [status, setStatus] = useState<string>('');

    const applyTheme = (theme: string) => {
        const root = window.document.documentElement;
        const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

        if (isDark) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    };

    useEffect(() => {
        let mounted = true;
        const init = async () => {
            const all = await window.api.settings.getAll();
            if (mounted) {
                setSettings(all);
            }
        };
        init();
        return () => { mounted = false; };
    }, []);

    // Apply theme whenever settings change
    useEffect(() => {
        if (settings.theme) {
            applyTheme(settings.theme);
        }
    }, [settings.theme]);

    const handleChange = <K extends keyof SettingsSchema>(key: K, value: SettingsSchema[K]) => {
        setSettings((prev) => ({ ...prev, [key]: value }));
        window.api.settings.set(key, value);

        // Immediate visual feedback for boolean toggles
        if (typeof value === 'boolean') {
            // Optional: Add sound or haptic feedback here
        }

        setStatus('Saved');
        setTimeout(() => setStatus(''), 2000);
    };

    return (
        <div className="p-6 h-full overflow-y-auto" data-testid="settings-page">
            <h2 className="text-2xl font-semibold mb-6 text-white">Settings</h2>

            <div className="max-w-2xl space-y-8">
                {/* General Settings */}
                <section className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 backdrop-blur-sm">
                    <h3 className="text-lg font-medium mb-4 text-blue-400 flex items-center gap-2">
                        <span className="i-lucide-monitor w-5 h-5"></span>
                        General
                    </h3>

                    <div className="space-y-4">
                        {/* Theme */}
                        <div className="flex items-center justify-between p-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-200">Theme</label>
                                <p className="text-xs text-gray-400">Select application appearance</p>
                            </div>
                            <select
                                value={settings.theme || 'system'}
                                onChange={(e) => handleChange('theme', e.target.value as SettingsSchema['theme'])}
                                className="bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none w-32"
                                data-testid="settings-theme-select"
                            >
                                <option value="system">System</option>
                                <option value="light">Light</option>
                                <option value="dark">Dark</option>
                            </select>
                        </div>

                        {/* Language */}
                        <div className="flex items-center justify-between p-2 border-t border-gray-700/50 pt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-200">Language</label>
                                <p className="text-xs text-gray-400">Select interface language</p>
                            </div>
                            <select
                                value={settings.language || 'ko'}
                                onChange={(e) => handleChange('language', e.target.value as SettingsSchema['language'])}
                                className="bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none w-32"
                                data-testid="settings-language-select"
                            >
                                <option value="en">English</option>
                                <option value="ko">한국어</option>
                            </select>
                        </div>

                        {/* Auto Sync */}
                        <div className="flex items-center justify-between p-2 border-t border-gray-700/50 pt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-200">Auto Sync</label>
                                <p className="text-xs text-gray-400">Automatically sync changes to files</p>
                            </div>
                            <button
                                onClick={() => handleChange('autoSync', !settings.autoSync)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${settings.autoSync ? 'bg-blue-600' : 'bg-gray-700'}`}
                                data-testid="settings-autosync-toggle"
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.autoSync ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                        </div>
                    </div>
                </section>

                {/* API Keys Section */}
                <section className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 backdrop-blur-sm">
                    <h3 className="text-lg font-medium mb-4 text-emerald-400 flex items-center gap-2">
                        <span className="i-lucide-key w-5 h-5"></span>
                        LLM API Keys
                    </h3>

                    <div className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">OpenAI API Key</label>
                            <input
                                type="password"
                                value={settings.openAIKey || ''}
                                onChange={(e) => handleChange('openAIKey', e.target.value)}
                                placeholder="sk-..."
                                className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder-gray-600"
                                data-testid="settings-openai-key-input"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Anthropic API Key</label>
                            <input
                                type="password"
                                value={settings.anthropicKey || ''}
                                onChange={(e) => handleChange('anthropicKey', e.target.value)}
                                placeholder="sk-ant-..."
                                className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder-gray-600"
                                data-testid="settings-anthropic-key-input"
                            />
                        </div>
                    </div>
                </section>

                {status && (
                    <div className="fixed bottom-8 right-8 bg-emerald-600/90 backdrop-blur text-white px-6 py-3 rounded-lg shadow-xl animate-fade-in flex items-center gap-2 font-medium" data-testid="settings-toast">
                        <span className="i-lucide-check w-4 h-4"></span>
                        {status}
                    </div>
                )}
            </div>
        </div>
    );
};
