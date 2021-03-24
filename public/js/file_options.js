//holder values for papers document and paper data
let frame_doc;
let frame_win;
let paper_data;
let curr_file = document.URL.split("/").reduce((x, y) => {
    if (y.indexOf(".notes") !== -1) {
        return x += y;
    }
    else {
        return x;
    }
}).slice(5,);
console.log(`The file name is ${curr_file}`)
const tools = {
    surround(body, tag) {

        let sel = frame_doc.getSelection();
        console.dir(sel);
        if (frame_doc.getSelection().isCollapsed !== true) {
            for (let i = 0; i < sel.rangeCount; i++) {
                let startNode = sel.anchorNode;
                let startIndex = sel.anchorOffset;
                let endNode = sel.focusNode;
                let endIndex = sel.focusOffset;

                while ((startNode !== null)) {
                    // sel.getRangeAt(i).surroundContents(tag);


                    const range = new Range();
                    if (startIndex !== null)
                        range.setStart(startNode, startIndex);
                    else
                        range.setStart(startNode, 0);
                    startIndex = null;

                    if ((startNode.nextSibling === endNode) || (startNode.nextSibling === null))
                        range.setEnd(startNode, endIndex);
                    else
                        range.setEnd(startNode, startNode.length);



                    frame_win.getSelection().removeAllRanges();
                    frame_win.getSelection().addRange(range);
                    console.log(range);
                    sel.getRangeAt(0).surroundContents(tag);

                    startNode = startNode.nextSibling;

                }

            }
        }
        else {
            for (let i = 0; i < sel.rangeCount; i++) {
                sel.getRangeAt(i).insertNode(tag);

            }

        }
        body.focus();

        //use appendnextsibling every time a tool is turned off
    },
    bold(body) {
        const tag = document.createElement("b");
        tools.surround(body, tag);

    }
}


let currently_selected = home;

fonts = JSON.parse(fonts);
console.log(fonts);
const font_size = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];
const single_tag = ["<area>", "<base>", "<br>", "<col>", "<command>", "<embed>", "<hr>", "<img>", "<input>", "<keygen>", "<link>", "<meta>", "<param>", "<source>", "<track>", "<wbr>"];
const size_of_divide = 0.3;
const layout_height_template = "100vh - 4.25rem ";
let curr_font_size = 72;
let css_input = "";

const create_icon = function (fxn, name, label, side_border = false) {
    const i = document.createElement("i");
    i.setAttribute("aria-hidden", true);
    i.classList.add("icon");
    i.setAttribute("title", label);
    if (side_border === true) {
        i.classList.add("sideBorder");
    }
    try {
        if (typeof (name) === "string") {
            throw "You MUST pass in an array";
        }
        for (let cls of name) {
            i.classList.add(cls);
        }

    }
    catch (e) {
        console.error(e);
    }
    i.addEventListener("click", () => {
        console.log(fxn);
        fxn(paper_data);
    })
    return i;
}
const brk = function () {
    const br = document.createElement("br");
    return br;
}
const subregion = function (text, br, ...rest) {
    const reg = document.createElement("fieldset");
    const legend = document.createElement("legend");
    legend.innerText = text;
    reg.append(legend);
    try {
        let val = 0;
        for (let i = 0; i < rest.length; i++) {
            val++;
            if (rest[i].do_not_calc !== true) {
                if ((val >= br) || (i === rest.length - 1)) {
                    reg.append(create_icon(rest[i]["fxn"], rest[i]["classList"], rest[i]["label"]));
                    reg.append(brk());

                    val = 0;
                }
                else {
                    reg.append(create_icon(rest[i]["fxn"], rest[i]["classList"], rest[i]["label"], true));
                }
            }
            else {
                reg.append(rest[i].fxn);
            }
        }
    }
    catch (e) {
        console.error(e);
    }
    return reg;
}
const sub_subregion = function (...rest) {
    const outer = document.createElement("div");
    outer.classList.add("column");
    try {
        for (let i of rest) {
            outer.append(i);
        }
    }
    catch (e) {
        console.error(e);
    }
    return outer;
}
class icon_info {
    constructor(classList, label, fxn) {
        this.classList = classList;
        this.label = label;
        this.fxn = fxn;
    }
}
function drop_down_options(options, name) {
    const select = document.createElement("select");
    select.setAttribute("name", name);
    select.setAttribute("id", name);
    for (let i in options) {
        const option = document.createElement("option");
        option.classList.add("opt");
        option.setAttribute("value", options[i]);
        option.innerText = options[i];
        select.append(option);
    }
    return select;
}

