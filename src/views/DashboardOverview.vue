<template>
  <DashboardLayout>
    <div class="dashboard-overview">
      <!-- Welcome Section -->
      <div class="welcome-section">
        <div class="welcome-content">
          <h2 class="welcome-title">안녕하세요, {{ user.name }}님! 👋</h2>
          <p class="welcome-message">오늘도 멋진 하루 되세요. 현재 진행 중인 프로젝트가 {{ activeProjects }}개 있습니다.</p>
        </div>
        <div class="welcome-actions">
          <router-link to="/project-inquiry" class="cta-button primary">
            <i class="bi bi-plus-circle"></i>
            새 프로젝트 등록
          </router-link>
          <router-link to="/dashboard/messages" class="cta-button secondary">
            <i class="bi bi-chat-dots"></i>
            메시지 확인
          </router-link>
        </div>
      </div>

      <!-- Key Metrics Grid -->
      <div class="metrics-grid">
        <div class="metric-card revenue">
          <div class="metric-header">
            <div class="metric-icon">
              <i class="bi bi-currency-dollar"></i>
            </div>
            <div class="metric-trend up">
              <i class="bi bi-arrow-up"></i>
              <span>+12.5%</span>
            </div>
          </div>
          <div class="metric-content">
            <h3 class="metric-value">₩{{ formatMoney(monthlyRevenue) }}</h3>
            <p class="metric-label">이번 달 수익</p>
            <div class="metric-progress">
              <div class="progress-bar" :style="{ width: revenueProgress + '%' }"></div>
            </div>
            <p class="metric-subtitle">목표: ₩{{ formatMoney(revenueGoal) }}</p>
          </div>
        </div>

        <div class="metric-card projects">
          <div class="metric-header">
            <div class="metric-icon">
              <i class="bi bi-folder"></i>
            </div>
            <div class="metric-trend up">
              <i class="bi bi-arrow-up"></i>
              <span>+8</span>
            </div>
          </div>
          <div class="metric-content">
            <h3 class="metric-value">{{ totalProjects }}</h3>
            <p class="metric-label">전체 프로젝트</p>
            <div class="metric-breakdown">
              <span class="breakdown-item">
                <span class="breakdown-dot active"></span>
                진행중 {{ activeProjects }}
              </span>
              <span class="breakdown-item">
                <span class="breakdown-dot completed"></span>
                완료 {{ completedProjects }}
              </span>
            </div>
          </div>
        </div>

        <div class="metric-card clients">
          <div class="metric-header">
            <div class="metric-icon">
              <i class="bi bi-people"></i>
            </div>
            <div class="metric-trend up">
              <i class="bi bi-arrow-up"></i>
              <span>+5</span>
            </div>
          </div>
          <div class="metric-content">
            <h3 class="metric-value">{{ totalClients }}</h3>
            <p class="metric-label">총 클라이언트</p>
            <div class="metric-breakdown">
              <span class="breakdown-item">
                <span class="breakdown-dot new"></span>
                신규 {{ newClients }}
              </span>
              <span class="breakdown-item">
                <span class="breakdown-dot returning"></span>
                재계약 {{ returningClients }}
              </span>
            </div>
          </div>
        </div>

        <div class="metric-card rating">
          <div class="metric-header">
            <div class="metric-icon">
              <i class="bi bi-star-fill"></i>
            </div>
            <div class="metric-trend up">
              <i class="bi bi-arrow-up"></i>
              <span>+0.2</span>
            </div>
          </div>
          <div class="metric-content">
            <h3 class="metric-value">{{ averageRating }}<span class="rating-scale">/5.0</span></h3>
            <p class="metric-label">평균 평점</p>
            <div class="rating-stars">
              <i v-for="i in 5" :key="i" 
                 :class="['bi', i <= Math.floor(averageRating) ? 'bi-star-fill' : 'bi-star']"
                 class="star"></i>
            </div>
            <p class="metric-subtitle">{{ totalReviews }}개 리뷰</p>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="charts-section">
        <div class="chart-container">
          <div class="chart-header">
            <h3 class="chart-title">수익 추이</h3>
            <div class="chart-controls">
              <button v-for="period in ['7일', '30일', '3개월', '1년']" 
                      :key="period"
                      @click="setRevenuePeriod(period)"
                      :class="['period-btn', { active: revenuePeriod === period }]">
                {{ period }}
              </button>
            </div>
          </div>
          <div class="chart-content">
            <canvas ref="revenueChart" class="chart-canvas"></canvas>
          </div>
        </div>

        <div class="chart-container">
          <div class="chart-header">
            <h3 class="chart-title">프로젝트 현황</h3>
          </div>
          <div class="chart-content">
            <canvas ref="projectChart" class="chart-canvas"></canvas>
          </div>
          <div class="chart-legend">
            <div class="legend-item">
              <span class="legend-color" style="background: #FF7D12;"></span>
              <span>진행중</span>
              <span class="legend-value">{{ activeProjects }}</span>
            </div>
            <div class="legend-item">
              <span class="legend-color" style="background: #28a745;"></span>
              <span>완료</span>
              <span class="legend-value">{{ completedProjects }}</span>
            </div>
            <div class="legend-item">
              <span class="legend-color" style="background: #ffc107;"></span>
              <span>대기중</span>
              <span class="legend-value">{{ pendingProjects }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity & Quick Actions -->
      <div class="activity-section">
        <div class="recent-activity">
          <div class="section-header">
            <h3 class="section-title">최근 활동</h3>
            <router-link to="/dashboard/activity" class="view-all-link">
              전체 보기 <i class="bi bi-arrow-right"></i>
            </router-link>
          </div>
          <div class="activity-list">
            <div v-for="activity in recentActivities" :key="activity.id" class="activity-item">
              <div class="activity-icon" :class="activity.type">
                <i :class="getActivityIcon(activity.type)"></i>
              </div>
              <div class="activity-content">
                <p class="activity-message">{{ activity.message }}</p>
                <span class="activity-time">{{ formatRelativeTime(activity.timestamp) }}</span>
              </div>
              <div class="activity-action" v-if="activity.actionUrl">
                <router-link :to="activity.actionUrl" class="action-btn">
                  <i class="bi bi-arrow-right"></i>
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <div class="quick-actions">
          <div class="section-header">
            <h3 class="section-title">빠른 작업</h3>
          </div>
          <div class="actions-grid">
            <router-link to="/dashboard/projects/new" class="action-card">
              <div class="action-icon">
                <i class="bi bi-plus-circle"></i>
              </div>
              <h4 class="action-title">새 프로젝트</h4>
              <p class="action-description">프로젝트를 등록하고 클라이언트를 찾아보세요</p>
            </router-link>

            <router-link to="/dashboard/proposals/create" class="action-card">
              <div class="action-icon">
                <i class="bi bi-file-text"></i>
              </div>
              <h4 class="action-title">제안서 작성</h4>
              <p class="action-description">전문적인 제안서를 작성해보세요</p>
            </router-link>

            <router-link to="/dashboard/portfolio/add" class="action-card">
              <div class="action-icon">
                <i class="bi bi-collection"></i>
              </div>
              <h4 class="action-title">포트폴리오 추가</h4>
              <p class="action-description">작업물을 포트폴리오에 추가하세요</p>
            </router-link>

            <router-link to="/dashboard/messages" class="action-card">
              <div class="action-icon">
                <i class="bi bi-chat-dots"></i>
              </div>
              <h4 class="action-title">메시지 확인</h4>
              <p class="action-description">클라이언트와 소통하세요</p>
              <span v-if="unreadMessages > 0" class="action-badge">{{ unreadMessages }}</span>
            </router-link>
          </div>
        </div>
      </div>

      <!-- Upcoming Deadlines -->
      <div class="deadlines-section">
        <div class="section-header">
          <h3 class="section-title">다가오는 마감일</h3>
          <router-link to="/dashboard/projects" class="view-all-link">
            전체 프로젝트 <i class="bi bi-arrow-right"></i>
          </router-link>
        </div>
        <div class="deadlines-list">
          <div v-for="deadline in upcomingDeadlines" :key="deadline.id" 
               :class="['deadline-item', { urgent: deadline.isUrgent }]">
            <div class="deadline-info">
              <h4 class="deadline-project">{{ deadline.projectName }}</h4>
              <p class="deadline-task">{{ deadline.taskName }}</p>
              <span class="deadline-client">{{ deadline.clientName }}</span>
            </div>
            <div class="deadline-date">
              <span class="deadline-time" :class="{ urgent: deadline.isUrgent }">
                {{ formatDeadline(deadline.dueDate) }}
              </span>
              <div class="deadline-progress">
                <div class="progress-bar small" :style="{ width: deadline.progress + '%' }"></div>
              </div>
              <span class="deadline-percentage">{{ deadline.progress }}% 완료</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script>
import { ref, onMounted, nextTick } from 'vue'
import DashboardLayout from '@/components/dashboard/DashboardLayout.vue'

export default {
  name: 'DashboardOverview',
  components: {
    DashboardLayout
  },
  setup() {
    // Chart refs
    const revenueChart = ref(null)
    const projectChart = ref(null)

    // User data
    const user = ref({
      name: '김개발자'
    })

    // Metrics data
    const monthlyRevenue = ref(3200000)
    const revenueGoal = ref(4000000)
    const totalProjects = ref(47)
    const activeProjects = ref(12)
    const completedProjects = ref(35)
    const pendingProjects = ref(5)
    const totalClients = ref(28)
    const newClients = ref(8)
    const returningClients = ref(20)
    const averageRating = ref(4.8)
    const totalReviews = ref(156)
    const unreadMessages = ref(7)

    // Chart period
    const revenuePeriod = ref('30일')

    // Computed metrics
    const revenueProgress = ref(Math.round((monthlyRevenue.value / revenueGoal.value) * 100))

    // Recent activities
    const recentActivities = ref([
      {
        id: 1,
        type: 'project',
        message: '새로운 프로젝트 "모바일 앱 개발"에 대한 문의가 도착했습니다.',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        actionUrl: '/dashboard/inquiries/1'
      },
      {
        id: 2,
        type: 'payment',
        message: '"웹사이트 리뉴얼" 프로젝트 결제가 완료되었습니다.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        actionUrl: '/dashboard/projects/2'
      },
      {
        id: 3,
        type: 'review',
        message: '김클라이언트님이 5점 리뷰를 남겨주셨습니다.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
        actionUrl: '/dashboard/reviews'
      },
      {
        id: 4,
        type: 'message',
        message: '이클라이언트님으로부터 새 메시지가 도착했습니다.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
        actionUrl: '/dashboard/messages/3'
      }
    ])

    // Upcoming deadlines
    const upcomingDeadlines = ref([
      {
        id: 1,
        projectName: 'E-커머스 웹사이트',
        taskName: '결제 시스템 구현',
        clientName: 'ABC 쇼핑몰',
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
        progress: 75,
        isUrgent: true
      },
      {
        id: 2,
        projectName: '모바일 앱 개발',
        taskName: 'UI/UX 디자인 완료',
        clientName: 'XYZ 스타트업',
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
        progress: 60,
        isUrgent: false
      },
      {
        id: 3,
        projectName: '관리자 대시보드',
        taskName: '데이터 분석 기능',
        clientName: 'DEF 기업',
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        progress: 40,
        isUrgent: false
      }
    ])

    // Methods
    const formatMoney = (amount) => {
      return new Intl.NumberFormat('ko-KR').format(amount)
    }

    const formatRelativeTime = (timestamp) => {
      const now = new Date()
      const diff = now - timestamp
      const minutes = Math.floor(diff / (1000 * 60))
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))

      if (minutes < 60) return `${minutes}분 전`
      if (hours < 24) return `${hours}시간 전`
      return `${days}일 전`
    }

    const formatDeadline = (date) => {
      const now = new Date()
      const diff = date - now
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
      
      if (days === 0) return '오늘'
      if (days === 1) return '내일'
      if (days < 7) return `${days}일 후`
      return `${Math.ceil(days / 7)}주 후`
    }

    const getActivityIcon = (type) => {
      const iconMap = {
        project: 'bi-folder-plus',
        payment: 'bi-credit-card',
        review: 'bi-star-fill',
        message: 'bi-chat-dots'
      }
      return iconMap[type] || 'bi-bell'
    }

    const setRevenuePeriod = (period) => {
      revenuePeriod.value = period
      // In a real app, this would trigger a data refresh
      console.log('Setting revenue period to:', period)
    }

    // Simple chart implementation (in a real app, use Chart.js or similar)
    const drawRevenueChart = () => {
      const canvas = revenueChart.value
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      const width = canvas.width = canvas.offsetWidth * 2
      const height = canvas.height = canvas.offsetHeight * 2
      ctx.scale(2, 2)

      // Sample data
      const data = [2000000, 2300000, 2800000, 3100000, 2900000, 3200000, 3500000]
      const labels = ['6월', '7월', '8월', '9월', '10월', '11월', '12월']

      // Draw chart background
      ctx.fillStyle = '#f8f9fa'
      ctx.fillRect(0, 0, width / 2, height / 2)

      // Draw grid lines
      ctx.strokeStyle = '#e9ecef'
      ctx.lineWidth = 1
      for (let i = 1; i < 5; i++) {
        const y = (height / 2) * (i / 5)
        ctx.beginPath()
        ctx.moveTo(40, y)
        ctx.lineTo(width / 2 - 20, y)
        ctx.stroke()
      }

      // Draw line chart
      ctx.strokeStyle = '#FF7D12'
      ctx.lineWidth = 3
      ctx.beginPath()
      data.forEach((value, index) => {
        const x = 40 + (index * ((width / 2 - 60) / (data.length - 1)))
        const y = height / 2 - 20 - ((value - 1500000) / 2000000) * (height / 2 - 40)
        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })
      ctx.stroke()

      // Draw data points
      ctx.fillStyle = '#FF7D12'
      data.forEach((value, index) => {
        const x = 40 + (index * ((width / 2 - 60) / (data.length - 1)))
        const y = height / 2 - 20 - ((value - 1500000) / 2000000) * (height / 2 - 40)
        ctx.beginPath()
        ctx.arc(x, y, 4, 0, Math.PI * 2)
        ctx.fill()
      })
    }

    const drawProjectChart = () => {
      const canvas = projectChart.value
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      const width = canvas.width = canvas.offsetWidth * 2
      const height = canvas.height = canvas.offsetHeight * 2
      ctx.scale(2, 2)

      const centerX = width / 4
      const centerY = height / 4
      const radius = Math.min(centerX, centerY) - 20

      const data = [
        { label: '진행중', value: activeProjects.value, color: '#FF7D12' },
        { label: '완료', value: completedProjects.value, color: '#28a745' },
        { label: '대기중', value: pendingProjects.value, color: '#ffc107' }
      ]

      const total = data.reduce((sum, item) => sum + item.value, 0)
      let currentAngle = -Math.PI / 2

      data.forEach(item => {
        const sliceAngle = (item.value / total) * 2 * Math.PI
        
        ctx.fillStyle = item.color
        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle)
        ctx.closePath()
        ctx.fill()
        
        currentAngle += sliceAngle
      })

      // Draw center circle for donut effect
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius * 0.6, 0, Math.PI * 2)
      ctx.fill()

      // Draw total in center
      ctx.fillStyle = '#212529'
      ctx.font = 'bold 24px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(total, centerX, centerY + 8)
    }

    onMounted(async () => {
      await nextTick()
      drawRevenueChart()
      drawProjectChart()
    })

    return {
      user,
      monthlyRevenue,
      revenueGoal,
      totalProjects,
      activeProjects,
      completedProjects,
      pendingProjects,
      totalClients,
      newClients,
      returningClients,
      averageRating,
      totalReviews,
      unreadMessages,
      revenueProgress,
      revenuePeriod,
      recentActivities,
      upcomingDeadlines,
      revenueChart,
      projectChart,
      formatMoney,
      formatRelativeTime,
      formatDeadline,
      getActivityIcon,
      setRevenuePeriod
    }
  }
}
</script>

