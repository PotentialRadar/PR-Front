// src/composables/useProjects.js
import { ref, watch, onMounted } from 'vue';
import { listProjects } from '@/api/projects';

export function useProjects({ q: _q = '', category: _c = null, page: _p = 1, size: _sz = 8 } = {}) {
    const items = ref([]);
    const total = ref(0);
    const totalPages = ref(1);
    const loading = ref(false);
    const error = ref(null);

    const q = ref(_q);
    const category = ref(_c);
    const page = ref(_p);
    const size = ref(_sz);

    // 로컬 전용: 서버에서 받은 전체 목록 저장
    const all = ref([]);

    const adapt = (p) => ({ id: p.projectId ?? p.id, ...p });

    const applyFilterAndPaginate = () => {
        let rows = all.value;

        // (선택) 검색어/카테고리 필터: 백엔드 미구현이므로 프론트에서 처리
        if (category.value) rows = rows.filter(r => r.category === category.value);
        if (q.value) {
            const qq = q.value.toLowerCase();
            rows = rows.filter(r =>
                (r.title ?? '').toLowerCase().includes(qq) ||
                (r.description ?? '').toLowerCase().includes(qq)
            );
        }

        total.value = rows.length;
        totalPages.value = Math.max(1, Math.ceil(total.value / size.value));

        const start = (page.value - 1) * size.value;
        const end = start + size.value;

        items.value = rows.slice(start, end).map(adapt);
    };

    const load = async () => {
        loading.value = true;
        error.value = null;
        try {
            const { data } = await listProjects(); // 서버는 배열 반환
            all.value = Array.isArray(data) ? data : [];
            
            // API 데이터가 비어있거나 deadline이 없는 경우 fallback 데이터 사용
            if (!all.value.length || !all.value[0]?.deadline) {
                console.log('📋 API 데이터가 없거나 불완전하여 fallback 데이터 사용');
                const { projects } = await import('@/components/data/projects');
                all.value = projects;
            }
            
            // 페이지 범위 보정
            page.value = Math.min(page.value, Math.max(1, Math.ceil(all.value.length / size.value) || 1));
            applyFilterAndPaginate();
        } catch (e) {
            console.log('📋 API 호출 실패, fallback 데이터 사용');
            error.value = e;
            // API 실패 시 fallback 데이터 사용
            const { projects } = await import('@/components/data/projects');
            all.value = projects;
            applyFilterAndPaginate();
        } finally {
            loading.value = false;
        }
    };

    watch([q, category, page, size], applyFilterAndPaginate);
    onMounted(load);

    const setCategory = (c) => { category.value = (category.value === c ? null : c); page.value = 1; };
    const goToPage = (p) => { if (p < 1 || p > totalPages.value) return; page.value = p; };

    return { items, total, totalPages, loading, error, q, category, page, size, load, setCategory, goToPage };
}
