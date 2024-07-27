import React, { useEffect, useState } from 'react'
import Slider from 'react-slick'
import './Result.css'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { useLocation, useNavigate } from 'react-router-dom'

const sliderSettings = {
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 5000,
  centerMode: true,
  centerPadding: '35px',
  dots: true,
}

const Result3 = () => {
  const [bgColor, setBgColor] = useState('#ddcfb9') // Initial background color
  const location = useLocation() // Use location to get state
  const navigate = useNavigate()

  // Extract state from location
  const {
    selectedDate,
    emotionLabel,
    recommendedBook,
    recommendedMovie,
    recommendedMusic,
  } = location.state || {}

  // Handle button click
  const handleClick = () => {
    navigate('/result2', {
      state: {
        selectedDate,
        emotionLabel,
        recommendedBook,
        recommendedMovie,
        recommendedMusic,
      },
    })
  }

  useEffect(() => {
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

    const getRandomColor = () => {
      const randomIndex = Math.floor(Math.random() * colors.length)
      return colors[randomIndex]
    }

    // Set background color
    setBgColor(getRandomColor())
  }, [])

  return (
    <div className="Result-Container" style={{ backgroundColor: bgColor }}>
      <div className="Result-Text">2024년 07월 {selectedDate || '미정'}일</div>
      <div className="Result-Title">음악 추천 🎧</div>
      <Slider {...sliderSettings} className="Result-Slider">
        {recommendedMusic && recommendedMusic.length > 0 ? (
          recommendedMusic.map((music, index) => (
            <div key={index} className="Result-Slide">
              <div className="Slide-VideoContainer">
                <iframe
                  src={music.youtube_embed}
                  className="Slide-Video"
                  title={music.title}
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="Slide-TextContainer">
                <h3>{music.title}</h3>
                <p></p>
              </div>
            </div>
          ))
        ) : (
          <div className="Result-Slide">
            <h3>추천할 음악이 없습니다.</h3>
          </div>
        )}
      </Slider>
      <div className="Result-button2" onClick={handleClick}>
        다음 내용 보기
      </div>
    </div>
  )
}

export default Result3
