// TypeScript version of Pomodoro timer logic

type Mode = 'pomodoro' | 'short-break' | 'long-break';

const pomodoroBtns = document.querySelectorAll<HTMLButtonElement>('.pomodoro, .short-break, .long-break');
let timerInterval: number | undefined;
let timeLeft: number = 1500; // default Pomodoro 25:00
let isRunning: boolean = false;

function setTimeByMode(mode: Mode): number {
    if (mode === 'pomodoro') return 1500;
    if (mode === 'short-break') return 300;
    if (mode === 'long-break') return 600;
    return 1500;
}

function formatTime(sec: number): string {
    const m = String(Math.floor(sec / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    return `${m}:${s}`;
}

function updateTimerDisplay(sec: number): void {
    const timerP = document.querySelector<HTMLParagraphElement>('.timer p');
    if (timerP) timerP.textContent = formatTime(sec);
}

// Set initial timer display
updateTimerDisplay(timeLeft);

// Set default active selection to pomodoro
const pomodoroBtn = document.querySelector<HTMLButtonElement>('.pomodoro');
if (pomodoroBtn) pomodoroBtn.classList.add('active');

pomodoroBtns.forEach(btn => {
    btn.addEventListener('click', function (this: HTMLButtonElement) {
        pomodoroBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        // เปลี่ยน timer ตามปุ่มที่เลือก
        let mode: Mode = this.classList.contains('pomodoro') ? 'pomodoro'
            : this.classList.contains('short-break') ? 'short-break'
            : 'long-break';
        timeLeft = setTimeByMode(mode);
        updateTimerDisplay(timeLeft);
        if (timerInterval !== undefined) clearInterval(timerInterval);
    });
});

const startBtn = document.querySelector<HTMLButtonElement>('.start');
if (startBtn) {
    startBtn.addEventListener('click', function (this: HTMLButtonElement) {
        if (isRunning) {
            if (timerInterval !== undefined) clearInterval(timerInterval);
            isRunning = false;
            this.textContent = 'Start';
            this.classList.remove('active');
        } else {
            timerInterval = window.setInterval(() => {
                if (timeLeft > 0) {
                    timeLeft--;
                    updateTimerDisplay(timeLeft);
                } else {
                    if (timerInterval !== undefined) clearInterval(timerInterval);
                    isRunning = false;
                    this.textContent = 'Start';
                    this.classList.remove('active');
                }
            }, 1000);
            isRunning = true;
            this.textContent = 'Pause';
            this.classList.add('active');
        }
    });
}

const resetBtn = document.querySelector<HTMLButtonElement>('.reset');
if (resetBtn) {
    resetBtn.addEventListener('click', function () {
        if (timerInterval !== undefined) clearInterval(timerInterval);
        isRunning = false;
        // หาโหมดที่ active
        const activeBtn = document.querySelector<HTMLButtonElement>('.pomodoro.active, .short-break.active, .long-break.active');
        let mode: Mode = activeBtn?.classList.contains('pomodoro') ? 'pomodoro'
            : activeBtn?.classList.contains('short-break') ? 'short-break'
            : 'long-break';
        timeLeft = setTimeByMode(mode);
        updateTimerDisplay(timeLeft);
        if (startBtn) {
            startBtn.textContent = 'Start';
            startBtn.classList.remove('active');
        }
        // เพิ่ม animation หมุน
        const resetImg = document.querySelector<HTMLImageElement>('.reset img');
        if (resetImg) {
            resetImg.classList.add('rotating');
            setTimeout(() => resetImg.classList.remove('rotating'), 700);
        }
    });
}

const fullscreenBtn = document.querySelector<HTMLButtonElement>('.fullscreen-btn');
if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', function () {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    });
}

const musicControlBtn = document.querySelector<HTMLButtonElement>('.music-controls button');
if (musicControlBtn) {
    musicControlBtn.addEventListener('click', function () {
        const iframe = document.querySelector<HTMLElement>('.bottomleft .music-frame');
        if (!iframe) return;
        if (iframe.classList.contains('collapsed')) {
            iframe.classList.remove('collapsed');
        } else {
            iframe.classList.add('collapsed');
        }
    });
}
