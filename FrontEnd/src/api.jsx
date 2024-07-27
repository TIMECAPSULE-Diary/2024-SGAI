import axios from 'axios'

const BASE_URL = 'http://165.246.44.237:8000/'

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

const api = {
  getDiary: async date => {
    try {
      const response = await apiClient.get('/diary/get', {
        params: { date }, // 쿼리 파라미터로 날짜 전달
      })
      return response.data
    } catch (error) {
      console.error('Error fetching diary:', error)
      throw error
    }
  },

  getAllDiaries: async () => {
    try {
      const response = await apiClient.get('/diary/get/all') // 전체 다이어리 데이터 요청
      return response.data
    } catch (error) {
      console.error('Error fetching all diaries:', error)
      throw error
    }
  },
}

export default api
