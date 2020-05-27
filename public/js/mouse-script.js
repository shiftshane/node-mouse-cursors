
// client interaction functionality setup
window.onload = function () {
  var userName = "Anonymous";
  askName();

  // var socket = io.connect('http://localhost:3700');
  var socket = io.connect(window.location.hostname);
  
  // // send mouse position updates
  // document.onmousemove = function (ev) {
  //   socket.emit("mouse movement", { pos: { x: ev.clientX, y: ev.clientY, name: userName } });
  // }
  
  // initial setup, should only happen once right after socket connection has been established
  socket.on('mouse setup', function (mouses) {
    for (var mouse_id in mouses) {
      virtualMouse.move(mouse_id, mouses.mouse_id);
    }
    console.log("mouses", mouses);
  });
  
  // update mouse position
  socket.on('mouse update', function (mouse) {
    virtualMouse.move(mouse.id, mouse.pos);
    console.log('update mouse position')
  });
  
  // remove disconnected mouse
  socket.on('mouse disconnect', function (mouse) {
    virtualMouse.remove(mouse.id);
  });

  function askName() {
    var person = prompt("Please enter your name:", "Mark");
    if (person == null || person == "") {
      // message = "You hit cancel, dummy.";
      userName = "Anonymous";
    } else {
      // message = "Hello " + person + "!";
      userName = person;
    }
    // send mouse position updates AFTER a name is chosen
    document.onmousemove = function (ev) {
      socket.emit("mouse movement", { pos: { x: ev.clientX, y: ev.clientY, name: userName } });
    }
    
    // document.getElementById("person-name").innerHTML = message;
  }
}

// virtual mouse module
var virtualMouse = {
  // moves a cursor with corresponding id to position pos
  // if cursor with that id doesn't exist we create one in position pos
  move: function (id, pos) {
    var cursor = document.getElementById('cursor-' + id);
    if (!cursor) {
      cursor = document.createElement('div');
      cursor.className = 'virtualMouse';
      cursor.id = 'cursor-' + id;
      cursor.style.position = 'absolute';
      img = cursor.innerHTML = '<img src="/img/cursor.png" /><div class="cursor-name">' + pos.name + '</div>';
      // img.src = '/img/mark-cursor.png';
      document.body.appendChild(cursor);
    }
    cursor.style.left = pos.x + 'px';
    cursor.style.top = pos.y + 'px';
  },
  // remove cursor with corresponding id
  remove: function (id) {
    var cursor = document.getElementById('cursor-' + id);
    cursor.parentNode.removeChild(cursor);
  }
}

