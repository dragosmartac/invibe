// Function to convert from DjangoJSONEncoder datetime to JS DATE
import {AsyncStorage} from "react-native";

export const parseISOString = (s) => {
    // const b = s.split(/\D+/);
    // console.log(new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6])));
    return new Date(s.replace(/['"]+/g, ''));
};

export const formatAMPM = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return hours + ':' + minutes + ' ' + ampm;
};


// Function to generate a configurable size random string (usually used as a frontend_id generator)
export const genFrontendId = (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};

export const saveToLocalStorage = (key, data, errText) => {
    // console.log("saving...", key, data);
    AsyncStorage.setItem(key, JSON.stringify(data)).catch(err => console.log(errText, err));
};

export const retrieveFromLocalStorage = async (key, errText) => {
    const value = await AsyncStorage.getItem(key)
        .catch(err => console.log(errText, err));
    if (value) {
        return JSON.parse(value);
    }
    return null;
};


// isLessThanFun return true if a[i] < b[j]
export const mergeSortedArrays = (a, b, isLessThanFun) => {
    const res = [];
    let i = 0, j = 0;
    while (i < a.length && j < b.length) {
        if (isLessThanFun(a[i], b[j])) {
            res.push(a[i]);
            i++;
        }else {
            res.push(b[j]);
            j++;
        }
    }
    while (i < a.length) {
        res.push(a[i]);
        i++;
    }
    while (j < b.length) {
        res.push(b[j]);
        j++;
    }
    return res;
}