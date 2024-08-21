// TODO (20) Import components from @pexip/components
import './Toolbar.css'

interface ToolbarProps {
  className: string
  // TODO (21) Define onDisconnect property
}

export const Toolbar = (props: ToolbarProps): JSX.Element => {
  const className = [props.className, 'Toolbar'].join(' ')

  // TODO (22) Define the handleHangUp function

  return (
    <div className={className}>
      {/* TODO (23) Add a new button to disconnect from the call */}
    </div>
  )
}
