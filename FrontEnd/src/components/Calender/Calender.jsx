import React, { useState, useEffect } from 'react'
import './Calendar.css'
import { useNavigate } from 'react-router-dom'
import api from '../../api'

const emotionImages = {
  행복: '/happy.png',
  슬픔: '/sad.png',
  화남: '/angry.png',
  상처: '/hurt.png',
  사랑: '/yaho.png',
  당황: '/um.png',
}

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState(null)
  const [diaryData, setDiaryData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const [allDiaries, setAllDiaries] = useState([])

  const getFormattedDate = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    return `${year}${month.toString().padStart(2, '0')}${day
      .toString()
      .padStart(2, '0')}`
  }

  useEffect(() => {
    const today = new Date()
    const formattedDate = getFormattedDate(today)
    setSelectedDate(parseInt(formattedDate.slice(6), 10))

    const fetchDiaryData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await api.getDiary(formattedDate)
        setDiaryData(data)
      } catch (error) {
        setError(error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchDiaryData()
  }, [])

  const renderHeader = () => (
    <div className="header">
      <span className="month">24년 7월</span>
      <span className="menu-icon">≡</span>
    </div>
  )

  const renderDaysOfWeek = () => (
    <div className="days-of-week">
      {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
        <span key={index} className="day-of-week">
          {day}
        </span>
      ))}
    </div>
  )

  const renderDays = () => {
    const days = []
    for (let i = 1; i <= 31; i++) {
      const dateStr = `202407${i.toString().padStart(2, '0')}`
      const diaryEntry = allDiaries[dateStr]
      const emotionImage = diaryEntry ? emotionImages[diaryEntry[0]] : null

      days.push(
        <div
          key={i}
          className={`day ${selectedDate === i ? 'selected' : ''}`}
          onClick={() => {
            setSelectedDate(i)
            setDiaryData(null)
          }}
        >
          <div className="emotion-circle">
            {emotionImage && <img src={emotionImage} alt={diaryEntry[1]} />}
          </div>
          <span className="date-number">{i}</span>
        </div>
      )
    }
    return <div className="days-container">{days}</div>
  }

  const renderInfoBox = () => {
    if (isLoading) {
      return <div className="info-box">데이터를 가져오는 중...</div>
    }
    if (error) {
      return (
        <div className="info-box">
          일기가 존재하지 않습니다ㅠㅠ 작성해주세요
        </div>
      )
    }
    if (!selectedDate) {
      return <div className="info-box">날짜를 선택하세요.</div>
    }
    if (diaryData) {
      return (
        <div className="info-box">
          <h3>{selectedDate}일의 일기</h3>
          <p>{diaryData.data.content || '일기 내용이 없습니다.'}</p>
        </div>
      )
    }
    return <div className="info-box">일기 데이터를 가져오는 중...</div>
  }

  useEffect(() => {
    const fetchAllDiaries = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await api.getAllDiaries()
        const processedData = Object.entries(data.data).reduce(
          (acc, [date, value]) => {
            const emotion = value[0]
            const content = value[1]
            acc[date] = [emotion, content] // 감정, 내용
            return acc
          },
          {}
        )
        setAllDiaries(processedData)
        console.log(processedData)
      } catch (error) {
        setError(error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchAllDiaries()
  }, [])

  useEffect(() => {
    if (selectedDate) {
      const fetchDiaryData = async () => {
        setIsLoading(true)
        setError(null)
        try {
          const dateStr = `202407${selectedDate.toString().padStart(2, '0')}`
          const data = await api.getDiary(dateStr)
          setDiaryData(data)
          console.log(data)
        } catch (error) {
          setError(error)
        } finally {
          setIsLoading(false)
        }
      }
      fetchDiaryData()
    }
  }, [selectedDate])

  const handleClick = () => {
    if (selectedDate) {
      navigate('/emotion', { state: { selectedDate } })
    } else {
      alert('날짜를 선택해 주세요.')
    }
  }

  const handleClick2 = () => {
    if (selectedDate) {
      const url = `http://localhost:3005/?selectedDate=${encodeURIComponent(
        `202407${selectedDate.toString().padStart(2, '0')}`
      )}`
      window.open(url, '_blank', 'noopener,noreferrer')
    } else {
      alert('날짜를 선택해 주세요.')
    }
  }

  const handleClick3 = async () => {
    if (selectedDate) {
      try {
        const dateStr = `202407${selectedDate.toString().padStart(2, '0')}`
        const data = await api.getDiary(dateStr)
        navigate('/result', {
          state: {
            selectedDate: selectedDate,
            emotionLabel: data.feeling,
            responseData: data,
            diaryData: data,
          },
        })
        console.log(data)
      } catch (error) {
        alert('일기 데이터를 가져오는 데 실패했습니다.')
      }
    } else {
      alert('날짜를 선택해 주세요.')
    }
  }

  return (
    <div className="calendar">
      {renderHeader()}
      {renderDaysOfWeek()}
      {renderDays()}
      {renderInfoBox()}
      <div className="button-container">
        <button className="background-button" onClick={handleClick2}>
          배경화면 보러가기
        </button>
        <button className="diary-button" onClick={handleClick3}>
          일기 보러가기
        </button>
        <div className="add-button" onClick={handleClick}>
          +
        </div>
      </div>
    </div>
  )
}

export default Calendar
