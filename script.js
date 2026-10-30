var biggestIndex = 1;
var selectedIcon = undefined;
var startTime = Date.now();
var currentTrack = -1;
var isPlaying = false;

var notes = [
  {
    title: "Welcome",
    date: "10/30/2026",
    content: `
      <h3>Welcome to Notes</h3>
      <p>This is the Notes app for DJsOS. You can browse through different notes using the sidebar.</p>
      <p>Each note contains thoughts, ideas, or whatever comes to mind.</p>
      <p style="margin-top: 12px; opacity: 0.5; font-size: 12px;">Notes are stored locally in this session.</p>
    `
  },
  {
    title: "Poems",
    date: "10/28/2026",
    content: `
      <h3>Poems</h3>
      <p>Writing poems is like breathing — sometimes you do it without thinking, and sometimes you have to force it out when everything feels tight.</p>
      <p>The best ones come at 2 AM when you should be sleeping but your brain decided it has something important to say.</p>
      <p style="margin-top: 8px;"><em>silence tastes like cold water<br>after running too long<br>not refreshing — just necessary</em></p>
    `
  },
  {
    title: "Coding Notes",
    date: "10/25/2026",
    content: `
      <h3>Coding Notes</h3>
      <p>Things I keep forgetting:</p>
      <p>• CSS grid is not the enemy. flexbox is not always the answer.</p>
      <p>• Name variables like someone else has to read them at 3 AM.</p>
      <p>• If you copy-paste something three times, make it a function.</p>
      <p>• The bug is always in the part you didn't check.</p>
    `
  },
  {
    title: "Music Log",
    date: "10/22/2026",
    content: `
      <h3>Music Log</h3>
      <p>Tracks I've been listening to on repeat:</p>
      <p>• Stuff that hits different at night</p>
      <p>• Lo-fi beats for coding sessions</p>
      <p>• Random finds from YouTube rabbit holes</p>
      <p style="margin-top: 8px;">Music taste is subjective. Mine just happens to be objectively questionable.</p>
    `
  }
];

var playlist = [
  { title: "Late Night Coding", artist: "Lo-Fi Beats", duration: "3:42", freq: 220, type: "sine" },
  { title: "Digital Dreams", artist: "Synthwave", duration: "4:18", freq: 330, type: "sawtooth" },
  { title: "Quiet Hours", artist: "Ambient", duration: "5:01", freq: 174, type: "sine" },
  { title: "Neon Rain", artist: "Chillhop", duration: "3:55", freq: 261, type: "triangle" },
  { title: "Binary Sunset", artist: "Electronic", duration: "4:33", freq: 392, type: "square" }
];

var audioCtx = null;
var oscillator = null;
var gainNode = null;

function startAudio(track) {
  stopAudio();
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  oscillator = audioCtx.createOscillator();
  gainNode = audioCtx.createGain();

  oscillator.type = track.type;
  oscillator.frequency.setValueAtTime(track.freq, audioCtx.currentTime);
  gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);

  var lfo = audioCtx.createOscillator();
  var lfoGain = audioCtx.createGain();
  lfo.frequency.setValueAtTime(0.5, audioCtx.currentTime);
  lfoGain.gain.setValueAtTime(track.freq * 0.02, audioCtx.currentTime);
  lfo.connect(lfoGain);
  lfoGain.connect(oscillator.frequency);
  lfo.start();

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  oscillator.start();
}

function stopAudio() {
  if (oscillator) {
    oscillator.stop();
    oscillator = null;
  }
  if (audioCtx) {
    audioCtx.close();
    audioCtx = null;
  }
}

var terminalCommands = {
  help: function() {
    return "Available commands:\n  help     — show this message\n  about    — about DJsOS\n  date     — current date and time\n  uptime   — system uptime\n  echo     — repeat text\n  clear    — clear terminal\n  neofetch — system info\n  ls       — list desktop apps\n  whoami   — current user";
  },
  about: function() {
    return "DJsOS v1.0.0\nA web-based operating system built with HTML, CSS, and JS.\nMade by DJ.";
  },
  date: function() {
    return new Date().toLocaleString();
  },
  uptime: function() {
    var seconds = Math.floor((Date.now() - startTime) / 1000);
    var m = Math.floor(seconds / 60);
    var s = seconds % 60;
    var h = Math.floor(m / 60);
    m = m % 60;
    return "Uptime: " + h + "h " + m + "m " + s + "s";
  },
  clear: function() {
    return "__CLEAR__";
  },
  neofetch: function() {
    return "      ___      \n     /   \\     dj@djsos\n    | DJ  |    --------\n     \\___/     OS: DJsOS v1.0.0\n               Host: Browser\n               Kernel: JavaScript\n               Shell: Terminal v1.0\n               Theme: Dark Purple\n               Memory: Infinite";
  },
  ls: function() {
    return "Notes  Terminal  Music  About";
  },
  whoami: function() {
    return "dj";
  }
};

