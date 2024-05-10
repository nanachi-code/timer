import { useEffect, useState } from 'react'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { Label } from './components/ui/label'

function formatTimer(t: number) {
  const h = Math.trunc(t / (60 * 60))
  const m = Math.trunc((t - h * 60 * 60) / 60)
  const s = t - h * 60 * 60 - m * 60

  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s
    .toString()
    .padStart(2, '0')}`
}

const alarm = new Audio('alarm.mp3')

function App() {
  const [isWorking, setIsWorking] = useState(false)
  const [isRestPhase, setIsRestPhase] = useState(true)
  const [maxWorkTime, setMaxWorkTime] = useState(30)
  const [maxRestTime, setMaxRestTime] = useState(5)
  const [timer, setTimer] = useState(30)

  useEffect(() => {
    if (isWorking) {
      if (timer > 0) {
        const timerId = setTimeout(() => {
          setTimer(timer - 1)
        }, 1000)

        return () => {
          clearTimeout(timerId)
        }
      } else {
        setTimer(isRestPhase ? maxWorkTime * 60 : maxRestTime * 60)
        if (!isRestPhase) {
          alarm.play()
        }
        setIsRestPhase(!isRestPhase)
      }
    } else {
      setIsRestPhase(true)
      setTimer(maxWorkTime * 60)
    }
  }, [isWorking, isRestPhase, timer, maxWorkTime, maxRestTime])

  return (
    <div className='dark bg-background text-foreground w-[100vw] h-[100vh]'>
      <div>
        <Label>Work time in minutes</Label>
        <Input
          value={maxWorkTime}
          type='number'
          className='w-30'
          onChange={e => {
            if (isWorking) setIsWorking(false)
            setMaxWorkTime(e.target.valueAsNumber)
          }}
        />
      </div>

      <div>
        <Label>Rest time in minutes</Label>
        <Input
          value={maxRestTime}
          type='number'
          className='w-30'
          onChange={e => {
            if (isWorking) setIsWorking(false)
            setMaxRestTime(e.target.valueAsNumber)
          }}
        />
      </div>

      <p>Status: {isRestPhase ? 'Resting' : 'Working'}</p>

      <p>Timer: {formatTimer(timer)}</p>

      <Button
        onClick={() => {
          if (!isWorking) {
            setIsRestPhase(false)
          }
          setIsWorking(!isWorking)
        }}
      >
        {!isWorking ? 'Start' : 'Stop'}
      </Button>

      <Button
        className='ml-2'
        onClick={() => {
          alarm.pause()
          alarm.currentTime = 0
        }}
      >
        Turn off alarm
      </Button>
    </div>
  )
}

export default App
