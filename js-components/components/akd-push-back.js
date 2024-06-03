
;
(function (app) {
    'use strict';

    var cancelStatus, backBtn;
    app.registerSlideBack = function (dom, cb) {
        new function (dom, callback) {
            var pan1, pan2, cancel, flag ,style;
            dom.addEventListener('touchstart', touchStart, false);
            dom.addEventListener('touchmove', touchMove, false);
            dom.addEventListener('touchend', touchEnd, false);
            dom.addEventListener('touchcancel', touchEnd, false);
            backBtn = document.createElement('DIV');

            style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = `
                #back-view {
                    position: fixed;
                    z-index: 9999;
                    height: 42%;
                    background-color: rgba(239, 77, 26, 0.86);
                    color: white;
                    font-size: 20px;
                    display: flex;
                    display: -webkit-flex;
                    align-items: center;
                    -webkit-align-items: center;
                    justify-content: flex-end;
                    -webkit-justify-content: flex-end;
                    border-radius: 0 100% 100% 0;
                    width: 0;
                    left: 0;
                    top: 0;
                }

                #back-view i {
                    position: absolute;
                    text-align: center;
                    width: 50px;
                    height: 50px;
                }
            `;
            dom.appendChild(style);

            var i = document.createElement('I');
            backBtn.id = 'back-view';
            i.className = 'fa fa-chevron-left';
            backBtn.appendChild(i);
            dom.appendChild(backBtn);

            function touchStart(e) {
                if (dom.getAttribute('stop-touch')) {
                    cancel = true;
                    return false;
                }
                if (e.target.getAttribute("stop-touch")) {
                    cancel = true;
                    return false;
                }
                //console.log(e.target);
                pan1 = e.touches[0];

                
            }

            function touchMove(e) {
                if (cancel || !pan1 || cancelStatus) {
                    return false;
                }
                pan2 = e.touches[0];
                if (window.innerWidth - pan2.pageX < 10) {
                    touchEnd(e);
                    return false;
                }
                if (!flag && (pan1.pageY - pan2.pageY > 15 || pan2.pageY - pan1.pageY > 15)) {
                    cancel = true;
                    return false;
                }
                if (!flag && pan2.pageX - pan1.pageX > 15) {
                    flag = true;
                }
                if (pan1.pageX > pan2.pageX) {
                    pan1 = pan2;
                }
                if (flag) {
                    dom.setAttribute('stop-touch', 1);

                    var x = pan2.pageX - pan1.pageX;
                    x = x < 0 ? 0 : Math.min(x, 100);
                    backBtn.style.top = 'calc(-21% + ' + pan1.clientY + 'px)';
                    backBtn.style.width = x + 'px';
                    backBtn.style.left = -x / 2 + 'px';
                }
            }

            function touchEnd(e) {
                dom.removeAttribute('stop-touch');

                cancel = false;
                if (!flag) {
                    return false;
                }
                flag = false;
                if (pan2.pageX - pan1.pageX > 100) {
                    callback();
                }
                backBtn.style.transition = 'all .3s ease';
                backBtn.style.webkitTransition = 'all .3s ease';
                backBtn.style.width = '0';
                backBtn.style.left = '0';
                setTimeout(function () {
                    backBtn.style.transition = 'none';
                    backBtn.style.webkitTransition = 'none';
                }, 300);
            }
        }(dom, cb);
    }

    app.registerSlideBack(document.body, ()=>{
        history.back();
    })
})(window);