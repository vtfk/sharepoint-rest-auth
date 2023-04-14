const pfxToPem = require('./lib/pfx-to-pem')
const msal = require('@azure/msal-node')

/**
 * Gets a token for sharepoint rest api
 *
 * @param {object} options
 * @param {string} [options.pfxcert] PFX-cert as base64
 * @param {string} [options.pemcert] PEM-cert as base64
 * @param {string} [options.pemprivateKey] private key PEM as base64
 * @param {string} [options.privateKeyPassphrase] privateKey for decrypting cert-key
 * @param {string} options.thumbprint can be obtained from app registration, or inspecting cert
 * @param {string} options.clientId app reg client id
 * @param {string} options.tenantId
 * @param {string} options.tenantName
 *
 * @return {object} accessToken
 */
module.exports = async options => {
  if (!options) {
    throw Error('Missing required input: options')
  }
  if (!options.pemcert && !options.pfxcert) {
    throw Error('Missing required input: options.pemcert or options.pfxcert')
  }
  if (options.pemcert && !options.pemprivateKey) {
    throw Error('Missing required input: options.pemprivateKey')
  }
  if (!options.thumbprint) {
    throw Error('Missing required input: options.thumbprint')
  }
  if (!options.clientId) {
    throw Error('Missing required input: options.clientId')
  }
  if (!options.tenantId) {
    throw Error('Missing required input: options.tenantId')
  }
  if (!options.tenantName) {
    throw Error('Missing required input: options.tenantName')
  }
  
  const certificate = {
    cert: '',
    key: ''
  }
  if (options.pfxcert) {
    // Må konverte internt her
    const cert = pfxToPem(options.pfxcert, options.privateKeyPassphrase || null)
    certificate.cert = cert.certificate
    certificate.key = cert.key
  } else {
    // bare sett det til det som er sendt inn
    certificate.cert = Buffer.from(options.pemcert, 'base64').toString()
    certificate.key = Buffer.from(options.pemprivateKey, 'base64').toString()
  }

  const authConfig = {
    auth: {
      clientId: options.clientId,
      authority: `https://login.microsoftonline.com/${options.tenantId}/`,
      clientCertificate: {
        thumbprint: options.thumbprint, // can be obtained when uploading certificate to Azure AD (or inspect the certificate properties)
        privateKey: certificate.key
      }
    }
  }

  // Create msal application object
  const cca = new msal.ConfidentialClientApplication(authConfig)
  const clientCredentials = {
    scopes: [`https://${options.tenantName}.sharepoint.com/.default`]
  }

  const token = await cca.acquireTokenByClientCredential(clientCredentials)
  return token
}
