const reg_ex_for_dir_search = /\.notes$/;
const search_results = 3;
const minimum_input_length = 2;
const list_of_files = [];
//checks to see if there is an invalid rgb number
function some(color_arr) {
    let over = color_arr.some((val) => {
        if ((val > 255) || (val < 0)) {
            return true;
        }
        return false;
    });
    //return bool, true - it has an invalid, false - valid
    return over;
}
//fxn to create text gradient.
function gradient(text, colora, colorb) {
    //try to see if it was possible
    try {
        let length = text.length;
        //if anything went wrong, send error
        if ((colora.length !== 3) || (colorb.length !== 3)) {
            throw "array must contain exactly three elements";
        }
        if ((some(colora) === true) || (some(colorb) === true)) {
            throw "array must contain exactly values between 0 and 255";
        }
        //if the string is empty, return no color gradient
        if (length === 0) {
            return [];
        }
        //calculate the color difference
        let increment_a = colorb[0] - colora[0];
        let increment_b = colorb[1] - colora[1];
        let increment_c = colorb[2] - colora[2];
        let start = [];
        //initiate deep copy
        for (let i = 0; i < colora.length; i++) {
            start.push(colora[i]);
        }
        //output array
        let color_output = [];
        //calcuate colors per calc
        for (let i = 0; i < length; i++) {
            color_output.push(`${Math.round(start[0])}, ${Math.round(start[1])}, ${Math.round(start[2])}`);
            start[0] += increment_a / (length - 1);
            start[1] += increment_b / (length - 1);
            start[2] += increment_c / (length - 1);
        }
        return color_output;
    }

    catch (e) {
        console.error(e);
    }
}
//get body
const body = document.body;
//create the header to contain the title 
const header = document.createElement("header");
//this variable stores the title
const title = ".notebook.";
//color gradient - values are between 0 - 255
//must contain exactly 3 values
let start_color = [173, 255, 47];
let end_color = [229, 206, 246];
const color_arr = gradient(title, start_color, end_color);
//set each char value for the title
for (let i = 0; i < title.length; i++) {
    const char = document.createElement("span");
    char.innerText = title[i];
    char.style.color = `rgb(${color_arr[i]})`;
    header.append(char);
}
//add the header to the body
const new_anc = document.createElement("a");
new_anc.setAttribute("href", "/");
new_anc.append(header);
new_anc.classList.add("offAnchor");
body.prepend(new_anc);
//create file/folder prompt page
function create_prompt(str, path) {
    //the full screen div - includes the opaque screen and the prompt
    const fill = document.createElement("div");
    fill.classList.add("fill");
    //the prompt box
    const prompt = document.createElement("form");
    prompt.setAttribute("action", path);
    prompt.setAttribute("method", "POST");
    prompt.classList.add("prompt");
    //the label asking for name of file or directory
    const label = document.createElement("label");
    label.setAttribute("for", "name");
    label.classList.add("label_name");
    label.innerText = `${str} name:`;
    //the input
    const text = document.createElement("input");
    text.setAttribute("id", "name");
    text.setAttribute("name", "name");
    text.setAttribute("placeholder", `Please enter a ${str} name`);
    text.classList.add("input_name");
    text.setAttribute("autocomplete", "off");
    text.setAttribute("spellcheck", false);
    //button wrap
    const wrap = document.createElement("div");
    wrap.classList.add("wrap");
    //red btn
    const red_btn = document.createElement("button");
    red_btn.innerText = "Cancel";
    red_btn.classList.add("red_btn");
    //green btn
    const green_btn = document.createElement("button");
    green_btn.innerText = "Submit";
    green_btn.classList.add("green_btn");
    //add the buttons to the wrap
    wrap.append(red_btn);
    wrap.append(green_btn);
    //append all stuff into the form
    prompt.append(label);
    prompt.append(text);
    prompt.append(wrap);

    //append prompt to fill
    fill.append(prompt);

    //see the output
    return fill;
}
//validate the file/folder name to make sure no invalid char exist in the str
function validate_name(str) {
    //char of invalid values
    const invalid = ["<", ">", ":", "\"", "/", "\\", "|", "?", "*", "."];
    //check to see if the length of string is valid too
    if (str.length > 260) {
        return { "err": "The file/folder name cannot be greater than 260 characters" };
    }

    for (let i = 0; i < invalid.length; i++) {
        if (str.indexOf(invalid[i]) !== -1) {
            return { "err": "The file/folder name cannot contain <, >, :, /, \\,|,?, ., and *" };
        }
    }
    //if the string name is empty
    if (str.length === 0) {
        return { "err": "The file/folder name cannot be empty" };
    }
    if (str.trim() === "") {
        return { "err": "The file/folder name cannot contain only whitespaces" };
    }
    //return no error
    return { "err": "none" };

}
//create a prompt
function click_create(str, path) {
    body.classList.add("no_overflow");
    body.append(create_prompt(str, path));
}
//validate file/folder name
function validate(search, e, doc, outer_doc) {
    if (outer_doc.getAttribute("class").indexOf(search) !== -1) {
        e.preventDefault();
        //validate the user name
        const { err } = validate_name(doc.value);
        //if there is no error

        if (err === "none") {
            //change th color of the underline to green
            doc.classList.remove("red_border");
            doc.classList.add("green_border");
            //set the fb message to positive
            if (doc.nextElementSibling.getAttribute("class").indexOf("sm") !== -1) {
                doc.nextElementSibling.remove();
            }
            const fb = document.createElement("div");
            fb.innerText = "Looks good!!!";
            fb.classList.add("sm");
            fb.classList.add("green");
            doc.insertAdjacentElement("afterend", fb);
            return true;
        }
        //if there is an error
        else {
            //change the underline color to red
            doc.classList.remove("green_border");
            doc.classList.add("red_border");
            //set the fb message to negative
            if (doc.nextElementSibling.getAttribute("class").indexOf("sm") !== -1) {
                doc.nextElementSibling.remove();
            }
            const fb = document.createElement("div");
            fb.innerText = err;
            fb.classList.add("sm");
            fb.classList.add("red");
            doc.insertAdjacentElement("afterend", fb);
            return false;
        }

    }
}
//create select
function create_ckbx(all_files) {
    // add checkbox to all file and folder rows
    for (let i = 0; i < all_files.length; i++) {
        const name = all_files[i].children[1].innerText;
        const new_cb = document.createElement("input");
        new_cb.setAttribute("type", "checkbox");
        //if file
        if ((all_files[i].children[1].innerText.indexOf(".") !== -1) && (all_files[i].children[1].innerText !== "..")) {
            new_cb.setAttribute("name", "file");

        }
        //if folder, set the name to folder of the checkbox
        else {
            new_cb.setAttribute("name", "folder");
        }
        new_cb.setAttribute("value", name.trim());
        all_files[i].prepend(new_cb);
        //if parent directory, disable checkbox
        if (all_files[i].innerText.indexOf("..") !== -1) {
            new_cb.disabled = true;
        }
    }
    console.dir(all_files);
}
//create directory
const c_dir = document.querySelector("#c_dir");
c_dir.addEventListener("click", (e) => {
    click_create("Directory", "/c_dir");
});
//create file
const c_file = document.querySelector("#c_file");
c_file.addEventListener("click", (e) => {
    click_create("File", "/c_file");
});
//select
// let click = false;
const select_ = document.querySelector("#select");
select_.addEventListener("click", (e) => {
    let new_div;
    let main_options;
    let select_all;
    let unselect_all;
    let cancel;
    const all_files = document.querySelectorAll(".row .name");
    //if the select byutton text is still select
    if (select_.children[1].innerText === "select") {
        //change it to delete
        select_.children[1].innerText = "delete";
        //create checkbox for all file/folder
        create_ckbx(all_files);
        //create a new region to put new options in
        new_div = document.createElement("div");
        new_div.classList.add("new_space");
        //put this inside the options wrapper
        main_options = document.querySelector(".wrapper");
        main_options.append(new_div);

        //create new options  - btns
        select_all = document.createElement("button");
        select_all.innerText = "select all";
        select_all.classList.add("btn");
        unselect_all = document.createElement("button");
        unselect_all.innerText = "unselect all";
        unselect_all.classList.add("btn");
        cancel = document.createElement("button");
        cancel.innerText = "cancel";
        cancel.classList.add("btn");
        //append them to the new section
        new_div.append(select_all);
        new_div.append(unselect_all);
        new_div.append(cancel);
    }
    //if the button text is now delete
    else if (select_.children[1].innerText === "delete") {
        const select = document.querySelectorAll(".row input[type=\"checkbox\"]");
        //create a form
        const form = document.createElement("form");
        form.setAttribute("action", "/delete");
        form.setAttribute("method", "POST");
        //append all checkbox to the form
        for (let chbx of select) {
            form.append(chbx);
        }
        form.classList.add("invisible");
        body.append(form);
        form.submit();

    }

    //create a new section 

    //let us add event listeners to all this buttons

    //select all chckbox
    select_all.addEventListener("click", (e) => {
        const select = document.querySelectorAll(".row input[type=\"checkbox\"]");
        // console.log(click);
        for (let chbx of select) {
            if ((chbx.disabled !== true) && (chbx.checked !== true)) {

                chbx.click();

            }
        }
        // click = true;
    });
    //un-select all chck box
    unselect_all.addEventListener("click", (e) => {
        const select = document.querySelectorAll(".row input[type=\"checkbox\"]");
        for (let chbx of select) {
            if ((chbx.disabled !== true) && (chbx.checked !== false)) {
                chbx.click();

            }
        }
        // click = false;
    });
    cancel.addEventListener("click", (e) => {
        //change the delete text back to select
        select_.children[1].innerText = "select";
        new_div.remove();
        //remove all checkboxes
        const select = document.querySelectorAll(".row input[type=\"checkbox\"]");
        for (let chbx of select) {
            chbx.remove();
        }
    });


});
//add event listener
body.addEventListener("submit", (e) => {
    if (e.target.getAttribute("class").indexOf("prompt") !== -1) {
        const file_name = document.querySelector("#name");
        if (e.submitter.getAttribute("class").indexOf("red_btn") !== -1) {
            e.preventDefault();
            document.querySelector(".fill").remove();
            body.classList.remove("no_overflow");
        }
        let ret = validate("green_btn", e, file_name, e.submitter);
        if (ret === true) {
            e.target.submit();
        }

    }
});
body.addEventListener("input", (e) => {
    validate("name", e, e.target, e.target);

});




