document.addEventListener('DOMContentLoaded', function () {
    const timerForm = document.getElementById('timerForm');
    const addTimerButton = document.getElementById('addTimer');
    const timerDisplay = document.getElementById('timerDisplay');
    const startPauseButton = document.getElementById('startPause');
    const resetButton = document.getElementById('reset');
    let timers = [];
    let currentTimerIndex = 0;
    let timerInterval;
    let isPaused = false;

    function addTimerRow() {
        const newRow = document.createElement('div');
        newRow.innerHTML = `
            <input type="text" name="name" placeholder="Timer Name" required>
            <input type="number" name="duration" placeholder="Seconds" required>
        `;
        timerForm.insertBefore(newRow, addTimerButton.parentNode);
    }

    function validateTimers() {
        let isValid = true;
        const timerRows = timerForm.querySelectorAll('div:not(:last-child)');
        timerRows.forEach(row => {
            const durationInput = row.querySelector('input[name="duration"]');
            const nameInput = row.querySelector('input[name="name"]');
            if (nameInput.value.trim() === '') {
                nameInput.style.border = '2px solid red';
                isValid = false;
            } else {
                 nameInput.style.border = '';
            }
            if (durationInput) {
                const duration = parseInt(durationInput.value);
                if (isNaN(duration) || duration < 0 ) {
                    durationInput.style.border = '2px solid red';
                    isValid = false;
                } else {
                    durationInput.style.border = '';
                }
            }
        });
        return isValid;
    }

    function loadTimers() {
        timers = [];
        const timerRows = timerForm.querySelectorAll('div:not(:last-child)');
        timerRows.forEach(row => {
            const nameInput = row.querySelector('input[name="name"]');
            const durationInput = row.querySelector('input[name="duration"]');
            if (nameInput.value.trim() !== '' && durationInput.value.trim() !== '') {
                const name = nameInput.value;
                const duration = parseInt(durationInput.value);
                timers.push({ name, duration });
            }
        });
    }
    
    function startTimer() {
        loadTimers();
        if (timers.length > 0){
            if (!validateTimers()) {
                return;
            }
        }else{return;}
        if (currentTimerIndex < timers.length) {
            let currentTimer = { ...timers[currentTimerIndex] };
            timerDisplay.textContent = `${currentTimer.name}: ${currentTimer.duration} seconds`;
            timerInterval = setInterval(() => {
                if (!isPaused) {
                    currentTimer.duration--;
                    timerDisplay.textContent = `${currentTimer.name}: ${currentTimer.duration} seconds`;
                    if (currentTimer.duration <= 0) {
                        clearInterval(timerInterval);
                        new Audio('data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=').play();
                        currentTimerIndex++;
                        startTimer();
                    }
                }
            }, 1000);
            startPauseButton.textContent = 'Pause';
        } else {
            currentTimerIndex = 0;
            startPauseButton.textContent = 'Start';
        }
    }

    function resetTimer() {
        clearInterval(timerInterval);
        currentTimerIndex = 0;
        timerDisplay.textContent = '';
        startPauseButton.textContent = 'Start';
        isPaused = false;
        const timerRows = timerForm.querySelectorAll('div:not(:last-child)');
        timerRows.forEach(row => {
            const durationInput = row.querySelector('input[name="duration"]');
            durationInput.style.border = '';
        });
    }

    addTimerButton.addEventListener('click', addTimerRow);
    startPauseButton.addEventListener('click', () => {
        if (startPauseButton.textContent === 'Start') {
            startTimer();
        } else if (startPauseButton.textContent === 'Pause') {
            isPaused = true;
            startPauseButton.textContent = 'Resume';
        }else{
            isPaused = false;
            startPauseButton.textContent = 'Pause';
        }
    });
    resetButton.addEventListener('click', resetTimer);
});