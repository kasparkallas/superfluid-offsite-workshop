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
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from '@mui/material'
import Link from '../Link'

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Provider store={reduxStore}>
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
          <Component {...pageProps} />
        </Provider>
      </ThemeProvider>
    </CacheProvider>
  )
}
