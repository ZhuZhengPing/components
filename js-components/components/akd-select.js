;
/**
 * zzp write 2024-02-05 
 * bu chong fu zhao lun zi
 */
(function(app){
    'use strict';

    app.registerSelect = function(select){
        select.className += " akd-select-component";
        let input = document.createElement("input");
        input.type="text";
        //input.setAttribute("readonly", "true");
        input.addEventListener("click",togglePop,false);
        select.appendChild(input);

        // properties
        if(select.getAttribute("placeholder")){
            input.setAttribute("placeholder",select.getAttribute("placeholder"));
        }
        let disabled = select.getAttribute("disabled");
        if(disabled){
            input.setAttribute("disabled",disabled);
        }
        let value = select.getAttribute("value")||"";
        input.value=value;

        let i = document.createElement("i");
        i.className="fa fa-angle-down";
        select.appendChild(i);

        let pop = document.createElement("div");
        pop.style.display="none";
        pop.addEventListener("click",selectHandler,false);
        select.appendChild(pop);

        // if url is specified
        let url = select.getAttribute("url");
        if(url){
            let params = select.getAttribute("params")||"";
            let valueField = select.getAttribute("valueField");
            let textField = select.getAttribute("textField");
            post(url,params).then(res=>{
                // if array 
                if((res instanceof Array)==false){
                    res = res.Data;    
                }
                for(let i=0; i<res.length; i++){
                    let p = document.createElement("p");
                    p.setAttribute("value",res[i][valueField]);
                    p.innerHTML = res[i][textField];
                    pop.appendChild(p);
                }
            });
        }else{
            // get p 
            let ps = select.querySelectorAll("p");
            for(let i=0; i<ps.length; i++){
                ps[i].parentNode.removeChild(ps[i]);
                pop.appendChild(ps[i]);
            }
        }

        if(!document.querySelector("#akdSelectComponent")){
            let style = document.createElement("style");
            style.id="akdSelectComponent";
            style.innerHTML = `
                .akd-select-component{
                    position: relative;
                    height: 42px;
                    line-height: 42px;
                    display:block;
                }
                .akd-select-component input{
                    height: 100%;
                    width: 100%;
                    border-radius: 3px;
                    padding: 0 10px;
                    border: solid 1px lightgray;
                    vertical-align: bottom;
                    font-size: 14px;
                }
                .akd-select-component i{
                    position: absolute;
                    pointer-events: none;
                    right: 0;
                    top: 0;
                    width: 38px;
                    height: 100%;
                    text-align: center;
                    line-height: inherit;
                }
                .akd-select-component div{
                    position: absolute;
                    z-index: 99999;
                    padding: 0 5px;
                    top: 100%;
                    left: 0;
                    width: 100%;
                    max-height: 240px;
                    overflow: auto;
                    -webkit-overflow-scrolling: touch;
                    background-color: white;
                    box-shadow: 5px 5px 15px rgba(0, 0, 0, .3);
                }
                .akd-select-component .in-bottom{
                    top: auto;
                    bottom: 100%;
                }
                .akd-select-component p{
                    margin: 0;
                    padding: 5px 15px;
                    font-size: 15px;
                }
                .akd-select-component p:not(:last-child) {
                    border-bottom: solid 1px #efefef;
                }
            `;
            document.body.appendChild(style);
        }

        function togglePop(e){
            e.stopPropagation();
            if(disabled){
                return;
            }
            let isInBotton = e.target.getBoundingClientRect().y > window.innerHeight / 2;
            if(isInBotton){
                pop.className += " in-bottom";
            }
            if(pop.style.display == "none"){
                pop.style.display="block";
            }else{
                pop.style.display = "none";
            }
        }

        function selectHandler(e){
            if(pop.style.display=="none") return;
            const target = getTarget(e.target, 'p');
            input.value = target.innerHTML;
            select.setAttribute("value",target.getAttribute("value"));
            pop.style.display="none";
        }
    }

    function getTarget(target, curr, parent) {
        return function run(t, c) {
            if (!c || !t || t === (parent || document)) {
                return false;
            } else if ((function contrast(t, c) {
                switch (c.slice(0, 1)) {
                    case '.':
                        return Array.prototype.indexOf.call(t.classList, c.slice(1)) !== -1;
                    case '#':
                        return t.getAttribute('id') === c.slice(1);
                    default:
                        return t.nodeName.toLocaleLowerCase() === c.toLocaleLowerCase();
                }
            })(t, c)) {
                return t;
            } else if (t.hasAttribute && t.hasAttribute('stop')) {
                return false;
            } else {
                return run(t.parentNode, c);
            }
        }(target, curr);
    }

    function post(url,data){
        var http = initHttp(),success, fail, over, ch, params = [];
        try {
            http.open("post", url);
            http.setRequestHeader("If-Modified-Since","0");
            http.setRequestHeader("Cache-Control", "no-cache");
            http.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
            http.onreadystatechange = function() {
                if((http.readyState === 4) && (http.status === 200)) {
                    var response = JSON.parse(http.responseText);
                    success && success(response);
                    over && over();
                } else if(http.readyState === 4) {
                    fail && fail(http);
                    over && over();
                }
            };
            http.send(data);
        } catch(e) {
            ch && ch();
            over && over();
        }
        return {
            then: function(a, b) {
                success = a;
                fail = b;
                return this;
            },
            success: function(a) {
                success = a;
                return this;
            },
            fail: function(b) {
                fail = b;
                return this;
            },
            catch: function(d) {
                ch = d;
                return this;
            },
            finally: function(c) {
                over = c;
                return this;
            }
        }
    }

    function initHttp() {
        var xmlHttp;
        if(window.ActiveXObject) {
            xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
        } else if(window.XMLHttpRequest) {
            xmlHttp = new XMLHttpRequest();
        }
        return xmlHttp;
    }

    // register elements
    const selects = app.document.querySelectorAll("akd-select");
    for(let i=0;i<selects.length;i++){
        app.registerSelect(selects[i]);
    }
})(window);