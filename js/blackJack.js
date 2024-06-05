//              BLACK JACK 1.1
/*Bienvenido a este pseudo simulador de Black Jack creado por Pedro Ocares, basado en el código del juego "Truco"
 entregado por profesor de CoderHouse, esta es la versión 1.1 en la cual agregamos la interacción con el usuario
 a través del HTML en vez de por consola, ademas se agregaron funcionalidades del local storage el cual utilizamos
 para guardar los el estado del jugador, sus créditos y sus apuestas. Ademas se limito la capacidad de jugadores
 solo a 3 para simplificar el código y la vista, se reutilizo el código anterior donde se agregaron nuevas funciones
 otras se modificaron y otras dejaron de servir debido a que la dificultad hace implementar elementos con más 
 funcionalidades.

*/

let deck = [];//declaramos la variable.array deck el cual almacenará las cartas
const suits = ["Picas", "Tréboles", "Corazones", "Diamantes"];//declaramos constante suits con los "palos" de las cartas "Picas", "Tréboles", "Corazones", "Diamantes"
const ranks = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];//declaramos la constante.array ranks con los valores "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"
let playerHands = [[], [], []];//declaramos la variable.array playerHands para los jugadores y dentro se generará otro arreglo para las cartas
let dealerHand = [];//creamos la variable dealerHand y la asignamos un array 
let jugadorSentados = [false, false, false];
let jugadorCreditos = [500, 500, 500];//Arreglo con los créditos de los jugadores
let jugadorApuestas = [0, 0, 0];

// Guardar estados en localStorage
function guardarEstado() {
    localStorage.setItem('jugadorCreditos', JSON.stringify(jugadorCreditos)); // Guardamos los créditos de los jugadores
    localStorage.setItem('jugadorApuestas', JSON.stringify(jugadorApuestas)); // Guardamos las apuestas de los jugadores
    localStorage.setItem('jugadorSentados', JSON.stringify(jugadorSentados)); // Guardamos el estado de los jugadores (sentados o no)
}

// Cargar estados desde localStorage
function cargarEstado() {
    const CreditosGuardados = localStorage.getItem('jugadorCreditos'); // Obtenemos los créditos de los jugadores desde localStorage
    const apuestasGuardadas = localStorage.getItem('jugadorApuestas'); // Obtenemos las apuestas de los jugadores desde localStorage
    const jugadoresSentadosGuardados = localStorage.getItem('jugadorSentados'); // Obtenemos el estado de los jugadores (sentados o no) desde localStorage

    if (CreditosGuardados) jugadorCreditos = JSON.parse(CreditosGuardados); // Si hay créditos guardados, actualizamos jugadorCreditos
    if (apuestasGuardadas) jugadorApuestas = JSON.parse(apuestasGuardadas); // Si hay apuestas guardadas, actualizamos jugadorApuestas
    if (jugadoresSentadosGuardados) jugadorSentados = JSON.parse(jugadoresSentadosGuardados); // Si hay estado guardado, actualizamos jugadorSentados
}

//función createDeck para crear el mazo mezclando los valores de "{ranks} de {suit}"
function createDeck() {
    for (let suit of suits) {// ciclo for, creamos variable suit con los elementos de suits
        for (let rank of ranks) {//ciclo for creamos variable rank con elementos de ranks
            deck.push({ rank: rank, suit: suit });//con push() agregamos al deck rank y suit en ese orden o sea el número y luego el palo
        }
    }
}

//función para revolver las cartas 
function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {//ciclo for que lee el margen de elementos del deck -1 ya que queremos indicar el índice y este siempre es el número de elementos -1 porque el índice empieza desde 0
        const j = Math.floor(Math.random() * (i + 1));//se crea constante j para almacenar un número random entre 0 y i+1
        [deck[i], deck[j]] = [deck[j], deck[i]];//acá se hace un array para hacer un intercambio dentro de este mismo, es como decir el puesto de la carta 10(i) ahora lo ocupa la carta 3(j) 
    }
}

