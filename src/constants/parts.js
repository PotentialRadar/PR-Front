import { getTechParts } from '@/api/tech'

// 기본값 (호환성 및 API 실패시 사용)
const DEFAULT_PART_OPTIONS = [
    { value: '프론트엔드', label: '프론트엔드' },
    { value: '백엔드', label: '백엔드' },
    { value: '풀스택', label: '풀스택' },
    { value: '모바일', label: '모바일' },
    { value: '데브옵스', label: '데브옵스' },
    { value: 'QA/테스터', label: 'QA/테스터' },
    { value: 'UI/UX디자인', label: 'UI/UX디자인' },
    { value: '기타', label: '기타' }
];

// 백엔드에서 기술 파트를 가져와서 변환하는 함수
export const loadPartOptions = async () => {
    try {
        const techParts = await getTechParts()
        const options = techParts.map(part => ({
            value: part.name,
            label: part.name
        }))
        console.log(`✅ ${options.length}개의 기술 파트 로드 완료`)
        return options
    } catch (error) {
        console.error('기술 파트 로드 실패:', error)
        // 실패시 기본값 반환 (하드코딩 데이터 임시 사용)
        return DEFAULT_PART_OPTIONS
    }
}

// 기존 컴포넌트 호환성을 위한 export
export const PART_OPTIONS = DEFAULT_PART_OPTIONS;

export const EXPERIENCE_RANGE_OPTIONS = [
    { value: 'FRESHER', label: '신입' },
    { value: 'LT_1', label: '1년 미만' },
    { value: 'Y1_3', label: '1-3년' },
    { value: 'Y5_10', label: '5-10년' },
    { value: 'GE_10', label: '10년 이상' },
    { value: 'ETC', label: '기타' }
];
