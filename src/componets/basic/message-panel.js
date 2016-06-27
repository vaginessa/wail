import React, {Component} from "react"
import {Grid, Row, Column} from "react-cellblock"
import CircularProgress from "material-ui/CircularProgress"
import UrlStore from "../../stores/urlStore"

export default class MessagePanel extends Component {
   constructor(props, context) {
      super(props, context)
      this.updateMementoCount = this.updateMementoCount.bind(this)
      this.urlUpdated = this.urlUpdated.bind(this)
      this.state = {
         mementoCount: -1,
         message: this.fetchingMementoMsg()
      }


   }

   fetchingMementoMsg() {
      return (
         <p>
            Fetching memento count
            from public archives...
         </p>
      )
   }

   gotMementoMsg() {
      return (
         <p>
            Mementos available from public archives:
         </p>
      )
   }

   updateMementoCount() {
      this.setState({mementoCount: UrlStore.getMementoCount(), message: this.gotMementoMsg()})
   }

   urlUpdated() {
      this.setState({mementoCount: -1, message: this.fetchingMementoMsg()})
   }

   componentDidMount() {
      UrlStore.on('memento-count-updated', this.updateMementoCount)
      UrlStore.on('memento-count-fetch', this.urlUpdated)
   }

   componentWillUnmount() {
      UrlStore.removeListener('memento-count-updated', this.updateMementoCount)
      UrlStore.removeListener('memento-count-fetch', this.urlUpdated)
   }

   render() {
      const progressOrCount = this.state.mementoCount == -1 ? <CircularProgress size={0.5}/> :
         <p>{this.state.mementoCount}</p>
      return (
         <Grid>
            <Row>
               <Column width="1/2">
                  {this.state.message}
               </Column>
               <Column width="1/2">
                  {progressOrCount}
               </Column>
            </Row>
         </Grid>
      )
   }
}