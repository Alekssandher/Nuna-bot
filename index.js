import { Client, GatewayIntentBits, REST, Routes } from "discord.js"
import dotenv from "dotenv"

import axios from "axios"
dotenv.config()

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
})

// Verifica se o bot está pronto
client.once("ready", () => console.log("Bot is ready!"))

// Realiza o login do bot
client.login(process.env.TOKEN)

// Verifica se alguma mensagem foi enviada no chat do Discord e responde caso a mensagem seja "hello"
client.on("messageCreate", async message => {
  if (message.author.bot) return

  if (!!message.content && message.content.toLowerCase() === "teste") {
    message.reply(`Hello ${message.author.username}!`)
  }
  if (!!message.content && message.content.toLowerCase() === 'yuki') {
    message.reply('o yuki é um bobão')
  }
  if (!!message.content && message.content.toLowerCase() === 'bom dia') {
    message.reply('Bom dia', message.author.username)
  }
  if (!!message.content && message.content.toLowerCase() === 'gerar carteira'){
    gerarCarteira(message)


  }
})

async function gerarCarteira(message) {
  try {
      // Faz a requisição para a API na Vercel
      const response = await axios.get('https://cripto-wallet.vercel.app/generate-wallet');
      
      // Extrai as informações da carteira
      const carteira = response.data; // Aqui, `carteira` é um objeto JSON

      // Responde com o endereço e outras informações, se necessário
      message.reply(`Sua nova carteira de Bitcoin foi gerada com sucesso!\nEndereço: ${carteira.address}\nChave Privada: ${carteira.privateKey}\nSeed: ${carteira.seed}`);
  } catch (error) {
      console.error('Erro ao gerar a carteira:', error);
      message.reply('Não foi possível gerar a carteira, tente novamente mais tarde.');
  }
}

// Cria um comando de slash /hello no Discord que responde com "Hello World!"
client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return

  if (interaction.commandName === "hello") {

    await interaction.reply("Hello world")

  }
})


// Lista de commandos de slash
const commands = [
  {
    name: "hello",
    description: "Replies with Hello World!",
  },
]

// Sincroniza os comandos de slash com o Discord
const rest = new REST({ version: "10" }).setToken(process.env.TOKEN)

;(async () => {
  try {
    console.log("Started refreshing application (/) commands.")

    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
      body: commands,
    })

    console.log("Successfully reloaded application (/) commands.")
  } catch (error) {
    console.error(error)
  }
})()

