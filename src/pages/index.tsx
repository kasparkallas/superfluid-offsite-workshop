import * as React from 'react'
import type { NextPage } from 'next'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'

const Home: NextPage = () => {
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
        <h1>Workshop</h1>
        <a href="https://sdk-redux-refs.netlify.app/" target="_blank">
          sdk-redux reference docs
        </a>
        <a
          href="https://refs.superfluid.finance/sdk-core@0.3.2/"
          target="_blank"
        >
          sdk-core reference docs
        </a>
        <a
          href="https://redux-toolkit.js.org/rtk-query/overview"
          target="_blank"
        >
          rtk-query docs
        </a>
      </Box>
    </Container>
  )
}

export default Home
