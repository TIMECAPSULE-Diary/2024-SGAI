import React, { useState } from 'react'
import './emotion.css'
import { useLocation, useNavigate } from 'react-router-dom'

const Emotion = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { selectedDate } = location.state || {}

  const [selectedEmotion, setSelectedEmotion] = useState(null)

  const emotions = [
    { id: 'happy', label: '행복' },
    { id: 'excited', label: '상처' },
    { id: 'love', label: '사랑' },
    { id: 'grateful', label: '슬픔' },
    { id: 'relieved', label: '화남' },
    { id: 'sad', label: '당황' },
  ]

  const handleEmotionClick = emotion => {
    setSelectedEmotion(emotion)
  }

  const handleClick = () => {
    if (!selectedEmotion) {
      alert('감정을 선택해 주세요.')
      return
    }

    navigate('/write', {
      state: { selectedDate, selectedEmotion },
    })
  }

  return (
    <div>
      <div className="emotion-container">
        <div className="emotion-date">
          {selectedDate
            ? `7월 ${selectedDate}일의 감정`
            : '날짜를 선택해 주세요'}
        </div>
        <div className="emotion-explain">오늘 하루중 느낀 감정을</div>
        <div className="emotion-explain">선택해주세요.</div>
        <div className="emotion-grid">
          {emotions.map(emotion => (
            <div
              key={emotion.id}
              className={`emotion-icon ${emotion.id} ${
                selectedEmotion?.id === emotion.id ? 'selected' : ''
              }`}
              onClick={() => handleEmotionClick(emotion)}
              data-label={emotion.label}
            />
          ))}
        </div>
        <div className="emotion-next" onClick={handleClick}>
          다음
        </div>
      </div>
    </div>
  )
}

export default Emotion
