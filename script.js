document.addEventListener('DOMContentLoaded', function () {
    const startBtn = document.getElementById('start-btn');
    const resultDiv = document.getElementById('result');
  
    // Comprobar si el navegador admite reconocimiento de voz
    if ('webkitSpeechRecognition' in window) {
      const recognition = new webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'es-ES'; // Configura el idioma para el reconocimiento de voz
  
      startBtn.addEventListener('click', function () {
        recognition.start();
      });
  
      recognition.onresult = function (event) {
        const transcript = event.results[0][0].transcript;
        resultDiv.innerHTML = `
          <h3>Texto Reconocido:</h3>
          <p>${transcript}</p>
        `;
      };
  
      recognition.onerror = function (event) {
        resultDiv.innerHTML = '<p>Ocurrió un error durante el reconocimiento de voz.</p>';
      };
    } else {
      startBtn.style.display = 'none';
      resultDiv.innerHTML = '<p>El reconocimiento de voz no es compatible con este navegador.</p>';
    }
  });
  