//función para repartir cartas según el número de jugadores que se sienten
function dealCards() {
    if (jugadorSentados.some(sentado => sentado)) {//inspeccionamos con la función .some si hay algún jugador sentado (un elemento true), si hay devuelve true para repartir las cartas
        //creamos la constante dealerHand y la asignamos un array 
        dealerHand = [];
        //creamos un arreglo dentro del arreglo playerHands con la función .map la cual crea un nuevo arreglo dentro de cada uno de los elementos del arreglo playerHands 
        playerHands = playerHands.map(() => []);
        // Repartimos cartas al Dealer y Players a diferencia que en el código blackjack 1, acá hacemos todo en un solo ciclo for
        for (let i = 0; i < 2; i++) {
            dealerHand.push(deck.pop());//se le agregan las cartas que se eliminan del deck con la función pop() a dealerHand con la función push()
            jugadorSentados.forEach((sentado, index) => {//Verificamos que el jugador esté sentado, si es así 
                if (sentado) playerHands[index].push(deck.pop());//se le agregan las cartas que se eliminan del deck con la función pop() ahora a playerHands con la función push()
            });
        }
        MostrarCartas();//función para mostrar las cartas en el DOM
        determinarGanadores();// Función para determinar los ganadores
    } else {//en caso de que se haya cometido algún error o no supieron seguir las instrucciones, mostrará un mensaje de alerta que "Ningún jugador está sentado."
        alert("Ningún jugador está sentado.");
    }
}

// Función para mostrar las cartas en el DOM
function MostrarCartas() {
    const cartasCasa = document.getElementById("cartasCasa"); // Obtenemos desde el DOM la etiqueta con el ID "cartasCasa"
    cartasCasa.innerHTML = ''; // Limpiamos cualquier contenido previo en la etiqueta "cartasCasa"
    dealerHand.forEach(card => { // Recorremos cada carta en la mano del dealer (dealerHand)
        const cardElement = document.createElement("div"); // Creamos un nuevo elemento div para representar la carta
        cardElement.className = "card1"; // Asignamos la clase "card1" al nuevo elemento div para darle estilo
        cardElement.innerText = `${card.rank} de ${card.suit}`; // Establecemos el texto del div con el valor y el palo de la carta (por ejemplo, "7 de Corazones")
        cartasCasa.appendChild(cardElement); // Añadimos el nuevo elemento div al contenedor "cartasCasa" en el DOM
    });



    playerHands.forEach((hand, index) => {
        const playerContainer = document.getElementById(`cartasJugador${index + 1}`); // Obtenemos desde el DOM la etiqueta con el ID "cartasJugador" seguido del número del jugador
        playerContainer.innerHTML = ''; // Limpiamos cualquier contenido previo en la etiqueta del jugador específico
        hand.forEach(card => { // Recorremos cada carta en la mano del jugador (hand)
            const cardElement = document.createElement("div"); // Creamos un nuevo elemento div para representar la carta
            cardElement.className = "card1"; // Asignamos la clase "card1" al nuevo elemento div para darle estilo
            cardElement.innerText = `${card.rank} de ${card.suit}`; // Establecemos el texto del div con el valor y el palo de la carta (por ejemplo, "7 de Corazones")
            playerContainer.appendChild(cardElement); // Añadimos el nuevo elemento div al contenedor del jugador en el DOM
        });
    });
}

// Función para sentar a un jugador
function sentarseJugador(event) {
    const jugador = parseInt(event.target.getAttribute("data-jugador")) - 1; // Obtenemos el número de jugador desde el atributo "data-jugador" del evento
    if (!jugadorSentados[jugador]) { // Verificamos si el jugador no está sentado
        jugadorSentados[jugador] = true; // Marcamos al jugador como sentado
        alert(`Jugador ${jugador + 1} se ha sentado con $${jugadorCreditos[jugador]} de créditos.`); // Mostramos un mensaje de confirmación con el créditos del jugador
        actualizarCreditos(); // Actualizamos los Creditos en la interfaz
        guardarEstado(); // Guardamos el estado en localStorage
    } else { // Si el jugador ya está sentado
        alert(`Jugador ${jugador + 1} ya está sentado.`); // Mostramos un mensaje de alerta indicando que el jugador ya está sentado
    }
}

// Función para aumentar o disminuir la apuesta
function ajustarApuesta(event) {
    const jugador = parseInt(event.target.getAttribute("data-jugador")) - 1; // Obtenemos el número de jugador desde el atributo "data-jugador" del evento
    const action = event.target.getAttribute("data-action"); // Obtenemos la acción (sumar o restar) desde el atributo "data-action" del evento
    if (jugadorSentados[jugador]) { // Verificamos si el jugador está sentado
        if (action === "sumar" && jugadorCreditos[jugador] > 0) { // Si la acción es aumentar y el jugador tiene créditos disponibles
            jugadorApuestas[jugador]++; // Sumamos la apuesta del jugador
            jugadorCreditos[jugador]--; // Restamos el créditos del jugador
        } else if (action === "restar" && jugadorApuestas[jugador] > 0) { // Si la acción es disminuir y el jugador tiene una apuesta vigente
            jugadorApuestas[jugador]--; // Restamos la apuesta del jugador
            jugadorCreditos[jugador]++; // Sumamos el créditos del jugador
        }
        actualizarCreditos(); // Actualizamos los Creditos en la interfaz
        guardarEstado(); // Guardamos el estado en localStorage
    } else { // Si el jugador no está sentado
        alert(`Jugador ${jugador + 1} no está sentado.`); // Mostramos un mensaje de alerta indicando que el jugador no está sentado
    }
}

