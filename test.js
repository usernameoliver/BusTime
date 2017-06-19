Q = require("q");
Q.fcall(a = 1)
.then(a = a + 1)
.then(a = a + 2)
.then(console.log(a))
.catch(function (error) {
    // Handle any error from all above steps 
})
.done();