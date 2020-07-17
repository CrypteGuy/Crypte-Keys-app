import * as React from 'react'

import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
  Snackbar,
  SnackbarContent,
  TextField,
  Typography,
} from '@material-ui/core'

import Logo from '../../logo'
import {styles} from '../../../components'

import {push} from 'connected-react-router'
import {store} from '../../../store'

import {authVault} from '../../../rpc/keys'
import {RPCError, AuthVaultRequest, AuthVaultResponse} from '../../../rpc/keys.d'

type Props = {
  back: () => void
  setup: () => void
}
type State = {
  loading: boolean
  phrase: string
  error: string
}

export default class AuthVaultView extends React.Component<Props, State> {
  state = {
    loading: false,
    phrase: '',
    error: '',
  }

  onInputChangePhrase = (e: React.SyntheticEvent<EventTarget>) => {
    let target = e.target as HTMLInputElement
    this.setState({phrase: target ? target.value : '', error: ''})
  }

  renderServerSelect() {
    return (
      <Select variant="outlined" value={'keys.pub'} style={{width: 250, height: 40}}>
        <MenuItem value={'keys.pub'}>keys.pub</MenuItem>
      </Select>
    )
  }

  render() {
    return (
      <Box display="flex" flexGrow={1} flexDirection="column" alignItems="center">
        <Logo loading={this.state.loading} top={60} />
        <Typography style={{paddingTop: 0, width: 550, textAlign: 'center'}} paragraph>
          Enter in a vault auth phrase to connect to your vault.
          <br />
          You can generate an auth phrase from any of your devices (in Vault settings).
        </Typography>
        <Box marginBottom={1}>{this.renderServerSelect()}</Box>
        <FormControl error={this.state.error !== ''}>
          <TextField
            autoFocus
            label="Vault Phrase"
            variant="outlined"
            multiline
            rows={4}
            onChange={this.onInputChangePhrase}
            inputProps={{
              onKeyDown: this.onKeyDownPhrase,
            }}
            value={this.state.phrase}
            disabled={this.state.loading}
            InputProps={{
              style: {...styles.mono, fontSize: 12, width: 450},
            }}
          />
          <FormHelperText id="component-error-text">{this.state.error || ' '}</FormHelperText>
        </FormControl>
        <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center">
          <Box display="flex" flexDirection="row" style={{width: 450, paddingTop: 6}}>
            <Button
              color="secondary"
              variant="outlined"
              onClick={this.props.back}
              disabled={this.state.loading}
            >
              Back
            </Button>
            <Box flex={1} flexGrow={1} />
            <Button color="primary" variant="outlined" onClick={this.authVault} disabled={this.state.loading}>
              Connect
            </Button>
          </Box>
        </Box>
      </Box>
    )
  }

  onKeyDownPhrase = (event: React.KeyboardEvent<any>) => {
    if (event.key === 'Enter') {
      this.authVault()
    }
  }

  authVault = async () => {
    const req: AuthVaultRequest = {
      phrase: this.state.phrase,
    }
    this.setState({loading: true, error: ''})
    authVault(req, (err: RPCError, resp: AuthVaultResponse) => {
      if (err) {
        this.setState({loading: false, error: err.details})
        return
      }
      this.props.setup()
    })
  }
}
