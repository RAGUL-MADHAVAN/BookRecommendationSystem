import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import api from '../lib/api'

export default function UserDashboard(){
  const { user } = useAuth()
  const [progress, setProgress] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await api.get('/progress')
        if (mounted) setProgress(res.data.progress || [])
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  const rewards = user?.rewards || { points: 0, level: 1, badges: [] }
  const completed = progress.filter(p => p.completedAt)
  const reading = progress.filter(p => !p.completedAt)

  return (
    <div className="container">
      <h2>My Dashboard</h2>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:16,marginTop:12}}>
        <div className="card">
          <h3>Rewards</h3>
          <div style={{marginTop:8,color:'#666'}}>Points</div>
          <div style={{fontSize:28,fontWeight:800}}>{rewards.points || 0}</div>
          <div style={{marginTop:8,color:'#666'}}>Level</div>
          <div style={{fontSize:28,fontWeight:800}}>{rewards.level || 1}</div>
        </div>
        <div className="card">
          <h3>Currently Reading</h3>
          {loading ? <div>Loading...</div> : (
            <ul style={{margin:0,paddingLeft:16}}>
              { reading.length === 0 && <li>No books in progress</li>}
              { reading.map(p => (
                <li key={p._id}>{p.book?.title} — {p.percentage}%</li>
              ))}
            </ul>
          )}
        </div>
        <div className="card">
          <h3>Completed</h3>
          {loading ? <div>Loading...</div> : (
            <ul style={{margin:0,paddingLeft:16}}>
              {completed.length === 0 && <li>No completed books yet</li>}
              {completed.map(p => (
                <li key={p._id}>{p.book?.title}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
