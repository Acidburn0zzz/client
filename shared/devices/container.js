// @flow
import Render from '.'
import {List} from 'immutable'
import {addNewPhone, addNewComputer, addNewPaperKey} from '../actions/login'
import {connect} from 'react-redux'
import {createSelector} from 'reselect'
import {lifecycle} from 'recompose'
import {loadDevices} from '../actions/devices'
import {navigateAppend} from '../actions/route-tree'

import type {TypedState} from '../constants/reducer'

const Devices = lifecycle({
  componentWillMount: function () {
    this.props.loadDevices()
  },
})(Render)

const getAllDevicesSelector = (state: TypedState) => state.devices.devices

const getDevicesAndRevokedDevicesSelector = createSelector(
  getAllDevicesSelector,
  allDevices => {
    const split = allDevices.groupBy(d => d.revokedAt ? 'revokedDevices' : 'devices')
    const devices = split.get('devices', List()).toJS()
    const revokedDevices = split.get('revokedDevices', List()).toJS()
    return {
      devices,
      revokedDevices,
    }
  }
)

const mapStateToProps = (state: any, {routeState}) => {
  const {waitingForServer} = state.devices
  const {showingRevoked} = routeState
  const {devices, revokedDevices} = getDevicesAndRevokedDevicesSelector(state)

  return {
    devices,
    revokedDevices,
    showingRevoked,
    waitingForServer,
  }
}

const mapDispatchToProps = (dispatch: any, {routeState, setRouteState}) => ({
  addNewComputer: () => dispatch(addNewComputer()),
  addNewPaperKey: () => dispatch(addNewPaperKey()),
  addNewPhone: () => dispatch(addNewPhone()),
  loadDevices: () => dispatch(loadDevices()),
  onToggleShowRevoked: () => { setRouteState({showingRevoked: !routeState.showingRevoked}) },
  showExistingDevicePage: device => dispatch(navigateAppend([{props: {device}, selected: 'devicePage'}])),
})

export default connect(mapStateToProps, mapDispatchToProps)(Devices)
