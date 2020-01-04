import React from 'react'
//import {STLViewer} from './../STLViewer/STLViewer'

class ModelPreview extends React.Component{
    constructor(props){
        super(props);
        this.state={
            color:"#FF0000",
            model: null
        }
    }

    onChange = ({target})=>{
        let {files} = target;
        let reader = new FileReader();
        reader.readAsArrayBuffer(files[0])
        reader.onload=()=>{
            this.setState({model:reader.result})
        }
    }

    render(){
        return(    
        <div>
            <input id="image" type="file" onChange={this.onChange}/>
        </div>
        )
    }
}

export default ModelPreview