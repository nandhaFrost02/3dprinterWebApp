import React from 'react';
import {Card, ProgressBar, Button, Navbar, Container,Col,Row,Spinner} from 'react-bootstrap';
import {Address} from './Address';
import {DisplayTable, ShoppingCartTable,CheckoutTable} from './DisplayTable';
import Context from './../Context';
import {deliveryDateEstimate} from './../BusinessLogic/DeliveryMethods'
import {Radio} from 'antd'

const Card1 = (props) => (
  <Context.Consumer>
    {
      ContextProps=>(
        <Card>
        <Card.Body>
          <Card.Title>{props.title}</Card.Title>
          <div>
            <input type="file" id="fileUpload" onChange={(e)=>props.fileInfo(e)}/>
            <ProgressBar variant="success" now={ContextProps.precentProgress} label={ContextProps.precentProgress+"% Complete (success) - MIGHT TAKE EXTRA SECONDS AT LAST MOMENT"}/>
            <center><p>{ContextProps.fileName}</p></center>
            <Row>
              <Col>
                {/*<span className="text-primary">choice of material for printing </span>*/}
                <Radio.Group style={{float: "right"}} defaultValue={ContextProps.materialCode} onChange={(e)=>{props.setMaterial(e.target.value)}}>
                  <Radio name="material"value="PLA">PLA</Radio>
                  <Radio name="material" value="ABS">ABS</Radio>
                </Radio.Group>
              </Col>
              <Col>
                {/*<span className="text-primary">Choice of color for printing </span>*/}
                <Radio.Group defaultValue={ContextProps.materialColor} onChange={(e)=>{props.setColor(e.target.value)}}>
                  <Radio name="color"value="yellow">Yellow</Radio>
                  <Radio name="color" value="red">Red</Radio>
                </Radio.Group>
              </Col>  
            </Row>
          </div>
          <div>
            {
              ContextProps.displayEstimateSpinners===true?
              <Row className="justify-content-center">
                <Spinner animation="grow" variant="success"/>
                <Spinner animation="grow" variant="primary"/>
                <Spinner animation="grow" variant="muted"/>
                <Spinner animation="grow" variant="dark"/>
              </Row>:false
            }
            {ContextProps.displayEstimate===true?
              <Row style={{paddingTop:"1%"}}>
                <Col><Button style={{float: "right"}}variant="outline-danger" onClick={()=>props.clearFile()}>Clear</Button></Col>
                <Col><Button variant="outline-success" onClick={()=>props.nextStep()}>Next</Button></Col>
              </Row>
              : false
            }
            {ContextProps.pleaseLoginWarningWithFileHold===true?
            <Row className="justify-content-center">
              <strong className="text-warning">Please login, to continue</strong>
            </Row>:false}
          </div>
        </Card.Body>
        <Card.Footer className="text-muted">NOTE: upload a STL file (File operated at broswer, no uploading untill order made)</Card.Footer>
      </Card>
      )
    }
  </Context.Consumer>
);

const Card2 = (props) => (
  <Context.Consumer>
    {
      ContextProps=>(
        <Card>
        <Card.Body>
          <Navbar className="justify-content-between">
            <Card.Title>{props.title}</Card.Title>
            <Button variant="outline-secondary" onClick={()=>props.prevStep()}>GoBack</Button>
          </Navbar>
          <div>
            <DisplayTable/>
            <center><h6>Address</h6></center>
            <Address updateName={(name)=>props.updateName(name)}
                     updateNo={(number)=>props.updateNo(number)}
                     updateEmail={(email)=>props.updateEmail(email)}
                     updateStreet={(street)=>props.updateStreet(street)}
                     updateCity={(city)=>props.updateCity(city)}
                     updateDistrict={(district)=>props.updateDistrict(district)}
                     updatePincode={(pincode)=>props.updatePincode(pincode)}
                     expressRequired={(status)=>props.expressRequired(status)}
            />
          {ContextProps.fullNameValidator && ContextProps.phoneNoValidator &&
            ContextProps.emailValidator && ContextProps.streetValidator &&
            ContextProps.cityValidator && ContextProps.districtValidator &&
            ContextProps.pincodeValidator ? <Button size="lg" variant="outline-success" onClick={()=>props.nextStep()}>Next</Button>: 
          <Button size="lg" variant="outline-secondary" disabled>Button-disabled</Button>}
          </div>
        </Card.Body>
        <Card.Footer className="text-muted"><p>Hint: Type of courier and days of delivery will make changes in delivery charges</p></Card.Footer>
      </Card>
      )
    }
  </Context.Consumer>  
);

