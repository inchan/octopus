
import { test, expect, mockScenarios } from '../fixtures/mock-api.fixture';
import { RulesPage } from '../pages/rules.page';

test.describe('Rules Management - Overflow Reproduction', () => {
    let rulesPage: RulesPage;

    test.beforeEach(async ({ page, setupMockApi }) => {
        await setupMockApi(mockScenarios.empty);
        rulesPage = new RulesPage(page);
        await rulesPage.goto();
    });

    test('Very long rule name should be truncated and not overflow the container', async ({ page, setupMockApi }) => {
        const setName = 'Overflow Test Set';
        const longRuleName = 'A'.repeat(300); // 300 characters long name
        const longRuleId = 'rule-long-1';
        const setId = 'set-overflow-1';

        // Setup mock with data already containing the long rule and set
        await setupMockApi({
            rules: [
                { id: longRuleId, name: longRuleName, content: 'Long content', isActive: true }
            ],
            ruleSets: [
                { id: setId, name: setName, items: [longRuleId], isArchived: false }
            ]
        });

        // 1. Go to page
        await rulesPage.goto();

        // 2. Select the set
        await rulesPage.selectRuleSetByName(setName);

        // 3. Verify in Set Detail
        const setRuleItem = rulesPage.setDetail.locator(`[data-testid="rules-set-rule-item-${longRuleId}"]`);
        await expect(setRuleItem).toBeVisible();

        // Check for overflow
        // We expect the Rule Item WIDTH to be within the container width.
        // The container is the ScrollArea viewport or the RuleSetDetail main div.
        const container = rulesPage.setDetail.locator('.space-y-1').first(); // The container of the list

        const containerBox = await container.boundingBox();
        const itemBox = await setRuleItem.boundingBox();

        expect(containerBox).not.toBeNull();
        expect(itemBox).not.toBeNull();

        if (containerBox && itemBox) {
            console.log('Container Width:', containerBox.width);
            console.log('Item Width:', itemBox.width);

            // The panel is roughly 35% of standard 1280px screen ~450px.
            // If the item width is huge (~2800px), it means overflow is happening.
            // We expect the item width to be constrained to something reasonable, e.g. < 800px even if panel is large.
            expect(itemBox.width).toBeLessThan(1000);

            // Also ensure it is close to the container width (if container was constrained correctly)
            // But main failure mode is "item expands indefinitely".

            // The item width should not effectively exceed the container width (minus some padding/margins)
            // With 'truncate', the span inside should shrink, keeping the item width equal to container width (minus padding).
            // If it overflows, itemWidth might be significantly larger or scrollbar appears.

            // A rigid check: item width should be <= container width
            expect(itemBox.width).toBeLessThanOrEqual(containerBox.width + 1); // +1 fuzzer for sub-pixel rendering
        }
    });
});
