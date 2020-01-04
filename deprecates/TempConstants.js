import {tickMark,wrongMark} from './../staticData/constants'

const tickMark= () =>(
    <span className="text-success">tickMark</span>
);
const wrongMark = () =>(
    <span className="text-danger">wrongMark</span>
);
export{
    tickMark,
    wrongMark
}