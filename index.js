const path = require("path");
//requiring and running express
const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//requiring and setting engine to ejs
app.set("view engine", "ejs");
const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));
//setting static files 
app.use("*/css", express.static(path.join(__dirname, "public/css")));
app.use("*/js", express.static(path.join(__dirname, "public/js")));
app.use("*/fonts-main", express.static(path.join(__dirname, "fonts-main")));
// app.use("*/", express.static(path.join(__dirname, "public/innerframe")));

//requiring and setting up method-override
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
//requiring ejs-mate

const session = require("express-session");
app.use(session({
    name: "session2",
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
        // secure: true
    }
}));
//requiring and using flash
const flash = require("connect-flash");
app.use(flash());



//globals
const fs = require("fs").promises;
const { Stats } = require("fs");
const e = require("express");
const { json } = require("express");
let note_dir = "./notes/";
let recovery_dir = note_dir;
const file_ext = ".notes";
const months = ["january", "febuary", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
let JSON_data;
const signature = ".notes";
async function files() {

    let out = fs.readdir(note_dir)
        .then((data) => {
            return Promise.resolve(data);
        })
        .catch((err) => {
            return Promise.reject(err);
        })
    return out;
}

const filter_and_mod = async () => {
    let output = await files();


    const split = output
        .filter((file) => {

            if ((file.indexOf(file_ext) !== -1) || (file.indexOf(".") === -1)) {
                return true;
            }
            else {
                return false;
            }
        })
        .map((file) => {
            return `${note_dir}${file}`;
        });

    return split;
}
async function get_file_stats() {
    const input = await filter_and_mod();
    const output = [];


    const promise = new Promise(async (res, rej) => {
        try {
            for (let i = 0; i < input.length; i++) {

                const data = await fs.stat(input[i]);


                output.push({ file_name: input[i].replace(note_dir, ""), file_size: data.size, ctime: time_str(data.birthtime) });
            }
            res(output);
        }
        catch (e) {
            rej(e);
        }
    });
    return await promise;

}
//helper classes
class error extends Error {
    constructor(status, message) {
        super();
        this.status = status,
            this.message = message
    }
    note() {
        if (this.status === 404) {
            return "We are very sorry to break it to you, but, the page you seek does not exist. Please check your spelling and try again or return to the home page.";
        }
        if (this.status === 406) {
            return "Seems like you inputted an incorrect value, please try to follow the valid string entry guidelines. Please return to the home page and retry."
        }
        if (this.status === 401) {
            return "Classy, seems you were trying to access a protected directory. Please go back home."
        }
    }
}
//helper functions
function difference(new_path) {
    let curr_path = __dirname;


    let curr = curr_path.split("\\");
    let new_ = new_path.split("\\");
    if (new_[new_.length - 1] === "") {
        new_.splice(new_.length - 1, new_.length);
    }

    let relative_path = "";
    let max_length = 0;
    if (curr.length > new_.length) {
        max_length = curr.length;
    }
    else {
        max_length = new_.length;
    }
    let corrects = 0;
    for (let i = 0; i < max_length; i++) {
        if (curr[i] === new_[i]) {
            corrects++;
            continue;
        }
        else {
            break;
        }
    }
    console.log(new_.length, corrects, curr.length);
    console.log(new_);
    if ((curr.length === corrects) && (corrects !== new_.length)) {
        relative_path = "./";
        for (let i = corrects; i < new_.length; i++) {
            relative_path += new_[i] + "/";
        }
    }
    else if ((new_.length === corrects) && (corrects !== curr.length)) {
        relative_path = "./";
        for (let i = corrects; i < curr.length; i++) {
            relative_path += "../";
        }
    }
    else if (new_.length > corrects) {
        relative_path = "./";
        for (let i = corrects; i < curr.length; i++) {
            relative_path += "../";
        }
        for (let i = corrects; i < new_.length; i++) {
            relative_path += new_[i] + "/";
        }
    }
    else {
        relative_path = "./";
    }
    console.log(relative_path);
    console.log(curr_path);
    console.log(new_path);
    return relative_path;
}

//calculate time difference
function time_str(diff) {
    const time = new Date();
    if (diff.getFullYear() !== time.getFullYear()) {
        let res = Math.abs(diff.getFullYear() - time.getFullYear());
        let str = res === 1 ? "year ago" : "years ago";
        return `${res} ${str}`;
    }
    else if (diff.getMonth() !== time.getMonth()) {
        let res = Math.abs(diff.getMonth() - time.getMonth());
        let str = res === 1 ? "month ago" : "months ago";
        return `${res} ${str}`;
    }
    else if (diff.getDate() !== time.getDate()) {
        let res = Math.abs(diff.getDate() - time.getDate());
        let str = res === 1 ? "day ago" : "days ago";
        return `${res} ${str}`;
    }
    else {
        return "Today";
    }
}
//validate the file/folder name to make sure no invalid char exist in the str
function validate_name(req, res, next) {
    let str = req.body.name;
    //char of invalid values
    const invalid = ["<", ">", ":", "\"", "/", "\\", "|", "?", "*", "."];
    //check to see if the length of string is valid too
    if (str.length > 260) {
        next(new error(406, "Data inputted is not acceptable"))
    }

    for (let i = 0; i < invalid.length; i++) {
        if (str.indexOf(invalid[i]) !== -1) {
            next(new error(406, "Data inputted is not acceptable"))
        }
    }
    //if the string name is empty
    if (str.length === 0) {
        next(new error(406, "Data inputted is not acceptable"))
    }
    if (str.trim() === "") {
        next(new error(406, "Data inputted is not acceptable"));
    }
    //return no error
    return next();

}
async function read(note_dir, file_name) {
    let data = await fs.readFile(note_dir + file_name);
    let parsed;
    try {
        parsed = JSON.parse([...data].map((e) => { return String.fromCharCode(e) }).reduce((string, e) => { return string + e; }));
    }
    catch (e) {
        parsed = "";
    }
    return parsed;
}





app.listen(3000, () => {
    console.log("Listening on port 3000");
});

app.use((req, res, next) => {
    res.locals.error = req.flash("error");
    return next();
})
//home directory
function issue(req, res, e) {

    req.flash("error", e.code);
    req.flash("error", e.errno);
    req.flash("error", e.message);

    res.status(400).redirect("/");
}
app.route("/")
    .get(async (req, res, next) => {
        try {
            const info = await get_file_stats();
            const time = new Date();
            info.unshift({ file_name: "..", file_size: "", ctime: time_str(time) });
            res.render("home", { info, curr_dir: path.join(__dirname, note_dir.slice(1, note_dir.length)) });
        }
        catch (e) {
            note_dir = recovery_dir;

            return issue(req, res, e);



        }
    });

app.route("/c_dir")
    .post(validate_name, async (req, res) => {
        try {
            let output = await files();
            let cur_str = req.body.name;
            for (let i = 0; true; i++) {
                if (output.indexOf(cur_str) !== -1) {
                    cur_str = `${req.body.name}(${i + 1})`;
                }
                else {
                    break;
                }
            }

            fs.mkdir(note_dir + "/" + cur_str)
                .then(() => {
                    res.redirect("/");
                })
                .catch((err) => {
                    res.send(err);
                })
        }
        catch (e) {
            return issue(req, res, e);
        }
    })
app.route("/c_file")
    .post(validate_name, async (req, res) => {
        try {
            let output = await files();
            let cur_str = req.body.name + ".notes";
            for (let i = 0; true; i++) {
                if (output.indexOf(cur_str) !== -1) {
                    cur_str = `${req.body.name}(${i + 1}).notes`;
                }
                else {
                    break;
                }
            }
            let buffer = {
                signature: signature,
                data: {}
            };
            console.log(JSON.stringify(buffer));
            fs.writeFile(note_dir + "/" + cur_str, JSON.stringify(buffer))
                .then(() => {
                    res.redirect("/");
                })
                .catch((err) => {
                    res.send(err);
                })
        }
        catch (e) {
            return issue(req, res, e);
        }
    })
app.route("/folder/:name")
    .get((req, res) => {
        recovery_dir = note_dir;
        note_dir += req.params.name + "/";


        res.redirect("/");
    })

app.route("/file/:name")
    .get(async (req, res, next) => {
        try {
            JSON_data = await read(note_dir, req.params.name);
            if (JSON_data.signature !== signature) {
                throw "";
            }

            res.render("homeScreen", { file_name: req.params.name });
        }
        catch (e) {
            return next(new error(406, "JSON File inputted is not acceptable"));
        }
    })
app.get("/file/:name/create_note/paper", (req, res) => {
    res.render("paper");
})
app.post("/file/:name/create_note/save", async (req, res) => {

    try {
        let out = await read(note_dir, req.params.name);
        out.data[req.body.name] = { css: req.body.css, html: req.body.html };
        await fs.writeFile(note_dir + "/" + req.params.name, JSON.stringify(out));
        res.send(out);
    }
    catch (e) {

        res.status(500).json({ error: e });

    }

})


app.route("/file/:name/create_note")
    .get(async (req, res, next) => {
        let data = await read(__dirname, "/font.txt");
        res.render("create_note", { fonts: data });
    })
app.route("/folder/parent/directory")
    .get((req, res) => {
        recovery_dir = note_dir;
        note_dir += ".." + "/";
        console.log(req);
        res.redirect("/");
    })
app.route("/delete")
    .post(async (req, res) => {
        const { file, folder } = req.body;
        try {
            if ((file !== undefined) && (typeof (file) !== "string")) {
                for (let f of file) {
                    await fs.rm(note_dir + "/" + f)


                }
            }
            else if (typeof (file) === "string") {
                await fs.rm(note_dir + "/" + file)

            }
            if ((folder !== undefined) && (typeof (folder) !== "string")) {
                for (let f of folder) {

                    await fs.rm(note_dir + "/" + f, { recursive: true })

                }
            }
            else if (typeof (folder) === "string") {
                await fs.rm(note_dir + "/" + folder, { recursive: true })
            }

            return res.redirect("/");
        }
        catch (e) {
            return issue(req, res, e);
        }
    })

app.route("/search/dir")
    .get((req, res) => {
        recovery_dir = note_dir;
        note_dir = difference(req.query.path);

        res.redirect("/");
    })


//get any unhandled route
app.route("*")
    .all((req, res, next) => {
        return next(new error(404, "Page not found"));
    })

//error handling middleware
app.use((err, req, res, next) => {

    res.status(err.status).render("error", { err });

});
