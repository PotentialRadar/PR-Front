// portfolioData.js - 포트폴리오 데이터 관리

export const portfolioDatabase = {
  1: {
    userId: 1,
    userInfo: {
      name: '김개발자',
      jobTitle: 'Senior Frontend Developer',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
      category: 'Frontend'
    },
    introduction: '안녕하세요! 사용자 경험을 최우선으로 생각하는 프론트엔드 개발자입니다. React와 Vue.js를 주력으로 사용하며, 깔끔하고 직관적인 UI/UX 구현에 열정을 가지고 있습니다.',
    contactInfo: {
      email: 'kim.developer@example.com',
      phone: '010-1234-5678',
      github: 'https://github.com/kimdev',
      linkedin: 'https://linkedin.com/in/kimdev',
      website: 'https://kimdev.portfolio.com',
      location: '서울, 대한민국',
      showContact: true
    },
    skills: ['React', 'Vue.js', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'Node.js', 'GraphQL', 'Figma'],
    educations: [
      {
        institution: '서울대학교',
        program: '컴퓨터공학과 학사',
        startDate: '2019-03',
        endDate: '2023-02',
        isOngoing: false
      },
      {
        institution: '패스트캠퍼스',
        program: 'React 심화 과정',
        startDate: '2023-06',
        endDate: '2023-08',
        isOngoing: false
      }
    ],
    careers: [
      {
        company: 'Tech Startup A',
        position: 'Frontend Developer',
        startDate: '2023-09',
        endDate: null,
        isCurrent: true,
        description: 'React 기반 웹 애플리케이션 개발 및 사용자 인터페이스 설계를 담당했습니다.'
      },
      {
        company: '네이버',
        position: 'Junior Frontend Developer',
        startDate: '2023-03',
        endDate: '2023-08',
        isCurrent: false,
        description: 'Vue.js를 활용한 사내 관리 시스템 개발 및 유지보수를 담당했습니다.'
      }
    ],
    projects: [
      { id: 1, title: 'E-commerce 플랫폼', role: 'Frontend Developer' },
      { id: 2, title: '관리자 대시보드', role: 'Full-stack Developer' },
      { id: 3, title: '모바일 앱 UI', role: 'UI/UX Designer' },
      { id: 4, title: 'AI 챗봇 서비스', role: 'Frontend Developer' }
    ],
    reviews: []
  },
  2: {
    userId: 2,
    userInfo: {
      name: '박디자이너',
      jobTitle: 'UI/UX Designer',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
      category: 'Design'
    },
    introduction: 'UI/UX 디자이너 박디자이너입니다. 사용자 중심의 디자인 사고를 바탕으로 직관적이고 아름다운 인터페이스를 만들어갑니다. 데이터 기반의 디자인 결정을 중요하게 생각합니다.',
    contactInfo: {
      email: 'park.designer@example.com',
      github: 'https://github.com/parkdesigner',
      linkedin: 'https://linkedin.com/in/parkdesigner',
      website: 'https://parkdesigner.design',
      location: '부산, 대한민국',
      showContact: true
    },
    skills: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping', 'User Research'],
    educations: [
      {
        institution: '홍익대학교',
        program: '시각디자인학과 학사',
        startDate: '2018-03',
        endDate: '2022-02',
        isOngoing: false
      },
      {
        institution: 'Google UX Design',
        program: 'UX Design Professional Certificate',
        startDate: '2022-03',
        endDate: '2022-08',
        isOngoing: false
      }
    ],
    careers: [
      {
        company: 'Design Agency B',
        position: 'Senior UI/UX Designer',
        startDate: '2022-09',
        endDate: null,
        isCurrent: true,
        description: '사용자 경험 리서치부터 인터페이스 디자인까지 전 과정을 담당하며, 다양한 클라이언트 프로젝트를 성공적으로 수행했습니다.'
      }
    ],
    projects: [
      { id: 5, title: '모바일 뱅킹 앱 리디자인', role: 'Lead UX Designer' },
      { id: 6, title: 'E-learning 플랫폼', role: 'UI/UX Designer' }
    ],
    reviews: []
  },
  3: {
    userId: 3,
    userInfo: {
      name: '이백엔드',
      jobTitle: 'Backend Developer',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
      category: 'Backend'
    },
    introduction: '안정적이고 확장 가능한 서버 아키텍처 구축을 전문으로 하는 백엔드 개발자입니다. 클라우드 환경과 마이크로서비스 아키텍처에 관심이 많습니다.',
    contactInfo: {
      email: 'lee.backend@example.com',
      phone: '010-9876-5432',
      github: 'https://github.com/leebackend',
      location: '대구, 대한민국',
      showContact: true
    },
    skills: ['Node.js', 'Python', 'Docker', 'AWS', 'PostgreSQL'],
    educations: [
      {
        institution: 'KAIST',
        program: '전산학부 학사',
        startDate: '2017-03',
        endDate: '2021-02',
        isOngoing: false
      },
      {
        institution: 'AWS',
        program: 'Solutions Architect Associate',
        startDate: '2021-06',
        endDate: '2021-08',
        isOngoing: false
      }
    ],
    careers: [
      {
        company: 'Enterprise Corp C',
        position: 'Backend Developer',
        startDate: '2021-03',
        endDate: null,
        isCurrent: true,
        description: '대용량 트래픽 처리를 위한 백엔드 시스템 설계 및 개발을 담당하고 있습니다.'
      }
    ],
    projects: [
      { id: 7, title: '마이크로서비스 아키텍처 구축', role: 'Backend Developer' },
      { id: 8, title: 'API 게이트웨이 개발', role: 'Senior Backend Developer' }
    ],
    reviews: []
  },
  4: {
    userId: 4,
    userInfo: {
      name: '정모바일',
      jobTitle: 'Mobile Developer',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4',
      category: 'Mobile'
    },
    introduction: '크로스 플랫폼 모바일 앱 개발을 전문으로 하는 개발자입니다. Flutter와 React Native를 활용하여 효율적인 앱 개발을 추구합니다.',
    contactInfo: {
      email: 'jung.mobile@example.com',
      github: 'https://github.com/jungmobile',
      location: '인천, 대한민국',
      showContact: true
    },
    skills: ['Flutter', 'React Native', 'iOS', 'Android', 'Firebase'],
    educations: [
      {
        institution: '연세대학교',
        program: '컴퓨터과학과 학사',
        startDate: '2018-03',
        endDate: '2022-02',
        isOngoing: false
      }
    ],
    careers: [
      {
        company: 'Mobile Startup D',
        position: 'Mobile App Developer',
        startDate: '2022-03',
        endDate: null,
        isCurrent: true,
        description: 'Flutter를 이용한 크로스 플랫폼 앱 개발 및 앱스토어 배포 관리를 담당하고 있습니다.'
      }
    ],
    projects: [
      { id: 9, title: '배달 앱 개발', role: 'Flutter Developer' },
      { id: 10, title: '소셜 미디어 앱', role: 'Mobile Developer' }
    ],
    reviews: []
  },
  5: {
    userId: 5,
    userInfo: {
      name: '최AI',
      jobTitle: 'AI/ML Engineer',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5',
      category: 'AI/ML'
    },
    introduction: '머신러닝과 딥러닝을 활용한 지능형 시스템 개발을 전문으로 합니다. 컴퓨터 비전과 자연어 처리 분야에서 다양한 프로젝트 경험을 보유하고 있습니다.',
    contactInfo: {
      email: 'choi.ai@example.com',
      github: 'https://github.com/choiai',
      linkedin: 'https://linkedin.com/in/choiai',
      location: '판교, 대한민국',
      showContact: true
    },
    skills: ['Python', 'TensorFlow', 'PyTorch', 'OpenCV', 'NLP'],
    educations: [
      {
        institution: '서울대학교',
        program: '전기정보공학부 석사',
        startDate: '2020-03',
        endDate: '2022-02',
        isOngoing: false
      },
      {
        institution: 'Coursera',
        program: 'Deep Learning Specialization',
        startDate: '2022-03',
        endDate: '2022-06',
        isOngoing: false
      }
    ],
    careers: [
      {
        company: 'AI Research Lab E',
        position: 'ML Engineer',
        startDate: '2022-07',
        endDate: null,
        isCurrent: true,
        description: '컴퓨터 비전 및 자연어 처리 모델 연구 개발을 담당하고 있습니다.'
      }
    ],
    projects: [
      { id: 11, title: '이미지 분류 AI 모델', role: 'ML Engineer' },
      { id: 12, title: '챗봇 자연어 처리', role: 'AI Engineer' }
    ],
    reviews: []
  },
  6: {
    userId: 6,
    userInfo: {
      name: '강데브옵스',
      jobTitle: 'DevOps Engineer',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=6',
      category: 'DevOps'
    },
    introduction: 'CI/CD 파이프라인 구축과 인프라 자동화를 통해 개발팀의 생산성 향상에 기여하는 데브옵스 엔지니어입니다. 클라우드 네이티브 기술에 특화되어 있습니다.',
    contactInfo: {
      email: 'kang.devops@example.com',
      github: 'https://github.com/kangdevops',
      website: 'https://kangdevops.dev',
      location: '부산, 대한민국',
      showContact: true
    },
    skills: ['AWS', 'Docker', 'Kubernetes', 'Jenkins', 'Terraform'],
    educations: [
      {
        institution: '부산대학교',
        program: '정보컴퓨터공학부 학사',
        startDate: '2016-03',
        endDate: '2020-02',
        isOngoing: false
      },
      {
        institution: 'Linux Foundation',
        program: 'Kubernetes Administrator (CKA)',
        startDate: '2020-09',
        endDate: '2020-11',
        isOngoing: false
      }
    ],
    careers: [
      {
        company: 'Cloud Solutions F',
        position: 'Senior DevOps Engineer',
        startDate: '2020-03',
        endDate: null,
        isCurrent: true,
        description: 'Kubernetes 기반 컨테이너 오케스트레이션 및 CI/CD 파이프라인 구축을 담당하고 있습니다.'
      }
    ],
    projects: [
      { id: 13, title: 'Kubernetes 클러스터 구축', role: 'DevOps Engineer' },
      { id: 14, title: 'CI/CD 파이프라인 자동화', role: 'Senior DevOps Engineer' }
    ],
    reviews: []
  }
}

