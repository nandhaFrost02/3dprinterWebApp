import React from 'react';
import {Form, Col} from 'react-bootstrap';
import Context from './../Context';

const validator = (status)=>{
  if(status){
    return (<span className="text-success">&#10004;</span>);
  }else if(status===false){
    return (<span className="text-danger">&#10008;</span>);
  }else{
    return false;
  }
}
const Address = (props) =>(
  <Context.Consumer>
  {
  ContextProps=>(
<div>
    <Form.Row>
      <Form.Group as={Col} md="3" controlId="NameValidation">
        <Form.Label>Full name {validator(ContextProps.fullNameValidator)}</Form.Label>
        <Form.Control required type="text" defaultValue={ContextProps.fullName} placeholder="Full name" onChange={(e)=>props.updateName(e.target.value)}/>
      </Form.Group>
      <Form.Group as={Col} md="2" controlId="NumberValidation">
        <Form.Label>Phone{validator(ContextProps.phoneNoValidator)}</Form.Label>
        <Form.Control required type="number" defaultValue={ContextProps.phoneNo} placeholder="9585*****8" onChange={(e)=>{props.updateNo(e.target.value)}}/>
      </Form.Group>
      <Form.Group as={Col} md="3" controlId="EmailValidation">
        <Form.Label>EmailId {validator(ContextProps.emailValidator)}</Form.Label>
        <Form.Control required type="email" defaultValue={ContextProps.email} placeholder="yourEmail@provider.domain" onChange={(e)=>{props.updateEmail(e.target.value)}}/>
      </Form.Group>
      <Form.Group as={Col} md="3" controlId="StreetValidation">
        <Form.Label>Address {validator(ContextProps.streetValidator)}</Form.Label>
        <Form.Control required type="text" defaultValue={ContextProps.street}
        placeholder="your doorno.,street no., your area" onChange={(e)=>props.updateStreet(e.target.value)}/>
      </Form.Group>
    </Form.Row>
    <Form.Row>
      <Form.Group as={Col} md="3" controlId="CityValidation">
        <Form.Label>City{validator(ContextProps.cityValidator)}</Form.Label>
        <Form.Control required type="text" placeholder="City" defaultValue={ContextProps.city} onChange={(e)=>props.updateCity(e.target.value)}/> 
      </Form.Group>
      <Form.Group as={Col} md="3" controlId="DistrictValidation">
        <Form.Label>District {validator(ContextProps.districtValidator)}</Form.Label>
        <Form.Control required type="text" placeholder="District" defaultValue={ContextProps.district} onChange={(e)=>props.updateDistrict(e.target.value)}/>
      </Form.Group>
      <Form.Group as={Col} md="3" controlId="PincodeValidation">
        <Form.Label>Pincode {validator(ContextProps.pincodeValidator)}</Form.Label>
        <Form.Control required type="number" placeholder="Pincode" defaultValue={ContextProps.pincode} onChange={(e)=>props.updatePincode(e.target.value)}/>
      </Form.Group> 
    </Form.Row>
    </div>
  )
  }
  </Context.Consumer>
);

export {
    Address
}