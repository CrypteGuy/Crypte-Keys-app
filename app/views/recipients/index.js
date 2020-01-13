// @flow
import React, {Component} from 'react'

import {Box, Button, Divider, MenuItem, Paper, Typography} from '@material-ui/core'

import ChipInput from './chip-input'
// import ChipInput from 'material-ui-chip-input'

import Autosuggest from 'react-autosuggest'

import {connect} from 'react-redux'
import {goBack, push} from 'connected-react-router'

import {styles} from '../components'

import {search} from '../../rpc/rpc'

import type {Key, SearchResult, SearchRequest, SearchResponse} from '../../rpc/types'
import type {RPCState, RPCError} from '../../rpc/rpc'

export type Props = {
  dispatch: (action: any) => any,
}

type State = {
  results: Array<SearchResult>,
  selected: Array<SearchResult>,
  input: string,
  error: string,
}

class RecipientsView extends Component<Props, State> {
  state = {
    results: [],
    selected: [],
    input: '',
    error: '',
  }

  search = (q: string) => {
    const req: SearchRequest = {query: q, index: 0, limit: 100}
    this.props.dispatch(
      search(
        req,
        (resp: SearchResponse) => {
          this.setState({results: resp.results || []})
        },
        (err: RPCError) => {}
      )
    )
  }

  requestSuggestions = (req: {value: string}) => {
    this.search(req.value)
  }

  clearSuggestions = () => {
    this.setState({
      results: [],
    })
  }

  onInputChange = (e: SyntheticInputEvent<EventTarget>) => {
    this.setState({
      input: e.target.value,
    })
  }

  add = (result: SearchResult) => {
    const selected = [...this.state.selected, result]
    this.setState({
      selected,
      input: '',
    })
  }

  delete = (result: SearchResult, index: number) => {
    let temp = this.state.selected
    temp.splice(index, 1)
    this.setState({selected: temp})
  }

  render() {
    return (
      <Autosuggest
        renderInputComponent={renderInput}
        suggestions={this.state.results}
        onSuggestionsFetchRequested={this.requestSuggestions}
        onSuggestionsClearRequested={this.clearSuggestions}
        renderSuggestionsContainer={renderSuggestionsContainer}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        onSuggestionSelected={(e, value: {suggestion: SearchResult}) => {
          this.add(value.suggestion)
          // e.preventDefault()
        }}
        theme={autosuggest}
        focusInputOnSuggestionClick
        inputProps={{
          selected: this.state.selected,
          onChange: this.onInputChange,
          value: this.state.input,
          onAdd: this.add,
          onDelete: this.delete,
        }}
      />
    )
  }
}

const autosuggest = {
  root: {
    height: 250,
    flexGrow: 1,
  },
  container: {
    position: 'relative',
    marginTop: 4,
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    zIndex: 1,
    left: 0,
    right: 0,
  },
  suggestion: {
    display: 'block',
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
}

const renderInput = inputProps => {
  const {autoFocus, value, onChange, onAdd, onDelete, selected, ref, ...other} = inputProps

  const names = selected.map((result: SearchResult) => {
    if (result.users && result.users.length > 0) {
      const user = result.users[0]
      return user.name + '@' + user.service
    } else {
      return result.kid
    }
  })

  return (
    <ChipInput
      placeholder="Recipients"
      clearInputValueOnChange
      onUpdateInput={onChange}
      onAdd={onAdd}
      onDelete={onDelete}
      value={names}
      inputRef={ref}
      fullWidth
      {...other}
    />
  )
}

const renderSuggestion = (result: SearchResult, opts: {query: string, isHighlighted: boolean}) => {
  return <Typography>{result.kid}</Typography>
}

const renderSuggestionsContainer = options => {
  const {containerProps, children} = options

  return (
    <Paper {...containerProps} square>
      {children}
    </Paper>
  )
}

const getSuggestionValue = (result: Key) => {
  return result.id || ''
}

const mapStateToProps = (state: {rpc: RPCState}, ownProps: any) => {
  return {}
}

export default connect<Props, {}, _, _, _, _>(mapStateToProps)(RecipientsView)
