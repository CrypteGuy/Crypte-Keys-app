import emoji from 'node-emoji'

import {Key, KeyType, User} from '../rpc/types'

export const serviceName = (service: string): string => {
  let serviceName = '?'
  switch (service) {
    case 'github':
      serviceName = 'Github'
      break
    case 'twitter':
      serviceName = 'Twitter'
      break
  }
  return serviceName
}

export const keyUsers = (key: Key): string => {
  const users = (key.users || []).map((user: User) => user.label)
  return users.join(',')
}

export const keyDescription = (key: Key): string => {
  switch (key.type) {
    case KeyType.CURVE25519:
      return 'Curve25519 Private Key'
    case KeyType.CURVE25519_PUBLIC:
      return 'Curve25519 Public Key'
    case KeyType.ED25519:
      return 'Ed25519 Private Key'
    case KeyType.ED25519_PUBLIC:
      return 'Ed25519 Public Key'
    default:
      return ''
  }
}

export const keySymbol = (key: Key): string => {
  switch (key.type) {
    case KeyType.CURVE25519:
      return emoji.get('key')
    case KeyType.ED25519:
      return emoji.get('lower_left_fountain_pen')
  }
  return emoji.get('question')
}

var dateOptions = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
}

export const dateString = (ms: string): string => {
  const n = parseInt(ms)
  if (n === 0) {
    return ''
  }
  const d = new Date(n)
  //return d.toJSON()

  return d.toLocaleDateString('en-US', dateOptions)
}
