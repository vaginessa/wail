import React, { Component } from 'react'
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table'
import autobind from 'autobind-decorator'
import RaisedButton from 'material-ui/RaisedButton'
import FixIcon from 'material-ui/svg-icons/action/build'
import KillIcon from 'material-ui/svg-icons/content/clear'
import { launchHeritrix, killHeritrix } from '../../actions/heritrix-actions'
import { startWayback, killWayback } from '../../actions/wayback-actions'
import ServiceStore from '../../stores/serviceStore'
import style from '../styles/styles'
import wc from '../../constants/wail-constants'
import { remote, ipcRenderer as ipc } from 'electron'
import * as notify from '../../actions/notification-actions'

const EventTypes = wc.EventTypes


export default class General extends Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      wbGood: ServiceStore.waybackStatus(),
      hGood: ServiceStore.heritrixStatus()
    }
  }

  componentWillMount () {
    ServiceStore.on('heritrix-status-update', this.updateHeritrixStatus)
    ServiceStore.on('wayback-status-update', this.updateWaybackStatus)
    ServiceStore.on('monitor-status-update', this.servicesUpdated)
  }

  componentWillUnmount () {
    ServiceStore.removeListener('heritrix-status-update', this.updateHeritrixStatus)
    ServiceStore.removeListener('wayback-status-update', this.updateWaybackStatus)
    ServiceStore.removeListener('monitor-status-update', this.servicesUpdated)
  }

  @autobind
  servicesUpdated () {
    this.setState({ wbGood: ServiceStore.serviceStatus.wayback, hGood: ServiceStore.serviceStatus.heritrix })
  }

  @autobind
  updateWaybackStatus () {
    this.setState({ wbGood: ServiceStore.waybackStatus() })
  }

  @autobind
  updateHeritrixStatus () {
    this.setState({ hGood: ServiceStore.heritrixStatus() })
  }

  @autobind
  wayBackFix (event) {
    notify.notifyInfo(`Starting Wayback`)
    ipc.send('start-service', 'wayback')
    this.setState({wbGood: true})
  }

  @autobind
  wayBackKill (event) {
    notify.notifyInfo(`Stopping Wayback`)
    ipc.send('kill-service', 'wayback')
    this.setState({wbGood: false})
    // console.log('Wayback Kill')
  }

  @autobind
  heritrixFix (event) {
    notify.notifyInfo(`Starting Heritrix`)
    ipc.send('start-service', 'heritrix')
    this.setState({hGood: true})
    // console.log(' Generalv HeritrixTab fix')
  }

  @autobind
  heritrixKill (event) {
    notify.notifyInfo(`Stopping Heritrix`)
    // console.log('General HeritrixTab Kill')
    ipc.send('kill-service', 'heritrix')
    this.setState({hGood: false})
  }

  render () {
    const waybackStatus = this.state.wbGood ? 'Running' : 'X'
    const heritrixStatus = this.state.hGood ? 'Running' : 'X'
    return (
      <Table >
        <TableHeader
          displaySelectAll={false}
          adjustForCheckbox={false}
        >
          <TableRow>
            <TableHeaderColumn style={style.servicesSS}>Service</TableHeaderColumn>
            <TableHeaderColumn style={style.servicesSS}>State</TableHeaderColumn>
            <TableHeaderColumn style={style.servicesSS}>Version</TableHeaderColumn>
            <TableHeaderColumn style={style.servicesActionsH}>Actions</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody
          displayRowCheckbox={false}
          showRowHover
        >
          <TableRow>
            <TableRowColumn style={style.servicesSS}>Wayback</TableRowColumn>
            <TableRowColumn style={style.servicesSS}>{waybackStatus}</TableRowColumn>
            <TableRowColumn style={style.servicesSS}>0.32.1</TableRowColumn>
            <TableRowColumn style={style.servicesActions}>
              <RaisedButton
                disabled={this.state.wbGood}
                style={style.serviceActionButton}
                labelPosition='before'
                label='Start'
                onMouseDown={this.wayBackFix}
                icon={<FixIcon />}
              />
              <RaisedButton
                disabled={!this.state.wbGood}
                style={style.serviceActionButton}
                labelPosition='before'
                label='Stop'
                onMouseDown={this.wayBackKill}
                icon={<KillIcon />}
              />
            </TableRowColumn>
          </TableRow>
          <TableRow>
            <TableRowColumn style={style.servicesSS}>Heritrix</TableRowColumn>
            <TableRowColumn style={style.servicesSS}>{heritrixStatus}</TableRowColumn>
            <TableRowColumn style={style.servicesSS}>3.2.0</TableRowColumn>
            <TableRowColumn style={style.servicesActions}>
              <RaisedButton
                disabled={this.state.hGood}
                style={style.serviceActionButton}
                labelPosition='before'
                label='Start'
                onMouseDown={this.heritrixFix}
                icon={<FixIcon />}
              />
              <RaisedButton
                disabled={!this.state.hGood}
                style={style.serviceActionButton}
                labelPosition='before' label='Stop'
                onMouseDown={this.heritrixKill}
                icon={<KillIcon />}
              />
            </TableRowColumn>
          </TableRow>
        </TableBody>
      </Table>
    )
  }
}
