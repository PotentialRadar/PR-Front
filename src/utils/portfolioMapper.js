// 공통 포트폴리오 매핑 유틸

// 역할 코드 -> 라벨 매핑
export function mapProjectRole(rawRole) {
  if (!rawRole) return '';
  const role = String(rawRole).toUpperCase();
  return role === 'LEADER' || role === 'PM' || role === 'PROJECT_MANAGER'
    ? '팀장'
    : '팀원';
}

// 단일 프로젝트 매핑
export function mapProject(raw) {
  if (!raw) return null;
  return {
    id: raw.projectId ?? raw.id,
    title: raw.title,
    description: raw.description,
    role: mapProjectRole(raw.role),
    techPart: raw.techPart,
    startDate: raw.startDate,
    endDate: raw.endDate,
    status: raw.status,
    techStacks: raw.techStacks || []
  };
}

// 사용자 카테고리(기술 파트) 매핑
export function mapUserCategory(data) {
  // 공개 포트폴리오: techPartName, 개인 포트폴리오: techPart
  return data?.techPartName || data?.techPart || '';
}

