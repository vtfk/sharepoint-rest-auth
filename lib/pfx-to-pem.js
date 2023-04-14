const forge = require('node-forge')

/**
 * @param {string} pfx: certificate + private key combination in pfx format
 * @param {string} passphrase: passphrase used to encrypt pfx file
 * @returns {Object}
 */
module.exports = (pfx, passphrase = null) => {
  const asn = forge.asn1.fromDer(forge.util.decode64(pfx))
  const p12 = forge.pkcs12.pkcs12FromAsn1(asn, true, passphrase)

  // Retrieve key data
  const keyData = p12.getBags({ bagType: forge.pki.oids.pkcs8ShroudedKeyBag })[forge.pki.oids.pkcs8ShroudedKeyBag]
    .concat(p12.getBags({ bagType: forge.pki.oids.keyBag })[forge.pki.oids.keyBag])

  // Retrieve certificate data
  const certBags = p12.getBags({ bagType: forge.pki.oids.certBag })[forge.pki.oids.certBag]
  const certificate = forge.pki.certificateToPem(certBags[0].cert)

  // Convert a Forge private key to an ASN.1 RSAPrivateKey
  const rsaPrivateKey = forge.pki.privateKeyToAsn1(keyData[0].key)

  // Wrap an RSAPrivateKey ASN.1 object in a PKCS#8 ASN.1 PrivateKeyInfo
  const privateKeyInfo = forge.pki.wrapRsaPrivateKey(rsaPrivateKey)

  // Convert a PKCS#8 ASN.1 PrivateKeyInfo to PEM
  const privateKey = forge.pki.privateKeyInfoToPem(privateKeyInfo)

  return {
    certificate,
    key: privateKey
  }
}
