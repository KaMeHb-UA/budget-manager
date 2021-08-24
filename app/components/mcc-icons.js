import config from './config.js';

const { default: defaultIcon, icons } = await config('mcc-icons');
const db = {};
for(const icon in icons){
    for(const mcc of icons[icon]){
        if(typeof mcc === 'number') db[mcc] = icon;
        else {
            const [ start, end ] = mcc;
            for(let i = start; i <= end; i++) db[i] = icon;
        }
    }
}

export default code => db[+code] || defaultIcon;
