import React from 'react';
import froozenLogo from './../assets/froozenLogo.PNG'

const AboutUsDoc=()=>(
<div>
    <center>
        <small className="text-muted">You can now 3D-Print without owning a 3D-Printer</small>
        <h6 className="text-primary">3dPrinting as a service</h6>
    </center>
    <strong>
    <p className="text-success">3 simple Step</p>
    <ul>
        <li>Upload your file,select color and material of your choice</li>
        <li>Give your address</li>
        <li>Checkout using your preferred payment option</li>
        <small className="text-muted">Don't worry!! We have the best secured payment gateway for our valuable customers</small>
    </ul>
    <p>That's it, wait for you order to reach you as per the postal area<br/>
    <small className="text-mute">Normally takes 7-12 working days</small>
        <small className="text-muted">Note: If you really want to or not satisfied with the printed object, you can return, refund or cancelling the order. Also contact us for any issues<br/>
        We are glad to help our customers<br/>
        <span className="text-warning">Report us for bugs or issues</span>
        </small>
    </p>
    </strong>
    <p style={{textAlign:"right"}} className="text-success"><strong>-Nandha A.K.A NandhaFrost</strong></p>
    <p style={{textAlign:"right"}} className="text-success"><strong>CEO, Froozen</strong></p>
    <img src={froozenLogo} style={{float:"right",width:"15%",height:"15%"}} alt="froozenLogo"/>
</div>
)

export default AboutUsDoc;