// 포트폴리오 리스트용 간소화된 데이터
export const getPortfolioList = () => {
  return Object.values(portfolioDatabase).map(portfolio => ({
    id: portfolio.userId,
    name: portfolio.userInfo.name,
    jobTitle: portfolio.userInfo.jobTitle,
    avatar: portfolio.userInfo.avatar,
    skills: portfolio.skills,
    category: portfolio.userInfo.category,
    isLiked: false // 기본값
  }))
}

// 특정 포트폴리오 상세 데이터 가져오기
export const getPortfolioById = (userId) => {
  return portfolioDatabase[userId] || null
}

// 모든 스킬 목록 가져오기
export const getAllSkills = () => {
  const allSkills = Object.values(portfolioDatabase)
    .flatMap(portfolio => portfolio.skills)
  return [...new Set(allSkills)]
}

// 카테고리별 포트폴리오 수 가져오기
export const getCategoryStats = () => {
  const categories = Object.values(portfolioDatabase)
    .map(portfolio => portfolio.userInfo.category)

  const stats = {}
  categories.forEach(category => {
    stats[category] = (stats[category] || 0) + 1
  })

  return stats
}

// 인기 스킬 목록 (등장 빈도 기준)
export const getPopularSkills = (limit = 8) => {
  const skillCount = {}
  Object.values(portfolioDatabase).forEach(portfolio => {
    portfolio.skills.forEach(skill => {
      skillCount[skill] = (skillCount[skill] || 0) + 1
    })
  })

  return Object.entries(skillCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, limit)
    .map(([skill]) => skill)
}

