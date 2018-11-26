/* Formata texto como Título */
export function titleCase(str) {
    str = str.toLowerCase().split(' ');
    for (let i = 0; i < str.length; i++) {
      str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1); 
    }
    return str.join(' ');
}

/* Formata segundos com dois dígitos */
export function secondFormat(number) {
  if (number < 10) {
    return "0" + number;
  }

  return number;
}

/* Pegando uma letra aleatoria */
export function randomLetter() {
  let text = "";
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    
  text = possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

/* A partir do number define um array de arrays */ 
export function arrayOfArrays(number, array) {
  if (array) {
  }

  return [];
}