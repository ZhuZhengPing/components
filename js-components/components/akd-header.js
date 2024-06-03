;
/**
 * zzp write 2024-01-29 
 * bu chong fu zhao lun zi
 */
(function (app) {
        let ah = document.querySelector("akd-header");
        if (!ah) {
            return;
        }
        ah.className += " akd-header-component";

        // remove first and last whitespace
        if(ah.childNodes[0].nodeType == 3 && /^\s+$/.test(ah.childNodes[0].nodeValue)){
            ah.removeChild(ah.childNodes[0]);
        }
        let len = ah.childNodes.length;
        if(ah.childNodes[len-1].nodeType == 3 && /^\s+$/.test(ah.childNodes[len-1].nodeValue)){
            ah.removeChild(ah.childNodes[len-1]);
        }

        // check left part
        let divLeft = ah.firstChild;
        if(divLeft.className && divLeft.className.indexOf("left")>-1){
            let temp = document.createElement("div");
            temp.className="left";
            temp.appendChild(divLeft.cloneNode(true));
            ah.insertBefore(temp, divLeft);
            ah.removeChild(divLeft);
        }else{
            let temp = document.createElement("div");
            temp.className="left";
            let i = document.createElement("i");
            i.style.fontSize="28px";
            i.className = `fa fa-angle-left`;
            i.addEventListener("click", () => {
                history.back();
            }, false);
            temp.appendChild(i);
            ah.insertBefore(temp, divLeft);
        }

        // check text node
        let titleNode=null;
        for(let i = 0; i < ah.childNodes.length;i++){
            if(ah.childNodes[i].nodeType == 3 && /^\s+$/.test(ah.childNodes[i].nodeValue)==false){
                titleNode=ah.childNodes[i];
                break;
            }
        }

        // insert h3 tag
        if(titleNode){
            let h3 = document.createElement("h3");
            h3.innerHTML = titleNode.nodeValue;
            ah.insertBefore(h3, titleNode);
            ah.removeChild(titleNode);
        }

        // check right node
        let divRight = ah.lastChild;
        if(divRight.className && divRight.className.indexOf("right")>-1){
            let temp = document.createElement("div");
            temp.className="right";
            temp.appendChild(divRight.cloneNode(true));
            ah.insertBefore(temp, divRight);
            ah.removeChild(divRight);
        }else{
            let temp = document.createElement("div");
            temp.className="right";
            let i = document.createElement("i");
            temp.appendChild(i);
            ah.appendChild(temp);
        }

        let style = document.createElement("style");
        style.innerHTML = `
            .akd-header-component{
                flex: none;
                height: 56px;
                background-color: goldenrod;
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .akd-header-component div{
                flex: none;
                width: 56px;
                height: 100%;
            }

            .akd-header-component h3{
                flex: auto;
                margin: 0;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .akd-header-component div i{
                height: 100%;
                width: 100%;
                display: inline-block;
                text-align: center;
                font-size: 20px;
                line-height: 56px;
            }
        `;
        document.body.appendChild(style);
})(window);