for (let file of names_of_files) {
    list_of_files.push(JSON.parse(file).file_name);

}


//lets implement the search function
function search_query(search_results, minimum) {
    const output = {
        name: [],
        index: []
    };
    if (search_input.value.length >= minimum) {
        for (let name of list_of_files) {
            let index = name.toLowerCase().trim().indexOf(search_input.value.toLowerCase().trim());
            if (index !== -1) {
                // output.push({ name: name, index: index });
                output.name.push(name);
                output.index.push(index);
            }
            if (output.name.length === search_results) {
                break;
            }
        }
    }
    return output;
}
function generate_result(file_name, index, length) {
    const div = document.createElement("div")

    div.innerHTML = ' ' + file_name.slice(0, index) + `<span class="highlight">${file_name.slice(index, index + length)}</span>` + file_name.slice(index + length, file_name.length);
    //remove
    const i = document.createElement("i");
    i.classList.add("fa");
    i.setAttribute("aria-hidden", true);
    let href = "";
    if ((file_name.indexOf(".") !== -1) && (file_name !== "..")) {
        i.classList.add("fa-file");
        href = `/file/${file_name}`;
    }
    else {
        i.classList.add("fa-folder");
        if (file_name === "..") {
            href = "/folder/parent/directory";
        }
        else {
            href = `/folder/${file_name}`;
        }
    }
    div.prepend(i);
    const a = document.createElement("a");
    a.append(div);
    a.classList.add("decor_res");
    a.setAttribute("href", href);
    return a;
}

