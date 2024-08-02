export const makePoints = (MapRows = 100, MapColumns = 100, hexRadius = 0.001, startX = 0, startY = 0, ) => {
    var points: [number, number][] = [];
    for (var i = startX; i < MapRows; i++) {
        for (var j = startY; j < MapColumns; j++) {
            var x = hexRadius * j * Math.sqrt(3)
            //Offset each uneven row by half of a "hex-width" to the right
            if(i%2 === 1) x += (hexRadius * Math.sqrt(3))/2
            var y = hexRadius * i * 1.5
            points.push([x,y])
        }//for j
    }//for i
    return points
  }
  
  export function hilbert(x: number, y: number, z: number) {
    let n = 1 << z, rx: number, ry: number, s: number, d = 0;
    for (s = n >> 1; s > 0; s >>= 1) {
      rx = (x & s) > 0 ? 1 : 0;
      ry = (y & s) > 0 ? 1 : 0;
      d += s * s * ((3 * rx) ^ ry);
      [x, y] = rot(n, x, y, rx, ry);
    }
    return d / (1 << z * 2);
  }
  
  export function rot(n: number, x: number, y: number, rx: number, ry: number) {
    if (!ry) {
      if (rx) {
        x = n - 1 - x;
        y = n - 1 - y;
      }
      return [y, x];
    }
    return [x, y];
  }