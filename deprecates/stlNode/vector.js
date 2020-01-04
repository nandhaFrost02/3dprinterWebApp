export default class Vector {
  constructor(x,y,z){
    this.x = parseInt(x)
    this.y = parseInt(y)
    this.z = parseInt(z)
  }

  //clone of vector
  clone(){return new Vector(this.x,this.y,this.z)}

  //AddingVectors
  add(secondVector){
    this.x = this.x + secondVector.x
    this.y = this.y + secondVector.y
    this.z = this.z + secondVector.z
    return this
  }

  //SubractingVectors
  sub(secondVector){
    this.x = this.x - secondVector.x
    this.y = this.y - secondVector.y
    this.z = this.z - secondVector.z
    return this
  }

  //MultiplyVectors
  multiply(secondVector){
    return ((this.x*secondVector.x)+(this.y*secondVector.y)+(this.z*secondVector.z))
  }

  //CrossMultiples the vectors
  crossMultiply(secondVector){
    this.x = this.y*secondVector.z - this.z*secondVector.y
    this.y = this.z*secondVector.x - this.x*secondVector.z
    this.z = this.x*secondVector.y - this.y*secondVector.x
    return this
  }
  
  //finds the length of the vector
  length(){
    return Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z)
  }
}