class Card3 extends React.Component{
  constructor(props){
    super(props);
    this.state={
      deliveryCost:52,//default to normal courier
      expressCourier:false,
      deliveryDate: props.deliveryDate,
      buttonSpinner:false
    }
  }
  expressRequired=(state)=>{
    if(state){//yes express needed
      this.setState(prevState=>({
        ...prevState,
        deliveryCost:110,
        expressCourier:state,
        deliveryDate: deliveryDateEstimate(state)
      }))
    }else{//normal courier time
      this.setState(prevState=>({
        ...prevState,
        deliveryCost:50,
        expressCourier:state,
        deliveryDate: deliveryDateEstimate(state)
      }))
    }
  }
  checkoutCaller=(costToPrint)=>{
    this.setState(prevState=>({
      ...prevState,
      buttonSpinner:!prevState.buttonSpinner
    }))
    this.props.checkOut(((+costToPrint)+this.state.deliveryCost).toFixed(2))
  }
  
  render(){
    return(
      <Context.Consumer>
      {
      contextProps=>(
        <Card>
          <Card.Body>
          <Navbar className="justify-content-between">
            <Card.Title>{this.props.title}</Card.Title>
            <Button variant="outline-secondary" onClick={()=>this.props.prevStep()}>GoBack</Button>
          </Navbar>
          <ShoppingCartTable 
            fileName={contextProps.fileInfo.name}
            deliveryDate={this.state.deliveryDate}
            expressCourier={this.state.expressCourier}
            expressRequired={state=>this.expressRequired(state)}
            costToPrint={contextProps.costToPrint}/>
          <Container>
            <Row><h4>Checkout</h4></Row>
            <Row>
            <Col>  {/*md={4}*/}    
            <CheckoutTable fileName={contextProps.fileInfo.name}
              costToPrint={contextProps.costToPrint}
              expressCourier={this.state.expressCourier}//deliveryChargers are hard-coded
              costToPay={((+contextProps.costToPrint)+this.state.deliveryCost).toFixed(2)}/>
            </Col>
            <Col>
              <Button variant="success" size="lg" onClick={(e)=>this.checkoutCaller(contextProps.costToPrint)}>
              <span>Checkout for {((+contextProps.costToPrint)+this.state.deliveryCost).toFixed(2)} &#x20B9;</span>
              {this.state.buttonSpinner===true?<Spinner as="span"animation="border"size="lg"role="status"aria-hidden="true"/>:false}
              </Button>
            </Col>
            </Row>
          </Container>      
          </Card.Body>
          <Card.Footer className="text-muted">NOTE: upload a STL file (File operated at broswer, no uploading untill order made)</Card.Footer>
      </Card>
      )}
      </Context.Consumer>    
    )
  }
}

const Card4=(props)=>(
  <Card>
    <Card.Body>
    {props.loadingOrder===true?
      <div>
        <Row className="justify-content-center">
            <Spinner animation="grow" variant="success"/>
            <Spinner animation="grow" variant="warning"/>
            <Spinner animation="grow" variant="danger"/>
            <Spinner animation="grow" variant="info"/>
        </Row>
        <Row className="justify-content-center">
            <strong className="text-success">preparing your order</strong>
            <Spinner animation="border" variant="success" size="sm"/>
        </Row>
        <Row className="justify-content-center">
          <span className="text-muted">This might take few seconds</span>
        </Row>  
        <Row className="justify-content-center">
          <span className="text-muted">depending on your internet speed</span>
        </Row>
      </div>:
      props.fileUploadResponse==="success"?    
        <center>
          <h2 className="text-success">
          Your order has been successfully created
          </h2>
          <h2 className="text-primary">
              please track-order for more information
          </h2>
          <div>
            <Button variant="success" onClick={()=>props.homeRun()}>Home button</Button>
          </div>
        </center>:
        <center><h6>don't worry, Error in creating invoice we shall get it mailed </h6></center>
    }
    </Card.Body>
    <Card.Footer className="text-muted">Thanks, we shall take care for your print</Card.Footer>
  </Card>
);

const DefautCard = () => (
  <Card>
    <Card.Body>
      <Card.Title>Step: Unknown of 4</Card.Title>
      <div>
        <center><p>Something went wrong please refresh the page again</p></center>
      </div>
    </Card.Body>
    <Card.Footer className="text-muted">Tip: we accept even, Ctrl+R </Card.Footer>
  </Card>
);

export {
    Card1,
    DefautCard,
    Card2,
    Card3,
    Card4
}