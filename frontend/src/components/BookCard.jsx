import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function BookCard({ book }){
  const { title, author, genre, rating, coverUrl } = book
  return (
    <Link to={`/book/${book._id}`} style={{textDecoration:'none', color:'inherit'}}>
      <motion.div
        className="card"
        whileHover={{ y: -4, boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        style={{ overflow:'hidden', padding:0 }}
      >
        <div style={{position:'relative',aspectRatio:'3/4',background:'#f4f4f4'}}>
          {coverUrl ? (
            <img src={coverUrl} alt={title} style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}} />
          ) : (
            <div style={{width:'100%',height:'100%',display:'grid',placeItems:'center',color:'#777'}}>No cover</div>
          )}
        </div>
        <div style={{padding:12}}>
          <div style={{fontWeight:700, lineHeight:1.3}} title={title}>{title}</div>
          <div style={{color:'#666', marginTop:4}}>{author?.name || 'Unknown author'}</div>
          <div style={{display:'flex',justifyContent:'space-between',marginTop:8,fontSize:12,color:'#555'}}>
            <span>{genre}</span>
            <span>⭐ {Number(rating || 0).toFixed(1)}</span>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
