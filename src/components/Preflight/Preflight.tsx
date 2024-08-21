import { useEffect, useState } from 'react'
import { Button, Box, TextHeading, Input } from '@pexip/components'

import './Preflight.css'

const nodeDomainKey = 'pexip-node-domain'
const vmrKey = 'pexip-vmr'
const displayNameKey = 'pexip-display-name'

interface PreflightProps {
  onSubmit: (
    nodeDomain: string,
    vmr: string,
    displayName: string
  ) => Promise<void>
}

export const Preflight = ({ onSubmit }: PreflightProps): JSX.Element => {
  const [nodeDomain, setNodeDomain] = useState('')
  const [vmr, setVmr] = useState('')
  const [displayName, setDisplayName] = useState('')

  const handleSubmit = async (): Promise<void> => {
    localStorage.setItem(nodeDomainKey, nodeDomain)
    localStorage.setItem(vmrKey, vmr)
    localStorage.setItem(displayNameKey, displayName)
    await onSubmit(nodeDomain, vmr, displayName)
  }

  useEffect(() => {
    const nodeDomain: string = localStorage.getItem(nodeDomainKey) ?? ''
    const vmr: string = localStorage.getItem(vmrKey) ?? ''
    const displayName: string = localStorage.getItem(displayNameKey) ?? ''
    setNodeDomain(nodeDomain)
    setVmr(vmr)
    setDisplayName(displayName)
  }, [])

  return (
    <div className="preflight">
      <Box padding="small">
        <TextHeading htmlTag="h3" className="mb-4 text-center">
          Join a conference
        </TextHeading>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            handleSubmit().catch(console.error)
          }}
        >
          <Input
            name="nodeDomain"
            value={nodeDomain}
            onValueChange={setNodeDomain}
            required
            label="Conference Node Domain"
            placeholder="192.168.1.100 or pexipdemo.com"
          />
          <Input
            className="mt-4"
            name="vmr"
            value={vmr}
            onValueChange={setVmr}
            required
            label="Conference (VMR)"
            placeholder="conference"
          />
          <Input
            className="mt-4"
            name="displayName"
            value={displayName}
            onValueChange={setDisplayName}
            required
            label="Display Name"
            placeholder="John Smith"
          />
          <Button className="mt-5" modifier="fullWidth" type="submit">
            Join
          </Button>
        </form>
      </Box>
    </div>
  )
}
