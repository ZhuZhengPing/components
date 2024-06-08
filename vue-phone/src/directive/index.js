

export const akdTouch = {
    mounted(el, binding, vnode, prevVnode) {
        let backBtn = document.querySelector('#back-view');
        if(!backBtn){
            let app = document.querySelector("#app");
            backBtn = document.createElement('div');
            backBtn.id="back-view";
            backBtn.style.position="absolute";
            backBtn.style.zIndex=9999;
            backBtn.style.height="42%";
            backBtn.style.backgroundColor="#daa520";
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
                if (e.target.getAttribute('stop-touch')) {
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
        el.addEventListener('touchstart', el.akdTouchEvents.start, { passive: true });
        el.addEventListener('touchmove', el.akdTouchEvents.move, { passive: true });
        el.addEventListener('touchend', el.akdTouchEvents.end, { passive: true });
    },
    unmounted(el, binding, vnode, prevVnode) {
        el.removeEventListener('touchstart', el.akdTouchEvents.start);
        el.removeEventListener('touchmove', el.akdTouchEvents.move);
        el.removeEventListener('touchend', el.akdTouchEvents.end);
    }
};

// 参数(binding.value)：{
//  refreshEvent:xxx
//  refreshState:true
//}
export const akdRefresh={
    beforeUpdate(el,binding,vnode,prevVnode){
        let refreshDiv = document.querySelector("#refreshDiv");
        let i = document.querySelector("#refreshDiv i");

        let loading = false;
        let touched=false;
        let panStart;
        let panMove;
        // let refreshEvent=binding.value;
        let oy=0;
        let ot=0;

        if(!refreshDiv){
            refreshDiv = document.createElement("div");
            refreshDiv.id="refreshDiv";
            refreshDiv.style.position="absolute";
            refreshDiv.style.zIndex=9999;
            refreshDiv.style.top="-50px";
            refreshDiv.style.left="0";
            refreshDiv.style.width="100%";
            refreshDiv.style.textAlign="center";
            refreshDiv.style.height="50px";
            refreshDiv.style.lineHeight="50px";
            refreshDiv.style.pointerEvents="none";

            i = document.createElement("i");
            i.className="fa fa-spinner";
            i.style.width="36px";
            i.style.height="36px";
            i.style.display="inline-flex";
            i.style.alignItems="center";
            i.style.justifyContent="center";
            i.style.backgroundColor="#daa520";
            i.style.color="#fff";
            i.style.borderRadius="18px";
            i.style.transition="background-color .3s ease";

            refreshDiv.appendChild(i);
            el.appendChild(refreshDiv);

            el.akdTouchEvents ={
                start: (e) => {
                    if (loading) return;
                    if (e.target.getAttribute('stop-touch')) {
                        cancel = true;
                        return false;
                    }
                    
                    i.className='fa fa-spinner';
                    i.style.backgroundColor="#daa520";
                },
                move:(e)=>{
                    if(panStart || !el.scrollTop){
                        if (loading) return;
                        if (e.target.getAttribute('stop-touch')) {
                            cancel = true;
                            return false;
                        }
                        if (oy > 10) refreshDiv.scrollTop = 0;
                        touched = true;
                        panStart = panStart || e.touches[0];
                        panMove = e.touches[0];
                        oy = (panMove.clientY - panStart.clientY) / 2;
                        ot = oy * 3;
                        i.style.transform = 'rotate(' + ot + 'deg)';
                        oy = Math.min(oy, 70);
                        refreshDiv.style.top = oy - 50 + 'px';
                    }
                },
                end:(e)=>{
                    if (loading) return;
                    loading = true;
                    touched = false;
                    panStart = undefined;
                    if (oy === 70) {
                        i.style.animation="rotate 1s infinite linear";
                        binding.value(overRefresh);
                    } else {
                        doOver();
                    }
                }
            };
            el.addEventListener('touchstart', el.akdTouchEvents.start, { passive: true });
            el.addEventListener('touchmove', el.akdTouchEvents.move, { passive: true });
            el.addEventListener('touchend', el.akdTouchEvents.end, { passive: true });
        }


        function overRefresh(state){
            i.style.transform="rotate(0)";
            i.style.animation="none";
            if(state){
                i.className ="fa fa-check";
                i.style.backgroundColor = "#2196f3";
            }else{
                i.className ="fa fa-exclamation";
                i.style.backgroundColor = "red";
            }
            
            setTimeout(function () {
                doOver();
            }, 1000);
        }

        function doOver() {
			oy -= 2;
			ot -= 5;
			if (oy > 0) {
				refreshDiv.style.top = oy - 50 + 'px';
				requestAnimationFrame(doOver);
			} else {
				i.classList.remove('fa-check');
				i.classList.remove('fa-exclamation');
                i.style.animation="none";
				loading = false;
				oy = 0;
				ot = 0;
			}
		}
    },
    unmounted(el, binding, vnode, prevVnode) {
        el.removeEventListener('touchstart', el.akdTouchEvents.start);
        el.removeEventListener('touchmove', el.akdTouchEvents.move);
        el.removeEventListener('touchend', el.akdTouchEvents.end);
    }
};