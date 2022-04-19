import type { NextPage } from 'next'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import { rpcApi } from '../redux/store'
import { Button, FormGroup, TextField, Typography } from '@mui/material'
import { SyntheticEvent, useState } from 'react'
import { useNetworkContext } from '../contexts/NetworkContext'
import { useWalletContext } from '../contexts/WalletContext'

const Rpc: NextPage = () => {
  const { network } = useNetworkContext()
  const { walletAddress } = useWalletContext()

  const [downgradeFromSuperToken, { isLoading, error }] =
    rpcApi.useSuperTokenDowngradeMutation()

  const [amount, setAmount] = useState<string>('')
  const [superToken, setSuperToken] = useState<string>('')

  const handleDowngradeFromSuperToken = (e: SyntheticEvent) => {
    downgradeFromSuperToken({
      chainId: network.chainId,
      superTokenAddress: superToken,
      amountWei: amount,
      waitForConfirmation: true,
    })
  }

  console.log({
    chainId: network.chainId,
    isLoading,
    error,
    walletAddress,
  })

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          my: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant="h1">RPC</Typography>
        <Typography variant="subtitle1" sx={{ mb: 3 }}>
          Downgrade from SuperToken
        </Typography>

        {walletAddress && isLoading ? (
          'Loading...'
        ) : (
          <>
            {error && error.toString()}
            <form onSubmit={(e: SyntheticEvent) => e.preventDefault()}>
              <FormGroup>
                <TextField
                  sx={{ m: 1 }}
                  label="SuperToken"
                  onChange={(e) => setSuperToken(e.currentTarget.value)}
                />
                <TextField
                  sx={{ m: 1 }}
                  label="Amount"
                  onChange={(e) => setAmount(e.currentTarget.value)}
                />
                <Button
                  sx={{ m: 1 }}
                  type="submit"
                  variant="contained"
                  onClick={handleDowngradeFromSuperToken}
                >
                  Downgrade
                </Button>
              </FormGroup>
            </form>
          </>
        )}
      </Box>
    </Container>
  )
}

export default Rpc
