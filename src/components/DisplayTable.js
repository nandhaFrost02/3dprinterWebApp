import React from 'react';
import {Table,Form} from 'react-bootstrap';
import Context from './../Context';
import {Progress} from 'antd';

const DisplayTable = () =>(
  <Context.Consumer>
    {
      contextProps=>(
      <Table responsive>{/*striped bordered hover*/}
      <thead>
      <tr className="font-weight-normal">
        <th>#</th>
        <th>FileToPrint*.stl</th>
        <th>Price &#x20B9;</th>
        <th>Weight(grams)</th>
        <th>Volume(cm<sup>3</sup>)</th>
        <th>Material-density(g/cm<sup>3</sup>)</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td>1</td>
        <td>{contextProps.fileInfo.name}</td>
        <td className="text-success font-italic font-weight-bold">{contextProps.costToPrint}</td>
        <td>{Math.round(contextProps.businessInfo.weight * 100) / 100}</td>
        <td>{Math.round(contextProps.businessInfo.volume * 100) / 100}</td>
        <td>{Math.round(contextProps.density * 100) / 100}</td>
      </tr>
      </tbody>
      </Table>
      )
    }
  </Context.Consumer>  
);

const ShoppingCartTable = (props) => (
  <Table responsive>
    <thead>
      <tr className="font-weight-normal">
        <th>#</th>
        <th>FileToPrint*.stl</th>
         <th>delivery date</th>
         <th>Faster delivery</th>
         <th>Delivery cost &#x20B9;</th>
         <th>Printing cost &#x20B9;</th>
       </tr>
    </thead>
    <tbody>
      <tr>
        <td>1</td>
         <td>{props.fileName}</td>
         <td>{props.deliveryDate}
         <br/><small className="text-muted">{props.expressCourier===true?<span>delivery by 5-7days</span>:<span>delivery by 10-12 days</span>}</small>
         </td>
         <td>
           <Form>
              <Form.Check type="switch" id="custom-switch-1" className="d-inline" label="" checked={props.expressCourier} onChange={(e)=>props.expressRequired(e.target.checked)}/>
               {props.expressCourier===true?<p className="d-inline text-success">Faster delivery</p>:<p className="d-inline text-info">Normal delivery</p>}
            </Form>
          </td>
          <td className="text-success font-italic font-weight-bold">{props.expressCourier===true?110:52}</td>
          <td className="text-success font-italic font-weight-bold">{props.costToPrint}</td>
          </tr>
        </tbody>
      </Table>
);

const CheckoutTable =(props)=>(
  <Table responsive borderless hover>
    <tbody >
      <tr>
      <td><h6>{props.fileName}</h6></td>
      <td><h6>{props.costToPrint}&#x20B9;</h6></td>
      </tr>
      <tr>
      <td><h6>Delivery charges</h6></td>
      <td><h6>{props.expressCourier===true?<span>110.00</span>:<span>52.00</span>}&#x20B9;</h6></td>
      </tr>
      <tr>
      <td className="text-success"><h5>Total bill</h5></td>
      <td className="text-success"><h5>{props.costToPay}&#x20B9;</h5></td>
      </tr>
    </tbody>
  </Table>
);

const DeliveryStatusTable=(props)=>{
  return(
    <Table responsive borderless hover>
    <tbody >
      <tr>
      <td><h6>fileName</h6></td>
      <td><h6>{props.orderDetails.fileName}</h6></td>
      </tr>
      <tr>
      <td><h6>orderId</h6></td>
      <td><h6>{props.orderId}</h6></td>
      </tr>
      <tr>
      <td><h6>deliveryDate</h6></td>
      <td><h6>{props.orderDetails.deliveryDate}</h6></td>
      </tr>
      <tr>
      <td><h6>status</h6></td>
      <td>{Object.keys(props.cancelledOrders).includes(props.orderId)?
        <h6 className="text-danger">{"cancelled"}</h6>
        :<h6 className="text-success">{props.orderDetails.status}</h6>
        }
      </td>
      </tr>
      {props.orderDetails.status === "shipped" || props.orderDetails.status === "delivered"? 
      <tr>
        <td><h6>shipmentId</h6></td>
        <td><h6>{props.orderDetails.shipmentId}</h6></td>
      </tr>
      :false}
      <tr>
        <td colSpan="2"><Progress
          status={Object.keys(props.cancelledOrders).includes(props.orderId)?"exception"
          :props.orderDetails.status==="orderMade"?"active":
          props.orderDetails.status==="printed"?"active":
          props.orderDetails.status==="shipped"?"success":
          props.orderDetails.status==="delivered"?"success":"active"
        } 
          percent={props.orderDetails.status==="orderMade"?10:
              props.orderDetails.status==="printed"?50:
              props.orderDetails.status==="shipped"?80:
              props.orderDetails.status==="delivered"?100:30}/></td>
      </tr>
    </tbody>
  </Table>
  )
}

const GreetingTable=(props)=>(
  <Table responsive borderless>
    <tr><td><center><strong className="text-muted">Order has been created</strong></center></td></tr>
    <tr><td><center><strong className="text-muted">invoice will be mailed shortly</strong></center></td></tr>
    <tr>
      <td>
        <center>
          <strong className="text-muted">click Track order</strong>
        </center>
      </td>
    </tr>
    <tr>
      <td>
        <center>
          <strong className="text-muted">click Track order</strong>
        </center>
      </td>
    </tr>
  </Table>
)

export {
    DisplayTable,
    ShoppingCartTable,
    CheckoutTable,
    DeliveryStatusTable,
    GreetingTable
}