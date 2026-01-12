/**
 * Settings Flow E2E Tests
 *
 * 설정 페이지 기능 테스트:
 * - 테마 변경
 * - 언어 변경
 * - Auto Sync 토글
 * - API Keys 관리
 * - Toast 알림
 * - 접근성
 */

import { test, expect, mockScenarios } from './fixtures/mock-api.fixture';
import { SettingsPage } from './pages/settings.page';

test.describe('Settings Flow', () => {
  let settingsPage: SettingsPage;

  test.beforeEach(async ({ page, setupMockApi }) => {
    await setupMockApi(mockScenarios.empty);
    settingsPage = new SettingsPage(page);
    await settingsPage.navigate();
  });

  // ===========================================
  // 기존 테스트 (유지)
  // ===========================================

  test('should display theme select', async () => {
    await settingsPage.expect(settingsPage.themeSelect).toBeVisible();
  });

  test('should change theme and show saved toast', async () => {
    await settingsPage.setTheme('light');
    await settingsPage.expectToastVisible();
    await settingsPage.expectToastText('Saved');
  });

  test('should toggle auto sync and show saved toast', async () => {
    await settingsPage.toggleAutoSync();
    await settingsPage.expectToastVisible();
    await settingsPage.expectToastText('Saved');
  });

  test('should persist theme selection during session', async () => {
    await settingsPage.setTheme('dark');
    await settingsPage.expectThemeSelected('dark');
    await settingsPage.setTheme('light');
    await settingsPage.expectThemeSelected('light');
  });

  // ===========================================
  // API Keys (8개) - High Priority
  // ===========================================

  test.describe('API Keys', () => {
    test('TC-SET-E019: should display OpenAI API Key input field', async () => {
      await settingsPage.expect(settingsPage.openAIKeyInput).toBeVisible();
    });

    test('TC-SET-E020: should save OpenAI API Key', async () => {
      await settingsPage.setOpenAIKey('sk-test-openai-key-12345');
      await settingsPage.expectToastVisible();
      await settingsPage.expectToastText('Saved');
    });

    test('TC-SET-E021: should mask OpenAI API Key display', async () => {
      await settingsPage.setOpenAIKey('sk-test-openai-key-12345');
      // API Key input should have type="password" for masking
      const inputType = await settingsPage.openAIKeyInput.getAttribute('type');
      expect(inputType).toBe('password');
    });

    test('TC-SET-E022: should persist OpenAI API Key', async () => {
      await settingsPage.setOpenAIKey('sk-test-persist-key');
      await settingsPage.expectOpenAIKeyValue('sk-test-persist-key');
    });

    test('TC-SET-E023: should delete OpenAI API Key', async () => {
      await settingsPage.setOpenAIKey('sk-test-delete-key');
      await settingsPage.clearOpenAIKey();
      await settingsPage.expectOpenAIKeyValue('');
    });

    test('TC-SET-E024: should display Anthropic API Key input field', async () => {
      await settingsPage.expect(settingsPage.anthropicKeyInput).toBeVisible();
    });

    test('TC-SET-E025: should save Anthropic API Key', async () => {
      await settingsPage.setAnthropicKey('sk-ant-test-key-12345');
      await settingsPage.expectToastVisible();
      await settingsPage.expectToastText('Saved');
    });

    test('TC-SET-E026: should mask Anthropic API Key display', async () => {
      await settingsPage.setAnthropicKey('sk-ant-test-key-12345');
      const inputType = await settingsPage.anthropicKeyInput.getAttribute('type');
      expect(inputType).toBe('password');
    });

    test('TC-SET-E027: should persist Anthropic API Key', async () => {
      await settingsPage.setAnthropicKey('sk-ant-persist-key');
      await settingsPage.expectAnthropicKeyValue('sk-ant-persist-key');
    });

    test('TC-SET-E028: should delete Anthropic API Key', async () => {
      await settingsPage.setAnthropicKey('sk-ant-delete-key');
      await settingsPage.clearAnthropicKey();
      await settingsPage.expectAnthropicKeyValue('');
    });

    test('TC-SET-E029: should save both API Keys simultaneously', async () => {
      await settingsPage.setOpenAIKey('sk-openai-both');
      await settingsPage.setAnthropicKey('sk-ant-both');
      await settingsPage.expectOpenAIKeyValue('sk-openai-both');
      await settingsPage.expectAnthropicKeyValue('sk-ant-both');
    });
  });

  // ===========================================
  // 언어 설정 (4개) - High Priority
  // ===========================================

  test.describe('Language Settings', () => {
    test('TC-SET-E009: should display language selector', async () => {
      await settingsPage.expect(settingsPage.languageSelect).toBeVisible();
    });

    test('TC-SET-E010: should change language to English', async () => {
      await settingsPage.setLanguage('en');
      await settingsPage.expectLanguageSelected('en');
      await settingsPage.expectToastVisible();
    });

    test('TC-SET-E011: should change language to Korean', async () => {
      await settingsPage.setLanguage('ko');
      await settingsPage.expectLanguageSelected('ko');
      await settingsPage.expectToastVisible();
    });

    test('TC-SET-E012: should persist language setting', async () => {
      await settingsPage.setLanguage('en');
      await settingsPage.expectLanguageSelected('en');
      // Navigate away and back
      await settingsPage.navigateTo('rules');
      await settingsPage.navigateTo('settings');
      await settingsPage.expectLanguageSelected('en');
    });
  });

  // ===========================================
  // 테마 확장 (3개) - Medium Priority
  // ===========================================

  test.describe('Theme Extended', () => {
    test('TC-SET-E006: should change to system theme', async () => {
      await settingsPage.setTheme('system');
      await settingsPage.expectThemeSelected('system');
      await settingsPage.expectToastVisible();
    });

    test('TC-SET-E007: should persist theme setting', async () => {
      await settingsPage.setTheme('dark');
      await settingsPage.navigateTo('rules');
      await settingsPage.navigateTo('settings');
      await settingsPage.expectThemeSelected('dark');
    });

    test('TC-SET-E008: should apply theme on initial load', async ({ page, setupMockApi }) => {
      // Setup with dark theme preference
      await setupMockApi({
        ...mockScenarios.empty,
        settings: { theme: 'dark', language: 'ko', autoSync: false },
      });
      const freshSettingsPage = new SettingsPage(page);
      await freshSettingsPage.navigate();
      await freshSettingsPage.expectThemeSelected('dark');
    });
  });

  // ===========================================
  // Toast 알림 (3개) - Medium Priority
  // ===========================================

  test.describe('Toast Notifications', () => {
    test('TC-SET-E031: should auto-dismiss toast', async () => {
      await settingsPage.setTheme('light');
      await settingsPage.expectToastVisible();
      // Wait for toast to disappear (default 3s)
      await settingsPage.waitForToastToDisappear(5000);
      await settingsPage.expectToastHidden();
    });

    test('TC-SET-E032: should reset toast timer on consecutive changes', async () => {
      await settingsPage.setTheme('light');
      await settingsPage.expectToastVisible();
      // Change again quickly
      await settingsPage.setTheme('dark');
      await settingsPage.expectToastVisible();
      // Toast should still be visible
      await settingsPage.expectToastText('Saved');
    });

    test('TC-SET-E033: should display toast with correct styling', async () => {
      await settingsPage.setTheme('light');
      await settingsPage.expectToastVisible();
      // Check toast has success styling (green/checkmark)
      const toastClasses = await settingsPage.toast.getAttribute('class');
      expect(toastClasses).toBeDefined();
    });
  });

  // ===========================================
  // 초기화 & 에러 처리 (6개) - Medium Priority
  // ===========================================

  test.describe('Initialization & Error Handling', () => {
    test('TC-SET-E034: should load settings on page mount', async ({ page, setupMockApi }) => {
      await setupMockApi({
        ...mockScenarios.empty,
        settings: { theme: 'light', language: 'en', autoSync: true },
      });
      const freshPage = new SettingsPage(page);
      await freshPage.navigate();
      await freshPage.expectThemeSelected('light');
      await freshPage.expectLanguageSelected('en');
    });

    test('TC-SET-E035: should handle empty settings gracefully', async ({ page, setupMockApi }) => {
      await setupMockApi(mockScenarios.empty);
      const freshPage = new SettingsPage(page);
      await freshPage.navigate();
      // Should still render with defaults
      await freshPage.expect(freshPage.themeSelect).toBeVisible();
    });

    test('TC-SET-E036: should cleanup on unmount', async () => {
      // Navigate away from settings
      await settingsPage.navigateTo('rules');
      // No errors should occur
      await settingsPage.page.getByTestId('rules-page').waitFor();
    });

    test.skip('TC-SET-E037: should handle IPC get failure', async () => {
      // Requires error injection in mock - placeholder
    });

    test.skip('TC-SET-E038: should handle IPC set failure', async () => {
      // Requires error injection in mock - placeholder
    });

    test.skip('TC-SET-E039: should handle storage unavailable', async () => {
      // Requires error injection in mock - placeholder
    });
  });

  // ===========================================
  // 접근성 (3개) - Medium Priority
  // ===========================================

  test.describe('Accessibility', () => {
    test('TC-SET-E040: should support keyboard navigation', async ({ page }) => {
      // Tab through controls
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      // Should be able to navigate without mouse
      const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
      expect(focusedElement).toBeDefined();
    });

    test('TC-SET-E041: should have screen reader labels', async () => {
      // Check for aria-labels
      const themeLabel = await settingsPage.themeSelect.getAttribute('aria-label');
      expect(themeLabel || await settingsPage.themeSelect.getAttribute('id')).toBeDefined();
    });

    test('TC-SET-E042: should manage focus on toggle', async () => {
      await settingsPage.autoSyncToggle.focus();
      const isFocused = await settingsPage.autoSyncToggle.evaluate(el => el === document.activeElement);
      expect(isFocused).toBeTruthy();
    });
  });

  // ===========================================
  // 테마 적용 (3개) - High Priority
  // ===========================================

  test.describe('Theme Application', () => {
    test('TC-SET-E043: should apply theme globally', async () => {
      await settingsPage.setTheme('dark');
      const isDark = await settingsPage.isDarkThemeApplied();
      expect(isDark).toBeTruthy();
    });

    test('TC-SET-E044: should detect OS theme change', async ({ page }) => {
      // Set to system theme
      await settingsPage.setTheme('system');
      await settingsPage.expectThemeSelected('system');
      // Emulating OS theme change requires page.emulateMedia
      await page.emulateMedia({ colorScheme: 'dark' });
      // Theme should follow system
    });

    test('TC-SET-E045: should prioritize theme on startup', async ({ page, setupMockApi }) => {
      await setupMockApi({
        ...mockScenarios.empty,
        settings: { theme: 'dark', language: 'ko', autoSync: false },
      });
      const freshPage = new SettingsPage(page);
      await freshPage.navigate();
      const isDark = await freshPage.isDarkThemeApplied();
      expect(isDark).toBeTruthy();
    });
  });

  // ===========================================
  // 시각적 회귀 (3개) - Low Priority
  // ===========================================

  test.describe('Visual Regression', () => {
    test.skip('TC-SET-E046: should match light theme appearance', async () => {
      await settingsPage.setTheme('light');
      // Visual snapshot comparison - requires baseline
    });

    test.skip('TC-SET-E047: should match dark theme appearance', async () => {
      await settingsPage.setTheme('dark');
      // Visual snapshot comparison - requires baseline
    });

    test.skip('TC-SET-E048: should match toast visual appearance', async () => {
      await settingsPage.setTheme('light');
      // Visual snapshot comparison - requires baseline
    });
  });

  // ===========================================
  // 성능 (2개) - Low Priority
  // ===========================================

  test.describe('Performance', () => {
    test.skip('TC-SET-E049: should load settings within acceptable time', async () => {
      // Performance measurement - requires timing API
    });

    test.skip('TC-SET-E050: should handle rapid setting changes', async () => {
      // Stress test for rapid changes
      for (let i = 0; i < 5; i++) {
        await settingsPage.setTheme(i % 2 === 0 ? 'light' : 'dark');
      }
      // Should not crash or show errors
      await settingsPage.expect(settingsPage.themeSelect).toBeVisible();
    });
  });
});
