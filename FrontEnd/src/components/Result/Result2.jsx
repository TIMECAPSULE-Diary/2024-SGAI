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

const Result2 = () => {
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
    navigate('/calendar')
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
      <div className="Result-Title">책 추천 📚</div>
      <Slider {...sliderSettings} className="Result-Slider3">
        {recommendedBook && recommendedBook.length > 0 ? (
          recommendedBook.map((book, index) => (
            <div key={index} className="Result-Slide3">
              <div className="Slide-ImageContainer">
                <img
                  src={book._source.url}
                  className="Slide-Image"
                  alt={book._source.title}
                />
              </div>
              <div className="Slide-TextContainer3">
                <h3>{book._source.title}</h3>
                <p className="Slide-Description">
                  {book._source.text.length > 150
                    ? book._source.text.slice(0, 130) + '...'
                    : book._source.text}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="Result-Slide">
            <h3>추천할 책이 없습니다.</h3>
          </div>
        )}
      </Slider>
      <div className="Result-button3" onClick={handleClick}>
        오늘 일기 끝!
      </div>
    </div>
  )
}

export default Result2
