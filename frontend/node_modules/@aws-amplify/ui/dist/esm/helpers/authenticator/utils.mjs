import { ALLOWED_SPECIAL_CHARACTERS, emailRegex } from './constants.mjs';

// replaces all characters in a string with '*', except for the first and last char
const censorAllButFirstAndLast = (value) => {
    const split = value.trim().split('');
    for (let i = 0; i < split.length; i++) {
        if (i > 0 && i < split.length - 1) {
            split[i] = '*';
        }
    }
    return split.join('');
};
// censors all but the last four characters of a phone number
const censorPhoneNumber = (val) => {
    if (val.length < 4) {
        return val;
    }
    const split = val.split('');
    for (let i = 0; i < split.length - 4; i++) {
        split[i] = '*';
    }
    return split.join('');
};
// censors all but the first and last of the name of an email and keeps domain
const censorEmail = (val) => {
    const splitEmail = val.split('@');
    const censoredName = censorAllButFirstAndLast(splitEmail[0]);
    return `${censoredName}@${splitEmail[1]}`;
};
// based on the ContactMethod type, returns a censored contact value
const censorContactMethod = (type, value) => {
    return type === 'Phone Number'
        ? censorPhoneNumber(value)
        : censorEmail(value);
};
const hasSpecialChars = (password) => ALLOWED_SPECIAL_CHARACTERS.some((char) => password.includes(char));
const getTotpCodeURL = (issuer, username, secret) => encodeURI(`otpauth://totp/${issuer}:${username}?secret=${secret}&issuer=${issuer}`);
function trimValues(values, ...ignored) {
    return Object.entries(values).reduce((acc, [name, value]) => ({
        ...acc,
        [name]: ignored.includes(name) ? value : value?.trim(),
    }), {});
}
const isValidEmail = (value) => {
    if (!value)
        return false;
    return emailRegex.test(value);
};

export { censorAllButFirstAndLast, censorContactMethod, censorEmail, censorPhoneNumber, getTotpCodeURL, hasSpecialChars, isValidEmail, trimValues };
