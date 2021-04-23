//zoom configure
let WIDTH_OF_PAPER = 793.632;
let ZOOM = 100;
let MAX_ZOOM = 150;
let MIN_ZOOM = 80;
let ZOOM_INC = 10;

function add_specificity_to_css(unique_id, css_str) {
    let stack_num = 0;
    let added_specificity = false;
    let new_str = "";
    for (let i of css_str) {
        if ((stack_num === 0) && (added_specificity === false)) {
            if (i !== "\n") {
                new_str += `${unique_id} `;
                added_specificity = true;
            }
        }
        if (i === "{") {
            stack_num++;
        }
        if (i === "}") {
            stack_num--;
            if (stack_num === 0) {
                added_specificity = false;
            }
        }
        new_str += i;
    }
    return new_str;
}
const note_container = document.querySelector(".contain_notes");
const notes = {};

let int = 1;
for (let i in data) {
    notes[i] = JSON.parse(JSON.stringify(data[i]));
}
function fill_str(str) {
    let ret = str + "...";
    return ret;
}

const toc = document.querySelector(".table-of-content");
toc.innerHTML = `<thead>
                    <tr>
                        <th>
                            Table of content
                        </th>
                        <th>
                            Notes
                        </th>
                    </tr>
                </thead>
                <tbody>`;
let k = 0;
for (let i in notes) {
    k++;
    let a = `note${k}`;
    // let a = "#som";
    toc.innerHTML += `<tr>
                        <td>
                            <div class="hash ${a}">${fill_str(i.slice(1, -1).substr(0, 20))}</div>
                        </td>
                        <td>
                        <div class="hash ${a}">${k}</div>
                        </td> 
                    </tr>`;
    // k++;
}
toc.innerHTML += "</tbody>";

//set note values
let is_fullscreen = false;
if (document.URL.indexOf("list") !== -1) {
    document.querySelector(".num_of_notes").innerText = Object.keys(notes).length;
    document.querySelector(".is_fit_screen").innerText = is_fullscreen;
    document.querySelector(".zoom_info").innerText = ZOOM + "%";
}

const hash = document.querySelectorAll(".hash");
const par = document.querySelector(".contain_notes");
for (let i of hash) {
    i.addEventListener("click", (e) => {
        let id = e.target.className.split(" ")[1];


        for (let j = 0; j < par.childElementCount; j++) {
            console.log(par.children[j].id, id)
            par.children[j].id.trim() === id.trim() ? note_container.scroll({
                top: par.children[j].offsetTop - 100,
                behavior: 'smooth'
            }) : false;

        }

    })
}
const cover_table = document.querySelector(".coverTable");
function fix_toc() {

    cover_table.style.top = `calc(${window.getComputedStyle(document.querySelector(".contain_type")).height} + 4.2rem)`;

    cover_table.style.height = "100%";
}

if (document.URL.indexOf("list") !== -1) {
    if (note_container !== undefined) {
        for (let i in notes) {
            //create divs
            const wrap_div = document.createElement("div");
            const header = document.createElement("div");
            const note = document.createElement("div");

            //append them
            wrap_div.append(header);
            wrap_div.append(note);
            // wrap_div.append(footer);
            note_container.append(wrap_div);
            //classlist styles
            header.classList.add("header");
            wrap_div.classList.add("wrapNote");
            note.classList.add("note");

            //add unique note id
            let unique_id = `note${int} `;
            wrap_div.setAttribute("id", unique_id);
            //adding text and css
            header.innerText = i.slice(1, i.length - 1);

            note.innerHTML = notes[i].html;
            for (let i = 0; i < note.childElementCount; i++) {
                note.children[0].style.boxSizing = "border-box";
            }
            document.head.innerHTML += `< style > ${add_specificity_to_css("#" + unique_id, notes[i].css)}</style > `;


            int++;
        }

    }
}
//resize
const fit_scr = document.querySelector("#fit-screen");
const allNotes = document.querySelector(".allNotes");
function resize(width) {
    if (document.URL.indexOf("list") !== -1) {
        if (width < 814) {
            if (fit_scr.className.indexOf("selectd") === -1) {
                note_container.style.marginLeft = `${((830 - width) + (ZOOM - 100) * 8 + 1)}px`;
            }
            else {
                note_container.style.marginLeft = ``;
            }
        }
        else {
            note_container.style.marginLeft = ``;
        }
    }
    const scr = document.querySelector("#fit-screen");
    const scr1 = document.querySelector("#cont");
    const scr2 = document.querySelector("#search");

    try {

        scr1.childNodes[1].remove();
        scr2.childNodes[1].remove();
        scr.childNodes[1].remove();

    }
    catch (e) {
        console.log();
    }

    if (width >= 674) {
        try {

            scr1.innerHTML += " Content";
            scr2.innerHTML += " Search";
            scr.innerHTML += " Fit screen";

        }
        catch (e) {
            console.log();
        }
    }
}
window.addEventListener("resize", (e) => {

    let width = e.srcElement.innerWidth;
    console.dir(e);
    resize(width);
    fix_toc();


});

let begin = -1;
let end = 0;
function clear_search(node) {
    const find = document.querySelectorAll(".search-result-a");
    for (let i of find) {
        i.innerHTML = i.innerText;
        const text = document.createTextNode(i.innerText);
        i.replaceWith(text);
    }
    begin = -1;
    end = 0;

}
function recursive_search(node, search_str) {
    Array.from(node.childNodes).forEach((n) => {
        if ((n.localName !== "script") && (n.localName != "style")) {
            if (n.nodeName === "#text") {
                let a = n.data;
                n.data = "";
                const new_data = document.createElement("span");
                new_data.classList.add("search-result-a");
                new_data.innerHTML = a.replaceAll(search_str, "<span style='background-color:greenyellow;' class='search-result-b'>" + search_str + "</span>");
                n.replaceWith(new_data);
            }
            else if (typeof (n) === "string") {
                console.log(n);
            }
            recursive_search(n, search_str);
        }

    })
}
const feed = document.querySelector(".output");

