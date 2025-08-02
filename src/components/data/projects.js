export const projects = [
    {
        id: 1,
        title: 'AI 기반 협업툴 백엔드 개발',
        description: 'AI 추천을 기반으로 한 팀 매칭 서비스의 서버 설계와 구현. Spring Boot와 JWT 기반 인증 시스템, 실시간 AI 추천 엔진과 협업 환경을 구축하며 다양한 클라우드 경험을 쌓을 수 있습니다.',
        techStacks: [
            { techStackName: 'Spring Boot' },
            { techStackName: 'JWT' },
            { techStackName: 'PostgreSQL' },
            { techStackName: 'Redis' }
        ],
        status: '모집중',
        startDate: '2024-07-01',
        endDate: '2024-11-01',
        recruitCount: 3,
        appliedCount: 8,
        deadline: 'D-16',
        category: 'backend',
        viewCount: 142,
        isFavorite: false,
        author: {
            userId: 3,
            name: '이백엔드',
            title: 'Backend Developer',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=backend1',
            rating: 4.7,
            projectCount: 15,
            joinDate: '2023-03-15',
            isVerified: true
        },
        attachments: [
            {
                name: '프로젝트_요구사항_명세서.pdf',
                url: 'https://example.com/files/requirements.pdf',
                size: 2048000
            },
            {
                name: 'API_설계도.png',
                url: 'https://picsum.photos/800/600?random=1',
                size: 1024000
            },
            {
                name: '데이터베이스_ERD.jpg',
                url: 'https://picsum.photos/1200/800?random=2',
                size: 1536000
            }
        ]
    },
    {
        id: 2,
        title: 'Lock Screen 앱 5종 AOS 최신화 및 마켓 등록',
        description: '안드로이드 앱 개발 및 Google Play 스토어 등록 프로젝트입니다. 기존 락스크린 앱을 최신 Android 버전에 맞게 리팩토링하고, 배포 및 마켓 출시까지 전 과정을 함께합니다.',
        techStacks: [
            { techStackName: 'Android' },
            { techStackName: 'Kotlin' },
            { techStackName: 'Google Play' }
        ],
        status: '모집중',
        startDate: '2024-07-05',
        endDate: '2024-10-05',
        recruitCount: 6,
        appliedCount: 12,
        deadline: 'D-13',
        category: 'app',
        viewCount: 89,
        isFavorite: true,
        author: {
            userId: 4,
            name: '정모바일',
            title: 'Mobile Developer',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mobile1',
            rating: 4.9,
            projectCount: 8,
            joinDate: '2023-06-20',
            isVerified: true
        },
        attachments: [
            {
                name: '앱_스크린샷_모음.zip',
                url: 'https://example.com/files/screenshots.zip',
                size: 5120000
            },
            {
                name: '마켓_등록_가이드.docx',
                url: 'https://example.com/files/guide.docx',
                size: 512000
            }
        ]
    },
    {
        id: 3,
        title: 'Web 프레임워크 및 UI 시스템 고도화',
        description: '현대적인 웹 프론트엔드 시스템을 구축하는 프로젝트입니다. React, TypeScript, StoryBook을 활용하여 UI 시스템 설계와 성능 최적화까지 실무처럼 경험할 수 있습니다.',
        techStacks: [
            { techStackName: 'React' },
            { techStackName: 'TypeScript' },
            { techStackName: 'Vite' },
            { techStackName: 'StoryBook' },
            { techStackName: 'CSS-in-JS' }
        ],
        status: '모집중',
        startDate: '2024-07-10',
        endDate: '2024-12-31',
        recruitCount: 3,
        appliedCount: 5,
        deadline: 'D-16',
        category: 'frontend',
        viewCount: 203,
        isFavorite: false,
        author: {
            userId: 1,
            name: '김프론트',
            title: 'Frontend Developer',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=frontend1',
            rating: 4.8,
            projectCount: 12,
            joinDate: '2023-01-10',
            isVerified: true
        },
        attachments: [
            {
                name: 'UI_컴포넌트_가이드.pdf',
                url: 'https://example.com/files/ui-guide.pdf',
                size: 3072000
            },
            {
                name: '디자인_시스템_예시.png',
                url: 'https://picsum.photos/1000/700?random=3',
                size: 2048000
            },
            {
                name: '성능_최적화_체크리스트.xlsx',
                url: 'https://example.com/files/checklist.xlsx',
                size: 256000
            }
        ]
    },
    {
        id: 4,
        title: 'E-commerce 플랫폼 디자인 시스템',
        description: '사용자 친화적인 온라인 쇼핑몰 UI/UX 디자인 프로젝트. Figma와 Prototyping을 통한 디자인 시스템 설계, 실무 중심의 UI/UX 프로젝트 경험 제공.',
        techStacks: [
            { techStackName: 'UI/UX' },
            { techStackName: 'Figma' },
            { techStackName: '디자인시스템' },
            { techStackName: 'Prototyping' }
        ],
        status: '모집중',
        startDate: '2024-07-20',
        endDate: '2024-11-30',
        recruitCount: 4,
        appliedCount: 7,
        deadline: 'D-8',
        category: 'design',
        viewCount: 156,
        isFavorite: false,
        author: {
            userId: 2,
            name: '박디자이너',
            title: 'UI/UX Designer',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=designer1',
            rating: 4.9,
            projectCount: 18,
            joinDate: '2022-09-05',
            isVerified: true
        },
        attachments: [
            {
                name: '쇼핑몰_와이어프레임.fig',
                url: 'https://example.com/files/wireframe.fig',
                size: 4096000
            },
            {
                name: '사용자_플로우_차트.png',
                url: 'https://picsum.photos/1400/900?random=4',
                size: 1792000
            },
            {
                name: '프로토타입_링크.txt',
                url: 'https://example.com/files/prototype.txt',
                size: 1024
            }
        ]
    },
    {
        id: 5,
        title: 'MSA 기반 클라우드 인프라 구축',
        description: '마이크로서비스 아키텍처와 컨테이너 기반 인프라 구축. Docker, Kubernetes, AWS를 활용한 마이크로서비스 배포 및 운영 자동화를 실습합니다.',
        techStacks: [
            { techStackName: 'Docker' },
            { techStackName: 'Kubernetes' },
            { techStackName: 'AWS' },
            { techStackName: 'MSA' }
        ],
        status: '모집중',
        startDate: '2024-07-12',
        endDate: '2024-12-10',
        recruitCount: 5,
        appliedCount: 14,
        deadline: 'D-20',
        category: 'infra',
        viewCount: 321,
        isFavorite: true,
        author: {
            userId: 6,
            name: '강데브옵스',
            title: 'DevOps Engineer',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=devops1',
            rating: 4.6,
            projectCount: 22,
            joinDate: '2022-11-12',
            isVerified: true
        },
        attachments: [
            {
                name: '인프라_아키텍처_도표.pdf',
                url: 'https://example.com/files/architecture.pdf',
                size: 2560000
            },
            {
                name: 'Docker_설정파일_모음.zip',
                url: 'https://example.com/files/docker-configs.zip',
                size: 1024000
            },
            {
                name: 'K8s_배포_가이드.md',
                url: 'https://example.com/files/k8s-guide.md',
                size: 128000
            },
            {
                name: '시스템_모니터링_대시보드.png',
                url: 'https://picsum.photos/1600/1000?random=5',
                size: 2048000
            }
        ]
    },
    // 나머지 프로젝트들도 동일한 패턴으로 attachments 추가
    {
        id: 6,
        title: 'AI 챗봇 개발',
        description: '자연어 처리 기반 AI 챗봇 개발 프로젝트. TensorFlow, NLP 기반의 대화형 챗봇을 설계하고 실제 서비스 환경에 배포까지 진행합니다.',
        techStacks: [
            { techStackName: 'Python' },
            { techStackName: 'NLP' },
            { techStackName: 'TensorFlow' }
        ],
        status: '모집중',
        startDate: '2024-07-18',
        endDate: '2024-09-30',
        recruitCount: 2,
        appliedCount: 6,
        deadline: 'D-7',
        category: 'backend',
        viewCount: 98,
        isFavorite: false,
        author: {
            userId: 5,
            name: '최AI',
            title: 'AI/ML Engineer',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ai1',
            rating: 4.8,
            projectCount: 9,
            joinDate: '2023-02-28',
            isVerified: true
        },
        attachments: [
            {
                name: '챗봇_학습_데이터셋.csv',
                url: 'https://example.com/files/chatbot-dataset.csv',
                size: 10240000
            },
            {
                name: 'NLP_모델_구조도.jpg',
                url: 'https://picsum.photos/1200/800?random=6',
                size: 1536000
            }
        ]
    },
    {
        id: 7,
        title: 'iOS SNS 앱 개발',
        description: 'SwiftUI로 만드는 소셜네트워크 서비스 앱. Swift와 Firebase로 실시간 채팅, 피드, 알림 기능을 구현하고, iOS 앱의 전 과정을 함께 설계·개발합니다.',
        techStacks: [
            { techStackName: 'Swift' },
            { techStackName: 'iOS' },
            { techStackName: 'Firebase' }
        ],
        status: '모집중',
        startDate: '2024-07-15',
        endDate: '2024-10-15',
        recruitCount: 4,
        appliedCount: 8,
        deadline: 'D-12',
        category: 'app',
        viewCount: 167,
        isFavorite: false,
        author: {
            userId: 7,
            name: '김iOS',
            title: 'iOS Developer',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ios1',
            rating: 4.7,
            projectCount: 14,
            joinDate: '2023-04-18',
            isVerified: true
        },
        attachments: [
            {
                name: 'iOS_앱_기획서.pages',
                url: 'https://example.com/files/ios-plan.pages',
                size: 2048000
            },
            {
                name: '앱_플로우_차트.png',
                url: 'https://picsum.photos/1000/800?random=7',
                size: 1280000
            }
        ]
    },
    // 기존 프로젝트들 계속...
    {
        id: 8,
        title: 'B2B 쇼핑몰 프론트 고도화',
        description: '대규모 B2B 쇼핑몰 프론트엔드 구조 개선. Vue.js와 Pinia로 SPA 구조 전환, 성능 개선 및 코드 리팩토링 경험 제공.',
        techStacks: [
            { techStackName: 'Vue.js' },
            { techStackName: 'TypeScript' },
            { techStackName: 'Pinia' }
        ],
        status: '모집중',
        startDate: '2024-07-12',
        endDate: '2024-12-12',
        recruitCount: 4,
        appliedCount: 9,
        deadline: 'D-14',
        category: 'frontend',
        viewCount: 234,
        isFavorite: true,
        author: {
            name: '김프론트',
            title: 'Frontend Developer',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=frontend1',
            rating: 4.8,
            projectCount: 12,
            joinDate: '2023-01-10',
            isVerified: true
        },
        attachments: []
    }
    // 나머지 프로젝트들도 필요에 따라 attachments 필드 추가...
];