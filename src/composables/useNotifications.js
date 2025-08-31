import { ref, computed } from 'vue'
import { EventSourcePolyfill } from 'event-source-polyfill'
import axios from 'axios'
import { useRouter } from 'vue-router'

console.log('🔥🔥🔥 useNotifications.js 파일이 로드되었습니다! 🔥🔥🔥')

// SSE EventSource 인스턴스를 앱 전체에서 하나만 유지하도록 외부에 선언
let eventSource = null

// 컴포저블 외부에서 상태를 선언하여 싱글턴처럼 동작하게 만듭니다.
const notifications = ref([])
const hasNewChatMessage = ref(false)
const isLoading = ref(false)
const hasMore = ref(true)
const isLogin = ref(false)
const notificationVersion = ref(0)
const totalUnreadNotifications = ref(0)
const isChatPageActive = ref(false)

/**
 * 알림 데이터 중앙 관리 composable
 */
export function useNotifications() {
    const router = useRouter()
    const lastNotificationId = ref(null)
    let reconnectTimeout = null

    function forceUpdate() {
        notificationVersion.value += 1
    }

    function formatLocalDateTime(dateTimeStr) {
        if (!dateTimeStr) return ''
        const date = new Date(dateTimeStr)
        if (isNaN(date)) return ''
        const y = date.getFullYear()
        const m = String(date.getMonth() + 1).padStart(2, '0')
        const d = String(date.getDate()).padStart(2, '0')
        const h = String(date.getHours()).padStart(2, '0')
        const min = String(date.getMinutes()).padStart(2, '0')
        return `${y}-${m}-${d} ${h}:${min}`
    }

    function connectSSE() {
        // httpOnly 쿠키 방식에서는 토큰을 localStorage에서 확인하지 않음
        // 서버가 쿠키를 통해 자동으로 인증 처리
        if (eventSource) {
            console.log('🔄 기존 SSE 연결 종료 후 재연결')
            eventSource.close()
        }
        
        // PR-Front API 엔드포인트로 변경 (환경에 따라 수정 필요)
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
        
        console.log('🔗 SSE 연결 시도 (httpOnly 쿠키 방식):', `${apiBaseUrl}/api/notification/connect`)
        
        eventSource = new EventSourcePolyfill(`${apiBaseUrl}/api/notification/connect`, {
            headers: { 
                'Cache-Control': 'no-cache'
            },
            heartbeatTimeout: 300000, // 5분
            withCredentials: true // httpOnly 쿠키 포함
        })
        
        // SSE 연결 상태를 전역에 저장 (디버깅용)
        window.debugSSE = eventSource

        eventSource.onopen = () => {
            console.log('✅ SSE 연결 성공')
            isLogin.value = true
        }
        
        eventSource.addEventListener('sse', (event) => {
            try {
                console.log('📡 SSE 이벤트 수신:', event.data)
                
                if (!event.data || event.data.trim().includes('EventStream Created')) {
                    console.log('📡 SSE 연결 확인 메시지 수신')
                    return
                }
                const data = JSON.parse(event.data)
                const type = data.notificationType?.toUpperCase()
                
                console.log('🔔 실시간 알림 수신:', { type, data })

                if (type === 'CHAT') {
                    if (!hasNewChatMessage.value) { 
                        hasNewChatMessage.value = true
                        forceUpdate()
                        console.log('💬 새로운 채팅 메시지 알림')
                    }
                    return
                }
                
                // COMMENT 타입 처리 추가
                const notificationTypeMap = {
                    'INVITATION': 'invite',
                    'PROJECT': 'project', 
                    'COMMENT': 'comment',
                    'REVIEW': 'review',
                    'APPLICATION': 'application'
                }
                
                const newNotification = {
                    id: data.id,
                    type: notificationTypeMap[type] || 'system',
                    message: data.content,
                    timestamp: new Date(data.actionCreatedAt),
                    invitationId: data.invitationId,
                    url: data.url || null,
                    notificationType: data.notificationType,
                    isRead: false
                }
                
                console.log('📝 새로운 알림 추가:', newNotification)
                notifications.value.unshift(newNotification)
                totalUnreadNotifications.value += 1
                forceUpdate()
            } catch (e) {
                console.error('❌ 알림 파싱 실패:', e, '원본 데이터:', event.data)
            }
        })
        
        eventSource.onerror = (err) => {
            console.error('❌ SSE 연결 에러:', err)
            console.error('SSE readyState:', eventSource?.readyState)
            
            // 연결 실패시 재시도 로직
            if (eventSource?.readyState === EventSource.CLOSED) {
                console.log('🔄 SSE 재연결 시도')
                setTimeout(() => {
                    // httpOnly 쿠키 방식에서는 토큰 확인 없이 재연결 시도
                    connectSSE()
                }, 5000) // 5초 후 재시도
            }
        }
    }

    async function fetchNotifications(isInitial = false) {
        if (isLoading.value || (!isInitial && !hasMore.value)) return
        isLoading.value = true
        try {
            // httpOnly 쿠키 방식에서는 토큰 확인을 하지 않고 바로 API 호출
            // 서버에서 쿠키를 통해 인증 처리
            
            const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
            console.log('📋 알림 목록 요청:', `${apiBaseUrl}/api/notification/list`)
            
            // httpOnly 쿠키 방식으로 axios 대신 fetch 사용
            const response = await fetch(`${apiBaseUrl}/api/notification/list?${new URLSearchParams({
                lastId: isInitial ? '' : (lastNotificationId.value || ''),
                size: '10'
            })}`, {
                method: 'GET',
                credentials: 'include', // httpOnly 쿠키 포함
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            
            const data = await response.json()

            console.log('📋 알림 목록 응답:', data)
            
            const { notifications: fetchedData, hasNext, totalUnreadCount } = data
            const hasUnreadChat = fetchedData.some(item => item.notificationType?.toUpperCase() === 'CHAT' && item.delYn === 'N')
            if (hasUnreadChat) hasNewChatMessage.value = true
            
            const nonChatNotifications = fetchedData.filter(item => item.notificationType?.toUpperCase() !== 'CHAT')
            const newNotifications = nonChatNotifications.map(item => ({
                id: item.id,
                type: item.notificationType?.toLowerCase() === 'invitation' ? 'invite' : 
                      item.notificationType?.toLowerCase() === 'project' ? 'project' :
                      item.notificationType?.toLowerCase() === 'review' ? 'review' : 'system',
                message: item.content,
                timestamp: new Date(item.actionCreatedAt),
                invitationId: item.invitationId,
                url: item.url || null,
                notificationType: item.notificationType,
                isRead: item.delYn === 'Y'
            }))
            
            if (isInitial) {
                notifications.value = newNotifications
                totalUnreadNotifications.value = totalUnreadCount
            } else {
                notifications.value.push(...newNotifications)
            }
            hasMore.value = hasNext
            if (nonChatNotifications.length > 0) {
                lastNotificationId.value = nonChatNotifications[nonChatNotifications.length - 1].id
            }
            forceUpdate()
            
            console.log('✅ 알림 목록 로드 완료:', newNotifications.length + '개')
        } catch (error) {
            console.error('📛 알림 리스트 불러오기 실패:', error)
            if (error.response?.status === 401) {
                console.error('🚫 인증 실패 - 토큰이 만료되었을 수 있습니다')
                // 인증 실패시 로그인 페이지로 리다이렉트하거나 토큰 갱신
            } else if (error.response?.status === 404) {
                console.error('🚫 알림 API 엔드포인트를 찾을 수 없습니다')
            }
        } finally {
            isLoading.value = false
        }
    }
    
    function initializeNotifications() {
        console.log('🚀 알림 시스템 초기화 시작')
        // httpOnly 쿠키 방식에서는 localStorage에서 토큰을 확인하지 않음
        console.log('✅ httpOnly 쿠키 방식 - 알림 시스템 활성화')
        isLogin.value = true
            
        // 백엔드 알림 API가 구현되어 있으므로 활성화
        fetchNotifications(true).then(() => {
            console.log('📋 초기 알림 목록 로드 완료 - SSE 연결 시작')
            // 약간의 지연 후 SSE 연결 (백엔드 준비 시간 확보)
            setTimeout(() => {
                connectSSE()
            }, 1000)
        }).catch(error => {
            console.error('❌ 초기 알림 목록 로드 실패:', error)
            // 404 에러가 아닌 경우에만 SSE 연결 시도
            if (error.response?.status !== 404) {
                setTimeout(() => {
                    connectSSE()
                }, 2000)
            } else {
                console.log('⚠️ 알림 API 엔드포인트가 없습니다. SSE 연결을 건너뜁니다.')
            }
        })
    }

    async function markChatAsRead() {
        if (!hasNewChatMessage.value) {
            return
        }
        hasNewChatMessage.value = false
        try {
            const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
            // httpOnly 쿠키 방식으로 fetch 사용
            await fetch(`${apiBaseUrl}/api/notification/read-chat`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        } catch (error) {
            console.error('❌ 채팅 알림 읽음 처리 API 호출 실패:', error)
            hasNewChatMessage.value = true
        }
    }

    async function markAllAsRead() {
        try {
            const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
            // httpOnly 쿠키 방식으로 fetch 사용
            await fetch(`${apiBaseUrl}/api/notification/read-all`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            notifications.value.forEach(notification => {
                notification.isRead = true
            })
            totalUnreadNotifications.value = 0
            forceUpdate()
        } catch (error) { 
            console.error('❌ 모든 알림 읽음 처리 실패:', error) 
        }
    }

    function _removeNotificationFromState(notificationId) {
        const notificationToRemove = notifications.value.find(item => item.id === notificationId)
        if (notificationToRemove && !notificationToRemove.isRead) {
            totalUnreadNotifications.value = Math.max(0, totalUnreadNotifications.value - 1)
        }
        notifications.value = notifications.value.filter(item => item.id !== notificationId)
    }

    async function deleteNotification(notificationId) {
        try {
            const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
            // httpOnly 쿠키 방식으로 fetch 사용
            await fetch(`${apiBaseUrl}/api/notification/delete/${notificationId}`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            _removeNotificationFromState(notificationId)
        } catch (error) { 
            console.error('❌ 알림 삭제 실패:', error) 
        }
    }
    
    async function acceptInvitation(notification) {
        try {
            const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
            // httpOnly 쿠키 방식으로 fetch 사용
            const response = await fetch(`${apiBaseUrl}/api/invitations/${notification.invitationId}/accept`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            
            const data = response.ok ? await response.json() : null
            _removeNotificationFromState(notification.id)
            
            // PR-Front에서는 프로젝트 상세 페이지로 리다이렉트
            if (data && data.projectId) {
                router.push({ path: `/projects/${data.projectId}` })
            }
        } catch (error) { 
            console.error('❌ 초대 수락 실패:', error) 
        }
    }

    async function rejectInvitation(notification) {
        try {
            const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
            // httpOnly 쿠키 방식으로 fetch 사용
            await fetch(`${apiBaseUrl}/api/invitations/${notification.invitationId}/reject`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            _removeNotificationFromState(notification.id)
        } catch (error) { 
            console.error('❌ 초대 거절 실패:', error) 
        }
    }

    /**
     * 알림 아이템 클릭 시 처리하는 함수.
     * 알림 타입에 따라 적절한 페이지로 라우팅합니다.
     * @param {object} notification - 클릭된 알림 객체
     */
    async function handleNotificationClick(notification) {
        console.log('🚨🚨🚨 [handleNotificationClick] 함수 시작!!! 🚨🚨🚨')
        console.log('🚨 [handleNotificationClick] 알림 클릭:', notification)
        console.log('🚨 [handleNotificationClick] 알림 전체 속성:', Object.keys(notification))
        console.log('🚨 [handleNotificationClick] notification.url:', notification.url)
        console.log('🚨 [handleNotificationClick] notification.notificationType:', notification.notificationType)
        console.log('🚨 [handleNotificationClick] notification.type:', notification.type)
        console.log('🚨 [handleNotificationClick] notification.invitationId:', notification.invitationId)
        
        // notificationType과 type 둘 다 확인
        if (!notification || (!notification.notificationType && !notification.type)) {
            console.error("잘못된 알림 데이터입니다.", notification)
            return
        }
        
        // 알림을 읽음으로 처리
        if (!notification.isRead) {
            notification.isRead = true
            totalUnreadNotifications.value = Math.max(0, totalUnreadNotifications.value - 1)
            forceUpdate()
        }
        
        const type = (notification.notificationType || notification.type || '').toUpperCase()
        console.log('[handleNotificationClick] 처리할 타입:', type)

        if (type === 'INVITATION' || type === 'INVITE') {
            console.log('🎯 초대 알림 처리 시작')
            // 초대 알림 클릭 시 - invitationId로 프로젝트 정보를 가져와서 이동
            if (notification.invitationId) {
                console.log('🎯 invitationId 발견:', notification.invitationId)
                try {
                    // invitationId로 초대 정보를 가져와서 프로젝트 ID 확인
                    const token = localStorage.getItem('accessToken')
                    const response = await axios.get('/api/invitations/received', {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'User-Id': localStorage.getItem('userId') || '2'  // 임시로 user 2번 사용
                        }
                    })
                    
                    const invitation = response.data.find(inv => inv.invitationId === notification.invitationId)
                    if (invitation && invitation.projectId) {
                        console.log('🎯 초대에서 프로젝트 ID 찾음:', invitation.projectId)
                        router.push(`/projects/${invitation.projectId}`)
                    } else {
                        console.log('🎯 초대 정보를 찾을 수 없음, 프로젝트 목록으로 이동')
                        router.push('/projects')
                    }
                } catch (error) {
                    console.error('🎯 초대 정보 조회 실패:', error)
                    router.push('/projects')
                }
            } else {
                console.log('🎯 invitationId 없음, 프로젝트 목록으로 이동')
                router.push('/projects')
            }
            return
        }

        if (type === 'CHAT') {
            await markChatAsRead()
            router.push('/my-messages')
            return
        }

        if (type === 'PROJECT') {
            // 프로젝트 관련 알림 - 프로젝트 상세 페이지로 이동
            const projectId = extractProjectIdFromUrl(notification.url)
            if (projectId) {
                router.push(`/projects/${projectId}`)
            } else {
                router.push('/projects')
            }
            return
        }

        if (type === 'REVIEW') {
            // 리뷰 관련 알림 - 해당 프로젝트 또는 포트폴리오 페이지로 이동
            const projectId = extractProjectIdFromUrl(notification.url)
            if (projectId) {
                router.push(`/projects/${projectId}`)
            } else {
                router.push('/portfolios')
            }
            return
        }

        // 기본적으로 URL이 있으면 해당 페이지로 이동
        if (notification.url) {
            router.push(notification.url)
        }
    }

    function extractProjectIdFromUrl(url) {
        console.log('[extractProjectIdFromUrl] URL 파싱:', url)
        if (!url) return null
        const match = url.match(/\/projects\/(\d+)/)
        const projectId = match ? match[1] : null
        console.log('[extractProjectIdFromUrl] 추출된 projectId:', projectId)
        return projectId
    }

    // 컴퓨티드 속성
    const unreadNotificationCount = computed(() => totalUnreadNotifications.value)
    const unreadChatCount = computed(() => hasNewChatMessage.value ? 1 : 0)

    function cleanup() {
        if (eventSource) { 
            eventSource.close()
            eventSource = null
        }
        if (reconnectTimeout) { 
            clearTimeout(reconnectTimeout)
            reconnectTimeout = null 
        }
    }

    function resetNotifications() {
        notifications.value = []
        hasNewChatMessage.value = false
        totalUnreadNotifications.value = 0
        lastNotificationId.value = null
        isLoading.value = false
        hasMore.value = true
        isLogin.value = false
        cleanup()
    }

    return {
        // 상태
        notifications, 
        hasNewChatMessage, 
        totalUnreadNotifications, 
        unreadNotificationCount,
        unreadChatCount,
        isLoading, 
        hasMore, 
        isLogin, 
        notificationVersion,
        isChatPageActive,
        
        // 메서드
        formatLocalDateTime, 
        initializeNotifications, 
        fetchNotifications, 
        markAllAsRead, 
        markChatAsRead,
        deleteNotification, 
        acceptInvitation, 
        rejectInvitation, 
        cleanup, 
        resetNotifications,
        handleNotificationClick
    }
}