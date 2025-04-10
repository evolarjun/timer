document.addEventListener('DOMContentLoaded', function () {
    // Get references to form, container, button and display elements
    const timerForm = document.getElementById('timerForm');
    const timerRowsContainer = document.getElementById('timerRows');
    const copyURLButton = document.getElementById('copyURL');
    const timerDisplay = document.getElementById('timerDisplay');
    const startPauseButton = document.getElementById('startPause');
    const resetButton = document.getElementById('reset');
    
    // Initialize variables for managing timers
    let timers = [];
    let currentTimerIndex = 0;
    let timerInterval;
    let isPaused = false;
    
    // Function to remove a specific timer row from the container
    function removeTimerRow(index) {
        // Convert the children of timerRowsContainer to an array
        const timerRows = Array.from(timerRowsContainer.children);
        if (index >= 0 && index < timerRows.length) {
            // Remove the timer row at the specified index
            timerRowsContainer.removeChild(timerRows[index]);            
            updateRowIndices();
            updateSummary();           
        }    }

    // Function to update the index data attribute of each timer row for identification
    function updateRowIndices() {
        // Convert the children of the timerRowsContainer to an array
        const timerRows = Array.from(timerRowsContainer.children);
        timerRows.forEach((row, index) => {
            // Set the data-index attribute to the current index for identification
            row.dataset.index = index;
        }); 
    }
    
    /**
     * Adds a new timer row to the timer rows container.
     *
     * It creates a new timer row element using the createTimerRow function,
     * appends it to the timer rows container, and then updates the indices
     * of all rows to ensure they are correctly numbered.
     */
    function addEventListeners(newRow){

        newRow.querySelectorAll('.timer-inputs input[name="name"]').forEach(input => {
            input.addEventListener('blur', updateSummary);
       });
        newRow.querySelectorAll('.timer-inputs input[name="duration"]').forEach(input => {
             input.addEventListener('blur', updateSummary);
        });
    }
    function addTimerRow() {
        const row = createTimerRow();
        addEventListeners(row);
        timerRowsContainer.insertBefore(row, timerRowsContainer.lastChild);
        updateSummary();
    }

    /** 
     * Creates a new timer row element.
     *
     * This function generates a new div element containing input fields for
     * the timer's name and duration. It also includes a delete button for
     * removing the row, except for the first row.
     *
     * @param {string} [name=''] - The default name for the timer.
     * @param {string} [duration=''] - The default duration for the timer.
     * @returns {HTMLDivElement} The newly created timer row element.
     */
    function createTimerRow(name = '', duration = '') {
        // Create a new div element to represent a timer row
        const newRow = document.createElement('div');

        // Get the current number of rows to use as the index
        newRow.classList.add('timer-row');
        const index = timerRowsContainer.children.length;
        
        // Define the HTML structure for the new row, including input fields for the timer's name and duration
        //Create a timer-controls div.
        const timerControls = document.createElement('div');
        timerControls.classList.add('timer-controls');

        
        newRow.innerHTML = `
        <div class="timer-inputs">


            <input type="text" name="name" placeholder="Timer Name" value="${name}" required>
            <input type="number" name="duration" placeholder="Seconds" value="${duration}" required> 
        </div>                                
                       
        `;        

        const addTimerButton = document.createElement('button');
        addTimerButton.textContent = '+';
        addTimerButton.classList.add('add-timer-button');
        timerControls.appendChild(addTimerButton);


        addTimerButton.addEventListener('click', function () {
            const rowIndex = parseInt(newRow.dataset.index);
            const row = createTimerRow();
            timerRowsContainer.insertBefore(row, newRow.nextSibling);
            updateRowIndices();
            updateSummary();
        });

        const removeTimerButton = document.createElement('button');
        removeTimerButton.classList.add('remove-timer-button');
        removeTimerButton.textContent = "x";
        timerControls.appendChild(removeTimerButton);

        newRow.appendChild(timerControls);
        // Set a data attribute to identify this row by index
        newRow.setAttribute('data-index', index);
        // Add a click listener to delete the row when the delete button is clicked
        const deleteButton = newRow.querySelector('.remove-timer-button');

        deleteButton.addEventListener('click', function () {
            
            const rowIndex = parseInt(newRow.dataset.index);
            //Only allow the removeTimerRow function to be called if there are more than one row.
            if (timerRowsContainer.children.length > 1) {
                removeTimerRow(rowIndex);
            }
            updateSummary();
        });

        return newRow;        
    }
    
    /**
     * Validates the timer data in each row of the timer rows container.
     *
     * This function checks if the name and duration fields in each timer row
     * are filled correctly. It sets the border to red for any invalid inputs
     * and returns a boolean indicating whether all timers are valid.
     *
     * @returns {boolean} True if all timers are valid, false otherwise.
     */
    function validateTimers() {
        let isValid = true;
        // Convert the children of the timer rows container into an array
        const timerRows = Array.from(timerRowsContainer.children);
        timerRows.forEach(row => {
            // Find the duration and name input fields in the current row element
            const durationInput = row.querySelector('input[name="duration"]');
            const nameInput = row.querySelector('input[name="name"]');
            // Validate the name input field
            if (nameInput.value.trim() === '') {
                // Set a red border if the name input is empty and mark as invalid
                nameInput.style.border = '2px solid red';
                isValid = false;
            } else {
                // Clear the border if the name input is valid
                nameInput.style.border = '';
            }
            // Check if the duration input exists
            if (durationInput) {                
                const duration = parseInt(durationInput.value);
                if (isNaN(duration) || duration < 0 ) { // Check if the duration is not a number or less than 0
                    durationInput.style.border = '2px solid red';
                    isValid = false;
                } else {
                    durationInput.style.border = '';
                }
            }
        });
        return isValid;
    }
    
    /**
     * Loads timer data from the timer rows container.
     *
     * This function reads the timer name and duration from each timer row,
     * validates them, and stores them in the timers array.
     * It also updates the URL to reflect the loaded timers.
     */
    function loadTimers() {
        // Clear the existing timers array
        timers = [];
        // Convert the timer rows container's children into an array
        const timerRows = Array.from(timerRowsContainer.children);
        timerRows.forEach(row => {
            // Get the name and duration inputs from the current row
            const nameInput = row.querySelector('input[name="name"]');
            const durationInput = row.querySelector('input[name="duration"]');
            // If both name and duration fields are filled, add the timer to the timers array
            if (nameInput.value.trim() !== '' && durationInput.value.trim() !== '') {
                const name = nameInput.value;
                const duration = parseInt(durationInput.value);
                timers.push({ name, duration });
            }
        });
        updateURL();
    }

    /**
     * Auto generated ring bell function
     */
    function ringBell() {
        const audio = new Audio("bell.mp3");
        
        audio.addEventListener('loadeddata', () => {
          // Audio is loaded and ready to play
          audio.play();
        });
      
        audio.addEventListener('error', (error) => {
          console.error('Error loading audio:', error);
        });      
    }

    /**
     * Generates a beep sound of a specified duration, frequency, and volume.
     *
     * This function uses the Web Audio API to create and play a beep sound,
     * allowing customization of the sound's characteristics.
     *
     * @param {number} [duration=0.5] - The duration of the beep in seconds.
     * @param {number} [frequency=440] - The frequency of the beep in Hz.
     * @param {number} [volume=0.5] - The volume of the beep (0.0 to 1.0).
     */
    function beep(duration, frequency, volume) {
        // Create a new audio context to handle audio operations
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        // Create an oscillator node, which will produce the sound
        const oscillator = audioContext.createOscillator();
        // Create a gain node to control the volume
        const gain = audioContext.createGain();
        // Connect the oscillator to the gain node, and the gain node to the audio context's destination
        oscillator.connect(gain);
        gain.connect(audioContext.destination);
        // Set the type of wave to be produced (sine wave in this case)
        oscillator.type = 'sine';
        // Set the frequency of the oscillator (default: 440Hz, A4 note)
        oscillator.frequency.setValueAtTime(frequency || 440, audioContext.currentTime);
        // Set the volume of the gain node (default: 0.5)
        gain.gain.setValueAtTime(volume || 0.5, audioContext.currentTime);
        // Start the oscillator
        oscillator.start();
        // Stop the oscillator after the specified duration (default: 0.5 seconds)
        oscillator.stop(audioContext.currentTime + (duration || 0.5));
        // Check for browser compatibility with older browsers
        if (!window.AudioContext) {
          console.warn("Web Audio API is not supported in this browser.");
        }
    }
    /**
     * Starts the timer countdown.
     *
     * This function loads the timers, validates them, and then starts the
     * countdown for each timer in sequence.
     */
    function startTimer() {
         loadTimers();
         if (!validateTimers()) {
             return;
         }        
        
        if (currentTimerIndex < timers.length) {            
            // Get a copy of the current timer
             let currentTimer = { ...timers[currentTimerIndex] };
            // Display the timer's name and remaining duration
            timerDisplay.textContent = `${currentTimer.name}: ${currentTimer.duration} seconds`;
            // Set up an interval to update the timer every second
            timerInterval = setInterval(() => {
                if (!isPaused) { // Check if the timer is not paused
                    // Check if the timer duration is less than 0
                    if (currentTimer.duration < 0) {
                        // Set the duration to 0 and update the display
                        currentTimer.duration = 0;
                        timerDisplay.textContent = `${currentTimer.name}: ${currentTimer.duration} seconds`;
                    }

                    currentTimer.duration--;
                    timerDisplay.textContent = `${currentTimer.name}: ${currentTimer.duration} seconds`;
                    if (currentTimer.duration <= 0) {
                        // beep(0.3, 500, 1);
                        ringBell();
                        clearInterval(timerInterval);
                        currentTimerIndex++;
                        startTimer();                        
                    }
                }
            }, 1000);            
            startPauseButton.textContent = 'Pause';
        } else {
            new Audio('data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=').play();
            // Reset variables to default values
            currentTimerIndex = 0;
            timers = []
            startPauseButton.textContent = 'Start';
            timerDisplay.textContent = `Done!`
        }
    }

    function resetTimer() {        
        // ... (existing code)
        /**
         * Resets the timer to its initial state.
         * This function stops the timer interval, resets the current timer index,
         * clears the timer display, and resets the start/pause button.
         */        
        clearInterval(timerInterval);
        currentTimerIndex = 0;
        timerDisplay.textContent = '';
        startPauseButton.textContent = 'Start';
        isPaused = false;
        Array.from(timerRowsContainer.children).forEach(row => {
            row.querySelectorAll('input').forEach(input => {
                input.style.border = '';
            });
        });

        updateSummary();
    }    

    const clearAllButton = document.getElementById('clearAll');
    // Clear all button logic
    clearAllButton.addEventListener('click', () => {
        location.href = location.origin + location.pathname;
    });
    
     /**
     * Updates the URL to reflect the current timers.
     *
     * This function reads the name and duration of each timer from the timer
     * rows container and updates the URL query parameters accordingly.
     * It uses `encodeURIComponent` to ensure the URL is properly formatted.
     */
    function updateURL() {
        // Convert the timer rows container's children to an array
        const timerRows = Array.from(timerRowsContainer.children);
        // Prepare an array to collect URL parameters
        const params = [];
        // Iterate over each timer row
        timerRows.forEach(row => {
            const nameInput = row.querySelector('input[name="name"]');
            const durationInput = row.querySelector('input[name="duration"]');
            if (nameInput && durationInput && nameInput.value.trim() !== '' && durationInput.value.trim() !== '') {
                params.push(`name=${encodeURIComponent(nameInput.value)}`);
                params.push(`time=${encodeURIComponent(durationInput.value)}`);
            }
        });        
        // Combine the parameters into a query string
        const queryString = params.join('&');
        // Construct the new URL with the query string
        const newURL = `${window.location.origin}${window.location.pathname}?${queryString}`;
        // Replace the current URL in the history without reloading the page
        history.replaceState({}, '', newURL);
    }
    
    /**
     * Loads timers from the URL query parameters.
     *
     * This function checks the URL for 'name' and 'time' parameters and
     * creates timer rows based on these parameters. It clears any existing
     * timer rows before creating new ones.
     */
    function loadFromURL() {
        // Get the URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        // Get all 'name' and 'time' parameters
        const names = urlParams.getAll('name');
        const times = urlParams.getAll('time');
        // If there's an equal number of names and times, and there are entries
        if (names.length === times.length && names.length > 0) {
            timerRowsContainer.innerHTML = '';
            // Create a timer row for each name/time pair
            for (let i = 0; i < names.length; i++) {
                const newRow = createTimerRow(names[i], times[i]);
                timerRowsContainer.appendChild(newRow);
            }
        }
    }

    function formatTime(totalSeconds) {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const formattedHours = String(hours).padStart(2, '0');
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(seconds).padStart(2, '0');

        if (hours > 0) {
            return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
        } else if (minutes > 0) {
            return `${formattedMinutes}:${formattedSeconds}`;
        } else {
            return `${formattedSeconds}`;
        }
    }

    function updateSummary() {
        const timerRows = Array.from(timerRowsContainer.children);
        let totalDuration = 0;
        const summarySpan = document.getElementById('summary');
        timerRows.forEach(row => {
            const durationInput = row.querySelector('input[name="duration"]');
            let duration = durationInput ? parseInt(durationInput.value) : 0;
            if (isNaN(duration)) {
                duration = 0;
            }
            totalDuration += duration;
        });
        const timerDisplay = document.getElementById('timerDisplay');
        if (summarySpan) {
            summarySpan.textContent = `Total Time: ${formatTime(totalDuration)}`;
        }
        if (startPauseButton.textContent !== 'Pause' && startPauseButton.textContent !== 'Resume') {
            timerDisplay.textContent = `Total Time: ${formatTime(totalDuration)}`;
        }
    
    }
        
    
    
    
    
    if(document.getElementById('summary')){
        document.getElementById('summary').textContent = `Total Time: 00`;
    }
    
    loadFromURL();

    startPauseButton.addEventListener('click', () => {        
        if (startPauseButton.textContent === 'Start' || startPauseButton.textContent === 'Done') {
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
    copyURLButton.addEventListener('click', () => {
        updateURL();
        navigator.clipboard.writeText(window.location.href)
            .then(() => alert('URL copied to clipboard!'))
            .catch(err => console.error('Could not copy URL: ', err));
    });
    addTimerRow();    
});
