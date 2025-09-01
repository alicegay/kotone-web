import { MouseEventHandler } from 'react'
import Icon from '../Icon'
import { cn } from '../../lib/cn'

interface Props {
  icon: string
  filled?: boolean
  size?: number
  className?: string
  off?: boolean
  onClick?: MouseEventHandler<HTMLDivElement>
}

const Button = ({
  icon,
  filled,
  size,
  className,
  off = false,
  onClick,
}: Props) => {
  return (
    <Icon
      icon={icon}
      filled={filled}
      size={size}
      className={cn(
        'rounded-full p-4 transition hover:cursor-pointer hover:bg-zinc-100/20',
        off && 'text-zinc-100/40',
        className,
      )}
      onClick={onClick}
    />
  )
}

export default Button
