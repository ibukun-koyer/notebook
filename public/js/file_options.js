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
const list_of_span_tools = ['underline', 'strike'];
const list_of_nodenames = ["B", "I"];
console.log(`The file name is ${curr_file}`)
function popup(body, name_of_tool, tool, callback) {
    const fill = document.createElement("div");
    fill.classList.add("fill");
    fill.classList.add("save-options");
    document.body.append(fill);
    const wrap = document.createElement("div");
    wrap.classList.add("tool-wrap");
    fill.append(wrap);

    //create label
    const lab = document.createElement("label");
    lab.innerText = name_of_tool;
    lab.setAttribute("for", name_of_tool);
    lab.setAttribute("id", "label_t");

    wrap.append(lab);
    for (let i of tool) {
        wrap.append(i);
    }

    //create button
    const sub = document.createElement("button");
    sub.innerText = "submit";
    sub.classList.add("green_btn");
    wrap.append(sub);

    sub.addEventListener("click", () => {
        callback();
        fill.remove();
    })
}
const tools = {
    surround(body, tag, css) {

        let sel = frame_doc.getSelection();
        if (frame_doc.getSelection().isCollapsed !== true) {
            tag.appendChild(sel.getRangeAt(0).extractContents());
            sel.getRangeAt(0).insertNode(tag);
        }
        else {
            let currNode = sel.anchorNode;
            while (currNode !== null) {
                let str = `no${tag.nodeName}`;
                try {
                    if (list_of_span_tools.indexOf(currNode.className) !== -1) {
                        str = `no${currNode.className}`;
                    }
                }
                catch (e) {
                    console.log('classname not defined');
                }

                if ((currNode.nodeName === tag.nodeName) && (currNode.nodeName !== undefined)) {
                    if (currNode.nodeName === "SPAN") {
                        if (list_of_span_tools.indexOf(currNode.className) === -1) {
                            currNode = currNode.parentElement;
                            continue;
                        }
                    }
                    const div = document.createElement("span");
                    div.setAttribute("id", str);
                    div.setAttribute("style", css);
                    for (let i = 0; i < sel.rangeCount; i++) {
                        sel.getRangeAt(i).insertNode(div);

                    }
                    break;


                }
                else if ((currNode.getAttribute !== undefined) && (currNode.getAttribute("id") === str)) {
                    for (let i = 0; i < sel.rangeCount; i++) {
                        sel.getRangeAt(i).insertNode(tag);
                    }
                    break;
                }
                else if (currNode.parentElement === null) {

                    for (let i = 0; i < sel.rangeCount; i++) {
                        sel.getRangeAt(i).insertNode(tag);

                    }
                    break;
                }

                currNode = currNode.parentElement;


            }


        }
        body.focus();

        //use appendnextsibling every time a tool is turned off
    },
    bold(body) {
        const tag = document.createElement("b");
        tools.surround(body, tag, 'font-weight: normal;');
    },
    italic(body) {
        const tag = document.createElement("i");
        tools.surround(body, tag, 'font-style: normal;');

    },
    underline(body) {
        const tag = document.createElement("span");
        tag.style = "text-decoration:underline;";
        tag.classList.add('underline');
        tools.surround(body, tag, 'display: inline-block;text-decoration:none;');
    },
    strike_through(body) {
        const tag = document.createElement("span");
        tag.style = "text-decoration:line-through;";
        tag.classList.add('strike');
        tools.surround(body, tag, 'display: inline-block;text-decoration:none;');
    },
    center_align(body) {
        body.style.textAlign = "center";
    },
    justify_align(body) {
        body.style.textAlign = "justify";
    },
    left_align(body) {
        body.style.textAlign = "left";
    },
    right_align(body) {
        body.style.textAlign = "right";
    },
    save(body) {
        const fill = document.createElement("div");
        fill.classList.add("fill");
        fill.classList.add("save-options");
        document.body.append(fill);
        create_form(fill, { path: "save", text: "Save progress" }, { path: "save_and_exit", text: "Save and return" }, { path: "cancel", text: "Cancel" });
    },
    margin(body) {
        let name_of_tool = "Margin";

        const margin_range = document.createElement("input");
        margin_range.style.width = "100%";
        margin_range.setAttribute("id", name_of_tool);
        margin_range.setAttribute("type", "range");
        margin_range.setAttribute("max", 5);
        margin_range.setAttribute("min", 0);
        margin_range.value = 0;

        const callback = function () {
            body.style.padding = `${margin_range.value}rem`;
        }

        popup(body, name_of_tool, [margin_range], callback);
    },
    text_height(body) {
        let name_of_tool = "Text-height";

        const text_height_range = document.createElement("input");
        text_height_range.style.width = "100%";
        text_height_range.setAttribute("id", name_of_tool);
        text_height_range.setAttribute("type", "range");
        text_height_range.setAttribute("max", 5);
        text_height_range.setAttribute("min", 1);
        text_height_range.value = 0;

        const callback = function () {
            body.style.lineHeight = `${text_height_range.value}rem`;
        }

        popup(body, name_of_tool, [text_height_range], callback);
    },
    text_width(body) {
        let name_of_tool = "Text-spacing";

        const text_width_range = document.createElement("input");
        text_width_range.style.width = "100%";
        text_width_range.setAttribute("id", name_of_tool);
        text_width_range.setAttribute("type", "range");
        text_width_range.setAttribute("max", 5);
        text_width_range.setAttribute("min", 1);
        text_width_range.value = 0;

        const callback = function () {
            body.style.letterSpacing = `${text_width_range.value}rem`;
        }

        popup(body, name_of_tool, [text_width_range], callback);
    },
    link(body) {
        let name_of_tool = "Link";

        const link = document.createElement("input");
        link.style.width = "100%";
        link.setAttribute("id", name_of_tool);
        link.setAttribute("type", "text");
        link.setAttribute("placeholder", "Please enter your link");

        const link_name = document.createElement("input");
        link_name.style.width = "100%";
        // link_name.setAttribute("id", name_of_tool);
        link_name.setAttribute("type", "text");
        link_name.setAttribute("placeholder", "Please enter link's display name");



        const callback = function () {
            let sel = frame_doc.getSelection();
            // body.style.letterSpacing = `${link.value}rem`;
            const anc = document.createElement("a");
            anc.setAttribute('href', link.value);
            anc.innerText = link_name.value;
            console.log(anc);
            body.append(anc);
            // sel.getRangeAt(0).insertNode(anc);
        }

        popup(body, name_of_tool, [link, link_name], callback);
    }
}


