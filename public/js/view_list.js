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

console.log(notes);
if (note_container !== undefined) {
    for (let i in notes) {
        //create divs
        const wrap_div = document.createElement("div");
        const header = document.createElement("div");
        const note = document.createElement("div");
        const footer = document.createElement("div");
        //append them
        wrap_div.append(header);
        wrap_div.append(note);
        wrap_div.append(footer);
        note_container.append(wrap_div);
        //classlist styles
        header.classList.add("header");
        wrap_div.classList.add("wrapNote");
        note.classList.add("note");
        footer.classList.add("pageNumber");
        //add unique note id
        let unique_id = `note${int}`;
        wrap_div.setAttribute("id", unique_id);
        //adding text and css
        header.innerText = i.slice(1, i.length - 1);
        // let str = `.${i.toUpperCase().slice(1, i.length - 1)}.`;
        // // let start_color = [173, 255, 47];
        // // let end_color = [229, 206, 246];
        // let start_color = [128, 0, 128];
        // let end_color = [255, 123, 255];
        // const color_arr = gradient(str, start_color, end_color);
        // //set each char value for the title
        // for (let i = 0; i < str.length; i++) {
        //     const char = document.createElement("span");
        //     char.innerText = str[i];
        //     char.style.color = `rgb(${color_arr[i]})`;
        //     header.append(char);
        // }

        note.innerHTML = notes[i].html;
        document.head.innerHTML += `<style>${add_specificity_to_css("#" + unique_id, notes[i].css)}</style>`;
        footer.innerText = int;
        int++;
    }
}
