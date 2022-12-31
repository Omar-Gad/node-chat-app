const bigInt = require('big-integer');

class RSA {
  static randomPrime(bits) {
    const min = bigInt.one.shiftLeft(bits - 1);
    const max = bigInt.one.shiftLeft(bits).prev();
    
    while (true) {
      let p = bigInt.randBetween(min, max);
      if (p.isProbablePrime(256)) {
        return p;
      } 
    }
  }

  static generate(keysize, p, q) {
    const e = bigInt(65537);

    let totient;
    // let totient = p.minus(bigInt(1)).multiply(q.minus(bigInt(1)));
  
    do {
      totient = bigInt.lcm(
        p.prev(),
        q.prev()
      );
    } while (bigInt.gcd(e, totient).notEquals(1) || p.minus(q).abs().shiftRight(keysize / 2 - 100).isZero());

    return {
      e, 
      n: p.multiply(q),
      d: e.modInv(totient),
    };
  }

  static encrypt(Msg, e, n) {
    return bigInt(Msg).modPow(e, n);
  }

  static decrypt(encryptedMsg, d, n) {
    return bigInt(encryptedMsg).modPow(d, n); 
  }

}

module.exports = RSA;