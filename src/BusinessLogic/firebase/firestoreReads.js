import App from './firebaseConfig';
import 'firebase/firestore';
const db = App.firestore();

const OrderList = () =>{
    return new Promise((resolve, reject)=>{
        db.collection(process.env.REACT_APP_DELIVERYSTATUS).doc(App.auth().currentUser.uid).get()
        .then(snapShot=>{
            if(snapShot.exists){
                resolve(snapShot.data())
            }
        })
        .catch(error=>{console.log(error);reject(error)})
    })
}

const CheckIfCancelled = () => {
    return new Promise((resolve,reject)=>{
        db.collection(process.env.REACT_APP_CANCELREQUEST).doc(App.auth().currentUser.uid).get()
        .then(snapShot=>{
            if(snapShot.exists){
                resolve(snapShot.data())
            }else{resolve({})}
        })
        .catch(error=>{
            if(error.message.includes("No document to update")){
              resolve({})
            }else{reject(error)}
        })
    })
}

const CostPerGram = () => {
    return new Promise((resolve,reject)=>{
        db.collection(process.env.REACT_APP_BUSINESSDATA).doc(process.env.REACT_APP_COST).get()
        .then(snapShot=>{
            resolve(snapShot.data().priceToPrint)
        }).catch(error=>reject(error));
    })
}

export {
    OrderList,
    CheckIfCancelled,
    CostPerGram
}