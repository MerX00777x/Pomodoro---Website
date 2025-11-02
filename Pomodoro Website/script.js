"use strict";
const pomodoroBtns = document.querySelectorAll(
  ".pomodoro, .short-break, .long-break"
);
let timerInterval;
let timeLeft = 1500; // ค่าเริ่มต้น Pomodoro 25:00
let isRunning = false;
let currentMode = "pomodoro"; // โหมดปัจจุบัน

// ที่เก็บการตั้งค่า Deafault ของเวลา
let settings = {
  pomodoro: 1500,
  shortBreak: 300,
  longBreak: 600,
};

// เก็บเวลาเหลือของแต่ละโหมด
let modeTimers = {
  pomodoro: 1500,
  shortBreak: 300,
  longBreak: 600,
};

function setTimeByMode(mode) {
  // ตั้งค่าเวลาโดยอิงจาก mode เอาค่าเวลาจาก let settings
  if (mode === "pomodoro") return settings.pomodoro;
  if (mode === "short-break") return settings.shortBreak;
  if (mode === "long-break") return settings.longBreak;
  return settings.pomodoro; // ค่า Default
}

function formatTime(sec) {
  // แปลงวินาทีเป็นรูปแบบ นาที:วินาที
  const m = String(Math.floor(sec / 60)).padStart(2, "0"); // Math.floor ปัดเศษลง เอาวินาทีหาร 60 .padStart เติม 0 ข้างหน้าให้ครบ 2 หลัก
  const s = String(sec % 60).padStart(2, "0"); // เอาเศษวินาทีจากการหาร 60 มาแปลงเป็นสตริงและเติม 0 ข้างหน้าให้ครบ 2 หลัก
  return `${m}:${s}`; // แสดงค่าของ m และ s
}

function updateTimerDisplay(sec) {
  // อัปเดตการแสดงผล timer
  const timerP = document.querySelector(".timer p"); // เลือก tag p ที่อยู่ใน div ที่มี class timer
  if (timerP) timerP.textContent = formatTime(sec); // นำค่าที่ได้จากฟังก์ชัน formatTime มาแสดงผล
}
updateTimerDisplay(timeLeft); // เรียกใช้ฟังก์ชันเพื่อแสดงผลค่าเริ่มต้น

const pomodoroBtn = document.querySelector(".pomodoro"); // สร้างตัวแปรก เลือกปุ่ม Pomodoro
if (pomodoroBtn) pomodoroBtn.classList.add("active"); // ตั้งค่าเริ่มต้นให้ปุ่ม Pomodoro เป็นปุ่มที่ active

pomodoroBtns.forEach((btn) => {
  // เพิ่ม event ให้กับปุ่มแต่ละปุ่ม
  btn.addEventListener("click", function () {
    pomodoroBtns.forEach((b) => b.classList.remove("active")); // ลบ class active ออกจากปุ่มทั้งหมด
    this.classList.add("active"); // เพิ่ม class active ให้กับปุ่มที่ถูกคลิก

    // หยุด timer ก่อนเปลี่ยนโหมด
    if (timerInterval !== undefined) clearInterval(timerInterval);
    isRunning = false;

    // เปลี่ยนโหมดปัจจุบัน
    currentMode = this.classList.contains("pomodoro")
      ? "pomodoro"
      : this.classList.contains("short-break")
      ? "short-break"
      : "long-break";

    // เปลี่ยนเวลาตามโหมดใหม่
    timeLeft = modeTimers[currentMode] || setTimeByMode(currentMode);
    updateTimerDisplay(timeLeft);

    // รีเซ็ตปุ่ม start
    const startBtn = document.querySelector(".start");
    if (startBtn) {
      startBtn.textContent = "Start";
      startBtn.classList.remove("active");
    }
  });
});

const startBtn = document.querySelector(".start");
if (startBtn) {
  startBtn.addEventListener("click", function () {
    if (isRunning) {
      if (timerInterval !== undefined) clearInterval(timerInterval);
      isRunning = false;
      this.textContent = "Start";
      this.classList.remove("active");
      // บันทึกเวลาเหลือก่อนหยุด
      modeTimers[currentMode] = timeLeft;
    } else {
      timerInterval = window.setInterval(() => {
        if (timeLeft > 0) {
          timeLeft--;
          // บันทึกเวลาเหลือของโหมดปัจจุบันที่กำลังทำงาน
          modeTimers[currentMode] = timeLeft;
          updateTimerDisplay(timeLeft);
        } else {
          if (timerInterval !== undefined) clearInterval(timerInterval);
          isRunning = false;
          this.textContent = "Start";
          this.classList.remove("active");
        }
      }, 1000);
      isRunning = true;
      this.textContent = "Pause";
      this.classList.add("active");
    }
  });
}

