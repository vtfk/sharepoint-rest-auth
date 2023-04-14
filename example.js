(async () => {
  const axios = require('axios').default
  const getSpToken = require('./index')
  const { readFileSync } = require('fs')
  const { PFX_PATH, PFX_PRIVATE_KEY_PASSPHRASE, THUMBPRINT, CLIENT_ID, TENANT_ID, TENANT_NAME } = require('dotenv').config()

  const pfxcert = readFileSync(PFX_PATH).toString('base64')
  
  const authOptions = {
    thumbprint: THUMBPRINT,
    pfxcert,
    privateKeyPassphrase: PFX_PRIVATE_KEY_PASSPHRASE || null,
    clientId: CLIENT_ID,
    tenantId: TENANT_ID,
    tenantName: TENANT_NAME
  }

  const token = await getSpToken(authOptions)

  const exampleSiteName = 'please provide a site name here for the example to work'
  const exampleListId = 'please provide a list guid here for the example to work'
  
  const exampleBase = `https://${TENANT_NAME}.sharepoint.com/sites/${exampleSiteName}`
  const exampleQuery = `_api/web/lists(guid'${exampleListId}')`
  try {
    const { data } = await axios.get(`${exampleBase}/${exampleQuery}`, {headers: { Authorization: `Bearer ${token.accessToken}`, Accept : 'application/json;odata=verbose' }})
    console.log(JSON.stringify(data, null, 2))
  } catch (error) {
    console.log(error)
  }
})()