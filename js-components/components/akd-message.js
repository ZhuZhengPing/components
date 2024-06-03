/**
 * 消息提醒
 * zzp 2023/2/14 样式仿造elementui 提示信息
 * 正确的消息:akdAlert("恭喜你操作成功!")
 * 错误的消息:akdError("操作失败,请重试或与管理员联系!")
 * */
 ; (function (app) {
    function AkdMessageAlert(options) {
        if (typeof (options) == "string") {
            options = { message: options };
        }
        this.view = options.view || document.body;
        this.top = options.top || 80;
        this.message = options.message;
        this.duration = options.duration || 3000;
        this.type = options.type;
        this.messageDive;

        this.init = function () {
            this.initStyle();
            this.initBlock();
            this.initDestory();
        }

        this.initBlock = function () {
            this.messageDive = document.createElement('DIV');
            this.messageDive.className = 'akd-message';
            this.messageDive.style.top = this.top + 'px';
            this.messageDive.style.zIndex = "2000";

            if (this.type == "error") {
                var i = document.createElement("i");
                i.className = "fa fa-times-circle";
                this.messageDive.className = this.messageDive.className + " akd-message-error";
                this.messageDive.appendChild(i);
            } else {
                var i = document.createElement("i");
                i.className = "fa fa-check-circle-o";
                this.messageDive.className = this.messageDive.className + " akd-message-success";
                this.messageDive.appendChild(i);
            }

            var p = document.createElement("p");
            p.innerHTML = this.message;
            this.messageDive.appendChild(p);

            if (getComputedStyle(this.view).position === "static") {
                this.view.style.position = "relative";
            }

            this.view.appendChild(this.messageDive);
            // 浏览器强行渲染
            this.view.clientHeight; // 导致reflow

            this.messageDive.style.opacity = 1;
            this.messageDive.style.transform = `translate(-50%, -50%)`;
        }
        this.initStyle = function () {
            if (!document.getElementById("akdMessageStyle")) {
                var style = document.createElement('style');
                style.type = "text/css";
                style.id = "akdMessageStyle";
                style.innerHTML = `
                .akd-message{
                    box-sizing: border-box;
                    border-radius: 4px;
                    border-width: 1px;
                    border-style: solid;
                    border-color: #EBEEF5;
                    position: fixed;
                    left: 50%;
                    top: 50%;
                    background-color: #edf2fc;
                    transition: 0.4s;
                    -webkit-transition: 0.4s;
                    -webkit-transform: translate(-50%, -50%) translateY(25px);
                    transform: translate(-50%, -50%) translateY(25px);
                    overflow: hidden;
                    padding: 15px 15px 15px 20px;
                    display: -webkit-box;
                    display: -ms-flexbox;
                    display: flex;
                    -webkit-box-align: center;
                    -ms-flex-align: center;
                    align-items: center;
                    opacity: 0;
                    max-width: 90%;
                }
                .akd-message p{
                    margin: 0;
                    width: max-content;
                }
                .akd-message i{
                    margin-right: 8px;
                    font-size: 20px;
                }
                .akd-message-success {
                    background-color: #f0f9eb;
                    border-color: #e1f3d8;
                    color:#67C23A;
                }
                .akd-message-success p{
                    color: #67C23A;
                }
                .akd-message-error{
                    background-color: #fef0f0;
                    border-color: #fde2e2;
                    color: #F56C6C;
                }
            `;
                document.body.appendChild(style);
            }
        }

        this.initDestory = function () {
            setTimeout(() => {
                this.messageDive.style.opacity = 0;
                this.messageDive.style.transform = `translate(-50%, -50%) translateY(-25px)`;
                this.messageDive.addEventListener("transitionend", () => {
                    this.view.removeChild(this.messageDive);
                }, { once: true });
            }, this.duration);
        }
    }

    app.akdAlert = function (message) {
        var temp = new AkdMessageAlert({
            message: message
        });
        temp.init();
        temp = null;
    }
    app.akdError = function (message) {
        var temp = new AkdMessageAlert({
            type: "error",
            message: message
        });
        temp.init();
        temp = null;
    }
})(window);