// src/utils/sweetAlert.js
import Swal from 'sweetalert2';

export const showQuickResult = (title, html) => {
  Swal.fire({
    title: title,
    html: html.replace(/\n/g, '<br>'), // для перенесень рядків
    icon: 'info',
    confirmButtonText: 'OK',
    width: '800px',
    customClass: {
      popup: 'swal-wide',
    }
  });
};

export const showSuccess = (message) => {
  Swal.fire({
    title: 'Успіх!',
    text: message,
    icon: 'success',
    confirmButtonText: 'OK'
  });
};

export const showError = (message) => {
  Swal.fire({
    title: 'Помилка',
    text: message,
    icon: 'error',
    confirmButtonText: 'OK'
  });
};