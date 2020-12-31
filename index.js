const fs = require('fs');
//https://www.definitions.net/definition/louder

const mainFunc = () => {
    return new Promise((resolve) => {
        fs.readFile("./data/data.txt", 'utf8', (err, data) => {

            if (err) throw err;
            data = cleanData(data);
            const words = data.split(' ');
            let msg = '';
            if (data === "") {
                //generatePart();
                console.log('enpty txt file');
                return;
            }
            fs.readFile('./data/words.json', 'utf8', (err, data) => {

                let obj = JSON.parse(data);
                //to isolate just the word value
                let values = obj.map(e => {
                    return e.value;
                });
                msg = 'old value: ' + values.length;
                let old = values.length;

                for (var i = 0; i < words.length; i++) {
                    //check if obj[i].value has a new value
                    if (values.indexOf(words[i]) === -1) {
                        //update value list
                        values.push(words[i]);
                        obj.push({
                            value: words[i],
                            date: new Date(),
                            first: words[i].split('')[0]
                        });
                    }
                }
                msg += '\n' + 'new value: ' + values.length;
                //to clean old data
                fs.writeFileSync('./data/data.txt', '', 'utf-8');
                //end message
                console.log(msg);
                console.log('=== new words ===');
                let arr = values.slice(old--, values.length);
                console.log(arr);
                console.log('=== 15 random words ===');
                obj = randomTwelve(obj);
                let json = JSON.stringify(obj);
                fs.writeFile('./data/words.json', json, 'utf8', () => { });
                showData(obj, randText());
                //returning via promisse all values
                resolve([msg, '=== new words ===',
                    ...arr, '=== 15 random words ===', ...words15]);
            });
        });
    });
}

const cleanData = (txt) => {
    txt = txt.split('.').join('');
    txt = txt.split(';').join('');
    txt = txt.split(',').join('');
    txt = txt.split(':').join('');
    txt = txt.split('(').join('');
    txt = txt.split(')').join('');
    txt = txt.split('!').join('');
    txt = txt.split('/').join('');
    txt = txt.split(')').join('');
    txt = txt.split('’').join("'");
    return txt.toLowerCase();
}

const showData = (obj, text) => {

    let filtered = obj.filter(o => o.value.includes(text));

    if (filtered.length > 0) {
        //save the part just if it returns one or more words
        fs.readFile('./data/part.json', 'utf8', (err, data) => {
            let obj = JSON.parse(data);
            obj.push(text);
            //preparing data to export
            const json = JSON.stringify(obj);
            fs.writeFile('./data/part.json', json, 'utf8', () => { });
        });
    }
    console.log(filtered.map(m => m.value));
}

let words15 = [];

const randomTwelve = (db) => {

    let r = 0;
    //to clean the var for the next round
    words15 = [];

    for (let index = 0; index < 15; index++) {
        try {
            r = Math.floor(Math.random() * db.length + 1);
            if (r >= db.length) r = db.length - 1;

            if (db[r].value !== void 0) {
                //to avoid undefined error
                words15.push(db[r].value);
                db[r].times === void 0 ? db[r].times = 1 : db[r].times++;
            } else {
                index--;
            }
        } catch (e) {
            console.log(`error at ${r}`);
            index--;
        }
    }


    console.log(words15);
    return db;
}

const randText = () => {
    let part = '';
    let len = Math.floor(Math.random() * 3) + 2;
    let char = 0;

    for (let i = 0; i < len; i++) {

        char = Math.floor(Math.random() * 25) + 65;
        part += String.fromCharCode(char);

    }

    console.log(part.toLowerCase(), ' pesquisando...');
    return part.toLowerCase();
}

const generatePart = () => {
    //the goal here is to combine letter to form word's parts
    // for example: aa, ing, due, bo, od
    // so I can mesure what part has or has'nt words
    console.log(String.fromCharCode(65));
    console.log(String.fromCharCode(90));
}
//20201219 to acess data.txt via node.js

const updateTxt = (value, fn) => {
    fs.writeFileSync('./data/data.txt', value, 'utf-8');
    mainFunc().then(data => fn(data));
}

const status = (callback) => {
    fs.readFile('./data/words.json', 'utf8', (err, data) => {
        let obj = JSON.parse(data);
        let num = topX(1, 9);
        num.forEach((e, i) => {
            num[i] = obj.filter((e) => e.times === num[i]).length;
        });
        const zero = obj.length - num.reduce((a, b) => a + b);
        callback(["0: " + zero + ' ' + (100 * zero / obj.length).toFixed(2) + "%",
        ...num.map((m, i) => `${i + 1}: ${m} ${(100 * m / obj.length).toFixed(2)}%`),
        (zero + num.reduce((a, b) => a + b)) - obj.length === 0 ? 'all good' : 'wtf']);
    });
}

const topX = (a, b) => {

    let arr = [];
    for (let i = a; i <= b; i++) {
        arr.push(i);
    }
    return arr;
}

//mainFunc();

module.exports = { updateTxt, status };