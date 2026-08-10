import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export default class LanyardErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error) {
    console.warn('[Lanyard] 3D scene error:', error.message)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'rgba(242,183,40,0.6)',
          fontFamily: 'monospace',
          fontSize: '12px',
          gap: '8px',
          letterSpacing: '0.08em',
        }}>
          <span style={{ fontSize: '28px' }}>🎪</span>
          <span>3D VIEW UNAVAILABLE</span>
          <span style={{ opacity: 0.5, fontSize: '11px' }}>WebGL not supported</span>
        </div>
      )
    }
    return this.props.children
  }
}