const search_input = document.querySelector("input[name=\"file_name\"");
search_input.addEventListener("input", (e) => {
    const { name: output, index } = search_query(search_results, minimum_input_length);
    console.log(output, index);

    const display = document.querySelector(".results");
    display.innerHTML = "";
    if (output.length !== 0) {
        display.classList.add("visible");
        display.classList.remove("invisible");
    }
    else {
        display.classList.remove("visible");
        display.classList.add("invisible");
    }

    for (let i = 0; i < output.length; i++) {
        display.append(generate_result(output[i], index[i], search_input.value.length));
    }
});
search_input.setAttribute("spellcheck", false);
const display = document.querySelector(".results");
let search_open = false;
display.addEventListener("mouseenter", () => {
    search_open = true;
});
display.addEventListener("mouseleave", () => {
    search_open = false;
});
display.addEventListener("click", () => {
    display.classList.remove("visible");
    display.classList.add("invisible");
});
search_input.addEventListener("focusout", (e) => {
    if (search_open === false) {
        display.classList.remove("visible");
        display.classList.add("invisible");
    }
});
const search_icon_1 = document.querySelector("#search_icon_1");
let temp_all = document.querySelector(".body").innerHTML;
search_icon_1.addEventListener("click", () => {
    document.querySelector(".body").innerHTML = temp_all;
    const { name, index } = search_query(list_of_files.length, 0);
    const names = document.querySelectorAll(".body .row .name a");
    const arr = Array.from(names);
    const mapped_name = arr.map((val) => {
        return val.innerText.trim();
    });
    for (let i = 0; i < arr.length; i++) {
        if ((name.includes(mapped_name[i]) === false) && (mapped_name[i] !== "..")) {
            names[i].parentElement.parentElement.remove();
        }
    }
    search_input.value = "";

});

