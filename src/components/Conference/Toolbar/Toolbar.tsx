import './Toolbar.css'

interface ToolbarProps {
  className: string
}

export const Toolbar = (props: ToolbarProps): JSX.Element => {
  const className = [props.className, 'Toolbar'].join(' ')

  return <div className={className}></div>
}
