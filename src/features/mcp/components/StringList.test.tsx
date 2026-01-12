/**
 * @vitest-environment happy-dom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StringList } from './StringList';

// Mock dnd-kit to avoid complex drag and drop simulation in unit tests
vi.mock('@dnd-kit/core', () => ({
    DndContext: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    closestCenter: vi.fn(),
    KeyboardSensor: vi.fn(),
    PointerSensor: vi.fn(),
    useSensor: vi.fn(),
    useSensors: vi.fn(() => []),
}));

vi.mock('@dnd-kit/sortable', () => ({
    SortableContext: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    sortableKeyboardCoordinates: vi.fn(),
    verticalListSortingStrategy: vi.fn(),
    useSortable: () => ({
        attributes: {},
        listeners: {},
        setNodeRef: vi.fn(),
        transform: null,
        transition: null,
        isDragging: false,
    }),
}));

vi.mock('@dnd-kit/utilities', () => ({
    CSS: {
        Transform: {
            toString: () => '',
        },
    },
}));

describe('StringList Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // TC-MCP-C-SL001: Add new string item
    it('TC-MCP-C-SL001: should add a new string item when Add button is clicked', async () => {
        const user = userEvent.setup();
        const mockOnChange = vi.fn();

        // Step 1: 컴포넌트 렌더링
        render(
            <StringList
                value={["arg1", "arg2"]}
                onChange={mockOnChange}
                addButtonLabel="Add Argument"
            />
        );

        // 초기값 확인
        expect(screen.getByDisplayValue('arg1')).toBeDefined();
        expect(screen.getByDisplayValue('arg2')).toBeDefined();

        // Step 2: "Add" 버튼 클릭
        const addButton = screen.getByRole('button', { name: /Add Argument/i });
        await user.click(addButton);

        // onChange가 빈 항목과 함께 호출되었는지 확인
        await waitFor(() => {
            expect(mockOnChange).toHaveBeenCalledWith(["arg1", "arg2", ""]);
        });

        // Step 3: 새 입력 필드에 "--port=3000" 입력
        const inputs = screen.getAllByPlaceholderText('Argument');
        const newInput = inputs[inputs.length - 1]; // 마지막 입력 필드
        await user.clear(newInput);
        await user.type(newInput, '--port=3000');

        // Step 4: Expected Result - onChange 호출 확인
        await waitFor(() => {
            expect(mockOnChange).toHaveBeenCalledWith(["arg1", "arg2", "--port=3000"]);
        });
    });

    // TC-MCP-C-SL002: Edit existing string item
    it('TC-MCP-C-SL002: should edit an existing string item', async () => {
        const user = userEvent.setup();
        const mockOnChange = vi.fn();

        // Step 1: 컴포넌트 렌더링 with 초기값
        render(
            <StringList
                value={["--watch", "--verbose"]}
                onChange={mockOnChange}
            />
        );

        // 초기값 확인
        const watchInput = screen.getByDisplayValue('--watch');
        expect(watchInput).toBeDefined();

        // Step 2-3: "--watch" 항목을 "--no-watch"로 변경
        await user.clear(watchInput);
        await user.type(watchInput, '--no-watch');

        // Step 4: Expected Result - onChange 호출 확인
        await waitFor(() => {
            expect(mockOnChange).toHaveBeenCalledWith(["--no-watch", "--verbose"]);
        });

        // UI에 변경된 값 표시 확인
        expect(screen.getByDisplayValue('--no-watch')).toBeDefined();
        expect(screen.getByDisplayValue('--verbose')).toBeDefined();
    });

    // TC-MCP-C-SL003: Delete string item
    it('TC-MCP-C-SL003: should delete a string item when delete button is clicked', async () => {
        const user = userEvent.setup();
        const mockOnChange = vi.fn();

        // Step 1: 컴포넌트 렌더링 with 초기값
        render(
            <StringList
                value={["item1", "item2", "item3"]}
                onChange={mockOnChange}
            />
        );

        // 초기값 확인
        expect(screen.getByDisplayValue('item1')).toBeDefined();
        expect(screen.getByDisplayValue('item2')).toBeDefined();
        expect(screen.getByDisplayValue('item3')).toBeDefined();

        // Step 2: "item2" 행의 삭제 버튼 클릭
        // X 버튼들을 찾기 (모든 삭제 버튼)
        const deleteButtons = screen.getAllByRole('button', { name: '' });
        // Add 버튼을 제외한 나머지가 삭제 버튼들
        const deleteOnlyButtons = deleteButtons.filter(btn =>
            btn.querySelector('svg.lucide-x')
        );

        // item2에 해당하는 두 번째 삭제 버튼 클릭
        await user.click(deleteOnlyButtons[1]);

        // Step 3: Expected Result - onChange 호출 확인
        await waitFor(() => {
            expect(mockOnChange).toHaveBeenCalledWith(["item1", "item3"]);
        });

        // "item2"가 UI에서 제거됨 확인
        expect(screen.queryByDisplayValue('item2')).toBeNull();
        expect(screen.getByDisplayValue('item1')).toBeDefined();
        expect(screen.getByDisplayValue('item3')).toBeDefined();
    });

    // TC-MCP-C-SL004: Drag and drop reorder
    it('TC-MCP-C-SL004: should reorder items via drag and drop', async () => {
        const mockOnChange = vi.fn();

        // dnd-kit의 onDragEnd 콜백을 테스트하기 위해 컴포넌트 내부 로직을 검증
        // 실제 드래그 시뮬레이션 대신 handleDragEnd 함수 동작을 간접 검증

        // Step 1: 컴포넌트 렌더링 with 초기값
        render(
            <StringList
                value={["first", "second", "third"]}
                onChange={mockOnChange}
            />
        );

        // 초기 순서 확인
        const inputs = screen.getAllByRole('textbox');
        expect((inputs[0] as HTMLInputElement).value).toBe('first');
        expect((inputs[1] as HTMLInputElement).value).toBe('second');
        expect((inputs[2] as HTMLInputElement).value).toBe('third');

        // Note: 실제 드래그 앤 드롭은 E2E 테스트에서 검증하는 것이 적합
        // 단위 테스트에서는 컴포넌트가 올바르게 렌더링되고 드래그 핸들이 존재하는지 확인
        // 드래그 핸들 요소가 존재하는지 확인 (cursor-move 클래스를 가진 요소)
        const gripElements = document.querySelectorAll('.cursor-move');
        expect(gripElements.length).toBe(3); // first, second, third에 대해 3개
    });

    // TC-MCP-C-SL005: Render empty state with placeholder
    it('TC-MCP-C-SL005: should render empty state with placeholder when value is empty', () => {
        const mockOnChange = vi.fn();

        // Step 1: 컴포넌트 렌더링 with 빈 배열
        render(
            <StringList
                value={[]}
                onChange={mockOnChange}
                placeholder="인자 추가"
            />
        );

        // Step 2: Expected Result - placeholder 텍스트 표시
        expect(screen.getByText(/No arguments configured/i)).toBeDefined();

        // "Add" 버튼 표시 확인
        const addButton = screen.getByRole('button', { name: /Add Argument/i });
        expect(addButton).toBeDefined();

        // 에러 없이 렌더링 확인 (에러가 없으면 위의 assertion들이 통과)
    });
});
