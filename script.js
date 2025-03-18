document.addEventListener('DOMContentLoaded', function () {
    const timerForm = document.getElementById('timerForm');
    const timerRowsContainer = document.getElementById('timerRows');
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
        const index = timerRowsContainer.children.length;
        newRow.innerHTML = `
            <input type="text" name="name" placeholder="Timer Name" required>
            <input type="number" name="duration" placeholder="Seconds" required>
        `;
        
        if (index > 0) {
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'x';
            deleteButton.addEventListener('click', function() {
                timerRowsContainer.removeChild(newRow);
                 updateRowIndices();
            });
            newRow.appendChild(deleteButton);
        }
        timerRowsContainer.appendChild(newRow);
    }
    function updateRowIndices() {
        
    }

    function validateTimers() {
        let isValid = true;
        const timerRows = Array.from(timerRowsContainer.children);
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
        const timerRows = Array.from(timerRowsContainer.children);
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
    
    function beep(duration, frequency, volume) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
      
        oscillator.connect(gain);
        gain.connect(audioContext.destination);
      
        oscillator.type = 'sine'; // You can change this to 'square', 'triangle', or 'sawtooth'
        oscillator.frequency.setValueAtTime(frequency || 440, audioContext.currentTime); // Default to 440Hz (A4)
        gain.gain.setValueAtTime(volume || 0.5, audioContext.currentTime); // Default to 0.5 volume
      
        oscillator.start();
        oscillator.stop(audioContext.currentTime + (duration || 0.5)); // Default to 0.5 seconds
      
        // Handle browser compatibility for older browsers
        if (!window.AudioContext) {
          console.warn("Web Audio API is not supported in this browser.");
        }
    }

    function startTimer() {
         loadTimers();
         if (!validateTimers()) {
             return;
         }        
        
        if (currentTimerIndex < timers.length) {            
             let currentTimer = { ...timers[currentTimerIndex] };
            timerDisplay.textContent = `${currentTimer.name}: ${currentTimer.duration} seconds`;
            timerInterval = setInterval(() => {
                if (!isPaused) {
                    currentTimer.duration--;
                    timerDisplay.textContent = `${currentTimer.name}: ${currentTimer.duration} seconds`;
                    if (currentTimer.duration <= 0) {
                        beep(0.3, 500, 1);
                        clearInterval(timerInterval);
                        currentTimerIndex++;
                        startTimer();
                    }
                }
            }, 1000);
            startPauseButton.textContent = 'Pause';
        } else {
            new Audio('data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=').play();
            currentTimerIndex = 0;
            timers = []
            startPauseButton.textContent = 'Start';
        }
    }

    function resetTimer() {
        clearInterval(timerInterval);
        currentTimerIndex = 0;
        timerDisplay.textContent = '';
        startPauseButton.textContent = 'Start';
        isPaused = false;
        const timerRows = timerForm.querySelectorAll('div');
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