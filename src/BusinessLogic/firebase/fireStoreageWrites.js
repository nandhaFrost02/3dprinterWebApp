import App from './firebaseConfig';
import 'firebase/storage'
const storage = App.storage().ref();

const UploadToFolder = (fileName,fileText) =>{
    return new Promise((resolve,reject)=>{
        storage.child(process.env.REACT_APP_FILEUPLOADLOCATION+fileName).putString(fileText)
        .then(snapShotResult=>{resolve(snapShotResult)})
        .catch(error=>{reject(error)})
    })
}

export {
    UploadToFolder
}