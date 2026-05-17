import { Telegraf } from "telegraf";
import 'dotenv/config'
import http from 'http'
import { getUser, setUser, updateUser } from "./database.js";

const bot = new Telegraf(process.env.TOKEN)

const cooldowns = new Map()
// const COOLDOWN_TIME = 4 * 60 * 60 * 1000;
const COOLDOWN_TIME = 4 ;

bot.command('start', async (ctx) => {
    ctx.reply('здарова.\nпиши раз в 4 часа /dick и твой хуй будет увеличиваться/уменьшаться')
})

bot.on('text', async (ctx) => {
    if (ctx.message.text !== '/dick') return;

    try {
        const id = ctx.from.id;
        const now = Date.now();

        if (cooldowns.has(id)) {
            const expirationTime = cooldowns.get(id) + COOLDOWN_TIME;
            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000 / 60;
                return await ctx.reply(
                    `ты слишком часто дрочишь, подожди еще ${timeLeft.toFixed(1)} минут`
                );
            }
        }

        let user = getUser(id);
        if (!user) {
            setUser(id, { dick: 10 });
            user = { dick: 10 };
            console.log(`новый пользователь ${id}, выдал 10см`);
        }

        const chance = Math.random();
        let uvelich;
        if (chance < 0.05)       uvelich = -4; // 5%
        else if (chance < 0.20)  uvelich = -2; // 15%
        else if (chance < 0.40)  uvelich =  0; // 20%
        else if (chance < 0.70)  uvelich =  1; // 30%
        else if (chance < 0.90)  uvelich =  3; // 20%
        else                     uvelich =  5; // 10%

        user.dick += uvelich;
        cooldowns.set(id, now);

        // Reset if went below 0
        if (user.dick <= 0) {
            updateUser(id, { dick: 10 });
            return await ctx.reply(
                'поздравляю блять. ты додрочился до отрицательного хуя.\nя сбросил твой "прогресс" и вернул тебе 10см'
            );
        }

        updateUser(id, { dick: user.dick }); 

        if (uvelich > 0) {
            await ctx.reply(
                `ты успешно подрочил свой пеструнчик!\nтвой хуй вырос на ${uvelich} см\nтеперь его размер: ${user.dick}см\nвозвращайся через 4 часа`
            );
        } else if (uvelich === 0) {
            await ctx.reply(
                `ты подрочил, но хуй не вырос. его размер все так же ${user.dick}см\nвозвращайся через 4 часа`
            );
        } else {
            await ctx.reply(
                `ты подрочил и твой хуй стал меньше!\nты потерял ${Math.abs(uvelich)} см\nтеперь у тебя: ${user.dick}см\nвозвращайся через 4 часа`
            );
        }

    } catch (e) {
        console.error(e);
    }
});

bot.launch()
console.log('bot is alive')

const server = http.createServer((req, res) => {
    res.write('I am alive');
    res.end();
}).listen(process.env.PORT || 3000);

process.once("SIGINT", () => { bot.stop("SIGINT"); server.close(); });
process.once("SIGTERM", () => { bot.stop("SIGTERM"); server.close(); });