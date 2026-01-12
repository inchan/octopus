
import { useQuery } from '@tanstack/react-query';
import { ToolDetectionResult } from '../../shared/api';

export interface UseInstalledToolsResult {
    tools: ToolDetectionResult[];
    installedTools: ToolDetectionResult[];
    isLoading: boolean;
    error: string | null;
    debugInfo?: any;
    refetch: () => void;
}

export function useInstalledTools(): UseInstalledToolsResult {
    // 1. 캐시된 데이터를 먼저 가져옴 (Instant Load)
    const { data: cachedTools } = useQuery({
        queryKey: ['tools-detection-cached'],
        queryFn: async () => {
            if (!window.api) return null;
            const result = await window.api.toolDetection.getCached();
            if (result.success && result.data && Array.isArray(result.data)) {
                return result.data as ToolDetectionResult[];
            }
            return null;
        },
        staleTime: Infinity, // 캐시는 명시적 무효화 전까지 유효
    });

    // 2. 백그라운드에서 최신 데이터 조회 (Background Update)
    const { data: freshResult, isLoading, error, refetch } = useQuery({
        queryKey: ['tools-detection'],
        queryFn: async () => {
            if (!window.api) return { tools: [] as ToolDetectionResult[], debugInfo: { error: 'No API available' } };
            try {
                const result = await window.api.toolDetection.detect();
                if (result.success) {
                    let validTools: ToolDetectionResult[] = [];
                    if (Array.isArray(result.data)) {
                        validTools = result.data;
                    } else if (result.data && typeof result.data === 'object') {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        validTools = Object.values(result.data as any);
                    }

                    return {
                        tools: validTools,
                        debugInfo: {
                            ...(result.debugInfo && typeof result.debugInfo === 'object' ? result.debugInfo : {}),
                            frontendToolsCount: validTools.length,
                            dataType: typeof result.data,
                            isArray: Array.isArray(result.data)
                        }
                    };
                }
                throw new Error(result.error);
            } catch (err) {
                console.error('Tool detection failed:', err);
                return { tools: [] as ToolDetectionResult[], debugInfo: { error: String(err) } };
            }
        },
    });

    // 3. 데이터 병합: 최신 데이터가 있으면 최신 데이터, 없으면 캐시, 둘 다 없으면 빈 배열
    // 단, 로딩 중이라도 캐시가 있으면 캐시를 보여줌
    const effectiveTools = (freshResult?.tools && freshResult.tools.length > 0)
        ? freshResult.tools
        : (cachedTools ?? []);

    const showLoading = isLoading && !cachedTools; // 캐시조차 없을 때만 진짜 로딩

    return {
        tools: effectiveTools,
        installedTools: effectiveTools.filter(t => t.isInstalled),
        isLoading: showLoading,
        error: error ? (error instanceof Error ? error.message : String(error)) : null,
        debugInfo: freshResult?.debugInfo,
        refetch
    };
}
