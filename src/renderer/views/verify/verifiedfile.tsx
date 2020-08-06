import * as React from 'react'
import {CSSProperties} from 'react'

import {Button, Divider, Input, Box, Typography} from '@material-ui/core'

import {styles, Link} from '../../components'

import {store} from '../../store'
import SignerView from '../verify/signer'

import {shell} from 'electron'
import {Key} from '../../rpc/keys.d'

export type Props = {
  fileOut: string
  signer: Key
  error: string
  reloadKey: () => void
}

export default class VerifiedFileView extends React.Component<Props, {}> {
  openFolder = () => {
    shell.showItemInFolder(this.props.fileOut)
  }

  render() {
    const unsigned = this.props.fileOut && !this.props.signer

    return (
      <Box display="flex" flexDirection="column" flex={1} style={{height: '100%'}}>
        {this.props.error && (
          <Box style={{paddingLeft: 10, paddingTop: 10}}>
            <Typography style={{...styles.mono, color: 'red', display: 'inline'}}>
              {this.props.error}&nbsp;
            </Typography>
          </Box>
        )}
        {!this.props.error && (
          <Box>
            <SignerView signer={this.props.signer} unsigned={unsigned} reload={this.props.reloadKey} />
            <Divider />

            <Box style={{paddingLeft: 10, paddingTop: 10}}>
              <Typography style={{...styles.mono, display: 'inline'}}>{this.props.fileOut}&nbsp;</Typography>
              <Link inline onClick={this.openFolder}>
                Open Folder
              </Link>
            </Box>
          </Box>
        )}
      </Box>
    )
  }
}
