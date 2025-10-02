// Описаний в документації
import flatpickr from "flatpickr";
// Додатковий імпорт стилів
import "flatpickr/dist/flatpickr.min.css";

// Описаний у документації
import iziToast from "izitoast";
// Додатковий імпорт стилів
import "izitoast/dist/css/iziToast.min.css";


const startBtn = document.querySelector("[data-start]");
const dateInput = document.querySelector("#datetime-picker");

const daysEl = document.querySelector("[data-days]");
const hoursEl = document.querySelector("[data-hours]");
const minutesEl = document.querySelector("[data-minutes]");
const secondsEl = document.querySelector("[data-seconds]");

let userSelectedDate = null;
let timerId = null;

startBtn.disabled = true;

const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        const selectedDate = selectedDates[0];
        if (selectedDate <= new Date()) {
            iziToast.error({
                title: "Error",
                message: "Please choose a date in the future",
                position: "topRight",
            });
            startBtn.disabled = true;
        } else {
            userSelectedDate = selectedDate;
            startBtn.disabled = false;
        }
    },
};


flatpickr("#datetime-picker", options);


startBtn.addEventListener("click", () => {
    if (!userSelectedDate) return;

    startBtn.disabled = true;
    dateInput.disabled = true;

    timerId = setInterval(() => {
        const diff = userSelectedDate - new Date();
        if (diff <= 0) {
            clearInterval(timerId);
            updateTimerUI({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            dateInput.disabled = false;
            return;
        }
        updateTimerUI(convertMs(diff));
    }, 1000);
});


function convertMs(ms) {
    // Number of milliseconds per unit of time
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    // Remaining days
    const days = Math.floor(ms / day);
    // Remaining hours
    const hours = Math.floor((ms % day) / hour);
    // Remaining minutes
    const minutes = Math.floor(((ms % day) % hour) / minute);
    // Remaining seconds
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
}


function updateTimerUI({ days, hours, minutes, seconds }) {
    daysEl.textContent = days;
    hoursEl.textContent = addLeadingZero(hours);
    minutesEl.textContent = addLeadingZero(minutes);
    secondsEl.textContent = addLeadingZero(seconds);
}


function addLeadingZero(value) {
    return String(value).padStart(2, "0");
}