// 사용자 검색
export const searchPortfolios = (query) => {
  const lowercaseQuery = query.toLowerCase()

  return Object.values(portfolioDatabase).filter(portfolio => {
    return (
      portfolio.userInfo.name.toLowerCase().includes(lowercaseQuery) ||
      portfolio.userInfo.jobTitle.toLowerCase().includes(lowercaseQuery) ||
      portfolio.skills.some(skill => skill.toLowerCase().includes(lowercaseQuery)) ||
      portfolio.introduction.toLowerCase().includes(lowercaseQuery)
    )
  })
}

// 카테고리별 필터링
export const filterByCategory = (category) => {
  if (category === '전체') {
    return Object.values(portfolioDatabase)
  }

  return Object.values(portfolioDatabase).filter(
    portfolio => portfolio.userInfo.category === category
  )
}

// 스킬별 필터링
export const filterBySkills = (skills) => {
  if (!skills || skills.length === 0) {
    return Object.values(portfolioDatabase)
  }

  return Object.values(portfolioDatabase).filter(portfolio =>
    skills.some(skill => portfolio.skills.includes(skill))
  )
}

// 전체 통계
export const getOverallStats = () => {
  const portfolios = Object.values(portfolioDatabase)

  return {
    totalPortfolios: portfolios.length,
    totalSkills: getAllSkills().length,
    totalCategories: Object.keys(getCategoryStats()).length,
    activeCreators: portfolios.length
  }
}