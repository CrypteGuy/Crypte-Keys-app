import * as React from 'react'

import {Avatar, Box, Button, Dialog, DialogActions, DialogContent, Typography} from '@material-ui/core'

import {breakWords} from '../theme'

import {DialogTitle} from '../components'
import KeyView from './view'

import {key, pull} from '../rpc/keys'
import {Key, KeyRequest, KeyResponse, PullRequest, PullResponse} from '../rpc/keys.d'

type Props = {
  open: boolean
  close: (snack: string) => void
  kid: string
  search?: boolean
  update?: boolean
  import?: boolean
  reload?: () => void
}

type State = {
  error?: Error
  loading: boolean
  key?: Key
  openExport: boolean
  openRemove: boolean
}

// const transition = React.forwardRef<unknown, TransitionProps>(function Transition(props, ref) {
//   return <Slide direction="up" ref={ref} {...props} />
// })

export default class KeyDialog extends React.Component<Props, State> {
  state: State = {
    loading: false,
    openExport: false,
    openRemove: false,
  }

  close = (snack: string) => {
    this.props.close(snack)
  }

  componentDidMount() {
    this.loadKey(!!this.props.update, false)
  }

  componentDidUpdate(prevProps: Props, prevState: any, snapshot: any) {
    if (this.props.kid !== prevProps.kid) {
      this.loadKey(!!this.props.update, false)
    }
  }

  loadKey = (update: boolean, reload: boolean) => {
    if (!this.props.kid) {
      this.setState({key: undefined})
      return
    }

    this.setState({loading: true, error: undefined})
    const req: KeyRequest = {
      key: this.props.kid,
      search: !!this.props.search,
      update: update,
    }
    key(req)
      .then((resp: KeyResponse) => {
        this.setState({loading: false})
        if (resp.key) {
          this.setState({key: resp.key, loading: false})
        } else {
          this.setState({error: new Error('Key not found'), loading: false})
        }
        if (reload && this.props.reload) {
          this.props.reload()
        }
      })
      .catch((err: Error) => {
        this.setState({error: err, loading: false})
      })
  }

  refresh = (update: boolean) => {
    this.loadKey(update, true)
  }

  import = async () => {
    if (!this.props.kid) {
      return
    }
    this.setState({loading: true, error: undefined})
    const req: PullRequest = {
      key: this.props.kid,
    }
    try {
      const resp = await pull(req)
      this.setState({loading: false})
      this.close('Imported key')
      if (this.props.reload) {
        this.props.reload()
      }
    } catch (err) {
      this.setState({error: err, loading: false})
    }
  }

  render() {
    return (
      <Dialog
        onClose={this.close}
        open={this.props.open}
        disableBackdropClick
        fullWidth={true}
        PaperProps={{
          style: {minWidth: 620},
        }}
      >
        <DialogTitle loading={this.state.loading} onClose={() => this.close('')}>
          Key
        </DialogTitle>
        <DialogContent dividers style={{minHeight: 161, overflowX: 'hidden'}}>
          {/*TODO: Better error display*/}
          {this.state.error && (
            <Typography variant="body2" style={{...breakWords, color: 'red', paddingBottom: 20}}>
              {this.state.error?.message}
            </Typography>
          )}
          {this.state.key && <KeyView k={this.state.key} refresh={this.refresh} />}
        </DialogContent>
        <DialogActions>
          {this.props.import && (
            <Box display="flex" flexDirection="row">
              <Button onClick={() => this.close('')}>Close</Button>
              <Button color="primary" onClick={this.import} disabled={this.state.loading}>
                Import
              </Button>
            </Box>
          )}
          {!this.props.import && <Button onClick={() => this.close('')}>Close</Button>}
        </DialogActions>
      </Dialog>
    )
  }
}
