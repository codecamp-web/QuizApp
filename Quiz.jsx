import React, { useEffect, useState } from 'react'
import { questions as originalQuestions } from './data/Question'

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [showScore, setShowScore] = useState(false)
  const [shuffledQuestions, setShuffledQuestions] = useState([])
  const [timeLeft, setTimeLeft] = useState(60) // 60 seconds for whole quiz

  // Shuffle on mount
  useEffect(() => {
    const shuffled = originalQuestions.map((q) => ({
      ...q,
      answerOptions: shuffleArray(q.answerOptions),
    }))
    setShuffledQuestions(shuffled)
  }, [])

  // Timer countdown
  useEffect(() => {
    if (showScore) return
    if (timeLeft === 0) {
      setShowScore(true)
      return
    }

    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
    return () => clearTimeout(timer)
  }, [timeLeft, showScore])

  const handleAnswerClick = (index) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: index,
    })
  }

  const handleNext = () => {
    if (currentQuestion < shuffledQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowScore(true)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const calculateScore = () => {
    return Object.keys(selectedAnswers).reduce((score, key) => {
      const qIndex = parseInt(key)
      const selected = shuffledQuestions[qIndex].answerOptions[selectedAnswers[qIndex]].answerText
      const correct = originalQuestions[qIndex].answerOptions[originalQuestions[qIndex].correctAnswerIndex].answerText
      return selected === correct ? score + 1 : score
    }, 0)
  }

  const handleRestart = () => {
    const reshuffled = originalQuestions.map((q) => ({
      ...q,
      answerOptions: shuffleArray(q.answerOptions),
    }))
    setShuffledQuestions(reshuffled)
    setCurrentQuestion(0)
    setSelectedAnswers({})
    setShowScore(false)
    setTimeLeft(60)
  }

  if (!shuffledQuestions.length) return <div>Loading quiz...</div>

  const question = shuffledQuestions[currentQuestion]
  const selected = selectedAnswers[currentQuestion]

  return (
    <div className='flex justify-center items-center h-screen bg-gray-100'>
      <div className='w-full max-w-lg bg-white shadow-md p-6 rounded-lg'>
        <div className='text-center font-bold text-2xl mb-4'>Quiz App</div>

        {showScore ? (
          <div className='text-center'>
            <h2 className='text-2xl font-semibold mb-2'>Quiz Complete!</h2>
            <p className='text-lg mb-4'>
              You scored {calculateScore()} out of {shuffledQuestions.length}
            </p>
            <button
              onClick={handleRestart}
              className='mt-4 bg-blue-500 text-white px-4 py-2 rounded-md'
            >
              Retake Quiz
            </button>
          </div>
        ) : (
          <>
            <div className='flex justify-between items-center mb-2'>
              <p className='text-sm text-gray-500'>
                Question {currentQuestion + 1} of {shuffledQuestions.length}
              </p>
              <p className='text-sm text-red-500'>Time left: {timeLeft}s</p>
            </div>

            <div className='w-full bg-gray-300 rounded-full h-2.5 mb-4'>
              <div
                className='bg-green-500 h-2.5 rounded-full'
                style={{
                  width: `${((currentQuestion + 1) / shuffledQuestions.length) * 100}%`,
                }}
              ></div>
            </div>

            <div className='font-semibold mb-4'>{question.questionHeader}</div>
            <div className='space-y-2 mb-4'>
              {question.answerOptions.map((option, index) => {
                const isSelected = selected === index
                const selectedOptionText = question.answerOptions[selected]?.answerText
                const correctOptionText = originalQuestions[currentQuestion].answerOptions[originalQuestions[currentQuestion].correctAnswerIndex].answerText

                const isCorrect = option.answerText === correctOptionText
                const showFeedback = selected !== undefined
                const bgColor =
                  showFeedback && isSelected
                    ? isCorrect
                      ? 'bg-green-300'
                      : 'bg-red-300'
                    : isSelected
                    ? 'bg-gray-300'
                    : 'bg-white hover:bg-gray-100'

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerClick(index)}
                    className={`block w-full p-2 rounded-md border ${bgColor}`}
                  >
                    {option.answerText}
                  </button>
                )
              })}
            </div>

            <div className='flex gap-2'>
              <button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className='w-1/2 bg-blue-500 text-white p-2 rounded-md disabled:bg-gray-400'
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                disabled={selected === undefined}
                className={`w-1/2 text-white p-2 rounded-md ${
                  selected !== undefined
                    ? 'bg-green-500'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                {currentQuestion === shuffledQuestions.length - 1 ? 'Finish' : 'Next'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

const shuffleArray = (array) => {
  return [...array].sort(() => Math.random() - 0.5)
}

export default Quiz
