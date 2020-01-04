import React from 'react';
import {Form,InputGroup,Button} from 'react-bootstrap';

const fieldValidator=(status)=>{
    if(status){
      return (<span className="text-success">&#10004;</span>);
    }else if(status===false){
      return (<span className="text-danger">&#10008;</span>);
    }else{
      return false;
    }
}

const ContactUsModalForm=(props)=>(
<Form>
    <Form.Group>
    <Form.Label>your name {fieldValidator(props.nameValidator)}</Form.Label>
    <Form.Control required id="name" type="text" placeholder="Full name" onChange={(e)=>{props.updateEvent(e.target.id,e.target.value)}}/>
    </Form.Group>
    <Form.Group>
    <Form.Label>number {fieldValidator(props.numberValidator)}</Form.Label>
    <Form.Control required id="number" type="number" placeholder="9********8" onChange={(e)=>{props.updateEvent(e.target.id,e.target.value)}}/>
    </Form.Group>
    <Form.Group>
    <Form.Label>your valuable feedback please{fieldValidator(props.messageValidator)}</Form.Label>
    <Form.Control as="textarea" id="message" rows="3" placeholder="reason to contact us"onChange={(e)=>{props.updateEvent(e.target.id,e.target.value)}}/>
    </Form.Group>
</Form>
);

const FeedbackModalFrom=(props)=>(
<Form>
    <Form.Group>
        <Form.Label>your valuable feedback please{fieldValidator(props.messageValidator)}</Form.Label>
        <Form.Control as="textarea" id="message" rows="3" placeholder="reason to contact us"onChange={(e)=>{props.updateEvent(e.target.value)}}/>
    </Form.Group>
</Form>    
);

const ReportMeModalForm=(props)=>(
    <Form>
        <Form.Group>
            <Form.Label>Suitable issue title{fieldValidator(props.titleValidator)}</Form.Label>
            <Form.Control required id="title" type="text" placeholder="Issue title" onChange={(e)=>{props.updateEvent(e.target.id,e.target.value)}}/>
        </Form.Group>
        <Form.Group>
            <Form.Label>your valuable feedback please{fieldValidator(props.messageValidator)}</Form.Label>
            <Form.Control as="textarea" id="message" rows="3" placeholder="reason to contact us"onChange={(e)=>{props.updateEvent(e.target.id,e.target.value)}}/>
        </Form.Group>
    </Form>    
);

class CancelRequestFrom extends React.Component{
    constructor(){
        super();
        this.state={reason:"",reasonValidator:""}
    }
    reasonToCancel=(reason)=>{
        if(reason.length>=10 && reason.length<=30){
            this.setState(prevState=>({
                ...prevState,
                reason,
                reasonValidator:true
            }))
        }else{
            this.setState(prevState=>({
                ...prevState,
                reasonValidator: false
            }))
        }
    }
    render(){
        return(
        <Form>
            <Form.Label>Reason for cancelling{fieldValidator(this.state.reasonValidator)}</Form.Label>
            <InputGroup className="mb-3">
            <InputGroup.Prepend>
                <InputGroup.Text>{"Rs"}</InputGroup.Text>
                <InputGroup.Text>{this.props.billAmount}</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control onChange={(e)=>this.reasonToCancel(e.target.value)}placeholder="Explain your reason"/>
            <InputGroup.Append>
                <Button variant="danger" onClick={()=>{this.props.reasonToCancel(this.state.reason)}} disabled={!this.state.reasonValidator}>Button</Button>
            </InputGroup.Append>
            </InputGroup>
        </Form>
        )
    }
};
    

export {
    ContactUsModalForm,
    FeedbackModalFrom,
    ReportMeModalForm,
    CancelRequestFrom
}