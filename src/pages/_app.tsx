import * as React from 'react'
import Head from 'next/head'
import { AppProps } from 'next/app'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { CacheProvider, EmotionCache } from '@emotion/react'
import theme from '../theme'
import createEmotionCache from '../createEmotionCache'
import { Provider } from 'react-redux'
import { reduxStore } from '../redux/store'
import Image from 'next/image'
import {
  AppBar,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
} from '@mui/material'
import Link from '../Link'
import { useEffect, useState } from 'react'
import readOnlyFrameworks from '../readOnlyFrameworks'
import {
  setFrameworkForSdkRedux,
  setSignerForSdkRedux,
} from '@superfluid-finance/sdk-redux'
import NetworkContext from '../contexts/NetworkContext'
import { Network, networksByChainId } from '../networks'
import { ethers } from 'ethers'
import WalletContext from '../contexts/WalletContext'
import SelectNetwork from '../components/SelectNetwork'
import ConnectWallet from '../components/ConnectWallet'

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props

  useEffect(() => {
    readOnlyFrameworks.map((x) =>
      setFrameworkForSdkRedux(x.chainId, x.frameworkGetter)
    )
  })

  const [network, setNetwork] = useState<Network>(networksByChainId.get(137)!)
  const [walletProvider, setWalletProvider] = useState<
    ethers.providers.Web3Provider | undefined
  >()
  const [walletAddress, setWalletAddress] = useState<string | undefined>()
  const [walletChainId, setWalletChainId] = useState<number | undefined>()

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Provider store={reduxStore}>
          <NetworkContext.Provider
            value={{
              network: network,
              setNetwork: (network) => setNetwork(network),
            }}
          >
            <WalletContext.Provider
              value={{
                walletChainId: walletChainId,
                walletAddress: walletAddress,
                walletProvider: walletProvider,
                setProvider: async (web3Provider) => {
                  const ethersProvider = new ethers.providers.Web3Provider(
                    web3Provider
                  )

                  const chainId = (await ethersProvider.getNetwork()).chainId
                  const address = await ethersProvider.getSigner().getAddress()
                  setWalletChainId(chainId)
                  setWalletAddress(address)
                  setWalletProvider(ethersProvider)
                  setSignerForSdkRedux(Number(chainId), () =>
                    Promise.resolve(ethersProvider.getSigner())
                  )

                  web3Provider.on('accountsChanged', (accounts: string[]) => {
                    setWalletAddress(accounts[0])

                    setSignerForSdkRedux(chainId, () =>
                      Promise.resolve(ethersProvider.getSigner())
                    )
                  })

                  web3Provider.on('chainChanged', (chainId: number) => {
                    setWalletChainId(Number(chainId)) // Chain ID might be coming in hex.
                    setSignerForSdkRedux(Number(chainId), () =>
                      Promise.resolve(ethersProvider.getSigner())
                    )
                  })
                },
              }}
            >
              <Drawer variant="permanent">
                <Toolbar sx={{ height: '100px' }}>
                  <Image
                    src="/superfluid-logo-dark.svg"
                    width={167}
                    height={40}
                    layout="fixed"
                    alt="Superfluid logo"
                  />
                </Toolbar>
                <List component="nav">
                  <Link href="/" passHref>
                    <ListItemButton>
                      <ListItemText primary="Index" />
                    </ListItemButton>
                  </Link>
                  <Link href="/subgraph" passHref>
                    <ListItemButton>
                      <ListItemText primary="Subgraph" />
                    </ListItemButton>
                  </Link>
                  <Link href="/rpc" passHref>
                    <ListItemButton>
                      <ListItemText primary="Rpc" />
                    </ListItemButton>
                  </Link>
                </List>
              </Drawer>
              <AppBar sx={{ bgcolor: 'transparent', boxShadow: 'none' }}>
                <Stack
                  component={Toolbar}
                  direction="row"
                  justifyContent="flex-end"
                  alignItems="center"
                  spacing={2}
                >
                  <SelectNetwork></SelectNetwork>
                  <ConnectWallet></ConnectWallet>
                </Stack>
              </AppBar>
              <main>
                <Toolbar></Toolbar>
                <Component {...pageProps} />
              </main>
            </WalletContext.Provider>
          </NetworkContext.Provider>
        </Provider>
      </ThemeProvider>
    </CacheProvider>
  )
}
