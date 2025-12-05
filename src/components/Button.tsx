import { MouseEventHandler, ReactNode, useState } from 'react'
import Icon from './Icon'
import { cn } from '../lib/cn'
import tinycolor from 'tinycolor2'

interface Props {
  icon?: string
  filled?: boolean
  size?: number
  onClick?: MouseEventHandler<HTMLDivElement>
  children: ReactNode
  color?: string
}

const Button = ({ icon, filled, size, onClick, children, color }: Props) => {
  const [hover, setHover] = useState(false)
  const colorMain = color
    ? tinycolor(color).toString('hex6') + '40'
    : '#fb64b640'
  const colorHover = color ? tinycolor(color).toString('hex6') : '#fda5d5'

  return (
    <div
      className={cn(
        'round flex items-center gap-2 py-1 font-medium transition hover:cursor-pointer',
        icon ? 'pr-4 pl-2' : 'px-4',
      )}
      onClick={onClick}
      style={{
        backgroundColor: hover ? colorHover : colorMain,
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {icon && <Icon icon={icon} filled={filled} size={size} />}
      {children}
    </div>
  )
}

export default Button
