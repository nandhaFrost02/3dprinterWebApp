import React from 'react';
import {Button, Modal,DropdownButton,Dropdown,Spinner} from 'react-bootstrap';
import {DeliveryStatusTable} from './../DisplayTable';
import {orderList, cancelRequest,checkIfCancelled} from './../../BusinessLogic/FireStoreInteractions';
import {authState,appAuth} from './../../BusinessLogic/FireStoreInteractions';
import {CancelRequestFrom} from './../ModalForms';
import {ToasterErrorMessage,ToasterSuccessMessage} from './../Alerts';
import {Empty} from 'antd'

class TrackOrderModal extends React.Component{//tracking needed to fixed
    constructor(){
        super();
        this.state={
            modalState: false,//false initially
            orderSelected:"",
            orders : {},
            reasonToCancel: "",
            cancelledOrders: {},
            loadingOrderDetails: false,
            loadingCancelledOrderdDetails: false
        }
        appAuth.onAuthStateChanged(user=>{
            if(user){
                this.setState(prevState=>({
                    ...prevState,
                    loadingOrderDetails:!prevState.loadingOrderDetails,
                    loadingCancelledOrderdDetails:!prevState.loadingCancelledOrderdDetails
                }),()=>{
                    orderList(snapShotData=>{
                        let extractedOrders = {};
                        Object.keys(snapShotData).forEach(key=>{
                            extractedOrders[key] = snapShotData[key]
                        })
                        this.setState(prevState=>({...prevState,orders : extractedOrders
                        }),()=>{
                            extractedOrders={};
                            this.setState(prevState=>({...prevState,loadingOrderDetails: !prevState.loadingOrderDetails}))
                        })
                    })
                    checkIfCancelled((snapShotData)=>{
                        let extractedOrders = {};
                        Object.keys(snapShotData).forEach(key=>{
                            extractedOrders[key] = snapShotData[key]
                        })
                        this.setState(prevState=>({...prevState,cancelledOrders : extractedOrders
                        }),()=>{extractedOrders={};
                            this.setState(prevState=>({...prevState,loadingCancelledOrderdDetails: !prevState.loadingCancelledOrderdDetails}))
                        })
                    })
                })
            }           
        })
    }
    modalUpdate=()=>{
        if(this.state.modalState===false){
            authState(user=>{
                if(user){
                    this.setState(prevState=>({
                        ...prevState,
                        loadingOrderDetails:!prevState.loadingOrderDetails,
                        loadingCancelledOrderdDetails:!prevState.loadingCancelledOrderdDetails
                    }),()=>{
                        orderList(snapShotData=>{
                            let extractedOrders = {};
                            Object.keys(snapShotData).forEach(key=>{
                                extractedOrders[key] = snapShotData[key]
                            })
                            this.setState(prevState=>({...prevState,orders : extractedOrders
                            }),()=>{
                                extractedOrders={};
                                this.setState(prevState=>({...prevState,loadingOrderDetails: !prevState.loadingOrderDetails}))
                            })
                        })
                        checkIfCancelled((snapShotData)=>{
                            let extractedOrders = {};
                            Object.keys(snapShotData).forEach(key=>{
                                extractedOrders[key] = snapShotData[key]
                            })
                            this.setState(prevState=>({...prevState,cancelledOrders : extractedOrders
                            }),()=>{extractedOrders={};
                                this.setState(prevState=>({...prevState,loadingCancelledOrderdDetails: !prevState.loadingCancelledOrderdDetails}))
                            })
                        })
                    })
                }
            })
        }
        this.setState(prevState=>({
            ...prevState,
            modalState: !prevState.modalState
        }))
    }
    modalReset=()=>{
        this.setState({
            modalState: false,//false initially
            orderSelected:"",
            orders : {},
            reasonToCancel: ""
        })
    }
    modalClose=()=>{
        this.setState(prevState=>({
            ...prevState,
               modalState: false,//false initially
               orderSelected:"",
               loadingOrderDetails: prevState.loadingOrderDetails,
               loadingCancelledOrderdDetails: prevState.loadingCancelledOrderdDetails
        }))
       }
    selectOrder=(orderId)=>{
        this.setState(prevState=>({
            ...prevState,
            orderSelected: orderId
        }))
    }
    reasonToCancel=(reason)=>{
        this.setState(prevState=>({
            ...prevState,
            reasonToCancel: reason
        }),()=>{
            cancelRequest(this.state.orderSelected,this.state.reasonToCancel,(response)=>{
                if(response === "initiated"){
                    ToasterSuccessMessage("Cancel requested,"+this.refundAvailable()+"₹ will be refunded shortly after verification");
                    ToasterSuccessMessage("Ctrl+R or refresh to see changes");this.modalReset()}
                else{ToasterErrorMessage()}
            })
        })
    }
    orderStatus=(status)=>{
        if(status==="orderMade" || status ==="printed"){
            return true;
        }else{
            return false;
        }
    }
    refundAvailable=()=>{
        if(this.state.orders[this.state.orderSelected].status === "orderMade"){
            return (this.state.orders[this.state.orderSelected].billAmount)
        }else if(this.state.orders[this.state.orderSelected].status === "printed"){
            return ((+this.state.orders[this.state.orderSelected].billAmount)/2)
        }
    }

