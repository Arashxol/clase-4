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
  const limite = e.data;
  let primos = [];
  let sieve = new Array(limite + 1).fill(true);
  sieve[0] = sieve[1] = false; 

  for (let i = 2; i <= Math.sqrt(limite); i++) {
    if (sieve[i]) {
      for (let j = i * i; j <= limite; j += i) {
        sieve[j] = false;
      }
    }
  }

  for (let i = 2; i <= limite; i++) {
    if (sieve[i]) {
      primos.push(i);
    }
  }
  postMessage(primos.join(", "));
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
