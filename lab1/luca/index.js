"use strict";

const strings = ["abracadabra", "abba", "ab", "a"];

const s = "ciao";


const edit = (array) => {
    array.forEach((s,i) => array[i] = (s.length < 2 ) ? "" : s.substr(0, 2) + s.substr(s.length-2));
}

const main = () => {
    console.log(strings);
    edit(strings);
    console.log(strings);
}

main();