let currently_selected = home;

fonts = JSON.parse(fonts);
console.log(fonts);
const font_size = ["Small", "Normal", "Large", "Extra-large"];
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
    const image = new icon_info(["fa", "fa-image"], "image", tools.image);
    const save = new icon_info(["fa", "fa-bars"], "save", tools.save);
    const font_color = new icon_info(["fas", "fa-eye-dropper"], "font color", tools.font_color);
    const margin = new icon_info(["fa", "fa-indent"], "margin", tools.margin);

    // <i class="fa fa-indent" aria-hidden="true"></i>
    // <i class="fa fa-arrows" aria-hidden="true"></i>
    // <i class="fa fa-eyedropper" aria-hidden="true"></i>
    // <i class="fa fa-bars" aria-hidden="true"></i>
    const b = subregion("file", 10, save);
    target.append(b);
    const c = subregion("font", 10, { do_not_calc: true, fxn: drop_down_options(fonts, "fonts") }, { do_not_calc: true, fxn: drop_down_options(font_size, "fontSize") }, font_color, highlight, bold, italic, underline, strikethrough, subscript, superscript);
    target.append(c);
    const d = subregion("paragraph", 10, center, justify, left, right, margin, text_height, text_width, ol, ul)
    target.append(d);
    const e = subregion("insert", 10, link, table, image)
    target.append(e);

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

                        const offset = frame_doc.getSelection().anchorOffset;
                        const range = new Range();

                        range.setStart(frame_doc.getSelection().anchorNode, offset - e.data.length);
                        range.setEnd(frame_doc.getSelection().anchorNode, offset);


                        frame_win.getSelection().removeAllRanges();

                        frame_win.getSelection().addRange(range);

                        // frame_doc.getSelection().getRangeAt(0).surroundContents(frame_doc.getSelection().anchorNode.nextSibling);


                        // frame_doc.getSelection().collapseToEnd();

                        frame_doc.getSelection().anchorNode.nextSibling.appendChild(frame_doc.getSelection().getRangeAt(0).extractContents());
                        frame_doc.getSelection().getRangeAt(0).insertNode(frame_doc.getSelection().anchorNode.nextSibling);
                        frame_doc.getSelection().collapseToEnd();


                        paper_data.focus();

                    }
                }
            }
            catch (err) {
                try {
                    if ((frame_doc.getSelection().anchorNode.previousElementSibling.innerHTML.length === 0) && (frame_doc.getSelection().anchorNode.previousElementSibling.previousElementSibling === null)) {


                        const offset = frame_doc.getSelection().anchorOffset;
                        const range = new Range();

                        range.setStart(frame_doc.getSelection().anchorNode, 0);
                        range.setEnd(frame_doc.getSelection().anchorNode, e.data.length);

                        console.log("3")
                        frame_win.getSelection().removeAllRanges();

                        frame_win.getSelection().addRange(range);
                        console.log("4")
                        // frame_doc.getSelection().getRangeAt(0).surroundContents(frame_doc.getSelection().anchorNode.nextSibling);


                        // frame_doc.getSelection().collapseToEnd();

                        frame_doc.getSelection().anchorNode.previousElementSibling.appendChild(frame_doc.getSelection().getRangeAt(0).extractContents());
                        frame_doc.getSelection().getRangeAt(0).insertNode(frame_doc.getSelection().anchorNode.previousElementSibling);
                        frame_doc.getSelection().collapseToEnd();


                        paper_data.focus();


                    }
                }
                catch (e) {
                    console.log('its neither end nor beginning', e);
                }
            }
        }

        if (current.name === "html") {
            codearea.value = stack(paper_data.innerHTML);

        }

    });
    // frame_doc.addEventListener('selectionchange', () => {
    //     const signature_names = [...list_of_nodenames];
    //     const signature_span = [...list_of_span_tools];

    //     let currNode = frame_doc.getSelection().anchorNode;
    //     if (currNode.isCollapsed === true) {
    //         while (currNode !== null) {
    //             let nodeName = currNode.nodeName;
    //             let className = currNode.className;

    //             if (nodeName === "SPAN") {

    //             }
    //             else {

    //             }
    //             currNode = currNode.parentElement;
    //         }
    //     }
    // })

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
                            const data = { name: name_of_note, css: css_input.replaceAll("'", "\\\""), html: paper_data.innerHTML.replaceAll("'", "\\\"") };
                            console.log(data);
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
                    const data = { name: name_of_note, css: css_input.replaceAll("'", "\\\""), html: paper_data.innerHTML.replaceAll("'", "\\\"") };
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
//edit fontsize on display
const font_select = document.querySelectorAll('#fontSize option');
let start_i = 1;
let inc = 2;
for (let i of font_select) {
    i.style.fontSize = `${start_i}rem`;
    start_i++;
}
//edit font family on display
const font_fam_select = document.querySelectorAll('#fonts option');

for (let i of font_fam_select) {
    i.style.fontFamily = i.innerText;
    start_i++;
}