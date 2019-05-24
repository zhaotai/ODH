const dividers = ["\n", ".", "?", "!", ";", "。", "；", "？", "！"];
function getSentence(max) {
    const selection = window.getSelection();
    if (selection.rangeCount < 1) {
        return;
    }
    const word = selection.toString();
    const currentSelection = selection.getRangeAt(0);
    const preText = findPreviousText(currentSelection.startContainer, currentSelection.startOffset, "");
    const postText = findPostText(currentSelection.endContainer, currentSelection.endOffset, "");
    sentence = preText + word + postText;
    return sentence;
}

// Offset should be real offset, counting on dividers.
// node could be a Text
function findPreviousText(node, offset, preTextToOriginWord) {
    let context = "";
    if (node instanceof Text) {
        context = node.textContent.trim();
    } else  {
        context = node.innerText;
    }
    const previousDividerIndex = findLast(context.substring(0, offset), dividers);
    if (previousDividerIndex !== -1) {
        return context.substring(previousDividerIndex + 1, offset) + preTextToOriginWord;
    }
    
    const parentNode = node.parentNode;
    if (parentNode instanceof HTMLElement) {
        return "";
    }
    const parentOffset = calcOffset(node, parentNode);
    return findPreviousText(parentNode, parentOffset, preTextToOriginWord + context.substring(0, offset));
}

function findPostText(node, offsetToEnd, postTextToOriginWord) {
    let context = "";
    if (node instanceof Text) {
        context = node.textContent.trim();
    } else {
        context = node.innerText;
    }
    const postDividerIndex = findFirst(context.substring(offsetToEnd), dividers);
    if (postDividerIndex !== -1) {
        return postTextToOriginWord + context.substring(offsetToEnd, postDividerIndex + 1);
    }

    const parentNode = node.parentNode;
    if (parentNode instanceof HTMLElement) {
        return "";
    }
    const parentOffset = calcOffset(node, parentNode) + context.length;
    return findPostText(parentNode, parentOffset, postTextToOriginWord);
}

function calcOffset(node, parentNode) {
    const parentTxt = parentNode.innerText;
    const nodeList = parentNode.childNodes;
    let offset = 0;
    for (let i = 0; i < nodeList.length; i ++) {
        let txt = "";
        if (nodeList[i] instanceof Text) {
            txt = nodeList[i].textContent.trim();
        } else {
            txt = nodeList[i].innerText.trim();
        }
        if (txt) {
            offset = findEndIndexOfFirstAppearance(offset, parentTxt, txt);
            if (nodeList[i] === node) {
                offset -= txt.length;
            }
        }
    }
    return offset;
}

function findEndIndexOfFirstAppearance(start, parentTxt, nodeTxt) {
    let nodeIndex = 0;
    for (let i = start; i < parentTxt.length; i ++) {
        if (nodeTxt[nodeIndex] === parentTxt[i]) {
            nodeIndex ++;
            if (nodeIndex === nodeTxt.length) {
                return i + 1;
            }
        } else {
            nodeIndex = 0;
        }
    }
    return -1;
}

function findPostDivider(node, word, offset) {
    const context = node.innerText;
    const length = word.length;
    const postDividerIndex = findFirst(context.substring(offset + length), dividers);
    return context.substring(previousDividerIndex, postDividerIndex);
}

function clean(word) {
    let start = 0;
    let end = word.length - 1;
    while (!isEnglishCharacter(word[start])) {
        start ++;
    }
    while (!isEnglishCharacter(word[end])) {
        end --;
    }
    return word.substring(start, end + 1);
}

function isEnglishCharacter(c) {
    const code = c.charCodeAt(0);
    return (code >= 97 && code <= 122) || (code >= 65 && code <= 90);
}

function findFirst(str, charList) {
    for (let i = 0; i < charList.length; i ++) {
        for (let j = 0; j < charList.length; j ++) {
            if (str[i] === charList[j]) {
                return i;
            }
        }
    }
    return -1;
}

function findLast(str, charList) {
    for (let i = str.length - 1; i >= 0; i --) {
        for (let j = 0; j < charList.length; j ++) {
            if (str[i] === charList[j]) {
                return i;
            }
        }
    }
    return -1;
}