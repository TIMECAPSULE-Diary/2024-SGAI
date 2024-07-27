import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import './Result.css'

const Result = () => {
  const [bgColor, setBgColor] = useState('#ddcfb9')
  const [videoId] = useState('fTwVEu6itik')
  const [videoTitle, setVideoTitle] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  // Extract state from location
  const {
    selectedDate,
    emotionLabel: passedEmotionLabel,
    responseData,
  } = location.state || {}

  // Determine emotionLabel based on availability
  const emotionLabel =
    passedEmotionLabel || responseData?.data?.feeling || 'Unknown'

  // Get current date and time
  const now = new Date()
  const formatDate = date => {
    const optionsDate = { year: 'numeric', month: '2-digit', day: '2-digit' }
    const optionsTime = { hour: 'numeric', minute: 'numeric', hour12: true }

    const formatterDate = new Intl.DateTimeFormat('ko-KR', optionsDate)
      .format(date)
      .replace(/\./g, '.')
    const formatterTime = new Intl.DateTimeFormat('ko-KR', optionsTime)
      .format(date)
      .replace(/\s/g, '')

    return {
      date: formatterDate.replace(/(\d{4})-(\d{2})-(\d{2})/, '$1. $2. $3'),
      time: formatterTime,
    }
  }

  const { date: currentDate, time } = formatDate(now)

  const { doc, data } = responseData || {}

  // Use optional chaining and default values
  const imageUrl = doc?.photo || data?.photo || '' // Default to empty string if no URL
  const diaryContent = doc?.content || data?.content || '' // Default to empty string if no content

  // Extract recommendations with default empty arrays
  const recommendedBook = doc?.recommended_book || data?.recommended_book || []
  const recommendedMovie =
    doc?.recommended_movie || data?.recommended_movie || []
  const recommendedMusic =
    doc?.recommended_music || data?.recommended_music || []

  useEffect(() => {
    console.log('Selected Date:', selectedDate)
    console.log('Emotion Label:', emotionLabel)
    console.log('Response Data:', responseData)
  }, [selectedDate, emotionLabel, responseData])

  const handleClick = () => {
    navigate('/result1', {
      state: {
        selectedDate, // Preserve original selected date
        currentDate, // Pass the current date
        emotionLabel,
        responseData,
        recommendedBook,
        recommendedMovie,
        recommendedMusic,
      },
    })
  }

  useEffect(() => {
    const getRandomColor = () => {
      const colors = [
        '#ddcfb9',
        '#c9aab9',
        '#adc6d8',
        '#a5cea5',
        '#ccc18b',
        '#d49d9d',
        '#A0D6B4',
        '#9ebcda',
        '#ccb3da',
        '#ddc9be',
      ]
      return colors[Math.floor(Math.random() * colors.length)]
    }

    setBgColor(getRandomColor())
  }, [])

  return (
    <div className="Result-Container" style={{ backgroundColor: bgColor }}>
      <div className="Result-Text">2024년 07월 {selectedDate}일</div>
      <div className="Result-time">{time}</div>
      <div className="Result-emotion">#{emotionLabel}</div>
      <div className="Result-img">
        <img src={imageUrl} alt="Diary Thumbnail" className="Thumbnail-Image" />
      </div>
      <div className="Result-text">{diaryContent}</div>
      <div className="Result-button" onClick={handleClick}>
        다음 내용 보기
      </div>
    </div>
  )
}

export default Result
