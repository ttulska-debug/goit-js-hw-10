import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const datetimePicker = document.querySelector('#datetime-picker');
const startButton = document.querySelector('[data-start]');

const daysValue = document.querySelector('[data-days]');
const hoursValue = document.querySelector('[data-hours]');
const minutesValue = document.querySelector('[data-minutes]');
const secondsValue = document.querySelector('[data-seconds]');

let userSelectedDate = null;
let timerId = null;
startButton.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,

  onClose(selectedDates) {
    if (selectedDates.length === 0) {
      return;
    }

    const selectedDate = selectedDates[0];
    const currentDate = new Date();

    if (selectedDate <= currentDate) {
      userSelectedDate = null;
      startButton.disabled = true;

      iziToast.error({
        message: 'Please choose a date in the future',
        position: 'topRight',
      });

      return;
    }

    userSelectedDate = selectedDate;
    startButton.disabled = false;
  },
};

flatpickr(datetimePicker, options);

startButton.addEventListener('click', startTimer);

function startTimer() {
  if (!userSelectedDate) {
    return;
  }

  startButton.disabled = true;
  datetimePicker.disabled = true;

  updateTimer();

  timerId = setInterval(updateTimer, 1000);
}

function updateTimer() {
  const currentDate = new Date();
  const remainingTime = userSelectedDate - currentDate;

  if (remainingTime <= 0) {
    clearInterval(timerId);

    timerId = null;

   updateTimerDisplay(convertMs(0));

    datetimePicker.disabled = false;
    startButton.disabled = true;

    return;
  }

  const time = convertMs(remainingTime);

  updateTimerDisplay(time);
}

function updateTimerDisplay({ days, hours, minutes, seconds }) {
  daysValue.textContent = addLeadingZero(days);
  hoursValue.textContent = addLeadingZero(hours);
  minutesValue.textContent = addLeadingZero(minutes);
  secondsValue.textContent = addLeadingZero(seconds);
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {

  const second = 1000;

  const minute = second * 60;

  const hour = minute * 60;

  const day = hour * 24;


  const days = Math.floor(ms / day);

 

  const hours = Math.floor((ms % day) / hour);

 

  const minutes = Math.floor(((ms % day) % hour) / minute);

  

  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}