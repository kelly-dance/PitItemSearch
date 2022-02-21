import { useCallback, useEffect, useState } from 'react'

export default function useCounter(): [number, boolean, () => void, () => void] {
  const [count, setCount] = useState(0)
  const [isSyncing, setIsSyncing] = useState(true)
  const increase = useCallback(async () => {
    const response = await fetch('/api/counter/increase').catch(e => console.error(e));
    if(!response) return;
    const json: { count: number } = await response.json();
    setCount(json.count);
    console.log('updated up')
  }, [])
  const decrease = useCallback(async () => {
    const response = await fetch('/api/counter/decrease').catch(e => console.error(e));
    if(!response) return;
    const json: { count: number } = await response.json();
    setCount(json.count);
    console.log('updated down')
  }, [])

  useEffect(() => {
    fetch('/api/counter').then(resp => resp.json().catch(() => ({})))
      .then(({ count }) => {
        if (typeof count === 'number' && !Number.isNaN(count)) {
          setCount(count)
        }
      })
      .catch(e => console.error(e))
      .finally(() => {
        setIsSyncing(false)
      })
  }, [])

  return [count, isSyncing, increase, decrease]
}
