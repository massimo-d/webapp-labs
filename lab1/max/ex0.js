let a = ['string1','string2','string3','string4','ab', 'ace', 's', 'sciao' ];
a.forEach((el, i) => {
    let b = "";
    if (el.length >= 2){
        b += el.substr(0,2);
        b += el.substr(el.length - 2, 2);
    }
    a[i]=b;
});
console.log(a);