//function  para determinar el ganador y perdedor
function determinarGanadores() {
    const dealerScore = calcularPuntaje(dealerHand); // Calculamos el puntaje del dealer
    
    playerHands.forEach((hand, index) => { // Para cada mano de jugador
        if (jugadorSentados[index]) { // Si el jugador está sentado
            const playerScore = calcularPuntaje(hand); // Calculamos el puntaje del jugador
            let resultado = ""; // Inicializamos la variable resultado
            if (playerScore > 21) { // Si el puntaje del jugador es mayor a 21
                resultado = "Perdió"; // El jugador perdió
            } else if (dealerScore > 21 || playerScore > dealerScore) { // Si el dealer se pasa de 21 o el puntaje del jugador es mayor que el del dealer
                resultado = "Ganó"; // El jugador ganó
                jugadorCreditos[index] += jugadorApuestas[index] * 2; // Sumamos el créditos del jugador
            } else if (playerScore < dealerScore) { // Si el puntaje del jugador es menor que el del dealer
                resultado = "Perdió"; // El jugador perdió
            } else { // Si no se cumple ninguna de las condiciones anteriores 
                resultado = "Empate"; // Hay un empate
                jugadorCreditos[index] += jugadorApuestas[index]; // Sumamos el créditos del jugador
            }
            document.getElementById(`estadoJugador${index + 1}`).innerText = `Jugador ${index + 1} - ${resultado}`; // Mostramos el resultado en el DOM
            jugadorApuestas[index] = 0; // Resetear apuestas después de cada ronda
        }
    });
    
    actualizarCreditos(); // Actualizamos los Creditos en el DOM
    guardarEstado(); // Guardamos el estado en localStorage
    
}


// Función para calcular el puntaje de una mano
function calcularPuntaje(hand) {
    let score = 0; // Inicializamos el puntaje en 0
    let aces = 0; // Inicializamos el contador de ases en 0
    hand.forEach(card => { // Para cada carta en la mano
        if (card.rank === "J" || card.rank === "Q" || card.rank === "K") { // Si la carta es una figura (J, Q, K)
            score += 10; // Sumamos 10 al puntaje
        } else if (card.rank === "1") { // Si la carta es un as
            aces++; // Incrementamos el contador de ases
            score += 11; // Inicialmente, sumamos 11 al puntaje
        } else { // Si la carta es un número
            score += parseInt(card.rank); // Sumamos el valor numérico de la carta al puntaje
        }
    });
    while (score > 21 && aces > 0) { // Mientras el puntaje sea mayor que 21 y haya ases en la mano
        score -= 10; // Restamos 10 al puntaje
        aces--; // Restamos el contador de ases
    }
    return score; // Devolvemos el puntaje calculado
}


// Función para actualizar los Creditos y apuestas en el DOM
function actualizarCreditos() {
    jugadorApuestas.forEach((bet, index) => { // Iteramos sobre el arreglo de apuestas de los jugadores
        // Actualizamos el texto de la etiqueta con el ID `apuestaJugador${index + 1}` con el valor de la apuesta
        document.getElementById(`apuestaJugador${index + 1}`).innerText = bet;
        // Actualizamos el texto de la etiqueta con el ID `creditosJugador${index + 1}` con el valor del crédito del jugador
        document.getElementById(`creditosJugador${index + 1}`).innerText = `Créditos: ${jugadorCreditos[index]}`;
    });
}


// Establecer event listeners para los botones

// Event listeners para los botones "sentarse"
document.querySelectorAll('.sentarse-btn').forEach(button => {
    button.addEventListener('click', sentarseJugador);
});

// Event listeners para los botones "ajustar apuesta"
document.querySelectorAll('.apuesta-btn').forEach(button => {
    button.addEventListener('click', ajustarApuesta);
});

// Event listener para el botón "repartir cartas"
document.getElementById('repartirCartasBtn').addEventListener('click', () => {
    // Cuando se hace clic en el botón "repartir cartas", ejecutar estas funciones:
    createDeck(); // Crear el mazo de cartas
    shuffleDeck(); // Barajar el mazo
    dealCards(); // Repartir las cartas
});

// Cargar el estado del juego al iniciar la página

// Cuando la ventana se carga completamente, ejecutar estas funciones:
window.onload = () => {
    cargarEstado(); // Cargar el estado del juego desde localStorage
    actualizarCreditos(); // Actualizar los Creditos de los jugadores en el DOM
};