// Boot sequence
setTimeout(function() {
  var bootScreen = document.getElementById("bootScreen");
  bootScreen.style.opacity = "0";
  bootScreen.style.transition = "opacity 0.5s";
  setTimeout(function() {
    bootScreen.style.display = "none";
    document.getElementById("welcomeScreen").style.display = "flex";
  }, 500);
}, 2500);

document.getElementById("enterDesktop").addEventListener("click", function() {
  var ws = document.getElementById("welcomeScreen");
  ws.style.opacity = "0";
  ws.style.transition = "opacity 0.4s";
  setTimeout(function() {
    ws.style.display = "none";
    document.getElementById("desktop").style.display = "block";
    openWindow(document.getElementById("welcome"));
  }, 400);
});

// Clock
function updateTime() {
  var now = new Date();
  var timeStr = now.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
  document.getElementById("timeDisplay").textContent = timeStr;
}
updateTime();
setInterval(updateTime, 1000);

// Uptime
setInterval(function() {
  var el = document.getElementById("uptimeDisplay");
  if (el) {
    var seconds = Math.floor((Date.now() - startTime) / 1000);
    var m = Math.floor(seconds / 60);
    var s = seconds % 60;
    var h = Math.floor(m / 60);
    m = m % 60;
    el.textContent = h + "h " + m + "m " + s + "s";
  }
}, 1000);

