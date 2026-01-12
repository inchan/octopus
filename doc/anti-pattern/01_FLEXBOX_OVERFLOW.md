# Flexbox Overflow & Truncate Failure

## 1. 문제 상황 (Problem)

긴 텍스트(띄어쓰기 없는 긴 문자열 등)가 포함된 Flexbox 아이템이 부모 컨테이너의 크기를 무시하고 레이아웃을 깨트리며 확장되는 현상.
`truncate` (text-overflow: ellipsis) 클래스를 적용했음에도 불구하고 말줄임표가 나타나지 않고 컨테이너 자체가 늘어남.

### 증상
- `ResizablePanel`이나 `ScrollArea` 내부에서 콘텐츠가 화면 밖으로 넘침.
- `overflow: hidden`을 주어도 부모 자체가 늘어나서 소용없음.
- 하위 요소의 너비가 3000px 이상으로 비정상적으로 잡힘.

## 2. 원인 (Cause)

**Flexbox의 `min-width: auto` 기본 동작**이 원인입니다.

1.  **Flex Item의 기본 성질**: Flex Container의 자식(Flex Item)은 기본적으로 `min-width: auto`를 가집니다. 이는 "콘텐츠의 최소 크기(min-content)보다 작아질 수 없다"는 의미입니다.
2.  **긴 텍스트의 min-content**: 띄어쓰기가 없는 긴 문자열은 브라우저가 "하나의 덩어리"로 인식하여, 줄바꿈 가능한 지점이 없으므로 그 길이 전체가 `min-content`가 됩니다.
3.  **악순환**:
    - 텍스트 길이: 3000px
    - Flex Item: "내 최소 너비는 3000px이야."
    - 부모 컨테이너: Flex Item의 요구를 받아들여 같이 늘어남.
    - 결과: 부모가 자식만큼 커지므로 `truncate`가 작동할 조건(부모 너비 < 자식 너비)이 성립되지 않음.

## 3. 해결 방법 (Solution)

Flex Item이 자신의 콘텐츠 크기를 무시하고 부모의 제약에 맞춰 줄어들 수 있도록 **"최소 너비를 0으로 강제"**해야 합니다.

### 1. `min-w-0` (Tailwind)
가장 일반적인 해결책입니다. 텍스트를 감싸는 **직계 Flex Item**에 적용합니다.

```tsx
// ❌ 작동 안 함
<div className="flex">
  <span className="truncate">VeryLongText...</span>
</div>

// ✅ 해결
<div className="flex">
  <div className="min-w-0"> {/* Flex Item이 줄어들 수 있게 허용 */}
    <span className="truncate">VeryLongText...</span>
  </div>
</div>
```

### 2. `w-0` + `min-w-full` (Trick)
`min-w-0`만으로 해결되지 않는 복잡한 중첩 구조(특히 `ScrollArea`나 `Table` 레이아웃과 섞였을 때)에서 강력하게 작동합니다.
"너비는 0에서 시작하되, 최소한 부모의 100%만큼은 채워라"는 역설적인 지시를 통해 Flexbox 계산 방식을 재설정합니다.

```tsx
<div className="w-0 min-w-full">
  <LongContent />
</div>
```

### 3. `overflow: hidden` (Parent)
부모 컨테이너가 늘어나는 것을 물리적으로 차단합니다.
`react-resizable-panels`의 경우 `Panel` 컴포넌트에 직접 스타일을 주어야 할 수 있습니다.

```tsx
<ResizablePanel style={{ overflow: 'hidden' }}>
  ...
</ResizablePanel>
```

## 4. 예시 (Example Code)

**Before (Buggy):**
```tsx
<div className="flex gap-2">
  <span className="truncate">{longText}</span> {/* 늘어남 */}
</div>
```

**After (Fixed):**
```tsx
<div className="flex gap-2 min-w-0"> {/* min-w-0 추가 */}
  <span className="truncate flex-1">{longText}</span>
</div>
```