function focus_curr_search(op, nodeList) {
    if (op === "pos") {
        if (begin < end - 1) {
            if (begin > -1) {
                nodeList[begin].style.backgroundColor = "greenyellow";
            }
            begin++;
            // window.scrollTo(0, nodeList[begin].offsetTop - document.querySelector('header').offsetHeight - document.querySelector('.contain_type').offsetHeight);
            note_container.scroll({
                top: nodeList[begin].offsetTop - 500,
                behavior: 'smooth'
            });
            nodeList[begin].style.backgroundColor = "violet";
        }
    }
    if (op === "neg") {
        if (begin > 0) {
            nodeList[begin].style.backgroundColor = "greenyellow";
            begin--;
            // window.scrollTo(0, nodeList[begin].offsetTop - document.querySelector('header').offsetHeight);
            note_container.scroll({
                top: nodeList[begin].offsetTop - 500,
                behavior: 'smooth'
            });
            nodeList[begin].style.backgroundColor = "violet";
        }
    }
    if (end > 0) {
        feed.innerText = `${begin + 1} of ${end}`;
    }
    else {
        const feed = document.querySelector(".output");
        feed.innerText = `0 of 0`;
    }

}
const search_btn = document.querySelector("#search");
const search_reg = document.querySelector(".wrap-searcher");
let current_note = 0;
function output() {
    const value = document.querySelector(".wrap-search-input input").value;
    if (document.URL.indexOf("list") !== -1) {
        clear_search(par);
        recursive_search(par, value);
    }
    else {
        let num = 0;
        let found = 0;
        let curr_index = 0;
        Array.from(par.children).forEach((i) => {
            if (i.localName !== "script") {
                if (num === current_note) {
                    found = curr_index;

                }
                num++;
            }
            curr_index++;
        })
        clear_search(par.children[found]);
        if (search_reg.className.indexOf("show-search") !== -1) {
            recursive_search(par.children[found], value);
        }
    }
    if (value !== "") {
        const out = document.querySelectorAll(".search-result-b");
        end = out.length;
        focus_curr_search("pos", out);
    }
    else {
        feed.innerText = ``;
    }
}

let start = parseFloat(window.getComputedStyle(document.body).width);
resize(start);
fix_toc();

document.querySelector("#cont").addEventListener("click", (e) => {
    cover_table.classList.toggle("show");
})

search_btn.addEventListener("click", (e) => {
    if (search_reg.className.indexOf("show-search") === -1) {
        search_reg.classList.add("show-search");
        output();
    }
})

const times = document.querySelector(".i .fa-times");
times.addEventListener("click", (e) => {
    search_reg.classList.remove("show-search");
    clear_search();

})
const up_search = document.querySelector(".i .fa-arrow-up");
up_search.addEventListener("click", (e) => {
    const out = document.querySelectorAll(".search-result-b");
    focus_curr_search("neg", out);

})
const down_search = document.querySelector(".i .fa-arrow-down");
down_search.addEventListener("click", (e) => {
    const out = document.querySelectorAll(".search-result-b");
    focus_curr_search("pos", out);

})
document.querySelector(".wrap-search-input input").addEventListener("input", (e) => {

    output();

})

if (document.URL.indexOf("list") !== -1) {
    fit_scr.addEventListener("click", () => {
        fit_scr.classList.toggle("selectd");
        note_container.classList.toggle("fit");
        let start = parseFloat(window.getComputedStyle(document.body).width);
        resize(start);
        is_fullscreen = !is_fullscreen;
        document.querySelector(".is_fit_screen").innerText = is_fullscreen;

    })

    const zoom_in = document.querySelector("#zoom_in");
    const zoom_out = document.querySelector("#zoom_out");

    zoom_in.addEventListener("click", () => {
        if ((ZOOM > MIN_ZOOM) && (fit_scr.className.indexOf("selectd") === -1)) {
            ZOOM -= ZOOM_INC;
            document.querySelector(".zoom_info").innerText = ZOOM + "%";
            let fraction = ZOOM / MIN_ZOOM;
            let diff_from_hundred = 100 / MIN_ZOOM;

            let new_width = fraction * (WIDTH_OF_PAPER / diff_from_hundred);

            let new_height = new_width * 1.41421;
            console.log(new_width, new_height);

            note_container.style.width = new_width + "px";
            note_container.style.height = new_height + "px";
            let start = parseFloat(window.getComputedStyle(document.body).width);
            resize(start);
        }
    });
    zoom_out.addEventListener("click", () => {
        if ((ZOOM < MAX_ZOOM) && (fit_scr.className.indexOf("selectd") === -1)) {
            ZOOM += ZOOM_INC;
            document.querySelector(".zoom_info").innerText = ZOOM + "%";
            let fraction = ZOOM / MIN_ZOOM;
            let diff_from_hundred = 100 / MIN_ZOOM;

            let new_width = fraction * (WIDTH_OF_PAPER / diff_from_hundred);

            let new_height = new_width * 1.41421;
            console.log(new_width, new_height);

            note_container.style.width = new_width + "px";
            note_container.style.height = new_height + "px";
            let start = parseFloat(window.getComputedStyle(document.body).width);
            resize(start);
        }
    });
}