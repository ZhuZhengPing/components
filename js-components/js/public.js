function removeWhiteNode(nodes) {
    for (var i = 0; i < nodes.childNodes.length; i ++) {
        if (nodes.childNodes[i].nodeType === 3 && /^\s+$/.test(nodes.childNodes[i].nodeValue)) {
            nodes.childNodes[i].parentNode.removeChild(nodes.childNodes[i]);
        }
    }
    return nodes;
}