const opt = document.querySelector(".major-options");

function home() {
    const target = document.querySelector(".target");
    target.innerHTML = "";
    const center = new icon_info(["fas", "fa-align-center"], "center align", tools.center_align);
    const justify = new icon_info(["fas", "fa-align-justify"], "justify align", tools.justify_align);
    const left = new icon_info(["fas", "fa-align-left"], "left align", tools.left_align);
    const right = new icon_info(["fas", "fa-align-right"], "right align", tools.right_align);
    const bold = new icon_info(["fas", "fa-bold"], "bold", tools.bold);
    const border = new icon_info(["fas", "fa-border-all"], "border", tools.border);
    const paste = new icon_info(["fas", "fa-clipboard"], "clipboard", tools.clipboard);
    const heading = new icon_info(["fas", "fa-heading"], "heading", tools.heading);
    const highlight = new icon_info(["fas", "fa-highlighter"], "highlight", tools.highlight);
    const italic = new icon_info(["fas", "fa-italic"], "italic", tools.italic);
    const link = new icon_info(["fas", "fa-link"], "link", tools.link);
    const ol = new icon_info(["fas", "fa-list-ol"], "ordered list", tools.ol);
    const ul = new icon_info(["fas", "fa-list-ul"], "unordered list", tools.ul);
    const paragraph = new icon_info(["fas", "fa-paragraph"], "paragraph", tools.paragraph);
    const print = new icon_info(["fas", "fa-print"], "print", tools.print);
    const subscript = new icon_info(["fas", "fa-subscript"], "subscript", tools.subscript);
    const superscript = new icon_info(["fas", "fa-superscript"], "superscript", tools.superscript);
    const text_height = new icon_info(["fas", "fa-text-height"], "text height", tools.text_height);
    const text_width = new icon_info(["fas", "fa-text-width"], "text width", tools.text_width);
    const underline = new icon_info(["fas", "fa-underline"], "underline", tools.underline);
    const undo = new icon_info(["fas", "fa-undo"], "undo", tools.undo);
    const redo = new icon_info(["fas", "fa-redo"], "redo", tools.redo);
    const copy = new icon_info(["far", "fa-copy"], "copy", tools.copy);
    const cut = new icon_info(["fas", "fa-cut"], "cut", tools.cut);
    const table = new icon_info(["fas", "fa-table"], "table", tools.table);
    const strikethrough = new icon_info(["fa", "fa-strikethrough"], "strike through", tools.strike_through);
    //more icons to find
    //--->calculator icon for calculator functionality
    //--->map icon for map functionality
    //--->code icon for code functionality
    //--->quiz icon for quiz functionality
    //--->graph icons for graph functionalities
    //--->image icons for image functionality

    //option for enforce overflow hiddding
    //by default overflow is not hidden


    // const reg_a = subregion("clipboard", 2, undo, redo);

    // target.append(sub_subregion(reg_a));
    // target.append(subregion("clipboard", 2, undo, redo, copy, copy))

    const a = subregion("Fix", 2, undo, redo);
    target.append(a);
    const b = subregion("Clipboard", 4, cut, copy, paste, print);
    target.append(b);
    const c = subregion("font", 10, { do_not_calc: true, fxn: drop_down_options(fonts, "fonts") }, { do_not_calc: true, fxn: drop_down_options(font_size, "fontSize") }, bold, italic, underline, strikethrough, subscript, superscript, highlight);
    target.append(c);
    const d = subregion("paragraph", 10, center, justify, left, right, border, text_height, text_width, ol, ul)
    target.append(d);

    //calcuating height
    let height = window.getComputedStyle(opt).height;

    const layout = document.querySelector(".layout");
    layout.style.height = `calc(${layout_height_template} - ${height})`;


}
home();

