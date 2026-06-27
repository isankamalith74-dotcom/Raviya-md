const { default: makeWASocket, useMultiFileAuthState, delay } = require('@whiskeysockets/baileys');
const pino = require('pino');

async function startBot(phone) {
    return new Promise(async (resolve, reject) => {
        try {
            // Clean phone number format
            let formattedPhone = phone.replace(/[^0-9]/g, '');
            
            const { state, saveCreds } = await useMultiFileAuthState('./session');
            
            const sock = makeWASocket({
                auth: state,
                printQRInTerminal: false,
                logger: pino({ level: 'silent' })
            });

            if (!sock.authState.creds.registered) {
                await delay(1500); // Small delay for initialization
                const code = await sock.requestPairingCode(formattedPhone);
                resolve(code);
            } else {
                resolve("Already Linked!");
            }

            sock.ev.on('creds.update', saveCreds);
            
            sock.ev.on('connection.update', (update) => {
                const { connection, lastDisconnect } = update;
                if (connection === 'close') {
                    console.log("Connection closed, ready for next trial.");
                } else if (connection === 'open') {
                    console.log("WhatsApp Bot Successfully Connected!");
                }
            });

        } catch (error) {
            reject(error);
        }
    });
}

module.exports = { startBot };

