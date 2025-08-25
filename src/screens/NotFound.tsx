import { useLocation } from 'react-router'

const NotFound = () => {
  const location = useLocation()

  return (
    <div className="p-4">
      Not found: <span className="font-mono">{location.pathname}</span>
    </div>
  )
}

export default NotFound