const search_icon_2 = document.querySelector("#search_icon_2");
search_icon_2.addEventListener("click", (e) => {
    const new_form = document.createElement("form");

    new_form.setAttribute("method", "GET");
    const data = document.createElement("input");
    //get the string
    let value_in_box = document.querySelector("#dir").value;
    data.value = value_in_box;
    data.setAttribute("type", "text");
    data.setAttribute("name", "path");
    //append input to form
    new_form.append(data);
    //get the route
    let href = "";
    let val = "";
    if (value_in_box[value_in_box.length - 1] === "\\") {
        val = value_in_box.slice(0, value_in_box.length - 1);
    }
    else {
        val = value_in_box;
    }
    if (reg_ex_for_dir_search.test(val) === true) {
        href = "/search/file";
    }
    else {
        href = "/search/dir";
    }
    if (value_in_box[value_in_box.length - 1] !== "\\") {
        value_in_box += "\\";
    }
    console.log(val);
    console.log(value_in_box);
    new_form.setAttribute("action", href);
    new_form.classList.add("invisible");
    body.append(new_form);
    new_form.submit();
})

//hash function for alphabets
function hash_alpha(letter) {
    if (letter.length === 0) {
        return 0;
    }
    let word = letter.trim().toLowerCase();
    let total = 0;
    let start = 6;
    const lookup = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
    for (let i = 0; i < letter.length; i++) {
        if (lookup.indexOf(word[i]) !== -1) {
            total += (((26 - lookup.indexOf(word[i])) * 2) * (10 ** (start - (i * 2))));
        }
        else {
            total += ((60) * (10 ** (start - (i * 2))));
        }
    }
    return total;
}
//hash test -->scrap hashing, use the inbulit sort by alpha
console.log(hash_alpha("#red"));
console.log(hash_alpha("aaa"));
console.log(hash_alpha("aacd"));
console.log(hash_alpha("abcd"));
console.log(hash_alpha("azcd"));
console.log(hash_alpha("a"));
console.log(hash_alpha("bcd"));
console.log(hash_alpha("can"));
console.log(hash_alpha("din"));
console.log(hash_alpha("zbcd"));
//if alpha ascending, just put in this list
//id alpha descending, start at the end(z) and then start 
//appending all values into the body.

//we could also try creating an attribute called alpha_asc
//number that stores the initial index number.

function time_compare(time) {
    if (time.trim().toLowerCase() === "today") {
        return 1;
    }
    if (time.trim().toLowerCase().indexOf("day") !== -1) {
        return parseInt(time) * 10;
    }
    if (time.trim().toLowerCase().indexOf("month") !== -1) {
        return parseInt(time) * 310;
    }
    if (time.trim().toLowerCase().indexOf("year") !== -1) {
        return parseInt(time) * 310 * 12;
    }
}
function size_compare(size) {
    if (size === "") {
        return -1;
    }
    else {
        return parseInt(size);
    }
}

//function for row insertion sort
function insert_sort(str, weight_fxn, child) {
    let arr = [];
    const all = document.querySelectorAll(".body .row");
    for (let i = 0; i < all.length; i++) {
        if (all[i].children[1].innerText.trim() !== "..") {
            let weight = weight_fxn(all[i].children[child].innerText);
            let j = 0;
            while (j < arr.length) {
                if (j + 1 !== arr.length) {
                    if ((arr[j] <= weight) && (arr[j + 1] >= weight)) {
                        break;
                    }
                }
                j++;
            }
            arr = [...arr.slice(0, j + 1), weight, ...arr.slice(j + 1, arr.length)];
            document.querySelector(".body").children[j].insertAdjacentElement("afterend", all[i]);

        }
    }
    const new_all = document.querySelectorAll(".body .row");
    if (str.indexOf("des") !== -1) {
        for (let i = new_all.length - 1; i > 0; i--) {
            document.querySelector(".body").append(new_all[i]);

        }
    }
}
const sort = document.querySelector("#sort");
sort.addEventListener("change", (e) => {
    if (sort.value === "alp_asc") {
        document.querySelector(".body").innerHTML = temp_all;
    }
    if (sort.value === "alp_des") {
        document.querySelector(".body").innerHTML = temp_all;
        const all = document.querySelectorAll(".body .row");
        for (let i = all.length - 1; i > 0; i--) {
            document.querySelector(".body").append(all[i]);

        }
    }
    if ((sort.value === "time_asc") || (sort.value === "time_des")) {
        insert_sort(sort.value, time_compare, 1);
    }
    if ((sort.value === "size_asc") || (sort.value === "size_des")) {
        insert_sort(sort.value, size_compare, 2);
    }
})






