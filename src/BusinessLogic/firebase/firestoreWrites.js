import App from './firebaseConfig';
import 'firebase/firestore';
const db = App.firestore();

const ContactUsWrite=(name,contact,message)=>{
    return new Promise((resolve,reject)=>{
        if(App.auth().currentUser){
            let uid = App.auth().currentUser.uid;
            db.collection(process.env.REACT_APP_CONTACTUS).add({uid,name,contact,message})
            .then(()=>resolve())
            .catch(error=>reject("Error"))
        }else{
            db.collection(process.env.REACT_APP_CONTACTUS).add({name,contact,message})
            .then(()=>resolve())
            .catch(error=>{console.log(error);reject(error)})
        }
    })
}
const FeedbackWrite=(message)=>{
    return new Promise((resolve,reject)=>{
        let uid = App.auth().currentUser.uid;
        db.collection(process.env.REACT_APP_FEEDBACK).add({uid,message})
        .then(()=>resolve())
        .catch(error=>{console.log(error);reject(Error)})
    })
}

const CreateOrder=(uid,orderId,address,contact,printDetials,deliveryStatus)=>{
    let orderObject = {}, deliveryObject = {};
    orderObject[orderId] =  {
            address,
            contact,
            printDetials
    }
    deliveryObject[orderId] = {
        deliveryDate : deliveryStatus.deliveryDate,
        expressCourier : deliveryStatus.expressCourier,
        status: deliveryStatus.status,
        fileName: deliveryStatus.fileName,
        billAmount: deliveryStatus.billAmount
    }
    return new Promise((resolve,reject)=>{
        writeToFirstOrderDocument(process.env.REACT_APP_ORDERS,uid,orderObject)
        .then(()=>{
            writeToFirstOrderDocument(process.env.REACT_APP_DELIVERYSTATUS,uid,deliveryObject)
            .then(_=>resolve())
            .catch(error=>reject(error))
        }).catch(error=>reject(error))
    })
}

const writeToFirstOrderDocument = (collection,document,dataToWrite) =>{
    return new Promise((resolve,reject)=>{
        db.collection(collection).doc(document).update(dataToWrite)
        .then(_=>resolve())
        .catch(error=>{
            if(error.message.includes("No document to update")){
                db.collection(collection).doc(document).set(dataToWrite)
                .then(_=>resolve())
                .catch(error=>reject(error))
            }
        })
    })
}

const ReportMe=(title,message)=>{
    return new Promise((resolve,reject)=>{
        let uid = App.auth().currentUser.uid;
        db.collection(process.env.REACT_APP_REPORT).add({uid,title,message})
        .then(_=>resolve())
        .catch(error=>reject(error))
    })
}

const CancelRequest = (orderId,reason) =>{
    let orderToCancel={};
    orderToCancel[orderId]={reason}
    let uid = App.auth().currentUser.uid;
    return new Promise((resolve,reject)=>{
        db.collection(process.env.REACT_APP_CANCELREQUEST).doc(uid).update(orderToCancel)
        .then(_=>{resolve()})
        .catch(error=>{
            if(error.message.includes("No document to update")){
                db.collection(process.env.REACT_APP_CANCELREQUEST).doc(uid).set(orderToCancel)
                .then(_=>resolve())
                .catch(error=>{console.log(error);reject(error.message)})
            }
        })
    })
}

export {
    ContactUsWrite,
    FeedbackWrite,
    CreateOrder,
    ReportMe,
    CancelRequest
}