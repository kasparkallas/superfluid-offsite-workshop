import type { NextPage } from 'next'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import { subgraphApi } from '../redux/store'
import { List, ListItem, ListItemText, Typography } from '@mui/material'
import { useNetworkContext } from '../contexts/NetworkContext'
import { useWalletContext } from '../contexts/WalletContext'
import FlowingBalance from '../components/FlowingBalance'
import { skipToken } from '@reduxjs/toolkit/dist/query'

const Subgraph: NextPage = () => {
  const { network } = useNetworkContext()
  const { walletAddress } = useWalletContext()

  const accountTokenSnapshotsQuery = subgraphApi.useAccountTokenSnapshotsQuery(
    walletAddress
      ? {
          chainId: network.chainId,
          filter: {
            account: walletAddress,
          },
          pagination: {
            take: Infinity,
          },
        }
      : skipToken
  )

  console.log({
    chainId: network.chainId,
    walletAddress,
    isFetching: accountTokenSnapshotsQuery.isFetching,
    isLoading: accountTokenSnapshotsQuery.isLoading,
    data: accountTokenSnapshotsQuery.data,
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
        <Typography variant="h1">Subgraph</Typography>
        <Typography variant="subtitle1" sx={{ mb: 3 }}>
          Account Token Balances
        </Typography>
        {!walletAddress
          ? 'Connect wallet, plz'
          : accountTokenSnapshotsQuery.isUninitialized ||
            accountTokenSnapshotsQuery.isLoading
          ? 'Loading...'
          : ''}
        {accountTokenSnapshotsQuery.data && (
          <List>
            {accountTokenSnapshotsQuery.data.items.map((x) => (
              <ListItem key={x.id}>
                <ListItemText
                  primary={x.tokenSymbol}
                  secondary={
                    <FlowingBalance
                      balance={x.balanceUntilUpdatedAt}
                      flowRate={x.totalNetFlowRate}
                      balanceTimestamp={x.updatedAtTimestamp}
                    />
                  }
                ></ListItemText>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Container>
  )
}

export default Subgraph
