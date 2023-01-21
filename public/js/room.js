let gameStatus = [0, 0, 0, 0, 0, 0, 0, 0, 0];
let myClick;
let otherClick;
let enableClick = false;
let moves = 0;

const socket = io("/");
document.getElementById("url").value = location;

const copyToClip = () => {
  const copyBtn = document.getElementById("url");
  copyBtn.select();
  copyBtn.setSelectionRange(0, 9999);
  document.execCommand("copy");
  copyBtn.value = "copied";
  copyBtn.onclick = null;
  window.setSelectionRange().removeAllRanges();
};

socket.emit("join-room", ROOM_ID);

socket.on("user-connected", () => {
  document.getElementById("message").textContent = "Player Connected";
  myClick = "X";
  otherClick = "O";
  enableClick = true;
  socket.emit("can-play");
});

socket.on("can-play", () => {
  myClick = "O";
  otherClick = "X";
  enableClick = true;
});

const clicked = (id) => {
  if (enableClick) {
    moves++;
    const element = document.getElementById(id);
    element.innerHTML = myClick;
    element.onclick = null;
    socket.emit("clicked", id);
    enableClick = false;
    gameStatus[id - 1] = 1;

    if (
      (gameStatus[0] == 1 && gameStatus[1] == 1 && gameStatus[2] == 1) ||
      (gameStatus[0] == 1 && gameStatus[3] == 1 && gameStatus[6] == 1) ||
      (gameStatus[0] == 1 && gameStatus[4] == 1 && gameStatus[8] == 1) ||
      (gameStatus[2] == 1 && gameStatus[5] == 1 && gameStatus[8] == 1) ||
      (gameStatus[2] == 1 && gameStatus[4] == 1 && gameStatus[6] == 1) ||
      (gameStatus[1] == 1 && gameStatus[4] == 1 && gameStatus[7] == 1) ||
      (gameStatus[3] == 1 && gameStatus[4] == 1 && gameStatus[5] == 1) ||
      (gameStatus[6] == 1 && gameStatus[7] == 1 && gameStatus[8] == 1)
    ) {
      document.getElementById("message").innerHTML = "You win!";
      enableClick = false;
      setTimeout(() => {
        location.href = "/";
      }, 2000);
    } else if (moves === 9) {
      document.getElementById("message").innerHTML = "It's Draw!";
      setTimeout(() => {
        location.href = "/";
      }, 2000);
    }
  }
};

socket.on("clicked", (id) => {
  moves++;
  const element = document.getElementById(id);
  element.innerHTML = otherClick;
  element.onclick = null;
  enableClick = true;
  gameStatus[id - 1] = 2;

  if (
    (gameStatus[0] == 2 && gameStatus[1] == 2 && gameStatus[2] == 2) ||
    (gameStatus[0] == 2 && gameStatus[3] == 2 && gameStatus[6] == 2) ||
    (gameStatus[0] == 2 && gameStatus[4] == 2 && gameStatus[8] == 2) ||
    (gameStatus[2] == 2 && gameStatus[5] == 2 && gameStatus[8] == 2) ||
    (gameStatus[2] == 2 && gameStatus[4] == 2 && gameStatus[6] == 2) ||
    (gameStatus[1] == 2 && gameStatus[4] == 2 && gameStatus[7] == 2) ||
    (gameStatus[3] == 2 && gameStatus[4] == 2 && gameStatus[5] == 2) ||
    (gameStatus[6] == 2 && gameStatus[7] == 2 && gameStatus[8] == 2)
  ) {
    document.getElementById("message").innerHTML = "You Lose!";
    enableClick = false;
    setTimeout(() => {
      location.href = "/";
    }, 2000);
  } else if (moves === 9) {
    document.getElementById("message").innerHTML = "It's Draw!";
    setTimeout(() => {
      location.href = "/";
    }, 2000);
  }
});

socket.on("full-room", () => {
  document.getElementById("message").innerHTML = "Room FUll..";
  setTimeout(() => {
    location.href = "/";
  }, 2000);
});

socket.on("user-disconnected", () => {
  document.getElementById("message").innerHTML = "player Disconnected ";
  setTimeout(() => {
    location.href = "/";
  }, 2000);
});
