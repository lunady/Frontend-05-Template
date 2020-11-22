function String2Number(s, radix) {
  if (typeof s !== 'string') {
    return NaN;
  }
  if (radix == null) {
    radix = 10;
  } else if (typeof radix !== 'number' || radix < 2 || radix > 36) {
    return NaN;
  }

  let result = 0;
  for (let i = 0; i < s.length; i += 1) {
    let c = s.charCodeAt(i);
    if (c >= 97) {
      c -= 87;    // - 'a' + 10
    } else if (c >= 65) {
      c -= 55;    // - 'A' + 10
    } else {
      c -= 48;    // - '0'
    }
    if (c >= radix) {
      if (i === 0) {
        return NaN;
      }
      break;
    }
    result = (result * radix) + c;
  }

  return result;
}

console.log(String2Number("123445", 10));
console.log(String2Number("123445", 16));



function numberToString(number, radix) {
  if (number === 0) return "0";
  let plusMinusSign = number > 0 ? "" : "-" ;
  let hexNumbers = "0123456789abcdef";
  let result = "";
  let numb = Math.abs(number);

  while (numb > 0) {
    if (numb % radix) {
      result = hexNumbers[numb % radix] + result
    } else {
      result = "0" + result
    }
    numb >>= Math.log2(radix)
  }
  switch (radix) {
    case 16:
      result = "0x" + result
      break
    case 8:
      result = "0o" + result
      break
    case 2:
      result = "0b" + result
      break
    default:
      break
  }
  return plusMinusSign + result
}

console.log(numberToString(100, 2))
console.log(numberToString(100, 10))
console.log(numberToString(100, 16))
