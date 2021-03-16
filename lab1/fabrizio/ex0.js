'use strict';

const test = ['the brown fox', 'a black dog', 'yellow bird', 'gg', 'ace'];

const compute = (array) => {
    array.forEach((element, i) => {
        let computed = '';

        if (element.length >= 2)
            computed = element.slice(0, 2) + element.slice(-2);

        array.splice(i, 1, computed);
    });
}

const main = () => {
    console.log(test);
    compute(test);
    console.log(test);
}

main()