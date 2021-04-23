function off(node) {
    node.style.visibility = "hidden";
    node.style.height = 0;
    node.style.overflow = "hidden";
    node.style.padding = 0;
}
function on(node) {
    node.style.visibility = "visible";
    node.style.height = "";
    node.style.overflow = "";
    node.style.padding = "";
}

off(header);
const contain_type = document.querySelector(".contain_type");
off(contain_type);

const arrow = document.querySelector(".arrow-img");

arrow.addEventListener("click", () => {
    on(contain_type);
    on(header);
    off(arrow);
})

const hide = document.querySelector("#hide");
hide.addEventListener("click", () => {
    off(header);
    off(contain_type);
    on(arrow);
})


int = 0;

function hide_page(node) {
    node.classList.add("hide_box");
}
function show_page(node) {
    node.classList.remove("hide_box");
}

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
        let unique_id = `note${int + 1} `;
        wrap_div.setAttribute("id", unique_id);
        //adding text and css
        header.innerText = i.slice(1, i.length - 1);

        note.innerHTML = notes[i].html;
        for (let i = 0; i < note.childElementCount; i++) {
            note.children[0].style.boxSizing = "border-box";
        }
        document.head.innerHTML += `< style > ${add_specificity_to_css("#" + unique_id, notes[i].css)}</style > `;
        if (int !== current_note) {
            hide_page(wrap_div);

        }
        int++;
    }

}

//controls
const left = document.querySelector(".fa-arrow-left");
const right = document.querySelector(".fa-arrow-right");
left.addEventListener("click", () => {

    if (current_note > 0) {
        let num = 0;
        Array.from(par.children).forEach((i) => {
            if (i.localName !== "script") {
                if (num === current_note) {
                    hide_page(i);
                }
                if (num === current_note - 1) {
                    show_page(i);
                }
                num++;

            }
        })
        current_note -= 1;
        if (current_note === 0) {
            left.setAttribute("id", "grey");
        }
        if (current_note + 1 !== Object.keys(notes).length) {
            right.setAttribute("id", "");
        }
    }
    output();

})
right.addEventListener("click", () => {

    if (current_note + 1 < Object.keys(notes).length) {
        let num = 0;
        Array.from(par.children).forEach((i) => {
            if (i.localName !== "script") {
                if (num === current_note) {
                    hide_page(i);
                }
                if (num === current_note + 1) {
                    show_page(i);
                }
                num++;
            }
        })
        current_note += 1;
        if (current_note !== 0) {
            left.setAttribute("id", "");
        }
        if (current_note + 1 === Object.keys(notes).length) {
            right.setAttribute("id", "grey");
        }
    }
    output();

})
function jump_to(paper_num) {
    if ((paper_num >= 0) && (paper_num < Object.keys(notes).length)) {
        let num = 0;
        Array.from(par.children).forEach((i) => {
            if (i.localName !== "script") {
                if (num === current_note) {
                    hide_page(i);
                }
                if (num === paper_num) {
                    show_page(i);
                }
                num++;
            }
        })
        current_note = paper_num;
        if (current_note !== 0) {
            left.setAttribute("id", "");
        }
        if (current_note === 0) {
            left.setAttribute("id", "grey");
        }
        if (current_note + 1 === Object.keys(notes).length) {
            right.setAttribute("id", "grey");
        }
        if (current_note + 1 !== Object.keys(notes).length) {
            right.setAttribute("id", "");
        }
    }
    output();

}
function parse(node) {
    let number = parseInt(node.classList[1].split("note")[1]);
    jump_to(number - 1);


}
toc.addEventListener("click", (e) => {
    if (e.target.className.indexOf("hash") !== -1) {
        parse(e.target);
    }
})
jump_to();

