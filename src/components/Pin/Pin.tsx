import React, { useState } from 'react';
import { Box, Button, Input, TextHeading } from '@pexip/components';
import './Pin.css';

interface PinProps {
  onSubmit: Function;
  required: boolean;
}

function Pin({onSubmit, required}: PinProps) {

  const [pin, setPin] = useState('');

  return (
    <div className='pin'>
      <Box padding='small'>
        <TextHeading className='mb-4 text-center' htmlTag='h3'>Enter PIN</TextHeading>
        <form onSubmit={(event) => {
          event.preventDefault();
          onSubmit(pin);
        }}>
          <Input
            className='mt-4'
            type='password'
            name='password'
            value={pin}
            onValueChange={setPin}
            required={required}
            label=''
            placeholder='Enter the PIN'
          />
          <Button className='mt-5' modifier='fullWidth' type='submit'>Join</Button>
        </form>
      </Box>
    </div>
  );
}

export default Pin;
