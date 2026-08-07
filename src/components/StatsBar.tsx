import { Users, ImageIcon, Share2, Zap } from 'lucide-react'
import './StatsBar.css'

const stats = [
  { icon: <Users size={20} />, value: '2,000+', label: 'Builders Expected' },
  { icon: <ImageIcon size={20} />, value: 'Instant', label: 'Generation Speed' },
  { icon: <Share2 size={20} />, value: '#FrameInGoa', label: 'Share Hashtag' },
  { icon: <Zap size={20} />, value: 'Zero', label: 'Login Required' },
]

export default function StatsBar() {
  return (
    <div className="statsbar">
      <div className="statsbar__ticker">
        <div className="statsbar__ticker-track">
          {[...stats, ...stats].map((stat, i) => (
            <div key={i} className="statsbar__item">
              <span className="statsbar__icon">{stat.icon}</span>
              <span className="statsbar__value">{stat.value}</span>
              <span className="statsbar__label">{stat.label}</span>
              <span className="statsbar__dot" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
