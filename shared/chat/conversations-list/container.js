// @flow
import * as I from 'immutable'
import ConversationList from './index'
import {connect} from 'react-redux'
import {createSelectorCreator, defaultMemoize} from 'reselect'
import {loadInbox, newChat} from '../../actions/chat'

import type {TypedState} from '../../constants/reducer'

const getInbox = (state: TypedState) => state.chat.get('inbox')
const getSupersededByState = (state: TypedState) => state.chat.get('supersededByState')
const getAlwaysShow = (state: TypedState) => state.chat.get('alwaysShow')
const getPending = (state: TypedState) => state.chat.get('pendingConversations')

const createImmutableEqualSelector = createSelectorCreator(defaultMemoize, I.is)

const filteredInbox = createImmutableEqualSelector(
  [getInbox, getSupersededByState, getAlwaysShow],
  (inbox, supersededByState, alwaysShow) => {
    return inbox.filter(i => (!i.isEmpty || alwaysShow.has(i.conversationIDKey)) &&
        !supersededByState.get(i.conversationIDKey)).map(i => i.conversationIDKey)
  }
)
const getRows = createImmutableEqualSelector(
  [filteredInbox, getPending],
  (inbox, pending) => pending.toList().concat(inbox)
)

export default connect(
  (state: TypedState) => ({
    rows: getRows(state),
  }),
  (dispatch: Dispatch) => ({
    loadInbox: () => dispatch(loadInbox()),
    onNewChat: () => dispatch(newChat([])),
  })
)(ConversationList)
