Array.prototype.swap = function(i,j) {
  var temp = this[i];
  this[i] = this[j];
  this[j] = temp;
}

Array.prototype.transpose1d = function() {
  transposed = [];
  this.forEach((val) => {transposed.push([val]);});
  return transposed;
}

// Array.prototype.fillrange = function(n) {
//   this = [];
//   for (i=0;i<n;i++) {
//     this.push(i);
//   }
// }


// Default array for examples
var y = [];
while (y.length < 20) {
  y.push(Math.round(Math.random()*255));
}
console.log(y);
