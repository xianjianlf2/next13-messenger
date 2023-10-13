import clsx from 'clsx'

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset' | undefined
  fullWidth?: boolean
  children?: React.ReactNode
  onClick?: () => void
  secondary?: boolean
  danger?: boolean
  disabled?: boolean
}

const Button: React.FC<ButtonProps> = ({
  type,
  fullWidth,
  children,
  onClick,
  secondary,
  danger,
  disabled
}) => {
  return (
    <div>
      Hello <Button></Button>
    </div>
  )
}

export default Button
