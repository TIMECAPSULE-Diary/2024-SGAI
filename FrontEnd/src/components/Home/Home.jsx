import React from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import Slider1 from '../Slider/Slider1'
import Slider2 from '../Slider/Slider2'
import './Home.css'
function Home() {
  const settings = {
    dots: true,
    dotsClass: 'custom-slick-dots', // 커스텀 클래스 적용
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    fade: false,
  }

  return (
    <Slider {...settings}>
      <div>
        <Slider1 />
      </div>
      <div>
        <Slider2 />
      </div>
    </Slider>
  )
}

export default Home
