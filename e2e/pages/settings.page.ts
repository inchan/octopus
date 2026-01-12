/**
 * Settings Page Object
 *
 * 설정 페이지 테스트를 위한 Page Object
 */

import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { TESTID } from '../utils/test-ids';

export class SettingsPage extends BasePage {
  readonly page: Page;

  // Controls
  readonly themeSelect: Locator;
  readonly languageSelect: Locator;
  readonly autoSyncToggle: Locator;
  readonly openAIKeyInput: Locator;
  readonly anthropicKeyInput: Locator;

  // Toast
  readonly toast: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;

    this.themeSelect = page.getByTestId(TESTID.SETTINGS.THEME_SELECT);
    this.languageSelect = page.getByTestId(TESTID.SETTINGS.LANGUAGE_SELECT);
    this.autoSyncToggle = page.getByTestId(TESTID.SETTINGS.AUTOSYNC_TOGGLE);
    this.openAIKeyInput = page.getByTestId(TESTID.SETTINGS.OPENAI_KEY_INPUT);
    this.anthropicKeyInput = page.getByTestId(TESTID.SETTINGS.ANTHROPIC_KEY_INPUT);
    this.toast = page.getByTestId(TESTID.SETTINGS.TOAST);
  }

  // ==========================================
  // Navigation
  // ==========================================

  async navigate(): Promise<void> {
    await this.goto('/');
    await this.navigateTo('settings');
    await this.page.getByTestId(TESTID.SETTINGS.PAGE).waitFor();
  }

  // ==========================================
  // Theme Settings
  // ==========================================

  async setTheme(theme: 'system' | 'light' | 'dark'): Promise<void> {
    await this.themeSelect.selectOption(theme);
  }

  async getTheme(): Promise<string> {
    return await this.themeSelect.inputValue();
  }

  // ==========================================
  // Language Settings
  // ==========================================

  async setLanguage(language: 'en' | 'ko'): Promise<void> {
    await this.languageSelect.selectOption(language);
  }

  async getLanguage(): Promise<string> {
    return await this.languageSelect.inputValue();
  }

  // ==========================================
  // Auto Sync Settings
  // ==========================================

  async toggleAutoSync(): Promise<void> {
    await this.autoSyncToggle.click();
  }

  async isAutoSyncEnabled(): Promise<boolean> {
    const classes = await this.autoSyncToggle.getAttribute('class');
    return classes?.includes('bg-blue-600') ?? false;
  }

  // ==========================================
  // API Keys
  // ==========================================

  async setOpenAIKey(key: string): Promise<void> {
    await this.openAIKeyInput.clear();
    await this.openAIKeyInput.fill(key);
  }

  async getOpenAIKey(): Promise<string> {
    return await this.openAIKeyInput.inputValue();
  }

  async clearOpenAIKey(): Promise<void> {
    await this.openAIKeyInput.clear();
  }

  async setAnthropicKey(key: string): Promise<void> {
    await this.anthropicKeyInput.clear();
    await this.anthropicKeyInput.fill(key);
  }

  async getAnthropicKey(): Promise<string> {
    return await this.anthropicKeyInput.inputValue();
  }

  async clearAnthropicKey(): Promise<void> {
    await this.anthropicKeyInput.clear();
  }

  // ==========================================
  // Assertions
  // ==========================================

  async expectToastVisible(): Promise<void> {
    await this.expect(this.toast).toBeVisible();
  }

  async expectToastText(text: string): Promise<void> {
    await this.expect(this.toast).toContainText(text);
  }

  async expectThemeSelected(theme: string): Promise<void> {
    await this.expect(this.themeSelect).toHaveValue(theme);
  }

  async expectLanguageSelected(language: string): Promise<void> {
    await this.expect(this.languageSelect).toHaveValue(language);
  }

  async expectOpenAIKeyValue(value: string): Promise<void> {
    await this.expect(this.openAIKeyInput).toHaveValue(value);
  }

  async expectAnthropicKeyValue(value: string): Promise<void> {
    await this.expect(this.anthropicKeyInput).toHaveValue(value);
  }

  async expectToastHidden(): Promise<void> {
    await this.expect(this.toast).toBeHidden();
  }

  // ==========================================
  // Helpers
  // ==========================================

  async waitForToastToDisappear(timeout: number = 3000): Promise<void> {
    await this.toast.waitFor({ state: 'hidden', timeout });
  }

  async hasThemeClass(className: string): Promise<boolean> {
    const root = this.page.locator('html');
    const classes = await root.getAttribute('class');
    return classes?.includes(className) ?? false;
  }

  async isDarkThemeApplied(): Promise<boolean> {
    return await this.hasThemeClass('dark');
  }
}
