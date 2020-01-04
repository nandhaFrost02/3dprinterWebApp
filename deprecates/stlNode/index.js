import Vector from './vector';
import mainBuffer from 'buffer'

class STLMeasures {
  constructor(density){
    this.density = density
    this.volume = 0
    this.area = 0
    this.minx = Infinity
    this.miny = Infinity
    this.minz = Infinity
    this.maxx = -Infinity
    this.maxy = -Infinity
    this.maxz = -Infinity
    this.xCenter = 0
    this.yCenter = 0
    this.zCenter = 0
  }

  //Volume of triangle
  static _triangleVolume(triangle){
    const v210 = triangle[2].x * triangle[1].y * triangle[0].z
    const v120 = triangle[1].x * triangle[2].y * triangle[0].z
    const v201 = triangle[2].x * triangle[0].y * triangle[1].z
    const v021 = triangle[0].x * triangle[2].y * triangle[1].z
    const v102 = triangle[1].x * triangle[0].y * triangle[2].z
    const v012 = triangle[0].x * triangle[1].y * triangle[2].z
    return (1.0/6.0)*(-v210+v120+v201-v021-v102+v012)
  }

  addTriangle(triangle){
    let currentVolume = this.constructor._triangleVolume(triangle)
    this.volume += currentVolume;
    const ab = triangle[1].clone().sub(triangle[0])
    const ac = triangle[2].clone().sub(triangle[0])

    this.area += ab.clone().crossMultiply(ac).length()/2

    const tminx = Math.min(triangle[0].x, triangle[1].x,triangle[2].x)
    this.minx = tminx < this.minx ? tminx:this.minx
    const tmaxx = Math.max(triangle[0].x, triangle[1].x, triangle[2].x)
    this.maxx = tmaxx > this.maxx ? tmaxx : this.maxx
    
    const tminy = Math.min(triangle[0].y, triangle[1].y,triangle[2].y)
    this.miny = tminy < this.miny ? tminy:this.miny
    const tmaxy = Math.max(triangle[0].y, triangle[1].y, triangle[2].y)
    this.maxy = tmaxy > this.maxy ? tmaxy : this.maxy
    
    const tminz = Math.min(triangle[0].z, triangle[1].z,triangle[2].z)
    this.minz = tminz < this.minz ? tminz:this.minz
    const tmaxz = Math.max(triangle[0].z, triangle[1].z, triangle[2].z)
    this.maxz = tmaxz > this.maxz ? tmaxz : this.maxz
    
    //Center of mass calculation
    this.xCenter += ((triangle[0].x + triangle[1].x + triangle[2].x) / 4) * currentVolume;
    this.yCenter += ((triangle[0].y + triangle[1].y + triangle[2].y) / 4) * currentVolume;
    this.zCenter += ((triangle[0].z + triangle[1].z + triangle[2].z) / 4) * currentVolume;
  }

  //calculate final measurements
  finalize(){
    const volumeTotal = Math.abs(this.volume)/1000
    this.xCenter /= this.volume
    this.yCenter /= this.volume
    this.zCenter /= this.volume

    return {
      volume: volumeTotal, //cubicCm
      weight: volumeTotal * this.density,//Gm
      boundingBox:[
        this.maxx - this.minx,
        this.maxy - this.miny,
        this.maxz - this.minz
      ],
      area: this.area,
      centerOfMass: [this.xCenter,this.yCenter,this.zCenter]
    }
  }
}

export default class NodeStl {
  _parseSTLString(stl, density) {
    // yes, this is the regular expression, matching the vertexes
    // it was kind of tricky but it is fast and does the job
    let vertexes = stl.match(
      /facet\s+normal\s+([-+]?\b(?:[0-9]*\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\b)\s+([-+]?\b(?:[0-9]*\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\b)\s+([-+]?\b(?:[0-9]*\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\b)\s+outer\s+loop\s+vertex\s+([-+]?\b(?:[0-9]*\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\b)\s+([-+]?\b(?:[0-9]*\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\b)\s+([-+]?\b(?:[0-9]*\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\b)\s+vertex\s+([-+]?\b(?:[0-9]*\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\b)\s+([-+]?\b(?:[0-9]*\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\b)\s+([-+]?\b(?:[0-9]*\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\b)\s+vertex\s+([-+]?\b(?:[0-9]*\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\b)\s+([-+]?\b(?:[0-9]*\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\b)\s+([-+]?\b(?:[0-9]*\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\b)\s+endloop\s+endfacet/g
    );
    console.log(stl)
    let measures = new STLMeasures(density);

    vertexes.forEach(function(vert) {
      const triangle = new Array(3);
      vert
        .match(
          /vertex\s+([-+]?\b(?:[0-9]*\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\b)\s+([-+]?\b(?:[0-9]*\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\b)\s+([-+]?\b(?:[0-9]*\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\b)\s/g
        )
        .forEach(function(vertex, i) {
          let vector = vertex
            .replace("vertex", "")
            .match(/[-+]?[0-9]*\.?[0-9]+(?:[eE][-+]?[0-9]+)?/g);

          triangle[i] = new Vector(vector[0], vector[1], vector[2]);
        });

      measures.addTriangle(triangle);
    });

    return measures.finalize();
  }
}


class stlParser {
  
  parseSTLBinary(buffer, density,callback){
    console.log(mainBuffer)
    buffer = mainBuffer.Buffer.from(buffer)
    const faces = buffer.readUInt32LE(80);
    const dataOffset = 84;
    const faceLength = 12 * 4 + 2;
  
    let measures = new STLMeasures(density);
  
    for (let face = 0; face < faces; face++) {
      const start = dataOffset + face * faceLength;
      let triangle = new Array(3);
      for (let i = 1; i <= 3; i++) {
        const vertexstart = start + i * 12;
        triangle[i - 1] = new Vector(
          buffer.readFloatLE(vertexstart, true),
          buffer.readFloatLE(vertexstart + 4, true),
          buffer.readFloatLE(vertexstart + 8, true)
        );
      }
      measures.addTriangle(triangle);
    }
    console.log(measures.finalize())
    callback(measures.finalize())
  }
}

export{
  stlParser
}