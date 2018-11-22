export function titleCase(str) {
    str = str.toLowerCase().split(' ');
    for (var i = 0; i < str.length; i++) {
      str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1); 
    }
    return str.join(' ');
}

export function secondFormat(number) {
  if (number < 10) {
    return "0" + number;
  }

  return number;
}