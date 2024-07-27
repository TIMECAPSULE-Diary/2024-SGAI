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
  autoplaySpeed: 4000,
  centerMode: true,
  centerPadding: '35px',
  dots: false,
}

const Result1 = () => {
  const [bgColor, setBgColor] = useState('#ddcfb9') // Initial background color
  const location = useLocation() // Use location to get state
  const navigate = useNavigate()
  const {
    selectedDate,
    emotionLabel,
    recommendedBook,
    recommendedMovie,
    recommendedMusic,
  } = location.state || {}

  // Handle button click
  const handleClick = () => {
    navigate('/result3', {
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
      <div className="Result1-Text">2024년 07월 {selectedDate || '미정'}일</div>
      <div className="Result1-emotion">#{emotionLabel || '미정'}</div>
      <div className="Result1-Title">영화 추천🎞️</div>

      <Slider {...sliderSettings} className="Result-Slider1">
        {recommendedMovie && recommendedMovie.length > 0 ? (
          recommendedMovie.map((movie, index) => (
            <div key={index} className="Result-Slide1">
              <div className="Slide-ImageContainer">
                <img
                  src={movie.url}
                  alt={movie.title}
                  className="Slide-Image"
                />
              </div>
              <div className="Slide-TextContainer">
                <h3>{movie.title}</h3>
                <p>
                  {movie.traslated_text.slice(0, 150) +
                    (movie.traslated_text.length > 150 ? '...' : '')}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="Result-Slide1">
            <h3>추천할 영화가 없습니다.</h3>
          </div>
        )}
      </Slider>

      <div className="Result-button1" onClick={handleClick}>
        다음 내용 보기
      </div>
    </div>
  )
}

export default Result1
