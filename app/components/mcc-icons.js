// @ts-ignore
import codesArr from './mcc-codes.cjs';
import icons, { defaultIcon } from './mcc-icons-db.js';

/** @type {{[x: number]: string}} */
const codeDescriptionMap = {};

codesArr.forEach(({ mcc, irs_description }) => codeDescriptionMap[+mcc] = irs_description);

export default code => icons[codeDescriptionMap[+code]] || defaultIcon;
