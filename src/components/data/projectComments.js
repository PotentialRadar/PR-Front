// // src/components/data/projectComments.js
// export const projectCommentsStore = {
//     1: [
//         {
//             id: 1,
//             username: 'd*****t',
//             text: '안녕하세요, AI 필터, 리터치 기능은 제공을 해주시는 걸까요? 아니면 개발사가 알아서 구현해야하는 건가요?',
//             date: '2025-07-15 01:14:59',
//             avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1',
//             isReply: false
//         },
//         {
//             id: 2,
//             username: 't*****r',
//             text: '개발사가 직접 구현해야 합니다. API 활용 권장드려요!',
//             date: '2025-07-15 09:39:16',
//             avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user2',
//             isReply: true
//         }
//     ],
//     2: [
//         {
//             id: 1,
//             username: 'userX',
//             text: '이 프로젝트는 언제 오픈하나요?',
//             date: '2025-07-20 10:00:00',
//             avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=userX',
//             isReply: false
//         },
//         {
//             id: 2,
//             username: 'teamLeader',
//             text: '8월 중으로 런칭 예정입니다!',
//             date: '2025-07-21 12:11:00',
//             avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=teamLeader',
//             isReply: true
//         }
//     ],
//     3: [
//         {
//             id: 1,
//             username: 'y****7',
//             text: '프론트엔드 스택에 StoryBook도 포함되어 있나요?',
//             date: '2025-07-18 14:22:44',
//             avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user7',
//             isReply: false
//         },
//         {
//             id: 2,
//             username: 'manager99',
//             text: '네! StoryBook 적극 활용할 계획입니다.',
//             date: '2025-07-18 16:31:10',
//             avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=manager99',
//             isReply: true
//         }
//     ],
//     4: [
//         {
//             id: 1,
//             username: 'designer77',
//             text: '디자인 툴은 어떤 것 쓰시나요?',
//             date: '2025-07-22 09:13:57',
//             avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=designer77',
//             isReply: false
//         },
//         {
//             id: 2,
//             username: 't*****r',
//             text: 'Figma, Prototyping 툴 메인으로 씁니다.',
//             date: '2025-07-22 10:01:33',
//             avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=manager2',
//             isReply: true
//         }
//     ],
//     5: [
//         {
//             id: 1,
//             username: 'infraGuy',
//             text: 'AWS 크레딧 지원 되나요?',
//             date: '2025-07-24 17:51:19',
//             avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=infraGuy',
//             isReply: false
//         },
//         {
//             id: 2,
//             username: 'projectOwner',
//             text: '아직 논의 중입니다. 확정되면 안내드릴게요!',
//             date: '2025-07-24 18:20:40',
//             avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=projectOwner',
//             isReply: true
//         }
//     ],
//     6: [
//         {
//             id: 1,
//             username: 'nlpDev',
//             text: 'NLP 관련 경험이 없어도 지원 가능한가요?',
//             date: '2025-07-25 11:05:24',
//             avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nlpDev',
//             isReply: false
//         },
//         {
//             id: 2,
//             username: 'admin',
//             text: '기초만 있으면 팀원과 함께 진행 가능합니다!',
//             date: '2025-07-25 12:17:52',
//             avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
//             isReply: true
//         }
//     ],
//     7: [
//         {
//             id: 1,
//             username: 'appleUser',
//             text: 'iOS 관련해서 SwiftUI만 사용하나요?',
//             date: '2025-07-25 13:11:11',
//             avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=appleUser',
//             isReply: false
//         },
//         {
//             id: 2,
//             username: 'teamLeader',
//             text: '네, SwiftUI로만 진행합니다!',
//             date: '2025-07-25 13:40:17',
//             avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=teamLeader2',
//             isReply: true
//         }
//     ],
//     8: [
//         {
//             id: 1,
//             username: 'frontDev',
//             text: 'TypeScript 경험이 적어도 지원할 수 있을까요?',
//             date: '2025-07-26 10:45:23',
//             avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=frontDev',
//             isReply: false
//         },
//         {
//             id: 2,
//             username: 'owner88',
//             text: '코드 리뷰와 문서화 도움 주실 수 있으면 OK!',
//             date: '2025-07-26 11:12:00',
//             avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=owner88',
//             isReply: true
//         }
//     ],
//     9: [
//         {
//             id: 1,
//             username: 'brandGenius',
//             text: '로고 디자인 방향성이 있나요?',
//             date: '2025-07-26 17:33:09',
//             avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=brandGenius',
//             isReply: false
//         },
//         {
//             id: 2,
//             username: 'manager',
//             text: '기업 아이덴티티 맞게 자유롭게 디자인 원합니다.',
//             date: '2025-07-26 18:07:44',
//             avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=manager',
//             isReply: true
//         }
//     ],
//     10: [
//         {
//             id: 1,
//             username: 'devOps',
//             text: 'CI/CD 구축 경험 많은 분 우대인가요?',
//             date: '2025-07-26 21:00:00',
//             avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=devOps',
//             isReply: false
//         },
//         {
//             id: 2,
//             username: 'admin',
//             text: '네, 관련 경험자 환영합니다!',
//             date: '2025-07-26 21:45:30',
//             avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin2',
//             isReply: true
//         }
//     ],
//     11: [
//         {
//             id: 1,
//             username: 'aiKing',
//             text: 'PyTorch 기반 프로젝트 처음인데 지원해도 될까요?',
//             date: '2025-07-27 08:20:54',
//             avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=aiKing',
//             isReply: false
//         },
//         {
//             id: 2,
//             username: 'owner',
//             text: '네, 기본 문법과 머신러닝 기초만 알면 괜찮습니다!',
//             date: '2025-07-27 09:10:13',
//             avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=owner',
//             isReply: true
//         }
//     ],
//     12: [
//         {
//             id: 1,
//             username: 'hybridDev',
//             text: 'React Native 경험 없어도 팀에서 도와주시나요?',
//             date: '2025-07-27 10:25:41',
//             avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hybridDev',
//             isReply: false
//         },
//         {
//             id: 2,
//             username: 'leadDev',
//             text: '네, 코드 리뷰와 페어 프로그래밍 합니다!',
//             date: '2025-07-27 11:09:33',
//             avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=leadDev',
//             isReply: true
//         }
//     ],
//     13: [
//         {
//             id: 1,
//             username: 'adminGuy',
//             text: 'SPA 구조 경험 없는 분도 괜찮나요?',
//             date: '2025-07-27 13:00:00',
//             avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=adminGuy',
//             isReply: false
//         },
//         {
//             id: 2,
//             username: 'manager',
//             text: '네, 배우실 의지만 있으면 됩니다!',
//             date: '2025-07-27 13:32:15',
//             avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=manager3',
//             isReply: true
//         }
//     ],
//     14: [
//         {
//             id: 1,
//             username: 'uxstar',
//             text: '서비스 전체 UX 리서치도 포함되나요?',
//             date: '2025-07-27 15:19:11',
//             avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=uxstar',
//             isReply: false
//         },
//         {
//             id: 2,
//             username: 'ownerUX',
//             text: '네! 유저 리서치부터 직접 진행합니다.',
//             date: '2025-07-27 16:10:00',
//             avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ownerUX',
//             isReply: true
//         }
//     ],
//     15: [
//         {
//             id: 1,
//             username: 'dockKing',
//             text: 'Helm 차트 직접 짜야 하나요?',
//             date: '2025-07-27 17:20:44',
//             avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dockKing',
//             isReply: false
//         },
//         {
//             id: 2,
//             username: 'infraLead',
//             text: '샘플 제공하고, 커스텀 같이 작업해요!',
//             date: '2025-07-27 17:55:22',
//             avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=infraLead',
//             isReply: true
//         }
//     ],
//     16: [
//         {
//             id: 1,
//             username: 'swaggerFan',
//             text: 'Swagger 문서 자동화는 어떻게 진행되나요?',
//             date: '2025-07-27 19:01:36',
//             avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=swaggerFan',
//             isReply: false
//         },
//         {
//             id: 2,
//             username: 'apiMaster',
//             text: 'Spring Boot에서 자동화 플러그인 씁니다!',
//             date: '2025-07-27 19:41:22',
//             avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=apiMaster',
//             isReply: true
//         }
//     ],
//     17: [
//         {
//             id: 1,
//             username: 'iosDesign',
//             text: 'Sketch 버전 호환 가능한가요?',
//             date: '2025-07-28 09:10:05',
//             avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=iosDesign',
//             isReply: false
//         },
//         {
//             id: 2,
//             username: 'teamUX',
//             text: '최신 버전 기준으로 통일 예정입니다!',
//             date: '2025-07-28 09:48:55',
//             avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=teamUX',
//             isReply: true
//         }
//     ],
//     18: [
//         {
//             id: 1,
//             username: 'elkFan',
//             text: 'Grafana 연동 방법도 배우나요?',
//             date: '2025-07-28 12:00:55',
//             avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=elkFan',
//             isReply: false
//         },
//         {
//             id: 2,
//             username: 'ownerELK',
//             text: '네, 실습과 예시까지 다 해봅니다.',
//             date: '2025-07-28 12:44:11',
//             avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ownerELK',
//             isReply: true
//         }
//     ],
//     19: [
//         {
//             id: 1,
//             username: 'mlengineer',
//             text: '추천 알고리즘은 어떤 방식 사용해요?',
//             date: '2025-07-28 13:50:30',
//             avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mlengineer',
//             isReply: false
//         },
//         {
//             id: 2,
//             username: 'leadML',
//             text: 'Collaborative Filtering 위주로 개발 중입니다.',
//             date: '2025-07-28 14:27:14',
//             avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=leadML',
//             isReply: true
//         }
//     ],
//     20: [
//         {
//             id: 1,
//             username: 'uiuxdev',
//             text: 'Flutter와 React UI 모두 경험할 수 있나요?',
//             date: '2025-07-28 16:05:22',
//             avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=uiuxdev',
//             isReply: false
//         },
//         {
//             id: 2,
//             username: 'teamLead',
//             text: '네, 파트별 실습 진행합니다!',
//             date: '2025-07-28 16:55:11',
//             avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=teamLead',
//             isReply: true
//         }
//     ]
// }