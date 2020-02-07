import * as React from 'react'

import {store} from '../../store'

import AuthSetupView from './setup'
import AuthUnlockView from './unlock'
import {Splash} from '../../components'
import ErrorsView from '../../errors'

import {runtimeStatus} from '../../rpc/rpc'

import {RuntimeStatusRequest, RuntimeStatusResponse} from '../../rpc/types'

type Props = {}

type State = {
  authSetupNeeded: boolean
  error: Error | void
  loading: boolean
  waiting: boolean
}

const sleep = milliseconds => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

export default class AuthView extends React.Component<Props, State> {
  state = {
    authSetupNeeded: false,
    error: null,
    loading: true,
    waiting: false,
  }

  componentDidMount() {
    this.refresh()
    this.checkWaiting()
    this.checkTimeout()
  }

  checkWaiting = async () => {
    await sleep(2000)
    if (this.state.loading) {
      this.setState({waiting: true})
    }
  }

  checkTimeout = async () => {
    await sleep(15000)
    if (this.state.loading) {
      this.setState({error: new Error('Unable to connect to local service')})
    }
  }

  refresh = () => {
    const req: RuntimeStatusRequest = {}
    store.dispatch(
      runtimeStatus(req, (resp: RuntimeStatusResponse) => {
        this.setState({loading: false, authSetupNeeded: resp.authSetupNeeded})
      })
    )
  }

  render() {
    if (this.state.error) {
      return <ErrorsView error={this.state.error} />
    }
    if (this.state.loading && !this.state.waiting) return null
    if (this.state.loading) {
      return <Splash />
    }

    if (this.state.authSetupNeeded) {
      return <AuthSetupView />
    } else {
      return <AuthUnlockView />
    }
  }
}
