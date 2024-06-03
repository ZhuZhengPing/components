;
/**
 * zzp write 2024-02-03 
 * bu chong fu zhao lun zi
 */
(function (app) {
    'use strict';

    app.registerDatePicker = function(picker){
        picker.className += " akd-date-picker-component";
        let input = document.createElement("input");
        input.type="text";
        input.setAttribute("readonly", "true");
        picker.appendChild(input);

        // properties
        if(picker.getAttribute("placeholder")){
            input.setAttribute("placeholder",picker.getAttribute("placeholder"));
        }
        if(picker.getAttribute("disabled")){
            input.setAttribute("disabled",picker.getAttribute("disabled"));
        }
        let min = picker.getAttribute("min")||"1900-01-01";
        let max = picker.getAttribute("max")||"2050-12-31";
        
        let value = picker.getAttribute("value");
        if(!value){
            value = formatDate(new Date());
        }else{
            input.value=value;
        }
        
        // arguments
        let years=[];
        let yearIndex=0;
        let year=null;
        let months=[];
        let monthIndex=0;
        let month=null;
        let days = [];
        let dayIndex=0;
        let day=null;
        let lineHeight=50;
        let preY={
            y:undefined,
            time:undefined
        };
        let currUl=null;
        let speed=0;
        let footer = null;

        // 弹出框
        let dialog = document.createElement("div");
        dialog.className = "akd-date-time-select";
        dialog.style.display="none";
        dialog.innerHTML = `
        <div class="date-time-pop">
            <h4>日期选择器</h4>
            <div class="date-select">
                <div class="date-select-year">
                    <ul data-type="year">
                    </ul>
                </div>
                <div class="date-select-month">
                    <ul data-type="month">
                        
                    </ul>
                </div>
                <div class="date-select-day">
                    <ul data-type="day">
                        
                    </ul>
                </div>
            </div>
            <div class="akd-date-footer">
                <button class="btn-clear">清除</button>
                <div>
                    <button class="btn-cancel">取消</button>
                    <button class="btn-sure">确认</button>
                </div>
            </div>
        </div>
        `;
        picker.appendChild(dialog);
        let uls = dialog.querySelectorAll("ul");
        year = uls[0];
        month=uls[1];
        day=uls[2];
        footer = dialog.querySelector(".akd-date-footer");

        year.addEventListener('touchstart', touchStart, false);
        year.addEventListener('touchmove', touchMove, false);
        year.addEventListener('touchend', touchEnd, false);
        year.addEventListener('touchcancel', touchEnd, false);
        // year.addEventListener('click', liClickHandler, false);
        
        month.addEventListener('touchstart', touchStart, false);
        month.addEventListener('touchmove', touchMove, false);
        month.addEventListener('touchend', touchEnd, false);
        month.addEventListener('touchcancel', touchEnd, false);
        // month.addEventListener('click', liClickHandler, false);
        
        day.addEventListener('touchstart', touchStart, false);
        day.addEventListener('touchmove', touchMove, false);
        day.addEventListener('touchend', touchEnd, false);
        day.addEventListener('touchcancel', touchEnd, false);
        // day.addEventListener('click', liClickHandler, false);

        input.addEventListener('click', init, false);
        footer.addEventListener('click',clickHandler);

        initDate();

        function init(){
            dialog.style.display="flex";
            initDate();
        }

        function initDate(){
            let tempValue = new Date(value);
            let tempMin = new Date(min);
            let tempMax = new Date(max);
            
            year.innerHTML="";
            month.innerHTML="";
            day.innerHTML="";
            years=[];
            months=[];
            days=[];

            let tempLi = document.createElement("li");
            year.appendChild(tempLi);
            for(let i=tempMin.getFullYear(),index=0;i<tempMax.getFullYear();i++,index++){
                years.push(i);
                tempLi = document.createElement("li");
                tempLi.innerHTML=i;
                year.appendChild(tempLi);
                if(i==tempValue.getFullYear()){
                    yearIndex=index;
                }
            }
            tempLi = document.createElement("li");
            year.appendChild(tempLi);

            tempLi = document.createElement("li");
            month.appendChild(tempLi);
            for (let i = 1; i < 13; i++) {
                months.push(i);
                let tempLi = document.createElement("li");
                tempLi.innerHTML=i;
                month.appendChild(tempLi);
                if (i === tempValue.getMonth()+1) {
                    monthIndex = i - 1;
                }
            }
            tempLi = document.createElement("li");
            month.appendChild(tempLi);

            tempLi = document.createElement("li");
            day.appendChild(tempLi);
            for (let i = 1; i < 32; i++) {
                days.push(i);
                let tempLi = document.createElement("li");
                tempLi.innerHTML=i;
                day.appendChild(tempLi);
                if (i === tempValue.getDate()){
                    dayIndex = i - 1;
                } 
            }
            tempLi = document.createElement("li");
            day.appendChild(tempLi);
            
            setDate();
        }

        function setDate(){
            year.style.transform = 'translateY(' + -1 * yearIndex * lineHeight + 'px)';
            month.style.transform = 'translateY(' + -1 * monthIndex * lineHeight + 'px)';
            day.style.transform = 'translateY(' + -1 * dayIndex * lineHeight + 'px)';
            calcDay();
        }

        function calcDay(){
            const date = new Date(years[yearIndex] + '/' + months[monthIndex] + '/1');
            date.setMonth(date.getMonth() + 1);
            date.setDate(0);
    
            const maxDay = new Date(date).getDate();
            if (dayIndex > maxDay - 1) {
                dayIndex = maxDay;
            }
            const tempDays = [];
            for (let i = 1; i <= maxDay; i++) {
                tempDays.push(i);
            }
            days=tempDays;
            day.style.transform = 'translateY(' + -1 * dayIndex * lineHeight + 'px)';
        }

        function touchStart(e) {
            const cul = getTarget(e.target, 'ul');
            if (cul) {
                currUl = cul;
            } else {
                currUl = undefined;
            }
        }

        function touchMove(e) {
            if (!currUl) return;
            if (preY.y || preY.y === 0) {
                const range = e.touches[0].clientY - preY.y;
                currUl.style.transform = 'translateY(' + ((getComputedStyle(currUl, null).transform.slice(22, -1) | 0) + range) + 'px)';
                speed = range / (new Date().getTime() - preY.time);
            }
            preY.y = e.touches[0].clientY;
            preY.time = new Date().getTime();
        }

        function touchEnd() {
            const type = currUl.getAttribute('data-type');
            const curr = getComputedStyle(currUl, null).transform.slice(22, -1) | 0;
            let tempArray = eval(type + 's');
            const index = Math.min(Math.max(Math.round((curr + speed * 150) / lineHeight), (tempArray.length - 1) * -1), 0);
            const target = lineHeight * index;
            if(type=="year"){
                yearIndex=Math.abs(index);
            }else if(type=="month"){
                monthIndex=Math.abs(index);
            }else{
                dayIndex=Math.abs(index);
            }
            if (~['year', 'month'].indexOf(type)) {
                calcDay();
            }
            scrollTo(curr, target, Math.min(Math.abs(Math.floor(speed * 50)), 10), 0, ty => {
                currUl.style.transform = 'translateY(' + ty + 'px)';
            });
            speed = 0;
            preY = {};
        }

        function clickHandler(e){
            const target = getTarget(e.target,'button');
            if(!target) return;
            dialog.style.display="none";
            if(target.className=="btn-clear"){
                value="";
                input.value=value;
                picker.setAttribute("value", value);
            }else if(target.className=="btn-sure"){
                value=formatDate(years[yearIndex] + '-' + months[monthIndex] + '-' + days[dayIndex]);
                input.value=value;
                picker.setAttribute("value", value);
            }
            
        }

        // function liClickHandler(e){
        //     const target = getTarget(e.target, 'li');
        //     if (target) {
        //         if (!target.innerText) return;
        //         const type = target.getAttribute('data-type');
        //         let tempArray = eval(type + 's');
        //         const index = tempArray.indexOf((target.innerText | 0));
        //         if(type=="year"){
        //             yearIndex=index;
        //         }else if(type=="month"){
        //             monthIndex=index;
        //         }else{
        //             dayIndex=index;
        //         }
        //         if (~['year', 'month'].indexOf(type)) {
        //             calcDay();
        //         }
        //         scrollTo(getComputedStyle(app, null).transform.slice(22, -1) | 0, -1 * index * lineHeight, 10, 0, ty => {
        //             currUl.style.transform = 'translateY(' + ty + 'px)';
        //         });
        //     }
        // }

        if(!document.querySelector("#akdDatePickerComponent")){
            let style = document.createElement("style");
            style.id="akdDatePickerComponent";
            style.innerHTML = `
                .akd-date-picker-component{
                    height:36px;
                    display:block;
                }
                .akd-date-picker-component input{
                    flex: auto;
                    border: solid 1px lightgray;
                    border-radius: 3px;
                    height: 100%;
                    padding: 0 10px;
                    font-size: 14px;
                    width:100%;
                }
                .akd-date-picker-component .akd-date-time-select{
                    position: fixed;
                    z-index: 99999;
                    width: 100%;
                    left: 0;
                    top: 0;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: rgba(0, 0, 0, .5);
                }
                .akd-date-picker-component .date-time-pop{
                    padding: 20px;
                    background-color: white;
                    border-radius: 3px;
                    width: 90%;
                }
                .akd-date-picker-component .date-select {
                    margin-top: 20px;
                    position: relative;
                    display: flex;
                    justify-content: space-around;
                    height: 150px;
                    overflow: hidden;
                }
                .akd-date-picker-component .date-select:after{
                    position: absolute;
                    content: '';
                    left: 0;
                    right: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    background: linear-gradient(to bottom, white 0, white 5%, rgba(255, 255, 255, 0) 50%, white 95%, white 100%);
                }
                .akd-date-picker-component .date-select >div{
                    position: relative;
                    width: 33.3%;
                    height: 100%;
                    font-size: 15px;
                    overflow: hidden;
                    margin: 0;
                    padding: 0;
                }
                .akd-date-picker-component .date-select >div:before{
                    position: absolute;
                    content: '';
                    width: 70%;
                    height: 2px;
                    left: 15%;
                    top: 33%;
                    background-color: #333;
                }
                .akd-date-picker-component .date-select >div:after{
                    position: absolute;
                    content: '';
                    width: 70%;
                    height: 2px;
                    left: 15%;
                    bottom: 33%;
                    background-color: #333;
                }
                .akd-date-picker-component .date-select ul{
                    list-style-type: none;
                    margin: 0;
                    padding: 0;
                    height: 100%;
                    text-align: center;
                    line-height: 50px;
                }
                .akd-date-picker-component .date-select ul li{
                    height: 50px;
                }
                .akd-date-picker-component .akd-date-footer{
                    margin-top: 20px;
                    display: flex;
                    justify-content: space-between;
                }
                .akd-date-picker-component button{
                    background-color: cadetblue;
                    color: white;
                    border: none;
                    height: 42px;
                    font-size: 15px;
                    border-radius: 3px;
                    padding: 8px 20px;
                }
                .akd-date-picker-component .btn-clear{
                    background-color: #c1c1c1;
                }
                .akd-date-picker-component .btn-cancel{
                    background-color: burlywood;
                    margin-right: 10px;
                }
            `;
            document.body.appendChild(style);
        }
    }

    function formatDate(date) {
        if (!date) return '';
        if (typeof date === 'string') {
            date = new Date(date.replace(/T/g, ' ').replace(/-/g, '/').slice(0, 10));
        }
        return date.getFullYear() + '-' + (date.getMonth() + 1 + '').padStart(2, 0) + '-' + (date.getDate() + '').padStart(2, 0);
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
    
    function scrollTo(curr, target, time, start, callback) {
        let currY = easeOut(start, curr, target - curr, time);
        requestAnimationFrame(() => {
            callback(currY);
            start++;
            if (start < time) {
                scrollTo(curr, target, time, start, callback);
            } else {
                callback(target);
            }
        })
    }
    
    function easeOut(t, b, c, d) {
        return -c * (t /= d) * (t - 2) + b;
    }

    // register elements
    const pickers = app.document.querySelectorAll("akd-date-picker");
    for(let i=0;i<pickers.length;i++){
        app.registerDatePicker(pickers[i]);
    }
        
})(window);


