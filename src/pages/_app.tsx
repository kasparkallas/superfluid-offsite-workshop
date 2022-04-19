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
  ListItemText,
  Stack,
  Toolbar,
} from '@mui/material'
import Link from '../Link'
import { useEffect } from 'react'
import readOnlyFrameworks from '../readOnlyFrameworks'
import { setFrameworkForSdkRedux } from '@superfluid-finance/sdk-redux'
import { NetworkContextProvider } from '../contexts/NetworkContext'
import { WalletContextProvider } from '../contexts/WalletContext'
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

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Provider store={reduxStore}>
          <NetworkContextProvider>
            {(network) => (
              <WalletContextProvider>
                <Drawer variant="permanent">
                  <Toolbar sx={{ height: '100px' }}>
                    <Image
                      unoptimized
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
                  <Component key={network.chainId} {...pageProps} />
                </main>
              </WalletContextProvider>
            )}
          </NetworkContextProvider>
        </Provider>
      </ThemeProvider>
    </CacheProvider>
  )
}
