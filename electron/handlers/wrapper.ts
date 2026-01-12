import { Result } from '../../shared/api';

/**
 * Executes a handler function safely, wrapping its result or error in a Result<T> object.
 * This ensures consistency across the IPC layer.
 */
export async function safeHandler<T>(
    fn: () => Promise<T> | T
): Promise<Result<T>> {
    try {
        const data = await fn();
        // If the service already returns a Result (as updated in Step 3), 
        // we can either return it directly or wrap it.
        // Let's assume if it looks like a Result, we return it.
        if (data && typeof data === 'object' && 'success' in data && ('data' in data || 'error' in data)) {
            return data as Result<T>;
        }
        return { success: true, data };
    } catch (error) {
        console.error('[Handler Error]:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}
