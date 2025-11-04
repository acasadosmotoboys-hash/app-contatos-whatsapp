import { Client } from 'whatsapp-web.js'
import qrcode from 'qrcode'

let client: Client | null = null
let qrString: string | null = null

export const getClient = () => client

export const initClient = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (client) {
      resolve(qrString || '')
      return
    }

    client = new Client()

    client.on('qr', (qr) => {
      qrString = qr
      resolve(qr)
    })

    client.on('ready', () => {
      console.log('WhatsApp client is ready!')
    })

    client.on('auth_failure', (msg) => {
      console.error('Authentication failed:', msg)
      reject(new Error('Authentication failed'))
    })

    client.initialize().catch(reject)
  })
}

export const getContacts = async (): Promise<any[]> => {
  if (!client) throw new Error('Client not initialized')

  const chats = await client.getChats()
  const contacts = []

  for (const chat of chats) {
    if (chat.isGroup) continue // Skip groups for now

    const contact = await chat.getContact()
    contacts.push({
      name: contact.name || contact.pushname || contact.number,
      number: contact.number,
      id: contact.id._serialized,
    })
  }

  return contacts
}