import React from 'react';
import {Button, Modal} from 'react-bootstrap';
import {ContactUsModalForm,FeedbackModalFrom,ReportMeModalForm} from './ModalForms';
import { feedbackWrite, contactUsWrite } from '../BusinessLogic/FireStoreInteractions';
import {ToasterSuccessMessage,ToasterErrorMessage, ToasterCustomMessage} from './Alerts'
import {authState, reportMe} from './../BusinessLogic/FireStoreInteractions';
import TermsNConditionsDoc from './../staticData/TermsNConditionsDoc'
import PrivacyPoliciesDoc from './../staticData/PrivacyPoliciesDoc'
import AboutUsDoc from './../staticData/AboutUsDoc'
import WelcomeDoc from './../staticData/WelcomeDoc'
import logo from './../assets/logo.PNG'

const UserModal = (props) => (
    <Modal show={props.show}>
            <Modal.Header>
                <Modal.Title>{props.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <center>
                    <Button variant="outline-danger" onClick={()=>props.signOut()}>Log-out</Button>
                </center>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={()=>props.closeClicked()}>Close</Button>
            </Modal.Footer>
        </Modal>
);

class UserLoggerModal extends React.Component{
    constructor(){
        super();
        this.state={
            modalState: false
        }
    }
    modalUpdate=()=>{
        this.setState({
            modalState: !this.state.modalState
        })
    }
    render(){
    return(
        <div>
        <Button variant="outline-dark float-right" onClick={this.modalUpdate}>Join-us!</Button>
        <Modal show={this.state.modalState}>
            <Modal.Header>
                <Modal.Title>Sign-up/SignIn</Modal.Title>
            </Modal.Header>
            <Modal.Body>Body of modal</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={this.modalUpdate}>Close</Button>
                <Button variant="primary" onClick={this.modalUpdate}>Proceed</Button>
            </Modal.Footer>
        </Modal>
        </div>
    )
    }
}

class ContactUsModal extends React.Component{
    constructor(){
        super();
        this.state={
            modalState: false,
            number: 0,name:"",message:"",
            nameValidator: "",messageValidator: "",numberValidator:""
        }
    }
    updateEvent=(id,message)=>{
        switch(id){
            case 'name':
            if(message.length>=3 && message.length<=20){
            this.setState(prevState=>({...prevState,name: message,nameValidator:true}))
            }else{this.setState(prevState=>({...prevState,nameValidator:false}))}
            break;
            case 'number':
            if(message.length===10){
            this.setState(prevState=>({...prevState,number: message,numberValidator:true}))
            }else{this.setState(prevState=>({...prevState,numberValidator:false}))}
            break;
            case 'message':
            if(message.length>=10 && message.length<=150){
            this.setState(prevState=>({...prevState,message,messageValidator:true}))
            }else{this.setState(prevState=>({...prevState,messageValidator:false}))}
            break;
            default:
            break;
        }
    }
    modalUpdate=()=>{
        this.setState(prevState=>({
            ...prevState,
            modalState: !prevState.modalState
        }))
    }
    sendMessage=()=>{
        contactUsWrite(this.state.name,this.state.number,this.state.message,(result)=>{
            if(result==="success"){
                ToasterSuccessMessage("We will get back shortly, to you");
                this.setState(prevState=>({...prevState,modalState:false}))
            }else{
                ToasterErrorMessage();
            }
        })
    }
    render(){
    return(
        <div>
        <span variant="" style={{cursor:"pointer"}} onClick={this.modalUpdate}>Contact-US</span>
        <Modal show={this.state.modalState}>
            <Modal.Header>
                <Modal.Title>We will get back to you shortly</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ContactUsModalForm updateEvent={(id,message)=>this.updateEvent(id,message)}
                name={this.state.name} number={this.state.number} message={this.state.message}
                nameValidator={this.state.nameValidator} numberValidator={this.state.numberValidator} messageValidator={this.state.messageValidator}/>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={this.modalUpdate}>Close</Button>
                {this.state.nameValidator===true && this.state.numberValidator===true && this.state.messageValidator===true ? 
                    <Button variant="primary" onClick={this.sendMessage}>Tell us!</Button>
                   :<Button size="lg" variant="outline-secondary" disabled>Button-disabled</Button>}               
            </Modal.Footer>
        </Modal>
        </div>
    )
    }
}

class FeedbackModal extends React.Component{
    constructor(){
        super();
        this.state={
            modalState: false,
            message:"",messageValidator: "",
        }
    }
    updateEvent=(message)=>{
        if(message.length>=10){
            this.setState(prevState=>({...prevState,message,messageValidator:true}))
        }else{this.setState(prevState=>({...prevState,messageValidator:false}))}
    }
    modalUpdate=()=>{
        authState(user=>{
            if(user){
                this.setState(prevState=>({
                    ...prevState,
                    modalState: !prevState.modalState
                }))
            }else{
                ToasterCustomMessage("warning","please login to feedback us","top");
            }
        })
    }
    sendMessage=()=>{
        feedbackWrite(this.state.message,(result)=>{
            if(result==="success"){
                ToasterSuccessMessage("Thanks for your feedback");
                this.setState(prevState=>({...prevState,modalState:false}))
            }else if(result==="notLoggedIn"){
                ToasterCustomMessage("warning","please login to feedback us","top");
            }else{
                ToasterErrorMessage();
            }
        })
    }
    render(){
    return(
        <div>
        <span variant=""  style={{cursor:"pointer"}} onClick={this.modalUpdate}>feedback</span>
        <Modal show={this.state.modalState}>
            <Modal.Header>
                <Modal.Title>Feed-back form</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <FeedbackModalFrom updateEvent={(message)=>this.updateEvent(message)}
                message={this.state.message} messageValidator={this.state.messageValidator}/>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={this.modalUpdate}>Close</Button>
                {this.state.messageValidator===true ? 
                    <Button variant="primary" onClick={this.sendMessage}>Tell us!</Button>
                   :<Button size="lg" variant="outline-secondary" disabled>Button-disabled</Button>}               
            </Modal.Footer>
        </Modal>
        </div>
    )
    }    
}

class ReportMeModal extends React.Component{
    constructor(){
        super();
        this.state={
            modalState: false,
            message:"",messageValidator: "",
            title:"", titleValidator:""
        }
    }
    updateEvent=(id,message)=>{
        switch(id){
            case 'title':
            if(message.length>=5 && message.length<=25){
            this.setState(prevState=>({...prevState,title: message,titleValidator:true}))
            }else{this.setState(prevState=>({...prevState,titleValidator:false}))}
            break;
            case 'message':
            if(message.length>=10 && message.length<=150){
            this.setState(prevState=>({...prevState,message,messageValidator:true}))
            }else{this.setState(prevState=>({...prevState,messageValidator:false}))}
            break;
            default:
            break;
        }
    }
    modalUpdate=()=>{
        authState(user=>{
            if(user){
                this.setState(prevState=>({
                ...prevState,
                modalState: !prevState.modalState
                }))
            }else{
                ToasterCustomMessage("warning","please login to report problem","top");
            }
        })
    }
    sendMessage=()=>{
        reportMe(this.state.title,this.state.message,(result)=>{
            if(result==="success"){
                ToasterSuccessMessage("We will fix it sooner");
                this.setState(prevState=>({...prevState,modalState:false}))
            }else if(result==="notLoggedIn"){
                ToasterCustomMessage("warning","please login to report","top");
            }else{
                ToasterErrorMessage();
            }
        })
    }
    render(){
    return(
        <div>
        <span variant="" style={{cursor:"pointer"}} onClick={this.modalUpdate}>Report issue</span>
        <Modal show={this.state.modalState}>
            <Modal.Header>
                <Modal.Title>Report issue form</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ReportMeModalForm updateEvent={(id,message)=>this.updateEvent(id,message)}
                message={this.state.message} messageValidator={this.state.messageValidator}
                title={this.state.title} titleValidator={this.state.titleValidator}/>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={this.modalUpdate}>Close</Button>
                {this.state.messageValidator===true && this.state.titleValidator ? 
                    <Button variant="primary" onClick={this.sendMessage}>Tell us!</Button>
                   :<Button size="lg" variant="outline-secondary" disabled>Button-disabled</Button>}               
            </Modal.Footer>
        </Modal>
        </div>
    )
    }    
}

class AboutUsModal extends React.Component{
    constructor(){
        super();
        this.state={
            modalState: false,
        }
    }
    modalUpdate=()=>{
        authState(user=>{
            if(user){
                this.setState(prevState=>({
                ...prevState,
                modalState: !prevState.modalState
                }))
            }else{
                ToasterCustomMessage("warning","please login to know about us","top");
            }
        })
    }
    render(){
    return(
        <div>
        <span variant="" style={{cursor:"pointer"}} onClick={this.modalUpdate}>About us</span>
        <Modal scrollable show={this.state.modalState}>
            <Modal.Header>
                <Modal.Title>
                    <img src={logo} alt="App logo" style={{display:"block",float:"left",width:"10%",height:"10%"}}/>
                    3dPrinter Web App
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <AboutUsDoc />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={this.modalUpdate}>Close</Button>
            </Modal.Footer>
        </Modal>
        </div>
    )
    }    
}

class TermsnConditionModal extends React.Component{
    constructor(){
        super();
        this.state={
            modalState: false,
        }
    }
    modalUpdate=()=>{
        authState(user=>{
            if(user){
                this.setState(prevState=>({
                ...prevState,
                modalState: !prevState.modalState
                }))
            }else{
                ToasterCustomMessage("warning","please login to know the terms & conditions","top");
            }
        })
    }
    render(){
    return(
        <div>
        <span variant="" style={{cursor:"pointer"}} onClick={this.modalUpdate}>Terms & conditions</span>
        <Modal scrollable show={this.state.modalState}>
            <Modal.Header>
                <Modal.Title>Terms & Conditions</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <TermsNConditionsDoc/>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={this.modalUpdate}>Close</Button>
            </Modal.Footer>
        </Modal>
        </div>
    )
    }    
}

class PrivacyPoliciesModal extends React.Component{
    constructor(){
        super();
        this.state={
            modalState: false,
        }
    }
    modalUpdate=()=>{
        authState(user=>{
            if(user){
                this.setState(prevState=>({
                ...prevState,
                modalState: !prevState.modalState
                }))
            }else{
                ToasterCustomMessage("warning","please login to read the privacy-policies","top");
            }
        })
    }
    render(){
    return(
        <div>
        <span variant="" style={{cursor:"pointer"}} onClick={this.modalUpdate}>Privacy policies</span>
        <Modal scrollable show={this.state.modalState}>
            <Modal.Header>
                <Modal.Title>Privacy policies</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <PrivacyPoliciesDoc />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={this.modalUpdate}>Close</Button>
            </Modal.Footer>
        </Modal>
        </div>
    )
    }    
}

const WelcomeModal=(props)=>(
    <Modal scrollable show={props.welcomeModal}>
        <Modal.Header>
        <h3><strong className="text-success">Welcome to 3dPrinterWebApp</strong></h3>
        </Modal.Header>
        <Modal.Body>
            <WelcomeDoc />
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={()=>props.closeWelcomeModal()}>Close</Button>
        </Modal.Footer>
    </Modal>
)

export {
    WelcomeModal,
    UserLoggerModal,//deprecated - latest version "UserModal"
    ContactUsModal,
    FeedbackModal,
    UserModal,
    ReportMeModal,
    AboutUsModal,
    TermsnConditionModal,
    PrivacyPoliciesModal
}