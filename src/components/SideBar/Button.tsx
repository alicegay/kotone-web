import { MouseEventHandler, ReactNode } from 'react'
import Icon from '../Icon'
import { cn } from '../../lib/cn'

interface Props {
  icon?: string
  filled?: boolean
  onClick?: MouseEventHandler<HTMLDivElement>
  onContextMenu?: MouseEventHandler<HTMLDivElement>
  children: ReactNode
  selected?: boolean
}

function Button({
  icon,
  filled,
  onClick,
  onContextMenu,
  children,
  selected,
}: Props) {
  return (
    <div
      className={cn(
        'round flex items-center gap-2 px-4 py-1 transition-all hover:cursor-pointer hover:bg-zinc-100/20',
        selected && 'bg-zinc-100/10',
      )}
      onClick={onClick}
      onContextMenu={onContextMenu}
    >
      {icon && <Icon icon={icon} filled={filled} />}
      {children}
    </div>
  )
}

export default Button
