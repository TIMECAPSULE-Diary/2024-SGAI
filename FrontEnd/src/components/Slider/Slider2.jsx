import React from 'react'
import { useNavigate } from 'react-router-dom'

const Slider2 = () => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate('/calendar')
  }
  return (
    <div className="Slider2">
      <div className="Slider2text">
        <div className="Slider2text1">타임캡슐</div>
        <div className="Slider2text2">감정을 기록하고, </div>
        <div className="Slider2text2">감동을 더하다.</div>
        <div className="Slider2text3">
          오늘의 일기가, 내일의 취향을 만듭니다.
        </div>
        <div className="Slider2text4">
          일기와 추천이 만나 새로운 경험을 선사합니다.
        </div>
      </div>
      <div className="Slider2button" onClick={handleClick}>
        오늘부터 기록하기
      </div>
    </div>
  )
}

export default Slider2