<style scoped>
.dashboard-overview {
  max-width: 1400px;
  margin: 0 auto;
}

/* Welcome Section */
.welcome-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32px;
  background: linear-gradient(135deg, #FF7D12 0%, #FE7C25 100%);
  border-radius: 16px;
  color: white;
  margin-bottom: 32px;
}

.welcome-content h2 {
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 700;
}

.welcome-content p {
  margin: 0;
  font-size: 16px;
  opacity: 0.9;
}

.welcome-actions {
  display: flex;
  gap: 12px;
}

.cta-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
}

.cta-button.primary {
  background: white;
  color: #FF7D12;
}

.cta-button.secondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.cta-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Metrics Grid */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.metric-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.metric-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
}

.metric-card.revenue .metric-icon {
  background: linear-gradient(135deg, #28a745, #20c997);
}

.metric-card.projects .metric-icon {
  background: linear-gradient(135deg, #FF7D12, #FE7C25);
}

.metric-card.clients .metric-icon {
  background: linear-gradient(135deg, #6f42c1, #e83e8c);
}

.metric-card.rating .metric-icon {
  background: linear-gradient(135deg, #ffc107, #fd7e14);
}

.metric-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
}

.metric-trend.up {
  background: rgba(40, 167, 69, 0.1);
  color: #28a745;
}

.metric-value {
  font-size: 32px;
  font-weight: 700;
  color: #212529;
  margin: 0 0 4px 0;
}

.rating-scale {
  font-size: 18px;
  font-weight: 400;
  color: #6c757d;
}

.metric-label {
  color: #6c757d;
  font-size: 14px;
  margin: 0 0 12px 0;
}

.metric-progress {
  height: 4px;
  background: #e9ecef;
  border-radius: 2px;
  margin: 8px 0;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #28a745, #20c997);
  transition: width 0.3s ease;
}

.progress-bar.small {
  height: 3px;
}

.metric-subtitle {
  font-size: 12px;
  color: #6c757d;
  margin: 4px 0 0 0;
}

.metric-breakdown {
  display: flex;
  gap: 16px;
}

.breakdown-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #6c757d;
}

.breakdown-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.breakdown-dot.active {
  background: #FF7D12;
}

.breakdown-dot.completed {
  background: #28a745;
}

.breakdown-dot.new {
  background: #6f42c1;
}

.breakdown-dot.returning {
  background: #20c997;
}

.rating-stars {
  display: flex;
  gap: 2px;
  margin: 8px 0;
}

.star {
  color: #ffc107;
  font-size: 14px;
}

/* Charts Section */
.charts-section {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  margin-bottom: 32px;
}

.chart-container {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.chart-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: #212529;
}

.chart-controls {
  display: flex;
  gap: 4px;
}

.period-btn {
  padding: 6px 12px;
  border: 1px solid #e9ecef;
  background: white;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.period-btn:hover {
  background: #f8f9fa;
}

.period-btn.active {
  background: #FF7D12;
  color: white;
  border-color: #FF7D12;
}

.chart-content {
  height: 200px;
  position: relative;
}

.chart-canvas {
  width: 100%;
  height: 100%;
  border-radius: 8px;
}

.chart-legend {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.legend-value {
  margin-left: auto;
  font-weight: 600;
}

/* Activity Section */
.activity-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 32px;
}

.recent-activity, .quick-actions {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: #212529;
}

.view-all-link {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #FF7D12;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
}

.view-all-link:hover {
  color: #FE7C25;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  transition: background 0.2s ease;
}

.activity-item:hover {
  background: #f8f9fa;
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.activity-icon.project {
  background: #FF7D12;
}

.activity-icon.payment {
  background: #28a745;
}

.activity-icon.review {
  background: #ffc107;
}

.activity-icon.message {
  background: #6f42c1;
}

.activity-content {
  flex: 1;
}

.activity-message {
  margin: 0 0 4px 0;
  font-size: 14px;
  color: #212529;
  line-height: 1.4;
}

.activity-time {
  font-size: 12px;
  color: #6c757d;
}

.activity-action {
  flex-shrink: 0;
}

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: #f8f9fa;
  color: #6c757d;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: #FF7D12;
  color: white;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.action-card {
  display: block;
  padding: 20px;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.2s ease;
  position: relative;
}

.action-card:hover {
  border-color: #FF7D12;
  box-shadow: 0 4px 12px rgba(255, 125, 18, 0.15);
  transform: translateY(-2px);
}

.action-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #FF7D12, #FE7C25);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-bottom: 16px;
}

.action-title {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #212529;
}

.action-description {
  margin: 0;
  font-size: 14px;
  color: #6c757d;
  line-height: 1.4;
}

.action-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #dc3545;
  color: white;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 10px;
  min-width: 20px;
  text-align: center;
}

/* Deadlines Section */
.deadlines-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.deadlines-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.deadline-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.deadline-item:hover {
  border-color: #FF7D12;
  box-shadow: 0 2px 8px rgba(255, 125, 18, 0.1);
}

.deadline-item.urgent {
  border-color: #dc3545;
  background: rgba(220, 53, 69, 0.05);
}

.deadline-info h4 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: #212529;
}

.deadline-info p {
  margin: 0 0 4px 0;
  font-size: 14px;
  color: #6c757d;
}

.deadline-client {
  font-size: 12px;
  color: #6c757d;
}

.deadline-date {
  text-align: right;
  min-width: 120px;
}

.deadline-time {
  font-size: 14px;
  font-weight: 600;
  color: #212529;
}

.deadline-time.urgent {
  color: #dc3545;
}

.deadline-progress {
  margin: 8px 0 4px 0;
}

.deadline-percentage {
  font-size: 12px;
  color: #6c757d;
}

/* Mobile Responsive */
@media (max-width: 1024px) {
  .charts-section, .activity-section {
    grid-template-columns: 1fr;
  }

  .welcome-section {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }

  .actions-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .metrics-grid {
    grid-template-columns: 1fr;
  }

  .deadline-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .deadline-date {
    text-align: left;
    min-width: auto;
  }

  .welcome-content h2 {
    font-size: 24px;
  }

  .metric-value {
    font-size: 28px;
  }

  .chart-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
}
</style>
