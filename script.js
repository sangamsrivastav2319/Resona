// ELEMENTS
const dateSpan = document.getElementById("current-date");
const saveBtn = document.getElementById("save-btn");
const songUpload = document.getElementById("song-upload");
const audioPlayer = document.getElementById("daily-audio");
const historyList = document.getElementById("history-list");

const morning = document.getElementById("morning");
const day = document.getElementById("day");
const night = document.getElementById("night");

// DATE
const today = new Date();
const dateKey = "Resona-" + today.toISOString().split("T")[0];
const songKey = "Resona-song-" + today.toISOString().split("T")[0];

dateSpan.innerText = today.toLocaleDateString("en-IN", {
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric"
});

// AUTO RESIZE TEXTAREA
document.querySelectorAll("textarea").forEach(t => {
  t.addEventListener("input", () => {
    t.style.height = "auto";
    t.style.height = t.scrollHeight + "px";
  });
});

// SONG UPLOAD
songUpload.addEventListener("change", () => {
  const file = songUpload.files[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  audioPlayer.src = url;
  localStorage.setItem(songKey, url);
});

// SAVE JOURNAL
saveBtn.addEventListener("click", () => {
  const data = {
    morning: morning.value,
    day: day.value,
    night: night.value
  };

  localStorage.setItem(dateKey, JSON.stringify(data));
  alert("Saved ✨");

  lockToday();
  loadHistory();
});

// LOAD SAVED DATA
const savedData = localStorage.getItem(dateKey);
if (savedData) {
  const data = JSON.parse(savedData);
  morning.value = data.morning || "";
  day.value = data.day || "";
  night.value = data.night || "";
  lockToday();
}

// LOAD SONG
const savedSong = localStorage.getItem(songKey);
if (savedSong) {
  audioPlayer.src = savedSong;
}

// LOCK TODAY
function lockToday() {
  document.querySelectorAll("textarea").forEach(t => t.disabled = true);
  songUpload.disabled = true;
  songUpload.style.display = "none";
}

// HISTORY
function loadHistory() {
  historyList.innerHTML = "";

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith("Resona-") && !key.includes("song")) {
      const date = key.replace("Resona-", "");
      const li = document.createElement("li");
      li.innerText = new Date(date).toDateString();
      li.onclick = () => loadDay(key);
      historyList.appendChild(li);
    }
  }
}

function loadDay(key) {
  const data = JSON.parse(localStorage.getItem(key));
  if (!data) return;

  morning.value = data.morning || "";
  day.value = data.day || "";
  night.value = data.night || "";

  document.querySelectorAll("textarea").forEach(t => t.disabled = true);
}

loadHistory();
document.getElementById("reset-btn").addEventListener("click", () => {
  localStorage.clear();
  location.reload();
});
