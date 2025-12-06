import isDesktop from './isDesktop'

const isGlass = () => {
  if (isDesktop()) {
    return window.api.glass
  } else {
    return false
  }
}

export default isGlass
