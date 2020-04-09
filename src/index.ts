import { config } from 'dotenv';
import Telegraf from 'telegraf';
import axios from 'axios';
import { get } from 'lodash';
import COUNTRIES from './countries.json';

// config dotenv
config();

const bot = new Telegraf(process.env.BOT_TOKEN || '');

const HOST = 'https://covid2019-api.herokuapp.com';

const getData = async (path: string): Promise<string> => {
    try {
        const response = await axios.get(`${HOST}${path.toLowerCase()}`);
        const data = get(response, 'data.data');
        return data ?
            `
        *${data.location || 'Global'}*
        - confirmed: ${data.confirmed}
        - deaths: ${data.deaths}
        - recovered: ${data.recovered}
        - active: ${data.active}
        ` :
            'Not found'
            ;
    } catch (error) {
        return 'Not found'
    }
}

const renderUsage = `
    *You can control me by sending these commands:*

    /all - global summary
    /[country] - a [country] summary (e.g. /vietnam or /us or /china)
    /help
`;

bot.start((ctx) => ctx.replyWithMarkdown(`
    *Welcome 👋 to [CovidBot](https://github.com/103cuong/kovid_bot).*

    Get realtime data about Coronavirus.

    ${renderUsage}
`));
bot.command('help', (ctx) => {
    ctx.replyWithMarkdown(renderUsage);
});
bot.command('all', async (ctx) => {
    ctx.replyWithMarkdown(await getData('/v2/total'));
});
bot.command(COUNTRIES, async (ctx) => {
    ctx.replyWithMarkdown(await getData(`/v2/country${ctx.message?.text}`));
});

bot.launch();
