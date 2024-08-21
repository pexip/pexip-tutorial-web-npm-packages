import { Box, Button, TextHeading, Text } from '@pexip/components'

import './Error.css'

interface ErrorProps {
  message: string
  onClose: () => void
}

export const Error = ({ onClose, message }: ErrorProps): JSX.Element => {
  return (
    <div className="error">
      <Box padding="small">
        <TextHeading className="mb-4 text-center" htmlTag="h3">
          Error
        </TextHeading>
        <Text htmlTag="p" className="text-center">
          {message}
        </Text>
        <Button className="mt-2" modifier="fullWidth" onClick={onClose}>
          Close
        </Button>
      </Box>
    </div>
  )
}