// Drag functionality
function dragElement(element) {
  var initialX = 0;
  var initialY = 0;
  var currentX = 0;
  var currentY = 0;

  var header = document.getElementById(element.id + "header");
  if (header) {
    header.onmousedown = startDragging;
  } else {
    element.onmousedown = startDragging;
  }

  function startDragging(e) {
    e.preventDefault();
    initialX = e.clientX;
    initialY = e.clientY;
    document.onmouseup = stopDragging;
    document.onmousemove = drag;
  }

  function drag(e) {
    e.preventDefault();
    currentX = initialX - e.clientX;
    currentY = initialY - e.clientY;
    initialX = e.clientX;
    initialY = e.clientY;
    var newTop = element.offsetTop - currentY;
    var newLeft = element.offsetLeft - currentX;
    if (newTop < 0) newTop = 0;
    element.style.top = newTop + "px";
    element.style.left = newLeft + "px";
  }

  function stopDragging() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

// Window management
var topBar = document.getElementById("topBar");

function openWindow(element) {
  element.style.display = "flex";
  biggestIndex++;
  element.style.zIndex = biggestIndex;
  topBar.style.zIndex = biggestIndex + 1;
}

function closeWindow(element) {
  element.style.display = "none";
  if (element.id === "music" && isPlaying) {
    stopAudio();
    isPlaying = false;
    document.getElementById("playBtn").textContent = "▶";
    document.getElementById("musicDisc").classList.remove("spinning");
  }
}

function handleWindowTap(element) {
  biggestIndex++;
  element.style.zIndex = biggestIndex;
  topBar.style.zIndex = biggestIndex + 1;
  if (selectedIcon) {
    deselectIcon(selectedIcon);
  }
}

function initializeWindow(name) {
  var windowEl = document.getElementById(name);
  var closeBtn = document.getElementById(name + "close");

  dragElement(windowEl);

  closeBtn.addEventListener("click", function() {
    closeWindow(windowEl);
  });

  windowEl.addEventListener("mousedown", function() {
    handleWindowTap(windowEl);
  });
}

initializeWindow("welcome");
initializeWindow("notes");
initializeWindow("terminal");
initializeWindow("music");
initializeWindow("about");

// Icon selection
function selectIcon(element) {
  if (selectedIcon && selectedIcon !== element) {
    deselectIcon(selectedIcon);
  }
  element.classList.add("selected");
  selectedIcon = element;
}

function deselectIcon(element) {
  if (element) {
    element.classList.remove("selected");
    if (selectedIcon === element) {
      selectedIcon = undefined;
    }
  }
}

function setupIcon(iconId, windowId) {
  var icon = document.getElementById(iconId);
  var win = document.getElementById(windowId);

  icon.addEventListener("click", function() {
    if (icon.classList.contains("selected")) {
      deselectIcon(icon);
      openWindow(win);
    } else {
      selectIcon(icon);
    }
  });

  icon.addEventListener("dblclick", function() {
    openWindow(win);
  });
}

setupIcon("notesIcon", "notes");
setupIcon("terminalIcon", "terminal");
setupIcon("musicIcon", "music");
setupIcon("aboutIcon", "about");

// OS name opens welcome
document.getElementById("osName").addEventListener("click", function() {
  openWindow(document.getElementById("welcome"));
});

// Notes app
function setNotesContent(index) {
  var content = document.getElementById("notesContent");
  content.innerHTML = notes[index].content;

  var items = document.querySelectorAll(".note-item");
  items.forEach(function(item, i) {
    if (i === index) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
}

function populateNotesSidebar() {
  var sidebar = document.getElementById("notesSidebar");
  sidebar.innerHTML = "";

  for (var i = 0; i < notes.length; i++) {
    var div = document.createElement("div");
    div.className = "note-item";
    div.innerHTML = '<p class="note-item-title">' + notes[i].title + '</p><p class="note-item-date">' + notes[i].date + '</p>';
    div.addEventListener("click", (function(index) {
      return function() { setNotesContent(index); };
    })(i));
    sidebar.appendChild(div);
  }
}

populateNotesSidebar();

// Terminal
var terminalInput = document.getElementById("terminalInput");
var terminalOutput = document.getElementById("terminalOutput");

terminalInput.addEventListener("keydown", function(e) {
  if (e.key === "Enter") {
    var cmd = terminalInput.value.trim();
    terminalInput.value = "";

    if (cmd === "") return;

    var cmdLine = document.createElement("p");
    cmdLine.className = "terminal-line cmd";
    cmdLine.textContent = "dj@os:~$ " + cmd;
    terminalOutput.appendChild(cmdLine);

    var parts = cmd.split(" ");
    var command = parts[0].toLowerCase();
    var args = parts.slice(1).join(" ");

    var result;
    if (command === "echo") {
      result = args || "";
    } else if (terminalCommands[command]) {
      result = terminalCommands[command]();
    } else {
      result = "Command not found: " + command + ". Type 'help' for available commands.";
    }

    if (result === "__CLEAR__") {
      terminalOutput.innerHTML = "";
    } else {
      var lines = result.split("\n");
      lines.forEach(function(line) {
        var p = document.createElement("p");
        p.className = "terminal-line result";
        p.textContent = line;
        terminalOutput.appendChild(p);
      });
    }

    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }
});

document.getElementById("terminal").addEventListener("click", function() {
  terminalInput.focus();
});

// Music app
function populatePlaylist() {
  var container = document.getElementById("musicPlaylist");
  container.innerHTML = "";

  for (var i = 0; i < playlist.length; i++) {
    var div = document.createElement("div");
    div.className = "playlist-item" + (i === currentTrack ? " active" : "");
    div.innerHTML = '<span class="playlist-item-title">' + playlist[i].title + ' — ' + playlist[i].artist + '</span><span class="playlist-item-duration">' + playlist[i].duration + '</span>';
    div.addEventListener("click", (function(index) {
      return function() { selectTrack(index); };
    })(i));
    container.appendChild(div);
  }
}

function selectTrack(index) {
  currentTrack = index;
  document.getElementById("musicTitle").textContent = playlist[index].title;
  document.getElementById("musicArtist").textContent = playlist[index].artist;
  isPlaying = true;
  document.getElementById("playBtn").textContent = "⏸";
  document.getElementById("musicDisc").classList.add("spinning");
  startAudio(playlist[index]);
  populatePlaylist();
}

document.getElementById("playBtn").addEventListener("click", function() {
  if (currentTrack === -1) {
    selectTrack(0);
    return;
  }
  isPlaying = !isPlaying;
  this.textContent = isPlaying ? "⏸" : "▶";
  var disc = document.getElementById("musicDisc");
  if (isPlaying) {
    disc.classList.add("spinning");
    startAudio(playlist[currentTrack]);
  } else {
    disc.classList.remove("spinning");
    stopAudio();
  }
});

document.getElementById("prevBtn").addEventListener("click", function() {
  if (playlist.length === 0) return;
  var idx = currentTrack <= 0 ? playlist.length - 1 : currentTrack - 1;
  selectTrack(idx);
});

document.getElementById("nextBtn").addEventListener("click", function() {
  if (playlist.length === 0) return;
  var idx = currentTrack >= playlist.length - 1 ? 0 : currentTrack + 1;
  selectTrack(idx);
});

populatePlaylist();

// Click on desktop to deselect icons
document.getElementById("desktop").addEventListener("click", function(e) {
  if (e.target === this || e.target.id === "desktopApps") {
    if (selectedIcon) {
      deselectIcon(selectedIcon);
    }
  }
});
