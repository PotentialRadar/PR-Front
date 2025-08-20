// src/composables/useProjects.js
import { ref, watch } from 'vue';
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

    const adapt = (p) => ({ id: p.projectId ?? p.id, ...p });

    const load = async () => {
        loading.value = true;
        error.value = null;
        try {
            const params = {
                page: page.value - 1, // Spring Data JPA는 페이지를 0부터 시작
                size: size.value,
                category: category.value,
                q: q.value,
                _t: new Date().getTime(), // 캐시 방지를 위한 타임스탬프
            };
            // 값이 없는 파라미터는 전송하지 않음
            Object.keys(params).forEach(key => {
                if (params[key] === null || params[key] === '') {
                    delete params[key];
                }
            });

            const { data } = await listProjects(params);

            // API 응답이 배열인 경우와 페이징 객체인 경우 모두 처리
            if (Array.isArray(data)) {
                items.value = data.map(adapt);
                totalPages.value = 1; // 페이징 정보가 없으므로 1페이지로 가정
                total.value = data.length;
            } else if (data && Array.isArray(data.content)) {
                items.value = data.content.map(adapt);
                totalPages.value = data.totalPages ?? 1;
                total.value = data.totalElements ?? 0;
            } else {
                // API 응답이 예상과 다를 경우, 빈 목록으로 처리
                items.value = [];
                totalPages.value = 1;
                total.value = 0;
            }
        } catch (e) {
            console.error('📋 프로젝트 API 호출 실패:', e);
            error.value = e;
            items.value = []; // 오류 발생 시 빈 목록으로 초기화
            totalPages.value = 1;
            total.value = 0;
        } finally {
            loading.value = false;
        }
    };

    // q, category, page가 변경될 때마다 API를 다시 호출
    watch([q, category, page], load, { deep: true });

    load();

    const setCategory = (c) => {
        category.value = category.value === c ? null : c;
        page.value = 1; // 카테고리 변경 시 1페이지로
    };
    
    const goToPage = (p) => {
        if (p >= 1 && p <= totalPages.value) {
            page.value = p;
        }
    };

    return { items, total, totalPages, loading, error, q, category, page, size, load, setCategory, goToPage };
}