function calc_height(ratio, paper, paper_wrap, start, percent) {
    let incorrect = true;
    let height;
    paper.style.width = start;
    let width = parseFloat(window.getComputedStyle(paper).width);

    do {
        height = ratio * width;
        if (height <= (parseFloat(window.getComputedStyle(paper_wrap).height) * percent) / 100) {
            incorrect = false;
            paper.style.height = `${height}px`;

        }
        else {
            paper.style.width = `calc(${window.getComputedStyle(paper).width} - 10%)`;
            width = parseFloat(window.getComputedStyle(paper).width);
        }
    } while ((incorrect === true) && (width >= 0));

}
function calc_font(size, node) {
    const width = window.getComputedStyle(node).width;
    node.style.fontSize = `calc((${width}  * (${size * 2}))/1420)`;
    console.log(node.style.fontSize);
    console.log(`calc((${width}  * 8)/1420)`);
}

//for paper
const paper = document.querySelector(".paper");
const paper_wrap = document.querySelector(".paper-wrap");
const paper_ratio = 2 / 4;
const paper_start = "90%";
const paper_percent = 90;
calc_height(paper_ratio, paper, paper_wrap, paper_start, paper_percent);

//for code
const css = document.querySelector(".css");
const css_wrap = document.querySelector(".css-wrap");
const css_ratio = 2 / 3;
const css_start = "90%";
const css_percent = 60;
calc_height(css_ratio, css, css_wrap, css_start, css_percent);

//get divide
const divide = document.querySelector(".divide");
//target code buttons
const code_btn = document.querySelectorAll(".grp button");
//getting the text area where the code will stay
// const codearea = document.querySelector(".css textarea");
const codearea = document.querySelector(".css textarea");
//start-off
codearea.innerText = paper.innerHTML;
//get currently selected

// calc_font(100, codearea);
calc_font(curr_font_size, paper);

window.addEventListener("resize", () => {
    //resize body
    let height = window.getComputedStyle(opt).height;
    console.log(height);
    console.log(window.getComputedStyle(opt));

    const layout = document.querySelector(".layout");
    layout.style.height = `calc(${layout_height_template}- ${height})`;

    //resize paper
    calc_height(paper_ratio, paper, paper_wrap, paper_start, paper_percent);
    //resize code
    calc_height(css_ratio, css, css_wrap, css_start, css_percent);

    // calc_font(codearea);
    calc_font(curr_font_size, paper);
});


//lets get the show css/js button
const show_a = document.querySelector("#show_a");
//get the html of the tag
const show_a_html = show_a.outerHTML;
const show_b = document.querySelector("#show_b");
//get the html of the tag
const show_b_html = show_b.outerHTML;
show_b.remove();

document.body.addEventListener("click", (e) => {

    if (e.target.getAttribute("id") !== null) {
        if (e.target.getAttribute("id").indexOf("show") !== -1) {
            e.target.remove();
            paper_wrap.style.width = `${50 - size_of_divide}%`;
            css_wrap.style.width = `${50 - size_of_divide}%`;
            divide.style.width = `${size_of_divide}%`;
            console.log(paper_wrap.style.width, css_wrap.style.width)
            calc_height(paper_ratio, paper, paper_wrap, paper_start, paper_percent);
            //resize code
            calc_height(css_ratio, css, css_wrap, css_start, css_percent);

        }
    }
});
let prev = NaN;
divide.addEventListener("drop", (e) => {
    return false;
})

const layout = document.querySelector(".layout");
let mouse = false;

