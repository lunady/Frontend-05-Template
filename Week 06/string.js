function UTF8_Encoding(string) {
  let back = [];
  let byteSize = 0;

  for (let i = 0; i < string.length; i++) {
    let charCode = string[i].charCodeAt(0);
    /*根据大小判断UTF8的长度
    * 1个字节：Unicode码为 0 - 127
    * 2个字节：Unicode码为 128 - 2047
    * 3个字节：Unicode码为 2048 - 0xFFFF
    * 4个字节：Unicode码为 65536 - 0x1FFFFF
    * 5个字节：Unicode码为 0x200000 - 0x3FFFFFF
    * 6个字节：Unicode码为 0x4000000 - 0x7FFFFFFF
    * */
    if (0x00 <= charCode && charCode <= 0x7f) {
      byteSize += 1;
      back.push(charCode);
    } else if (0x80 <= charCode && charCode <= 0x7ff) {
      byteSize += 2;
      /*2字节格式
      * 110xxxxx
      * 10xxxxxx
      *
      * (192)10 = (11000000)2
      * (31)10  = (11111)2
      * (128)10 = (10000000)2
      * (63)10  = (111111)2
      * */
      // console.log("charCode-1-",charCode.toString(2), (charCode >> 6).toString(2), (31 & (charCode >> 6)).toString(2), (192 | 31 & (charCode >> 6)).toString(2));
      // console.log("charCode-2-",charCode.toString(2),  (63 & charCode).toString(2), (128 | (63 & charCode)).toString(2));
      back.push((192 | (31 & (charCode >> 6))));
      back.push((128 | (63 & charCode)))
    } else if ((0x800 <= charCode && charCode <= 0xd7ff) || (0xe000 <= charCode && charCode <= 0xffff)) {
      byteSize += 3;
      /*2字节格式
      * 1110xxxx
      * 10xxxxxx
      * 10xxxxxx
      *
      * (224)10 = (11100000)2
      * (15)10  = (1111)2
      * (128)10 = (10000000)2
      * (63)10  = (111111)2
      * */
      // console.log("charCode-1-------", charCode.toString(2),(charCode >> 6).toString(2))
      back.push((224 | (15 & (charCode >> 12))));
      back.push((128 | (63 & (charCode >> 6))));
      back.push((128 | (63 & charCode)))
    }
  }
  // console.log(byteSize, back);
  for (let i = 0; i < back.length; i++) {
    // 转化16位
    back[i] &= 0xff;
  }

  return Buffer.from(back)
}

console.log(UTF8_Encoding("一二三"));


// var buffer = new Buffer('一二三');
// console.log(buffer.length);
// console.log(buffer);
