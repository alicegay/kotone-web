import { MouseEventHandler } from 'react'
import { cn } from '../lib/cn'

interface Props {
  icon: string
  filled?: boolean
  size?: number
  weight?: number
  onClick?: MouseEventHandler<HTMLDivElement>
  className?: string
}

const Icon = ({
  icon,
  filled = false,
  size,
  weight,
  onClick,
  className,
}: Props) => {
  return (
    <span
      className={cn(
        'material-symbols-rounded desktop-no-drag select-none',
        filled && 'material-symbols-filled',
        className,
      )}
      style={{
        fontSize: size ?? 24,
        fontWeight: weight ?? 400,
      }}
      onClick={onClick}
    >
      {icon}
    </span>
  )
}

export default Icon
