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
export function arrayToDataTable(number, array) {
  let retorno = [];

  if (array && array.length) {
    let linhas = Math.ceil(array.length / number);
    let tamanho = (100/number);
    let inicioIndex = 0;
    let fimIndex = number;
    
    for(let linha = 0; linha < linhas; linha++) {
      let listaCell = [];
      
      array.slice(inicioIndex, fimIndex).forEach(e => {
        let element = e;
        element.width = tamanho + "%";
        listaCell.push(element);
      });

      inicioIndex  += number + 1;
      fimIndex += number + 1;

      if (listaCell.length < number) {
        let element = {tamanho: (tamanho * (number - listaCell.length)) + "%"}; 
        listaCell.push(element);
      }
      retorno.push(listaCell);
    }
  }

  return retorno;
}