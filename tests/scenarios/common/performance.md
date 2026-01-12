# Common Scenarios: Performance

## Overview
성능 관련 공통 시나리오를 정의합니다.

## 1. Load Performance

### TC-COM-PERF001: Initial page load < 3s
- **Description**: Verify page loads within acceptable time
- **Metric**: Time to First Contentful Paint (FCP)
- **Target**: < 3 seconds on 3G connection
- **Steps**:
  1. Clear cache
  2. Navigate to page
  3. Measure FCP using DevTools
- **Expected Result**:
  - FCP < 3s
  - No blocking resources warning
  - LCP < 5s
- **Priority**: Medium

### TC-COM-PERF002: Subsequent navigation < 1s
- **Description**: Verify SPA navigation speed
- **Steps**:
  1. Navigate between loaded routes
- **Expected Result**:
  - Visible change < 1s
- **Priority**: Medium

### TC-COM-PERF003: Time to interactive
- **Description**: Verify when page becomes usable
- **Metric**: Time to Interactive (TTI)
- **Steps**:
  1. Load page
  2. Attempt interaction immediately
- **Expected Result**:
  - TTI < 3.5s
- **Priority**: Low

## 2. Rendering Performance

### TC-COM-PERF011: List with 1000+ items
- **Description**: Verify performance with large lists
- **Steps**:
  1. Load list with 1000 items
  2. Scroll rapidly
- **Expected Result**:
  - 60fps scrolling
  - No blank spaces (if virtualized)
- **Priority**: High

### TC-COM-PERF012: Virtual scrolling
- **Description**: Verify virtualization implementation
- **Steps**:
  1. Inspect DOM of large list
- **Expected Result**:
  - Only visible items + buffer are in DOM
- **Priority**: High

### TC-COM-PERF013: Lazy loading
- **Description**: Verify code splitting/lazy loading
- **Steps**:
  1. Check Network tab
- **Expected Result**:
  - Route bundles loaded on demand
  - Images loaded when near viewport
- **Priority**: Medium

## 3. Resource Management

### TC-COM-PERF021: No memory leak on navigation
- **Description**: Verify memory is released
- **Steps**:
  1. Take Heap snapshot
  2. Navigate A -> B -> A -> B (10 times)
  3. Take Heap snapshot
- **Expected Result**:
  - Heap size stable
  - Detached DOM nodes count low
- **Priority**: High

### TC-COM-PERF022: Cleanup on component unmount
- **Description**: Verify listeners/intervals cleared
- **Steps**:
  1. Mount component with listeners
  2. Unmount
- **Expected Result**:
  - No console warnings about updates on unmounted component
  - Event listeners removed
- **Priority**: Medium

### TC-COM-PERF023: Long session stability
- **Description**: Verify app stable over time
- **Steps**:
  1. Keep app open for 1 hour with activity
- **Expected Result**:
  - No progressive slowdown
  - No crash
- **Priority**: Low
