function random(min, max) {
  let n = max - min + 1;
  return Math.ceil(Math.random() * n) - 1 + min;
}

function randomString(length) {
  let r = "";
  for (let i = 0; i < length; i++) {
    r += random(0, 15).toString(16);
  }
  return r;
}

function calcFF(x) {
  let min,
    max,
    ys = [],
    y;

  if (98 - ((100 * x) % 97) === 98) {
    min = 1;
  } else {
    min = 98 - ((100 * x) % 97);
  }

  if (98 - ((1000 * x) % 97) > 61) {
    max = 98 - ((1000 * x) % 97) + 97 * 1;
  } else {
    max = 98 - ((1000 * x) % 97) + 97 * 2;
  }

  let i = 0;

  do {
    ys.push(max - i * 97);
    i++;
  } while (max - i * 97 >= 100);

  if (min + 97 < 100) {
    ys.push(min + 97);
  }
  ys.push(min);

  y = ys[random(0, ys.length - 1)];

  return y.toString(16).padStart(2, "0");
}

function checkKeySchema(v) {
  //验证有效性
  let p = 0;
  if (v.length !== 25) {
    return false;
  }
  for (let item of [
    [0, 6, 6],
    [6, 8, 14],
    [14, 9, 23],
  ]) {
    if (
      parseInt(
        parseInt(v.substr(item[0], item[1]), 16) +
          String(parseInt(v.substr(item[2], 2), 16)).padStart(2, "0")
      ) %
        97 !==
      1
    ) {
      return false;
    }
  }
  return true;
}

function extractTime(v) {
  //获取有效期时间戳
  return parseInt(v.substr(18, 5), 16) / (parseInt(v.substr(1, 1), 16) || 9);
}

function vaild(k) {
  //验证函数
  let v = k.replace(/\-/g, "");
  let keyGenTime = extractTime(v);
  if (keyGenTime > 45000 || keyGenTime !== parseInt(keyGenTime, 10)) {
    return false;
  }
  let releaseTime = Math.floor(new Date() / 8.64e7);
  if (releaseTime > keyGenTime + 1) {
    return false;
  }
  return checkKeySchema(v);
}

function build(day = 365) {
  //根据验证需求 day需小于 45000
  //随机生成的 1-6 9-14 17-18 位 除了第二位为时间因数 其他数字可自定义 成为用户信息标识符
  let v;
  for (let i = 0; i < 3; i++) {
    if (i === 0) {
      //第 1-6 位任意 第二位为时间校验码的因数
      v = randomString(6);

      //第 1-6 位与第 7-8 位 各自转成十进制再转成字符串相连转整数 需要能被97除余1

      //取 7-8 位
      v += calcFF(parseInt(v.substr(0, 6), 16));
    } else if (i === 1) {
      //第 9-14 位随机生成
      v += randomString(6);
      //第 7-14 位与第 15-16 位 各自转成十进制再转成字符串相连转整数 需要能被97除余1

      //取 15-16 位
      v += calcFF(parseInt(v.substr(6, 8), 16));
    } else {
      //第 17-18 位随机生成
      v += randomString(2);

      //第 19-23 位时间校验码
      //当前时间戳的天数 + 有效天数 乘以第2位校验因数 如果为0 就乘以9 转16进制
      let n =
        (parseInt(new Date() / 8.64e7) + day) *
        (parseInt(v.substr(1, 1), 16) || 9);
      if (n > parseInt("fffff", 16)) {
        //如果时间校验码超过五位 为错误
        //理论上不可能 就算有效期至100年以后因数取最大都不会超过这个数
        return "";
      }
      v += n.toString(16).padStart(5, "0");

      //第 15-23 位与第 24-25 位各自转成十进制再转成字符串相连转整数 需要能被97除余1

      //取 24-25 位
      v += calcFF(parseInt(v.substr(14, 9), 16));
    }
  }
  let r = [];
  for (let i = 0; i < 5; i++) {
    r.push(v.substr(i * 5, 5));
  }
  let res = r.join("-");
  if (vaild(res)) {
    return res;
  } else {
    return build();
  }
}

export default function generateKey() {
  return build();
}
