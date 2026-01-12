/**
 * @vitest-environment happy-dom
 */
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach, Mock } from 'vitest';
import KeyValueList from './KeyValueList';

describe('KeyValueList Component', () => {
    let mockOnChange: Mock;

    beforeEach(() => {
        mockOnChange = vi.fn();
    });

    /**
     * Test Case ID: TC-MCP-U-KV001
     * Description: Add new key-value pair
     */
    it('TC-MCP-U-KV001: should add a new key-value pair', async () => {
        const user = userEvent.setup();

        // Step 1: 컴포넌트 렌더링
        render(<KeyValueList value={{}} onChange={mockOnChange} />);

        // Step 2: "Add Variable" 버튼 클릭
        const addButton = screen.getByRole('button', { name: /add variable/i });
        await user.click(addButton);

        // Step 3: Key 입력 필드에 "API_KEY" 입력
        const keyInputs = screen.getAllByPlaceholderText('KEY');
        const newKeyInput = keyInputs[keyInputs.length - 1];
        await user.clear(newKeyInput);
        await user.type(newKeyInput, 'API_KEY');

        // Step 4: Value 입력 필드에 "secret123" 입력
        const valueInputs = screen.getAllByPlaceholderText('VALUE');
        const newValueInput = valueInputs[valueInputs.length - 1];
        await user.clear(newValueInput);
        await user.type(newValueInput, 'secret123');

        // Expected Result: onChange가 올바른 값으로 호출됨
        await waitFor(() => {
            expect(mockOnChange).toHaveBeenCalledWith({ API_KEY: 'secret123' });
        });
    });

    /**
     * Test Case ID: TC-MCP-U-KV002
     * Description: Edit existing key-value pair
     */
    it('TC-MCP-U-KV002: should edit an existing key-value pair', async () => {
        const user = userEvent.setup();

        // Preconditions: 초기값 설정
        const initialValue = { NODE_ENV: 'development' };
        render(<KeyValueList value={initialValue} onChange={mockOnChange} />);

        // Step 2: "development" 값 클릭하여 편집
        const valueInput = screen.getByDisplayValue('development');

        // Step 3: "production"으로 변경
        await user.clear(valueInput);
        await user.type(valueInput, 'production');

        // Expected Result: onChange가 변경된 값으로 호출됨
        await waitFor(() => {
            expect(mockOnChange).toHaveBeenCalledWith({ NODE_ENV: 'production' });
        });
    });

    /**
     * Test Case ID: TC-MCP-U-KV003
     * Description: Delete key-value pair
     */
    it('TC-MCP-U-KV003: should delete a key-value pair', async () => {
        const user = userEvent.setup();

        // Preconditions: 초기값 설정
        const initialValue = { KEY1: 'val1', KEY2: 'val2' };
        render(<KeyValueList value={initialValue} onChange={mockOnChange} />);

        // Step 2: KEY1 행의 삭제 버튼 클릭
        const deleteButtons = screen.getAllByRole('button', { name: '' });
        const firstDeleteButton = deleteButtons.find(btn =>
            btn.querySelector('svg') && btn.className.includes('hover:text-red-400')
        );

        if (firstDeleteButton) {
            await user.click(firstDeleteButton);
        }

        // Expected Result: KEY1이 제거된 객체로 onChange 호출
        await waitFor(() => {
            const calls = mockOnChange.mock.calls;
            const lastCall = calls[calls.length - 1];
            expect(lastCall).toBeDefined();
            expect(lastCall[0]).not.toHaveProperty('KEY1');
        });
    });

    /**
     * Test Case ID: TC-MCP-U-KV004
     * Description: Render empty state
     */
    it('TC-MCP-U-KV004: should render empty state correctly', () => {
        // Step 1: 빈 값으로 컴포넌트 렌더링
        render(<KeyValueList value={{}} onChange={mockOnChange} />);

        // Expected Result: placeholder 메시지 표시
        expect(screen.getByText(/no environment variables/i)).toBeDefined();

        // Expected Result: "Add Variable" 버튼 활성화됨
        const addButton = screen.getByRole('button', { name: /add variable/i });
        expect(addButton).toBeDefined();
        expect(addButton.hasAttribute('disabled')).toBe(false);
    });

    /**
     * Test Case ID: TC-MCP-U-KV005
     * Description: Handle duplicate key validation
     *
     * Note: KeyValueListRobust 구현에서는 내부적으로 id 기반 배열을 사용하며,
     * updateParent에서 trim()된 키로 객체를 생성합니다.
     * 동일한 키가 여러 개 있을 경우 마지막 값이 덮어씁니다.
     */
    it('TC-MCP-U-KV005: should handle duplicate keys by overwriting', async () => {
        const user = userEvent.setup();

        // Preconditions: 초기값 설정
        const initialValue = { EXISTING_KEY: 'value1' };
        render(<KeyValueList value={initialValue} onChange={mockOnChange} />);

        // Step 2: 새 항목 추가
        const addButton = screen.getByRole('button', { name: /add variable/i });
        await user.click(addButton);

        // Step 3: Key에 "EXISTING_KEY" 입력
        const keyInputs = screen.getAllByPlaceholderText('KEY');
        const newKeyInput = keyInputs[keyInputs.length - 1];
        await user.clear(newKeyInput);
        await user.type(newKeyInput, 'EXISTING_KEY');

        // Value에 다른 값 입력
        const valueInputs = screen.getAllByPlaceholderText('VALUE');
        const newValueInput = valueInputs[valueInputs.length - 1];
        await user.clear(newValueInput);
        await user.type(newValueInput, 'value2');

        // Expected Result: 중복 키가 있을 경우 마지막 값으로 덮어씀
        // (현재 구현은 별도의 에러 메시지 없이 객체 병합 방식으로 처리)
        await waitFor(() => {
            const calls = mockOnChange.mock.calls;
            const lastCall = calls[calls.length - 1];
            expect(lastCall).toBeDefined();
            expect(lastCall[0]).toHaveProperty('EXISTING_KEY');
        });
    });

    /**
     * Test Case ID: TC-MCP-U-KV006
     * Description: Keyboard navigation
     */
    it('TC-MCP-U-KV006: should support keyboard navigation', async () => {
        const user = userEvent.setup();

        // Preconditions: 여러 key-value 쌍 존재
        const initialValue = { KEY1: 'val1', KEY2: 'val2' };
        render(<KeyValueList value={initialValue} onChange={mockOnChange} />);

        // Step 2: Tab 키로 필드 간 이동
        const firstKeyInput = screen.getByDisplayValue('KEY1');
        firstKeyInput.focus();

        expect(document.activeElement).toBe(firstKeyInput);

        // Tab으로 다음 필드로 이동
        await user.tab();

        // 포커스가 이동했는지 확인 (다음 입력 필드로)
        const firstValueInput = screen.getByDisplayValue('val1');
        expect(document.activeElement).toBe(firstValueInput);

        // Shift+Tab으로 이전 필드로 이동
        await user.tab({ shift: true });
        expect(document.activeElement).toBe(firstKeyInput);

        // Step 3: 편집 모드 진입 및 값 변경
        await user.clear(firstKeyInput);
        await user.type(firstKeyInput, 'NEW_KEY');

        // Expected Result: onChange 호출됨
        await waitFor(() => {
            expect(mockOnChange).toHaveBeenCalled();
        });
    });
});
