import { Button, Icon, IconTypes, Tooltip } from '@pexip/components'

import './Toolbar.css'

interface ToolbarProps {
  className: string
  onDisconnect: () => Promise<void>
}

export const Toolbar = (props: ToolbarProps): JSX.Element => {
  const className = [props.className, 'Toolbar'].join(' ')

  const handleHangUp = async (): Promise<void> => {
    await props.onDisconnect()
  }

  return (
    <div className={className}>
      <Tooltip text="Disconnect">
        <Button
          onClick={() => {
            handleHangUp().catch(console.error)
          }}
          variant="danger"
          modifier="square"
          colorScheme="light"
        >
          <Icon source={IconTypes.IconPhoneHorisontal} />
        </Button>
      </Tooltip>
    </div>
  )
}
