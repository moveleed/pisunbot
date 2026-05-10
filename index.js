import { Telegraf } from "telegraf";
import 'dotenv/config'

const bot = new Telegraf(process.env.TOKEN)

bot.command('start', async (ctx) => {
    ctx.reply('здарова.\nпиши раз в 4 часа /dick и твой хуй будет увеличиваться/уменьшаться')
})

const dicks = {} 
const cooldowns = new Map()

bot.on('text', async (ctx) => {
    // Basic filter for the command
    if (ctx.message.text !== '/dick') return;

    try {
        const id = ctx.from.id; // Removed ()
        const now = Date.now();
        const COOLDOWN_TIME = 4 * 60 * 60 * 1000;
//        const COOLDOWN_TIME = 4

        // 1. Check Cooldown
        if (cooldowns.has(id)) { // Changed [] to ()
            const expirationTime = cooldowns.get(id) + COOLDOWN_TIME;
            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000 / 60;
                return await ctx.reply(`ты слишком часто дрочишь подожди еще чуть чуть пожалуйста пожалей свои яйца еще немного а вернее ${timeLeft.toFixed(1)} минут`);
            }
        }

        // 2. Initialize size if new user
        if (dicks[id] === undefined) dicks[id] = 10; 

        // 3. Logic for growth/shrinkage using ranges
        const chance = Math.random();
        let uvelich;

        if (chance < 0.05) uvelich = -4;      // 5% chance
        else if (chance < 0.20) uvelich = -2; // 15% chance
        else if (chance < 0.40) uvelich = 0;  // 20% chance
        else if (chance < 0.70) uvelich = 1;  // 30% chance
        else if (chance < 0.90) uvelich = 3;  // 20% chance
        else uvelich = 5;                     // 10% chance

        dicks[id] += uvelich;
        cooldowns.set(id, now); // DON'T FORGET TO UPDATE COOLDOWN

        // 4. Replies
        if (uvelich > 0) {
            await ctx.reply(`ты успешно подрочил свой пеструнчик!\nтвой хуй вырос на ${uvelich} см\nтеперь его размер составляет ${dicks[id]}см\nвозвращайся через 4 часа`);
        } else if (uvelich === 0) {
            await ctx.reply(`ты подрочил, но твой хуй не вырос. его размер все так же ${dicks[id]}\nвозвращайся через 4 часа`);
        } else {
            await ctx.reply(`ты подрочил и твой хуй стал меньше!\nты проебал ${uvelich} от своего размера\nтеперь у тебя: ${dicks[id]} см\nвозвращайся через 4 часа`);
        }

    } catch (e) {
        console.error(e);
    }
});

bot.launch()