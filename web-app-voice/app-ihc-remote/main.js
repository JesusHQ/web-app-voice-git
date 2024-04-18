document.addEventListener('DOMContentLoaded', function () {
    const lastCommandElement = document.getElementById('last-command');
    let lastExecutedCommandId = null;  // Variable para almacenar el ID de la última orden ejecutada
  
    function executeCommand(command, id) {
      if (lastExecutedCommandId !== id) {
        console.log(`Ejecutando: ${command}`);
        if (command.includes('aumentar tamaño')) {
          let fontSize = parseInt(window.getComputedStyle(document.body).fontSize);
          fontSize += 2; // Incrementar tamaño de letra
          document.body.style.fontSize = `${fontSize}px`;
        } else if (command.includes('disminuir tamaño')) {
          let fontSize = parseInt(window.getComputedStyle(document.body).fontSize);
          fontSize -= 2; // Decrementar tamaño de letra
          if (fontSize < 10) { // Limitar tamaño de letra mínimo
            fontSize = 10;
          }
          document.body.style.fontSize = `${fontSize}px`;
        } else if (command.includes('cambiar color a rojo')) {
          document.body.style.color = 'red';
        } else if (command.includes('cambiar color a verde')) {
          document.body.style.color = 'green';
        } else if (command.includes('cambiar color a azul')) {
          document.body.style.color = 'blue';
        } else if (command.includes('abrir una pestaña')) {
          window.open('about:blank', '_blank');
        } else if (command.includes('ir a')) {
          const url = command.split('ir a ')[1].trim();
          window.location.href = url;
        } else if (command.includes('cerrar pestaña')) {
          window.close();
        } else if (command.includes('cerrar navegador')) {
          window.open('', '_self').close();
        } else if (command.includes('maximizar ventana')) {
          window.moveTo(0, 0);
          window.resizeTo(screen.width, screen.height);
        } else if (command.includes('minimizar ventana')) {
          window.resizeTo(200, 100);
        } else {
          console.log('Comando no reconocido o no ejecutable en este contexto');
        }
        lastExecutedCommandId = id; // Actualizar el ID de la última orden ejecutada
      } else {
        console.log('Orden ya ejecutada:', command);
      }
    }
  
    function fetchLatestCommand() {
      const url = 'https://6614d3aa2fc47b4cf27d2632.mockapi.io/datos';
      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error('Error al obtener los datos de la API');
          }
          return response.json();
        })
        .then(data => {
          if (data.length > 0) {
            const lastItem = data[data.length - 1];
            lastCommandElement.innerText = `Última orden: ${lastItem.orden}`;
            executeCommand(lastItem.orden, lastItem.id);  // Utilizando el campo 'id' para evitar repeticiones
          } else {
            lastCommandElement.innerText = "No hay datos disponibles.";
          }
        })
        .catch(error => {
          console.error('Error al recuperar datos:', error);
          lastCommandElement.innerText = "Error al cargar los datos.";
        });
    }
  
    // Llamada inicial inmediata y establecer intervalo para actualizar cada 2 segundos
    fetchLatestCommand();
    setInterval(fetchLatestCommand, 2000);
  });
  