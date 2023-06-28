import { useEffect, useState } from 'react';
import {Button, Box, TextHeading, Input} from '@pexip/components';
import './Preflight.css';

const nodeDomainKey = 'pexip-node-domain';
const vmrKey = 'pexip-vmr';
const displayNameKey = 'pexip-display-name';

interface PreflightProps {
  onSubmit: (nodeDomain: string, vmr: string, displayName: string) => void;
}

function Preflight({onSubmit}: PreflightProps) {

  const [nodeDomain, setNodeDomain] = useState('');
  const [vmr, setVmr] = useState('');
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    const nodeDomain = localStorage.getItem(nodeDomainKey) as string;
    const vmr = localStorage.getItem(vmrKey) as string;
    const displayName = localStorage.getItem(displayNameKey) as string;
    setNodeDomain(nodeDomain);
    setVmr(vmr);
    setDisplayName(displayName);
  }, []);

  return (
    <div className='preflight'>
      <Box padding='small'>
        <TextHeading htmlTag='h3' className="mb-4 text-center">Join a conference</TextHeading>
        <form onSubmit={(event) => {
          event.preventDefault();
          localStorage.setItem(nodeDomainKey, nodeDomain);
          localStorage.setItem(vmrKey, vmr);
          localStorage.setItem(displayNameKey, displayName);
          onSubmit(nodeDomain, vmr, displayName);
        }}>
          <Input
            name='nodeDomain'
            value={nodeDomain}
            onValueChange={setNodeDomain}
            required
            label='Conference Node Domain'
            placeholder='192.168.1.100 or pexipdemo.com'
          />
          <Input
            className='mt-4'
            name='vmr'
            value={vmr}
            onValueChange={setVmr}
            required
            label='Conference (VMR)'
            placeholder='conference'
          />
          <Input
            className='mt-4'
            name='displayName'
            value={displayName}
            onValueChange={setDisplayName}
            required
            label='Display Name'
            placeholder='John Smith'
          />
          <Button className='mt-5' modifier='fullWidth' type='submit'>Join</Button>
        </form>
      </Box>
    </div>
  );
}

export default Preflight;
