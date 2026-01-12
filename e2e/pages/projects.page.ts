/**
 * Projects Page Object
 */

import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { TESTID } from '../utils/test-ids';

export class ProjectsPage extends BasePage {
  readonly addProjectButton: Locator;
  readonly searchInput: Locator;
  readonly projectList: Locator;
  readonly emptyState: Locator;

  // Add Dialog
  readonly addDialog: Locator;
  readonly pathInput: Locator;
  readonly scanSubmitButton: Locator;
  readonly addSubmitButton: Locator;
  readonly cancelAddButton: Locator;

  constructor(page: Page) {
    super(page);
    this.addProjectButton = page.getByTestId(TESTID.PROJECTS.ADD_BUTTON);
    this.searchInput = page.getByTestId(TESTID.PROJECTS.SEARCH_INPUT);
    this.projectList = page.getByTestId(TESTID.PROJECTS.LIST);
    this.emptyState = page.getByTestId(TESTID.PROJECTS.EMPTY_STATE);

    this.addDialog = page.getByTestId(TESTID.PROJECTS.ADD_DIALOG);
    this.pathInput = page.getByTestId(TESTID.PROJECTS.ADD_PATH_INPUT);
    this.scanSubmitButton = page.getByTestId('projects-scan-submit');
    this.addSubmitButton = page.getByTestId(TESTID.PROJECTS.ADD_SUBMIT);
    this.cancelAddButton = page.getByTestId(TESTID.PROJECTS.ADD_CANCEL);
  }

  async navigate() {
    await this.goto('/projects');
    await this.page.getByTestId(TESTID.PROJECTS.PAGE).waitFor();
  }

  async openAddDialog() {
    await this.addProjectButton.click();
    await this.addDialog.waitFor();
  }

  async scanDirectory(path: string) {
    await this.pathInput.fill(path);
    await this.scanSubmitButton.click();
  }

  async selectCandidate(path: string) {
    await this.page.getByTestId(`projects-scan-item-${path}`).click();
  }

  async submitAdd() {
    await this.addSubmitButton.click();
    await this.addDialog.waitFor({ state: 'hidden' });
  }

  async cancelAdd() {
    await this.cancelAddButton.click();
    await this.addDialog.waitFor({ state: 'hidden' });
  }

  async searchProjects(query: string) {
    await this.searchInput.fill(query);
  }

  getProjectItem(projectId: string) {
    return this.page.getByTestId(`${TESTID.PROJECTS.ITEM}-${projectId}`);
  }

  async expectProjectVisible(name: string) {
    await expect(this.projectList).toContainText(name);
  }

  async expectProjectCount(count: number) {
    if (count === 0) {
        await expect(this.emptyState).toBeVisible();
    } else {
        const items = this.projectList.locator('[data-testid^="projects-item-"]');
        await expect(items).toHaveCount(count);
    }
  }
}