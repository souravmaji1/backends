import { useEffect, useState } from "react"
import Kilic from "@/assets/img/kilic.png";
import { useAppContext } from "@/context/app-context";

export default function MinerCard({ miner, onSelect }) {
  const [hours, setHours] = useState('')
  const [minutes, setMinutes] = useState('')
  const [seconds, setSeconds] = useState('')
  const [disabled, setDisabled] = useState(true)
  const { settings } = useAppContext();

  useEffect(() => {
    const interval = setInterval(() => {
      calculateTimeLeft()
    }, 1000);
    return () => clearInterval(interval);
  }, [])

  function calculateTimeLeft() {
    let endTime = new Date(miner.end_date).getTime();
    let now = new Date().getTime();
    let distance = endTime - now;

    let hours = Math.floor((distance % (1000 * 60 * 60 * 60)) / (1000 * 60 * 60));
    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((distance % (1000 * 60)) / 1000);

    setHours(String(hours).padStart(2, '0'))
    setMinutes(String(minutes).padStart(2, '0'))
    setSeconds(String(seconds).padStart(2, '0'))

    if (distance < settings.looters_least_time && disabled)
      setDisabled(false)
  }

  function select() {
    if (disabled)
      return

    onSelect(miner)
  }

  return (
    <div className={`text-white bg-gray-600 rounded-lg px-3 flex gap-3 items-center ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`} onClick={select}>
      <p className="text-white whitespace-nowrap">{hours} : {minutes} : {seconds}</p>

      <div className="w-full grid grid-cols-3 gap-2 w-4/5 h-auto py-2">
        {miner.miner.matchingTeam.ducks.map(duck =>
          <div key={duck.id} className="bg-dark_light rounded-lg transition-colors duration-300 hover:bg-dark" >
            <div
              key={duck.id}
              className="flex flex-col items-center justify-center bg-dark_light_2 rounded-lg m-2 transition-all duration-300 hover:brightness-90"
            >
              <div className="flex flex-col items-center justify-center">
                <img
                  src={process.env.NEXT_PUBLIC_API_URL + '/' + duck.photo}
                  className="w-14 h-14"
                />
                <h1 className="font-bold text-sm">{duck.name}</h1>
              </div>
              <div className="flex gap-1 justify-center items-center">
                <img
                  src={Kilic.src}
                  alt="kilic"
                  className="w-8 h-8"
                />
                <h1>{duck.base_power}</h1>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  )
}