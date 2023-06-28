import React from 'react';
import { Box, Button, TextHeading, Text } from '@pexip/components';
import './Error.css';

interface ErrorProps {
  message: string;
  onClose: () => void;
}

function Error ({onClose, message}: ErrorProps) {
  return (
    <div className='error'>
      <Box padding='small'>
        <TextHeading className='mb-4 text-center' htmlTag='h3'>Error</TextHeading>
        <Text htmlTag='p' className='text-center'>{message}</Text>
        <Button className='mt-2' modifier='fullWidth' onClick={onClose}>Close</Button>
      </Box>
    </div>
  );
}

export default Error;