function movement_fxn(e) {
    let thres = 5;
    if (mouse === true) {

        let noise = 50;
        let convert_thres = 20;
        if (e.clientX !== 0) {
            let curr_pos = e.clientX - divide.offsetLeft;

            if ((Math.abs(e.clientX - prev) >= noise) || (Number.isNaN(prev) === true)) {
                const layout_total_width = parseFloat(window.getComputedStyle(layout).width);
                curr_pos = (curr_pos / layout_total_width) * 100;

                paper_wrap.style.width = `calc(${50 - size_of_divide}% - ${curr_pos}%)`;
                css_wrap.style.width = `calc(${50 - size_of_divide}% + ${curr_pos}%)`;
                //resize paper
                calc_height(paper_ratio, paper, paper_wrap, paper_start, paper_percent);
                //resize code
                calc_height(css_ratio, css, css_wrap, css_start, css_percent);
                prev = e.clientX;
                const new_width = parseFloat(window.getComputedStyle(css_wrap).width);
                const percent = (new_width / layout_total_width) * 100;
                if (percent <= convert_thres) {
                    css_wrap.style.width = "0";
                    divide.style.width = "0";
                    paper_wrap.style.width = "100%";
                    const show_target = document.querySelector(".show_target");
                    show_target.innerHTML = show_a_html;
                    calc_height(paper_ratio, paper, paper_wrap, paper_start, paper_percent);
                    mouse = false;
                    console.log("up");
                }
                if (percent >= 100 - convert_thres) {
                    css_wrap.style.width = "100%";
                    divide.style.width = "0";
                    paper_wrap.style.width = "0";
                    const show_target = document.querySelector(".show_target");
                    show_target.innerHTML = show_b_html;

                    calc_height(css_ratio, css, css_wrap, css_start, css_percent);
                    mouse = false;
                    console.log("up");
                }

            }
        }

        let height = document.body.clientHeight;
        let width = document.body.clientWidth;
        if ((e.clientX === 0) || (e.clientY === 0) || (e.clientX >= width - thres) || (e.clientY >= height - thres)) {
            mouse = false;
            console.log("up");
        }

    }
}
layout.addEventListener("mousedown", (e) => {
    if (e.target === divide) {
        mouse = true;
        console.log("downb");
    }
})
layout.addEventListener("mousemove", (e) => {
    movement_fxn(e);
})
document.body.addEventListener("mouseup", (e) => {
    if (mouse === true) {
        console.log("up");
        mouse = false;
    }
})
//stack implementation for html parsing
function stack(str) {
    let stack_ = [];
    let i = 0;
    let temp = "";
    let ret_str = "";
    let start = false;
    str = str.replaceAll(/[\n\t\s]{2,}/g, "");

    while (i < str.length) {

        if (str[i] === "<") {
            temp += str[i];
            start = false;
            i++;
            continue;

        }
        else if (temp.length !== 0) {
            temp += str[i];
            if (str[i] === ">") {
                if (temp.indexOf("</") !== -1) {
                    stack_ = stack_.slice(0, stack_.length - 1);

                    if (ret_str.length !== 0) {
                        ret_str += "\n";

                    }
                    for (let j = 0; j < stack_.length; j++) {
                        ret_str += "\t";

                    }
                    ret_str += temp;

                }
                else {

                    if (ret_str.length !== 0) {

                        ret_str += "\n";
                    }
                    for (let j = 0; j < stack_.length; j++) {
                        ret_str += "\t";

                    }
                    ret_str += temp;
                    if (single_tag.indexOf(temp) === -1) {

                        stack_.push(temp);
                    }
                }
                temp = "";

            }
        }
        else {
            if (start === false) {
                if (ret_str.length !== 0) {
                    ret_str += "\n";
                }
                for (let j = 0; j < stack_.length; j++) {
                    ret_str += "\t";

                }
                start = true;

            }
            ret_str += str[i];

        }
        prev = str[i];

        i++;

    }

    return ret_str;

}


