import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import './write.css'
import Loading from '../Loading/Loading'

const Write = () => {
  const location = useLocation()
  const { selectedDate } = location.state || {}
  const { selectedEmotion } = location.state || {}
  const [image, setImage] = useState(null)
  const [inputText, setInputText] = useState('')
  const [loading, setLoading] = useState(false) // 로딩 상태 추가
  const navigate = useNavigate()

  const handleImageUpload = event => {
    const file = event.target.files[0]
    if (file) {
      setImage(file)
    }
  }

  const handleInputChange = event => {
    setInputText(event.target.value)
  }

  const handleClick = async () => {
    if (!inputText.trim()) {
      alert('내용을 입력해 주세요.')
      return
    }

    // Extract label from selectedEmotion
    const emotionLabel = selectedEmotion ? selectedEmotion.label : ''

    // Create FormData object
    const formData = new FormData()
    formData.append('date', `202407${selectedDate.toString().padStart(2, '0')}`)
    formData.append('feeling', emotionLabel)
    formData.append('content', inputText)
    if (image) {
      formData.append('photo', image, image.name) // Include image file
    }

    setLoading(true) // 로딩 시작

    try {
      // API 호출
      const response = await axios.post(
        'http://165.246.44.237:8000/diary/post',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data', // Important for FormData
          },
        }
      )
      console.log('Response:', response.data)

      // 성공 후 이동할 페이지
      navigate('/result', {
        state: { selectedDate, emotionLabel, responseData: response.data },
      })
    } catch (error) {
      console.error('Error posting diary data:', error)
      alert('일기 데이터를 저장하는 데 실패했습니다.')
    } finally {
      setLoading(false) // 로딩 종료
    }
  }

  return (
    <div className="Write-Container">
      {loading ? (
        <Loading /> // 로딩 중일 때 로딩 컴포넌트 표시
      ) : (
        <>
          <div className="Write-date">{`7월 ${selectedDate}일의 일기`}</div>
          <div className="Write-text">기록하고 싶은 내용을 입력해주세요!</div>
          <textarea
            className="Write-input"
            placeholder="여기에 일기를 작성하세요..."
            value={inputText}
            onChange={handleInputChange}
          ></textarea>
          <div className="image-upload-container">
            <label htmlFor="image-upload" className="image-upload-label">
              대표 이미지 추가
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              className="image-upload-input"
              onChange={handleImageUpload}
            />
            {image && (
              <img
                src={URL.createObjectURL(image)}
                alt="미리보기"
                className="image-preview"
              />
            )}
          </div>
          <div className="Write-next" onClick={handleClick}>
            다 적었어요!
          </div>
        </>
      )}
    </div>
  )
}

export default Write
