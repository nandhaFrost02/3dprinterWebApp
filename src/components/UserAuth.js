import React from 'react';
import * as firebase from 'firebase/app'
import 'firebase/auth'
import {Button} from 'react-bootstrap';
import App from './../BusinessLogic/firebase/firebaseConfig';//initalized app
import { UserModal } from './Modals';
import {ToasterSuccessMessage, ToasterErrorMessage,ToasterCustomMessage} from './Alerts';

class UserAuth extends React.Component{
    constructor(){
        super();
        this.state={modalShow:false,isSignedIn:false,name:"",email:"",uid:""}
        this.uiConfig={
            signInFlow:"popup",
            signInOptions:[
                firebase.auth.GoogleAuthProvider.PROVIDER_ID
            ]
        }
        App.auth().onAuthStateChanged(user=>{
            if(user){
                this.setState(prevState=>({
                    ...prevState,
                    isSignedIn:true,
                    name:user.displayName,
                    email:user.email,
                    uid:user.uid
                }))
            }else{
                this.setState(prevState=>({...prevState,isSignedIn:false,name:"",email:"",uid:""}))
            }
        })
    }
    signIn=()=>{
        App.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider())
        .then(user=>ToasterCustomMessage("success","Welcome,"+user.user.displayName,"top"))
        .catch(error=>{console.log(error);ToasterErrorMessage()})
    }
    signOut=()=>{
        App.auth().signOut()
        .then(ToasterSuccessMessage("please come back sooner"))
        .catch(error=>{console.log(error);ToasterErrorMessage()})
        this.setState(prevState=>({...prevState,modalShow:!prevState.modalShow}))
    }
    modalClicked=()=>{
        this.setState(prevState=>({...prevState,modalShow:!prevState.modalShow}))
    }
    render(){
        return(
            <div>
                {!this.state.isSignedIn ? 
                <Button variant="outline-success float-right" onClick={()=>this.signIn()}>{this.props.loginText}</Button>
                :<Button variant="outline-success float-right"onClick={()=>this.modalClicked()}>{this.state.name}</Button>
                }
                <UserModal show={this.state.modalShow}
                    closeClicked={()=>this.modalClicked()}
                    signOut={()=>this.signOut()}
                />
            </div>
        )
    }
}

export default UserAuth;