    render(){
    const OrderList=()=>{
        let items=[];
        Object.keys(this.state.orders).forEach(orderId=>{
            items.push(
            <Dropdown.Item key={orderId} onClick={()=>this.selectOrder(orderId)}as="button">
                {this.state.orders[orderId].fileName === "" || undefined ? orderId: this.state.orders[orderId].fileName}
            </Dropdown.Item>)
        })
        return items;
    }
    return(
        <div>
        <Button variant="" onClick={this.modalUpdate}>Track Order</Button>
        <Modal show={this.state.modalState} aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header>
            {/*<Modal.Title>your Order's</Modal.Title>*/}
            <h3 className="text-muted">your order's</h3>
            {appAuth.currentUser ?
                this.state.loadingCancelledOrderdDetails === true &&
                this.state.loadingOrderDetails === true ? <Button size="lg" variant="" disabled>
                    Loading orders<span><Spinner variant="dark"animation="grow"/></span>
                </Button>
                    : Object.keys(this.state.orders).length !== 0 ? 
                    <DropdownButton onClick={()=>this.generateOrders}id="dropdown-item-button" title="orders" drop="left">
                        <OrderList />
                    </DropdownButton>
                    : <Button size="lg" variant="" disabled>Soon, order now</Button> 
            :<Button size="lg" variant="" disabled>Login please</Button>}
            </Modal.Header>
            <Modal.Body>
              { this.state.loadingCancelledOrderdDetails === true &&
                this.state.loadingOrderDetails === true ? 
                    <center><strong className="text-muted">fetching your orders<br/></strong>
                            <Spinner animation="grow" variant="dark"/>
                            <Spinner animation="grow" variant="dark"/>
                            <Spinner animation="grow" variant="dark"/>
                    </center>
                :
                Object.keys(this.state.orders).length !== 0 ? 
                    this.state.orderSelected !== "" ?
                    <div>
                     <DeliveryStatusTable orderId={this.state.orderSelected} orderDetails={this.state.orders[this.state.orderSelected]} cancelledOrders={this.state.cancelledOrders} />
                     {//decides to allow if cancel can be enabled
                      Object.keys(this.state.cancelledOrders).includes(this.state.orderSelected) ?
                        <center><span className="text-muted">{"cancelled for reason : "}</span><strong className="text-danger">{this.state.cancelledOrders[this.state.orderSelected].reason}</strong></center>
                        :this.orderStatus(this.state.orders[this.state.orderSelected].status) ? 
                        <CancelRequestFrom reasonToCancel={(reason)=>this.reasonToCancel(reason)} billAmount={this.refundAvailable()}/>
                        :<center>
                            <strong className="text-muted">{"For any concerns please do contact us"}</strong>
                        </center>
                     }
                     </div> 
                    :<center><strong className="text-muted">Select order to track</strong></center>
                    :<center><strong className="text-muted">
                        <Empty description="Order's yet to made"/>
                    </strong></center>  
              }
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={this.modalClose}>GoBack</Button>
            </Modal.Footer>
        </Modal>
        </div>
    )
    }
};

export {
    TrackOrderModal
}