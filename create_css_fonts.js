const fs = require("fs").promises;
const { Stats } = require("fs");

const path = require("path");
const curr = "/fonts-main/apache";
let dir = path.join(__dirname, curr);


async function files() {

    let out = fs.readdir(dir)
        .then((data) => {
            return Promise.resolve(data);
        })
        .catch((err) => {
            return Promise.reject(err);
        })
    return out;
}

async function loop() {
    try {
        const data = await files();
        const obj = {};
        let id = 0;
        for (let j of data) {
            dir = path.join(__dirname, curr + `/${j}`);
            const sub_data = await files();
            const modified = sub_data.filter((k) => {
                return (k.toLowerCase().indexOf("italic") === -1) && (k.toLowerCase().indexOf("bold") === -1) && (k.toLowerCase().indexOf(".ttf") !== -1) ? true : false;
            });


            for (let k of modified) {
                let buffer = `@font-face{\n\tfont-family:\"${k.slice(0, k.length - 4).split("[")[0]}\";\n\tsrc: url(\"${curr + "/" + j + "/" + k}\");\n}\n`;
                await fs.appendFile("./public/css/font.css", buffer);
                obj[id] = k.slice(0, k.length - 4).split("[")[0];
                id++;
            }


        }
        await fs.appendFile("font.txt", JSON.stringify(obj));

    }
    catch (e) {
        console.error(e);
    }
}
loop();


