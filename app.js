const inputLimite = document.getElementById("limite");
const inputParrafo = document.getElementById("parrafo");
const inputPalabra = document.getElementById("palabra");
const botonGenerar = document.getElementById("generar");
const salida = document.getElementById("salida");

function crearWorker(fn) {
  const blob = new Blob(["onmessage = " + fn.toString()], { type: "application/javascript" });
  const url = URL.createObjectURL(blob);
  return new Worker(url);
}

function workerPrimos(e) {
  const cantidad = e.data; 
  let primos = [];
  let num = 2;

  while (primos.length < cantidad) {
    let esPrimo = true;
    for (let i = 2; i <= Math.sqrt(num); i++) {
      if (num % i === 0) {
        esPrimo = false;
        break;
      }
    }
    if (esPrimo) {
      primos.push(num);
    }
    num++;
  }

  let resultado = "";
  for (let i = 0; i < primos.length; i++) {
    resultado += primos[i] + ( (i+1) % 10 === 0 ? "\n" : ", " );
  }

  postMessage(resultado.trim());
}


function buscarPalabra(parrafo, palabra) {
  const palabras = parrafo.split(" ").sort();
  let izquierda = 0;
  let derecha = palabras.length - 1;

  while (izquierda <= derecha) {
    const medio = Math.floor((izquierda + derecha) / 2);
    if (palabras[medio] === palabra) {
      return true; // se encontro la palabra
    } else if (palabras[medio] < palabra) {
      izquierda = medio + 1;
    } else {
      derecha = medio - 1;
    }
  }
  return false; // no se encontro la palabra  
}

botonGenerar.addEventListener("click", () => {
  salida.textContent = "Calculando...\n";

  const limite = parseInt(inputLimite.value);
  const parrafo = inputParrafo.value;
  const palabra = inputPalabra.value;

  const wPrimos = crearWorker(workerPrimos);

  wPrimos.onmessage = (e) => salida.textContent += `Primos: ${e.data}\n`;

  wPrimos.postMessage(limite);

  const palabraEncontrada = buscarPalabra(parrafo, palabra);
  salida.textContent += palabraEncontrada ? `si.\n` : `no\n`;
});
