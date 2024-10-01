// Polyfill for requestAnimationFrame to ensure compatibility across different browsers
window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame

// onload event handler to initialize the application
onload = function (){
  setTimeout(init, 0) // Delay the initialization to ensure the DOM is fully loaded
}

// Initialization function
init = function(){
  // Get the canvas element and its 2D drawing context
  canvas = document.querySelector('canvas')
  ctx = canvas.getContext('2d')

  // Resize the canvas to match its displayed size
  onresize = function(){
    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight
  }
  onresize()

  // Initialize mouse object to track mouse position and state
  mouse = { x: canvas.width / 2, y: canvas.height / 2, out: false }

  // Event handler for mouse leaving the canvas
  canvas.onmouseout = function(){
    mouse.out = true
  }

  // Event handler for mouse movement over the canvas
  canvas.onmousemove = function(e){
    var rect = canvas.getBoundingClientRect()
    mouse = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      out: false
    }
  }

  // Initialize particle system variables
  gravityStrength = 10
  particles = []
  spawnTimer = 0
  spawnInterval = 10
  type = 0

  // Start the animation loop
  requestAnimationFrame(startLoop)
}

// Function to create a new particle
newParticle = function(){
  type = type ? 0 : 1 // Toggle particle type
  particles.push({
    x: mouse.x,
    y: mouse.y,
    xv: type ? 18 * Math.random() - 9 : 24 * Math.random() - 12, // Random x velocity
    yv: type ? 18 * Math.random() - 9 : 24 * Math.random() - 12, // Random y velocity
    c: type ? 'rgb(255,' + ((200 * Math.random()) | 0) + ',' + ((80 * Math.random()) | 0) + ')' : 'rgb(255,255,255)', // Color
    s: type ? 5 + 10 * Math.random() : 1, // Size
    a: 1 // Alpha (opacity)
  })
}

// Function to start the animation loop
startLoop = function(newTime){
  time = newTime
  requestAnimationFrame(loop)
}

// Main animation loop
loop = function(newTime){
  draw() // Draw particles
  calculate(newTime) // Update particle positions and states
  requestAnimationFrame(loop) // Request the next frame
}

// Function to draw particles on the canvas
draw = function(){
  ctx.clearRect(0, 0, canvas.width, canvas.height) // Clear the canvas
  for (var i = 0; i < particles.length; i++){
    var p = particles[i]
    ctx.globalAlpha = p.a // Set particle opacity
    ctx.fillStyle = p.c // Set particle color
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.s, 0, 2 * Math.PI) // Draw particle as a circle
    ctx.fill()
  }
}

// Function to update particle positions and states
calculate = function(newTime){
  var dt = newTime - time // Calculate time delta
  time = newTime

  // Spawn new particles if the mouse is not outside the canvas
  if (!mouse.out){
    spawnTimer += (dt < 100) ? dt : 100
    for (; spawnTimer > 0; spawnTimer -= spawnInterval){
      newParticle()
    }
  }

  // Remove excess particles to limit the total number
  particleOverflow = particles.length - 700
  if (particleOverflow > 0){
    particles.splice(0, particleOverflow)
  }

  // Update each particle's position and velocity
  for (var i = 0; i < particles.length; i++){
    var p = particles[i]
    if (!mouse.out){
      x = mouse.x - p.x
      y = mouse.y - p.y
      a = x * x + y * y
      a = a > 100 ? gravityStrength / a : gravityStrength / 100
      p.xv = (p.xv + a * x) * 0.99
      p.yv = (p.yv + a * y) * 0.99
    }
    p.x += p.xv
    p.y += p.yv
    p.a *= 0.99 // Fade out the particle over time
  }
}