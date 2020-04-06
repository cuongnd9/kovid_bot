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
        const response = await axios.get(`${HOST}${path}`);
        const data = get(response, 'data.data');
        return data ?
            `
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

bot.command('global', async (ctx) => {
    ctx.reply(await getData('/v2/total'));
})
bot.command(COUNTRIES, async (ctx) => {
    ctx.reply(await getData(`/v2/country${ctx.message?.text}`));
})

bot.launch();
