import { OrbitProgress } from 'react-loading-indicators'

const LoadingIndicator = () => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <OrbitProgress color="#fff" />
    </div>
  )
}

export default LoadingIndicator
