import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Home from './components/Home/Home'
import Calender from './components/Calender/Calender'
import Write from './components/Write/write'
import Emotion from './emotion/emotion'
import Loading from './components/Loading/Loading'
import Result from './components/Result/Result'
import Result1 from './components/Result/Result1'
import Result2 from './components/Result/Result2'
import { YouTubeProvider } from './components/Result/YoutubeContext1'
import './App.css'
import Result3 from './components/Result/Result3'

const pageVariants = {
  initial: {
    opacity: 0,
    y: 10, // 페이지가 살짝 아래에서 올라오는 효과
  },
  enter: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -20, // 페이지가 살짝 위로 사라지는 효과
  },
}

const pageTransition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.5,
}

function App() {
  const location = useLocation()

  return (
    <YouTubeProvider>
      {' '}
      {/* YouTubeProvider로 애플리케이션 감싸기 */}
      <div className="iphone-container">
        <AnimatePresence>
          <Routes location={location} key={location.key}>
            <Route
              path="/"
              element={
                <motion.div
                  initial="initial"
                  animate="enter"
                  exit="exit"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <Home />
                </motion.div>
              }
            />
            <Route
              path="/calendar"
              element={
                <motion.div
                  initial="initial"
                  animate="enter"
                  exit="exit"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <Calender />
                </motion.div>
              }
            />
            <Route
              path="/emotion"
              element={
                <motion.div
                  initial="initial"
                  animate="enter"
                  exit="exit"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <Emotion />
                </motion.div>
              }
            />
            <Route
              path="/write"
              element={
                <motion.div
                  initial="initial"
                  animate="enter"
                  exit="exit"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <Write />
                </motion.div>
              }
            />
            <Route
              path="/loading"
              element={
                <motion.div
                  initial="initial"
                  animate="enter"
                  exit="exit"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <Loading />
                </motion.div>
              }
            />
            <Route
              path="/result"
              element={
                <motion.div
                  initial="initial"
                  animate="enter"
                  exit="exit"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <Result />
                </motion.div>
              }
            />
            <Route
              path="/result1"
              element={
                <motion.div
                  initial="initial"
                  animate="enter"
                  exit="exit"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <Result1 />
                </motion.div>
              }
            />
            <Route
              path="/result2"
              element={
                <motion.div
                  initial="initial"
                  animate="enter"
                  exit="exit"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <Result2 />
                </motion.div>
              }
            />
            <Route
              path="/result3"
              element={
                <motion.div
                  initial="initial"
                  animate="enter"
                  exit="exit"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <Result3 />
                </motion.div>
              }
            />
          </Routes>
        </AnimatePresence>
      </div>
    </YouTubeProvider>
  )
}

export default App
