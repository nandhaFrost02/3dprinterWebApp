import FileReaderInput from 'react-file-reader-input';
fileHanderStl= (e, results) => {
    const [event,file] = results
    console.log(event[0].target)
    console.log(event[0].target.result)
    console.log(new NodeStl(event[0].target.result,{density: "1.75"}))
    
    //NodeStl.parseSTLBinary
    console.log(event[1])
    console.log(file)
    results.forEach(result => {
      const [e, file] = result;
      //this.props.dispatch(uploadFile());
      console.log(`Successfully uploaded ${file.name}!`);
    });
  }

  fileHanderStlCustom=(e)=>{
    var fileDetials = e.target.files[0]
    var reader = new FileReader();
    reader.readAsArrayBuffer(fileDetials);
    reader.onload = (event) =>{
      var data = reader.result;
      console.log(new NodeStl(data,{density: "1.75"}))
    }
    reader.onerror = (event) => {}
    reader.onprogress = (event) =>{
      console.log("onprogress")
    }
  }/*
  <input type="file" onChange={(e)=>this.fileHanderStlCustom(e)}/>
        <FileReaderInput as="buffer" id="my-file-input"
                         onChange={this.fileHanderStl}>
          <button>Select a file!</button>
</FileReaderInput>*/

