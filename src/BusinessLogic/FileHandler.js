import {densityValue} from './PublicStaticData';
import NodeStl from '@nandhafrost/stlparser/Stl.js'

let fileInfo=(file,callback)=>{//memory de-allocation needed
    try{
        let {name,lastModifiedDate,lastModified,size} = file;
        var reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = () =>{
            callback({
                fileBuffer: reader.result,
                fileInfo: {name,lastModifiedDate,lastModified,size},
            },"Ok")
        }
        reader.onerror = (event) => {
            callback({
                errorLog: event,
                status: "Err"
            },"Err");
        }
        reader.onprogress = (event) =>{
            callback(Math.round((event.loaded / event.total) * 50),"LOADING");
        }
    }catch(error){
        //no need to handle, it just arrests failure of code block
    }
}

const STLHandler=(materialCode,fileText, callback)=>{
    materialCode = densityValue(materialCode)
    try{
        //console.log(new NodeStl(data,{density: "1.75"}))
        let result = new NodeStl(fileText,{density:materialCode})
        callback(result,"OK");
    }catch(error){
        console.log(error)
        callback(null,"Error");
    }
}

const textCopy=(file,callback)=>{
    var reader = new FileReader();
        reader.readAsText(file);
        reader.onload = (event) =>{
         callback({
            fileText: event.target.result,
        },"Ok")}
        reader.onerror = (event) => {
            callback(event,"Error");
        }
        reader.onprogress = (event) =>{
            callback(Math.round((event.loaded / event.total) * 50),"LOADING");
        }
}

export {
    fileInfo,
    STLHandler,
    textCopy
}