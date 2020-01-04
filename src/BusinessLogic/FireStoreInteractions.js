import {CreateOrder,FeedbackWrite,ContactUsWrite, ReportMe, CancelRequest} from './firebase/firestoreWrites'
import App from './firebase/firebaseConfig'
import { OrderList,CheckIfCancelled,CostPerGram } from './firebase/firestoreReads';
import {UploadToFolder} from './firebase/fireStoreageWrites';

const createOrder=(paymentId,fullName,email,phoneNo,street,district,city,pincode,
    materialCode,materialColor,deliveryDate,fileName,expressCourier,billAmount,status,callback)=>{
    let orderId = paymentId;
    if(App.auth().currentUser !== null){
        let uid = App.auth().currentUser.uid;
        CreateOrder(uid,orderId,{street,city,district,pincode},{fullName,email,phoneNo},
            {fileName,fileLocation:fileName,materialCode,materialColor},{deliveryDate,expressCourier,status,fileName,billAmount}
        ).then(()=>callback(orderId))
        .catch(error=>callback(error))
    }else{
        callback("Error");
    }
}

const authState = (callback) => {
    callback(App.auth().currentUser);
}

const appAuth  = App.auth();

const feedbackWrite = (message,callback) =>{
    FeedbackWrite(message)
    .then(_=>callback("success"))
    .catch(error=>callback(error))
}

const contactUsWrite = (name,number,message,callback)=>{
    ContactUsWrite(name,number,message)
    .then(()=>callback("success"))
    .catch(error=>{console.log(error);callback(error)})
}

const reportMe = (title, message,callback)=>{
    if(App.auth().currentUser){
        ReportMe(title, message)
        .then(_=>callback("success"))
        .catch(error=>callback(error))
    }else{
        callback("notLoggedIn")
    }
}

const orderList = (callback) =>{
    if(App.auth().currentUser){
        OrderList()
        .then(snapShotData=>callback(snapShotData))
        .catch(error=>callback(error))
    }else{
        callback("notLoggedIn")
    }
}

const cancelRequest = (orderId, reason, callback) => {
    if(App.auth().currentUser){
        CancelRequest(orderId, reason)
        .then(_=>callback("initiated"))
        .catch(error=>callback(error))
    }else{
        callback("notLoggedIn")
    }
}

const checkIfCancelled=(callback)=>{
    if(App.auth().currentUser){
        CheckIfCancelled()
        .then(snapShotData=>callback(snapShotData))
        .catch(error=>{console.log(error);callback("error")})        
    }else{
        callback("error")
    }

}

const costPerGram = (callback) =>{
    if(App.auth().currentUser){
        CostPerGram()
        .then(cost=>callback(cost))
        .catch(error=>{console.log(error);callback("Error")})
    }
}

const uploadToFolder = (paymentId,fileText,callback) =>{
    UploadToFolder(paymentId,fileText)
            .then(snapshotData=>callback(snapshotData.state))
            .catch(error=>callback("Error"))
}

export{
    createOrder,
    authState,
    feedbackWrite,
    contactUsWrite,
    reportMe,
    orderList,
    cancelRequest,
    checkIfCancelled,
    costPerGram,
    appAuth,
    uploadToFolder
}