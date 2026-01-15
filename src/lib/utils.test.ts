import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn (tailwind-merge utility)', () => {
    it('should merge class names correctly', () => {
        const result = cn('text-red-500', 'bg-blue-500');
        expect(result).toContain('text-red-500');
        expect(result).toContain('bg-blue-500');
    });

    it('should handle conflicting classes (tailwind-merge behavior)', () => {
        const result = cn('p-2 p-4');
        expect(result).toBe('p-4');
    });

    it('should handle array of class names', () => {
        const result = cn(['text-center', 'font-bold']);
        expect(result).toContain('text-center');
        expect(result).toContain('font-bold');
    });

    it('should handle conditional classes', () => {
        const isTrue = true;
        const isFalse = false;
        const result = cn('base-class', isTrue && 'conditional-class', isFalse && 'not-included');
        expect(result).toContain('base-class');
        expect(result).toContain('conditional-class');
        expect(result).not.toContain('not-included');
    });

    it('should handle empty inputs', () => {
        const result = cn();
        expect(result).toBe('');
    });

    it('should handle null and undefined', () => {
        const result = cn('class1', null, undefined, 'class2');
        expect(result).toContain('class1');
        expect(result).toContain('class2');
    });

    it('should handle object inputs', () => {
        const result = cn({ 'active': true, 'disabled': false });
        expect(result).toContain('active');
        expect(result).not.toContain('disabled');
    });
});