const resetBtn = document.querySelector(".reset");
if (resetBtn) {
  resetBtn.addEventListener("click", function () {
    if (timerInterval !== undefined) clearInterval(timerInterval);
    isRunning = false;
    // หาโหมดที่ทำงานอยู่
    const activeBtn = document.querySelector(
      ".pomodoro.active, .short-break.active, .long-break.active"
    );
    let mode = (
      activeBtn === null || activeBtn === void 0
        ? void 0
        : activeBtn.classList.contains("pomodoro")
    )
      ? "pomodoro"
      : (
          activeBtn === null || activeBtn === void 0
            ? void 0
            : activeBtn.classList.contains("short-break")
        )
      ? "short-break"
      : "long-break";

    currentMode = mode;
    timeLeft = setTimeByMode(mode);
    modeTimers[mode] = timeLeft; // รีเซ็ตเวลาของโหมดปัจจุบัน
    updateTimerDisplay(timeLeft);
    if (startBtn) {
      startBtn.textContent = "Start";
      startBtn.classList.remove("active");
    }
    // เพิ่มแอนิเมชันการหมุน
    const resetImg = document.querySelector(".reset img");
    if (resetImg) {
      resetImg.classList.add("rotating");
      setTimeout(() => resetImg.classList.remove("rotating"), 700);
    }
  });
}
const fullscreenBtn = document.querySelector(".fullscreen-btn");
if (fullscreenBtn) {
  fullscreenBtn.addEventListener("click", function () {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  });
}
const musicControlBtn = document.querySelector(".music-controls button");
if (musicControlBtn) {
  musicControlBtn.addEventListener("click", function () {
    const iframe = document.querySelector(".bottomleft .music-frame");
    if (!iframe) return;
    if (iframe.classList.contains("collapsed")) {
      iframe.classList.remove("collapsed");
    } else {
      iframe.classList.add("collapsed");
    }
  });
}
// ฟังก์ชันการทำงานของหน้าต่างตั้งค่า
const modal = document.getElementById("settings-modal");
const settingsBtn = document.querySelector(".settings");
const closeBtn = document.querySelector(".close");
const saveSettingsBtn = document.querySelector(".save-settings");

// ป้องกันการใส่ค่าติดลบ
const pomodoroInput = document.getElementById("pomodoro-time");
const shortBreakInput = document.getElementById("short-break-time");
const longBreakInput = document.getElementById("long-break-time");

[pomodoroInput, shortBreakInput, longBreakInput].forEach((input) => {
  input.addEventListener("change", function () {
    if (this.value < 1) {
      alert("กรุณาใส่ตัวเลขที่ไม่ติดลบ (ตัวเลขต้องมากกว่า 0)");
      this.value = this.defaultValue;
    }
  });

  input.addEventListener("keydown", function (e) {
    if (e.key === "-" || e.key === "+") {
      e.preventDefault();
    }
  });
});

// เปิดหน้าต่างตั้งค่าเมื่อคลิกปุ่มตั้งค่า
settingsBtn.addEventListener("click", () => {
  modal.style.display = "block";
});

// ปิดหน้าต่างเมื่อคลิก X
closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

// ปิดหน้าต่างเมื่อคลิกนอกเนื้อหาของหน้าต่าง
window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

// บันทึกการตั้งค่าและนำไปใช้
saveSettingsBtn.addEventListener("click", () => {
  let pomodoroTime = parseInt(pomodoroInput.value) || 25;
  let shortBreakTime = parseInt(shortBreakInput.value) || 5;
  let longBreakTime = parseInt(longBreakInput.value) || 15;

  // ตรวจสอบว่าค่าติดลบหรือเป็น 0
  if (pomodoroTime < 1) {
    alert("กรุณาใส่ตัวเลขที่ไม่ติดลบสำหรับ Pomodoro (ต้องมากกว่า 0)");
    pomodoroInput.focus();
    return;
  }
  if (shortBreakTime < 1) {
    alert("กรุณาใส่ตัวเลขที่ไม่ติดลบสำหรับ Short Break (ต้องมากกว่า 0)");
    shortBreakInput.focus();
    return;
  }
  if (longBreakTime < 1) {
    alert("กรุณาใส่ตัวเลขที่ไม่ติดลบสำหรับ Long Break (ต้องมากกว่า 0)");
    longBreakInput.focus();
    return;
  }

  // แปลงนาทีเป็นวินาทีและเก็บในการตั้งค่า
  settings.pomodoro = pomodoroTime * 60;
  settings.shortBreak = shortBreakTime * 60;
  settings.longBreak = longBreakTime * 60;

  console.log("บันทึกการตั้งค่า:", {
    pomodoroTime,
    shortBreakTime,
    longBreakTime,
  });

  // อัปเดต modeTimers ให้เท่ากับค่าใหม่
  modeTimers.pomodoro = settings.pomodoro;
  modeTimers.shortBreak = settings.shortBreak;
  modeTimers.longBreak = settings.longBreak;

  // หยุด timer และรีเซ็ตการแสดงผล
  if (timerInterval !== undefined) clearInterval(timerInterval);
  isRunning = false;

  // อัปเดต timeLeft ตามโหมดที่ทำงานอยู่
  const activeBtn = document.querySelector(
    ".pomodoro.active, .short-break.active, .long-break.active"
  );
  let mode = activeBtn?.classList.contains("pomodoro")
    ? "pomodoro"
    : activeBtn?.classList.contains("short-break")
    ? "short-break"
    : "long-break";

  currentMode = mode;
  timeLeft = setTimeByMode(mode);
  updateTimerDisplay(timeLeft);

  // รีเซ็ตปุ่ม start
  const startBtn = document.querySelector(".start");
  if (startBtn) {
    startBtn.textContent = "Start";
    startBtn.classList.remove("active");
  }

  modal.style.display = "none";
});
