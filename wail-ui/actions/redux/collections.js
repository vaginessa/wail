import {Schema, arrayOf, normalize} from 'normalizr'
import {ipcRenderer as ipc, remote} from 'electron'
import ColCrawlInfo from '../../../wail-core/util/colCrawlInfo'
import * as notify from './notifications'

const settings = remote.getGlobal('settings')
let defForCol = 'default'
if (process.env.NODE_ENV === 'development') {
  defForCol = 'Wail'
}
export const GOT_ALL_COLLECTIONS = Symbol('Call API')

// ipc.on('got-all-collections', (event, ac) => {
//   console.log('got all collections', ac)
//   let {
//     cols,
//     wasError
//   } = ac
//
//   if (wasError) {
//     console.error(wasError)
//     window.logger.error({ err: ac.err, msg: 'got all collections error' })
//     // notify.notifyError('Error loading all collections this is fatal')
//     dispatch(notify.notifyError('Error loading all collections this is fatal'))
//   } else {
//     window.logger.debug('collection store got all collections')
//     dispatch({
//       type: 'got-all-collections',
//       cols
//     })
//   }
// })

export function gotAllCollections (event, ac) {
  console.log('got all collections', ac)
  let {
    cols,
    wasError
  } = ac

  if (wasError) {
    console.error(wasError)
    window.logger.error({ err: ac.err, msg: 'got all collections error' })
    // notify.notifyError('Error loading all collections this is fatal')
    return notify.notifyError('Error loading all collections this is fatal')
  } else {
    window.logger.debug('collection store got all collections')
    return {
      type: 'got-all-collections',
      cols
    }
  }
}

export function addedWarcs (event, update) {
  if (update.wasError) {
    window.logger.error({ err: update.error, msg: `Error updating warc count for collection ${update.forCol}` })
    return {
      action: 'notifyError',
      message: `Error updating warc count for collection ${update.forCol}`
    }
  } else {
    window.logger.debug('collection store got all collections')
    let {
      forCol,
      count
    } = update
    return {
      type: 'updated-col',
      forCol,
      count
    }
  }
}

export function addedNewCol (event, col) {
  dispatch(notify.notify({
    title: 'Success',
    level: 'success',
    autoDismiss: 0,
    message: `Created new collection ${col.viewingCol}`,
    uid: `Created new collection ${col.viewingCol}`
  }))
  return {
    type: 'added-new-collection',
    col
  }
}





