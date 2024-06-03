

export const akdPushBack = {
    mounted(el, binding, vnode, prevVnode) {
        let backBtn = document.querySelector('#back-view');
        if(!backBtn){
            let app = document.querySelector("#app");
            backBtn = document.createElement('div');
            backBtn.id="back-view";
            backBtn.style.position="absolute";
            backBtn.style.zIndex=9999;
            backBtn.style.height="42%";
            backBtn.style.backgroundColor="rgba(222, 176, 107, 0.81)";
            backBtn.style.color="white";
            backBtn.style.fontSize="24px";
            backBtn.style.display="flex";
            backBtn.style.flexDirection="column";
            backBtn.style.alignItems="flex-end";
            backBtn.style.justifyContent="center";
            backBtn.style.borderRadius="0 100% 100% 0";
            backBtn.style.width="0";
            backBtn.style.left="0";
            backBtn.style.top="0";
            let i = document.createElement("i");
            i.style.marginRight="15px";
            i.className="fa fa-chevron-left";
            backBtn.appendChild(i);
            app.appendChild(backBtn);
        }
        let pan1, pan2, cancel, flag;
        el.akdTouchEvents = {
            start: (e) => {
                if (el.getAttribute('stop-touch')) {
                    cancel = true;
                    return false;
                }
                pan1 = e.touches[0];
            },
            move: (e) => {
                if (cancel) {
                    return false;
                }
                pan2 = e.touches[0];
                if (el.getBoundingClientRect().width - pan2.pageX < 10) {
                    touchEnd(e);
                    return false;
                }
                if (!flag && (pan1.pageY - pan2.pageY > 10 || pan2.pageY - pan1.pageY > 10)) {
                    cancel = true;
                    return false;
                }
                if (!flag && pan2.pageX - pan1.pageX > 12) {
                    flag = true;
                }
                if (pan1.pageX > pan2.pageX) {
                    pan1 = pan2;
                }
                if (flag) {
                    let x = pan2.pageX - pan1.pageX;
                    x = x < 0 ? 0 : Math.min(x, 100);
                    backBtn.style.top = 'calc(-21% + ' + pan1.clientY + 'px)';
                    backBtn.style.width = x + 'px';
                    backBtn.style.left = -x / 2 + 'px';
                }
            },
            end: (e) => {
                cancel = false;
                if (!flag) {
                    return false;
                }
                flag = false;
                if (pan2.pageX - pan1.pageX > 100) {
                    window.appVue.config.globalProperties.$router.back()
                }
                backBtn.style.transition = 'all .3s ease';
                backBtn.style.webkitTransition = 'all .3s ease';
                backBtn.style.width = '0';
                backBtn.style.left = '0';
                setTimeout(() => {
                    backBtn.style.transition = 'none';
                    backBtn.style.webkitTransition = 'none';
                }, 300);
            }
        }
        el.addEventListener('touchstart', el.akdTouchEvents.start, false);
        el.addEventListener('touchmove', el.akdTouchEvents.move, false);
        el.addEventListener('touchend', el.akdTouchEvents.end, false);
    },
    unmounted(el, binding, vnode, prevVnode) {
        el.removeEventListener('touchstart', el.akdTouchEvents.start);
        el.removeEventListener('touchmove', el.akdTouchEvents.move);
        el.removeEventListener('touchend', el.akdTouchEvents.end);
    }
};

