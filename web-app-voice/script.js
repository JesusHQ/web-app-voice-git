document.addEventListener('DOMContentLoaded', function () {
  const startBtn = document.getElementById('start-btn');
  const resultDiv = document.getElementById('result');
  const textElement = document.getElementById('text');
  let fontSize = 16; // Tamaño de letra inicial

  if ('webkitSpeechRecognition' in window) {
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'es-ES';

    recognition.onresult = function (event) {
      const transcript = event.results[0][0].transcript.toLowerCase();
      resultDiv.innerHTML = `
        <h3>Texto Reconocido:</h3>
        <p>${transcript}</p>
      `;

      console.log('Texto reconocido:', transcript);

      // Analizar el texto reconocido para detectar comandos de control de tamaño de letra
      if (transcript.includes('aumentar tamaño')) {
        fontSize += 2; // Incrementar tamaño de letra
        textElement.style.fontSize = fontSize + 'px';
        console.log('Tamaño de letra aumentado a', fontSize + 'px');
      } else if (transcript.includes('disminuir tamaño')) {
        fontSize -= 2; // Decrementar tamaño de letra
        if (fontSize < 10) {
          fontSize = 10; // Limitar tamaño de letra mínimo
        }
        textElement.style.fontSize = fontSize + 'px';
        console.log('Tamaño de letra disminuido a', fontSize + 'px');
      }

      // Analizar el texto reconocido para detectar comandos de control de color del texto
      if (transcript.includes('cambiar color a rojo')) {
        textElement.style.color = 'red'; // Cambiar color del texto a rojo
        console.log('Color del texto cambiado a rojo');
      } else if (transcript.includes('cambiar color a verde')) {
        textElement.style.color = 'green'; // Cambiar color del texto a verde
        console.log('Color del texto cambiado a verde');
      } else if (transcript.includes('cambiar color a azul')) {
        textElement.style.color = 'blue'; // Cambiar color del texto a azul
        console.log('Color del texto cambiado a azul');
      }

      // Ejecutar acciones según el comando de voz para el navegador
      if (transcript.includes('abrir una pestaña')) {
        window.open('', '_blank');
        console.log('Se abrió una nueva pestaña');
      } else if (transcript.includes('ir a')) {
        const url = extractURL(transcript);
        if (url) {
          window.location.href = url;
          console.log('Navegando a:', url);
        }
      } else if (transcript.includes('cerrar pestaña')) {
        window.close();
        console.log('Pestaña cerrada');
      } else if (transcript.includes('cerrar navegador')) {
        window.open('', '_self').close();
        console.log('Navegador cerrado');
      } else if (transcript.includes('maximizar ventana')) {
        window.moveTo(0, 0);
        window.resizeTo(screen.width, screen.height);
        console.log('Ventana maximizada');
      } else if (transcript.includes('minimizar ventana')) {
        window.resizeTo(200, 100);
        console.log('Ventana minimizada');
      }

      // Guardar la orden en el MockAPI
      saveOrderToMockAPI(transcript);
    };

    recognition.onerror = function (event) {
      resultDiv.innerHTML = '<p>Ocurrió un error durante el reconocimiento de voz.</p>';
      console.error('Error en el reconocimiento de voz:', event.error);
    };

    startBtn.addEventListener('click', function () {
      recognition.start();
    });
  } else {
    startBtn.style.display = 'none';
    resultDiv.innerHTML = '<p>El reconocimiento de voz no es compatible con este navegador.</p>';
    console.error('Reconocimiento de voz no compatible');
  }

  // Función para extraer la URL de la instrucción "ir a"
  function extractURL(transcript) {
    const parts = transcript.split('ir a');
    if (parts.length > 1) {
      return parts[1].trim();
    }
    return null;
  }

  // Función para guardar la orden en el MockAPI
  function saveOrderToMockAPI(transcript) {
    // Lista de palabras clave que representan órdenes válidas
    const commands = [
      'aumentar tamaño',
      'disminuir tamaño',
      'cambiar color a rojo',
      'cambiar color a verde',
      'cambiar color a azul',
      'abrir una pestaña',
      'ir a',
      'cerrar pestaña',
      'cerrar navegador',
      'maximizar ventana',
      'minimizar ventana'
    ];

    // Buscar la primera palabra clave que coincida con la transcripción
    const command = commands.find(cmd => transcript.includes(cmd));
    
    if (command) {
      const url = 'https://6614d3aa2fc47b4cf27d2632.mockapi.io/datos'; // URL de MockAPI
      const data = {
        orden: command
      };

      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al guardar la orden en el MockAPI');
        }
        console.log('Orden guardada correctamente en el MockAPI');
      })
      .catch(error => {
        console.error('Error:', error.message);
      });
    } else {
      console.log('No se encontró una orden válida en la transcripción:', transcript);
    }
  }
});



//servinterval -- estaa funcion tiene 2 parametros, uno es el nombre de la funcion y el otro es el tiempo (en milisegundos)
//quitar el boton, el navegador siempre debe de estar escuchando