function implement_css_parse(str) {

    let spaces = "";
    let used = false;
    let opened = false;
    str = str.replaceAll(/[\n\t\s]{2,}/g, "");
    let ret = str.replaceAll("{", "{\n\t").replaceAll(";", ";\n\t").replaceAll("\t}", "}\n");

    return ret;

}

document.querySelector("iframe").contentWindow.addEventListener('DOMContentLoaded', (e) => {
    frame_doc = document.querySelector("iframe").contentDocument;
    frame_win = document.querySelector("iframe").contentWindow;
    paper_data = document.querySelector("iframe").contentDocument.querySelector("#p_data");

    let temp_innerhtml = "";
    //currently selected
    let current = document.querySelector("#outline");
    for (let btn of code_btn) {
        btn.addEventListener("click", () => {
            current.setAttribute("id", "");
            btn.setAttribute("id", "outline");
            current = btn;
            if (btn.name === "html") {
                if (paper_data.innerHTML.length !== 0) {
                    codearea.value = stack(paper_data.innerHTML);
                }
                else {
                    codearea.value = stack(temp_innerhtml);
                }
            }
            else {

                codearea.value = implement_css_parse(css_input);


            }
        })
    }

    paper_data.addEventListener("input", (e) => {

        console.log(frame_doc.getSelection());
        if (frame_doc.getSelection().isCollapsed === true) {
            try {
                if (frame_doc.getSelection().anchorNode.nextSibling.innerHTML.length === 0) {
                    if (frame_doc.getSelection().anchorNode.length === frame_doc.getSelection().anchorOffset) {
                        // frame_doc.getSelection().anchorNode.nextSibling.innerHTML += e.data;

                        const offset = frame_doc.getSelection().anchorOffset;
                        const range = new Range();
                        console.log(e.data.length);
                        range.setStart(frame_doc.getSelection().anchorNode, offset - e.data.length);

                        range.setEnd(frame_doc.getSelection().anchorNode, offset);
                        frame_win.getSelection().removeAllRanges();
                        frame_win.getSelection().addRange(range);
                        // console.log(range);
                        frame_doc.getSelection().getRangeAt(0).surroundContents(frame_doc.getSelection().anchorNode.nextSibling);

                        const range1 = new Range();
                        range1.setStart(frame_doc.getSelection().anchorNode, e.data.length + 1);
                        range1.collapse(true);
                        frame_win.getSelection().removeAllRanges();
                        frame_win.getSelection().addRange(range1);

                        paper_data.focus();
                        // frame_doc.getSelection().anchorNode.textContent = "";
                    }
                }

            }
            catch (e) {
                console.log(e);
            }
        }

        if (current.name === "html") {
            codearea.value = stack(paper_data.innerHTML);

        }

    });

    codearea.addEventListener("input", (e) => {

        if (current.name === "html") {
            paper_data.innerHTML = codearea.value;
            temp_innerhtml = codearea.value;

        }
        if (current.name === "css") {
            const curr_style = frame_doc.querySelectorAll("style");
            for (let i of curr_style) {
                i.remove();
            }
            frame_doc.head.innerHTML += `<style>${codearea.value}</style>`;
            css_input = codearea.value;

        }
    });

    paper_data.addEventListener("mousemove", (e) => {
        if (mouse === true) {

            let noise = 50;
            if (e.clientX !== 0) {
                let curr_pos = (e.clientX + paper.offsetLeft) - divide.offsetLeft;

                if ((Math.abs((e.clientX + paper.offsetLeft) - prev) >= noise) || (Number.isNaN(prev) === true)) {
                    const layout_total_width = parseFloat(window.getComputedStyle(layout).width);
                    curr_pos = (curr_pos / layout_total_width) * 100;

                    paper_wrap.style.width = `calc(${50 - size_of_divide}% - ${curr_pos}%)`;
                    css_wrap.style.width = `calc(${50 - size_of_divide}% + ${curr_pos}%)`;
                    //resize paper
                    calc_height(paper_ratio, paper, paper_wrap, paper_start, paper_percent);
                    //resize code
                    calc_height(css_ratio, css, css_wrap, css_start, css_percent);
                    prev = (e.clientX + paper.offsetLeft);
                }
                console.log(curr_pos);
            }

        }
    })
    paper_data.addEventListener("mouseup", (e) => {
        if (mouse === true) {
            console.log("up");
            mouse = false;
        }
    })




})
//start working on the major-options
let name_of_note = "";
function create_form(container, ...options) {

    for (let i of options) {
        const form = document.createElement("form");
        form.setAttribute("action", i.path);
        form.setAttribute("method", "GET");
        form.classList.add("btn-for-opt");
        const op = document.createElement("button");
        op.innerText = i.text;

        form.append(op);
        container.append(form);
        if (i.path.indexOf("cancel") !== -1) {
            form.addEventListener("submit", (e) => {
                e.preventDefault();
                container.remove();
            })
        }
        if (i.path.indexOf("save") !== -1) {
            form.addEventListener("submit", async (e) => {
                e.preventDefault();
                container.remove();
                if (name_of_note === "") {
                    click_create("save", i.path);

                    const prompt_form = document.querySelector(".prompt");
                    prompt_form.addEventListener("submit", async (e) => {
                        e.preventDefault();
                        if (e.submitter.className.indexOf("green_btn") !== -1) {
                            name_of_note = document.querySelector(".prompt input").value;
                            if (name_of_note === "") {
                                name_of_note = "untitled";
                            }
                            const data = { name: name_of_note, css: css_input, html: paper_data.innerHTML };
                            try {
                                await axios.post(`/file/${curr_file}/create_note/save`, data);
                                if (i.path.indexOf("exit") !== -1) {

                                    const redirect_form = document.createElement("form");
                                    redirect_form.setAttribute("action", `/file/${curr_file}`);
                                    redirect_form.setAttribute("method", "GET");
                                    document.body.append(redirect_form);
                                    redirect_form.style.width = 0;
                                    redirect_form.style.height = 0;

                                    redirect_form.submit();
                                }
                            }
                            catch (e) {
                                alert("SAVE FAILED!!!");
                            }
                        }
                        prompt_form.parentElement.remove();


                    })

                }
                else {
                    const data = { name: name_of_note, css: css_input, html: paper_data.innerHTML };
                    try {
                        await axios.post(`/file/${curr_file}/create_note/save`, data);
                        if (i.path.indexOf("exit") !== -1) {

                            const redirect_form = document.createElement("form");
                            redirect_form.setAttribute("action", `/file/${curr_file}`);
                            redirect_form.setAttribute("method", "GET");
                            document.body.append(redirect_form);
                            redirect_form.style.width = 0;
                            redirect_form.style.height = 0;

                            redirect_form.submit();
                        }
                    }
                    catch (e) {
                        alert("SAVE FAILED!!!");
                    }
                }



            })
        }




    }
}
const major_option = document.querySelector(".major-options");
let current_selection = major_option.children[0].children[1];
current_selection.classList.add("wrapAround");

major_option.addEventListener("click", (e) => {
    if (e.target.localName === "button") {
        current_selection.classList.remove("wrapAround");
        current_selection = e.target;
    }
    if (e.target.name === "home") {
        console.log("home");
    }
    if (e.target.name === "file") {
        const fill = document.createElement("div");
        fill.classList.add("fill");
        fill.classList.add("save-options");
        document.body.append(fill);
        create_form(fill, { path: "save", text: "Save progress" }, { path: "save_and_exit", text: "Save and return" }, { path: "cancel", text: "Cancel" });
    }
    if (e.target.name === "insert") {
        console.log("insert");
    }
    if (e.target.name === "layout") {
        console.log("layout");
    }
    if (e.target.name === "help") {
        console.log("help");
    }
    if (e.target.localName === "button") {
        e.target.classList.add("wrapAround");
    }
})