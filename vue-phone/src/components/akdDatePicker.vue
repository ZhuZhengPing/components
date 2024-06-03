<template>
    <div class="date-input">
        <input type="text" @click="openDateDialog" :placeholder="placeholder" readonly="readonly" :disabled="disabled" v-model="value" />
    
        <transition name="fade-form-large" v-show="show">
            <div class="date-time-select">
                <div class="date-time-pop">
                    <h4>日期选择器</h4>
                    <div class="date-select">
                        <div class="date-select-year">
                            <ul ref="year" data-type="year" @touchstart.prevent="touchStartHandler" @touchmove.prevent="touchMoveHandler" @touchend.prevent="touchEndHandler" @touchcancel.prevent="touchEndHandler"
                                @click="liClickHandler(year, $event)">
                                <li></li>
                                <li v-for="y in years" :key="y">{{y}}</li>
                                <li></li>
                            </ul>
                        </div>
                        <div class="date-select-month">
                            <ul ref="month" data-type="month" @touchstart.prevent="touchStartHandler" @touchmove.prevent="touchMoveHandler" @touchend.prevent="touchEndHandler" @touchcancel.prevent="touchEndHandler"
                                @click="liClickHandler(month, $event)">
                                <li></li>
                                <li v-for="m in months" :key="m">{{m}}</li>
                                <li></li>
                            </ul>
                        </div>
                        <div class="date-select-day">
                            <ul ref="day" data-type="day" @touchstart.prevent="touchStartHandler" @touchmove.prevent="touchMoveHandler" @touchend.prevent="touchEndHandler" @touchcancel.prevent="touchEndHandler"
                            @click="liClickHandler(day, $event)">
                                <li></li>
                                <li v-for="d in days" :key="d">{{d}}</li>
                                <li></li>
                            </ul>
                        </div>
                    </div>
                    <div class="footer" @click="clickHandler">
                        <button class="btn-clear">清除</button>
                        <div>
                            <button class="btn-cancel">取消</button>
                            <button class="btn-sure">确认</button>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup>
    import {formatDate,getTarget} from "../../public/index"
    import{ref,nextTick,reactive } from "vue"

    const props =  defineProps({
        min:{
            type:String,
            default:"1900-01-01"
        },
        max:{
            type:String,
            default:"2050-12-31"
        },
        placeholder:String,
        disabled:Boolean
    });

    let value = defineModel();
    
    

    let years= ref([]);
    let yearIndex= ref(0);
    const year = ref(null);

    let months = ref([]);
    let monthIndex=ref(0);
    const month = ref(null);

    let days = ref([]);
    let dayIndex=ref(0);
    const day = ref(null);

    let lineHeight = 50;
    let show = ref(false);


    let preY = reactive({
        y:undefined,
        time:undefined
    });

    let currUl=null;
    let speed=0;

    initDate();

    function openDateDialog(){
        show.value=true;
        initDate();
    }

    function initDate(){
        let tempValue = null;
        if(!value.value){
            tempValue= new Date();
        }else{
            tempValue=new Date(value.value);
        }
        
        let min = new Date(props.min);
        let max = new Date(props.max);
        for(let i=min.getFullYear(),index=0;i<max.getFullYear();i++,index++){
            years.value.push(i);
            if(i==tempValue.getFullYear()){
                yearIndex.value=index;
            }
        }
        for (let i = 1; i < 13; i++) {
            months.value.push(i);
            if (i === tempValue.getMonth()+1) {
                monthIndex.value = i - 1;
            }
        }
        for (let i = 1; i < 32; i++) {
            days.value.push(i);
            if (i === tempValue.getDate()){
                dayIndex.value = i - 1;
            } 
        }
        setDate();
    }

    function setDate(){
        nextTick(()=>{
            year.value.style.transform = 'translateY(' + -1 * yearIndex.value * lineHeight + 'px)';
            month.value.style.transform = 'translateY(' + -1 * monthIndex.value * lineHeight + 'px)';
            day.value.style.transform = 'translateY(' + -1 * dayIndex.value * lineHeight + 'px)';
            calcDay();
        })
    }

    function calcDay(){
        const date = new Date(years.value[yearIndex.value] + '/' + months.value[monthIndex.value] + '/1');
        date.setMonth(date.getMonth() + 1);
        date.setDate(0);

        const maxDay = new Date(date).getDate();
        if (dayIndex.value > maxDay - 1) {
            dayIndex.value = maxDay;
        }
        const tempDays = [];
        for (let i = 1; i <= maxDay; i++) {
            tempDays.push(i);
        }
        days.value=tempDays;
        nextTick(()=>{
            day.value.style.transform = 'translateY(' + -1 * dayIndex.value * lineHeight.value + 'px)';
        });
    }

    function clickHandler(e){
        const target = getTarget(e.target,'button');
        if(!target) return;
        show.value=false;
        if(target.className=="btn-clear"){
            value.value="";
        }else if(target.className=="btn-sure"){
            value.value=formatDate(years.value[yearIndex.value] + '-' + months.value[monthIndex.value] + '-' + days.value[dayIndex.value]);
        }
    }

    function touchStartHandler(e) {
        const cul = getTarget(e.target, 'ul');
        if (cul) {
            currUl = cul;
        } else {
            currUl = undefined;
        }
    }
    function touchMoveHandler(e) {
        if (!currUl) return;
        if (preY.y || preY.y === 0) {
            const range = e.touches[0].clientY - preY.y;
            currUl.style.transform = 'translateY(' + ((getComputedStyle(currUl, null).transform.slice(22, -1) | 0) + range) + 'px)';
            speed = range / (new Date().getTime() - preY.time);
        }
        preY.y = e.touches[0].clientY;
        preY.time = new Date().getTime();
    }
    function touchEndHandler() {
        const type = currUl.getAttribute('data-type');
        const curr = getComputedStyle(currUl, null).transform.slice(22, -1) | 0;
        let tempArray = eval(type + 's');
        let tempIndex = eval(type+'Index');
        const index = Math.min(Math.max(Math.round((curr + speed * 150) / lineHeight), (tempArray.value.length - 1) * -1), 0);
        const target = lineHeight * index;
        tempIndex.value = Math.abs(index);
        if (~['year', 'month'].indexOf(type)) {
            calcDay();
        }
        scrollTo(curr, target, Math.min(Math.abs(Math.floor(speed * 50)), 10), 0, ty => {
            currUl.style.transform = 'translateY(' + ty + 'px)';
        });
        speed = 0;
        preY = {};
    }
    function liClickHandler(dom, e) {
        console.log("liClickHandler");
        const target = getTarget(e.target, 'li', dom);
        if (target) {
            if (!target.innerText) return;
            const type = dom.getAttribute('data-type');
            let tempArray = eval(type + 's');
            const index = tempArray.value.indexOf((target.innerText | 0));
            if(type=="year"){
                yearIndex.value=index;
            }else if(type=="month"){
                monthIndex.value=index;
            }else{
                dayIndex.value=index;
            }
            if (~['year', 'month'].indexOf(type)) {
                calcDay();
            }
            scrollTo(getComputedStyle(dom, null).transform.slice(22, -1) | 0, -1 * index * lineHeight, 10, 0, ty => {
                currUl.style.transform = 'translateY(' + ty + 'px)';
            });
        }
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
</script>

<style lang="scss" scoped>
    .date-input{
        height: 36px;
        input{
            flex: auto;
            border: solid 1px lightgray;
            border-radius: 3px;
            height: 100%;
            padding: 0 10px;
            font-size: 14px;
            width:100%;
        }
    }
    .fade-form-large-enter-active, .fade-form-large-leave-active {
    transition: all .3s ease;
    }

    .fade-form-large-enter, .fade-form-large-leave-to {
    transform: scale(1.2);
    opacity: 0;
    }

    .date-time-select {
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
    .date-time-pop {
        padding: 20px;
        background-color: white;
        border-radius: 3px;
        width: 90%;
        .date-select {
        margin-top: 20px;
        position: relative;
        display: flex;
        justify-content: space-around;
        height: 150px;
        overflow: hidden;
        &:after {
            position: absolute;
            content: '';
            left: 0;
            right: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            background: linear-gradient(to bottom, white 0, white 5%, rgba(255, 255, 255, 0) 50%, white 95%, white 100%);
        }
        > div {
            position: relative;
            width: 33.3%;
            height: 100%;
            font-size: 15px;
            overflow: hidden;
            margin: 0;
            padding: 0;
            &:before {
            position: absolute;
            content: '';
            width: 70%;
            height: 2px;
            left: 15%;
            top: 33%;
            background-color: #333;
            }
            &:after {
            position: absolute;
            content: '';
            width: 70%;
            height: 2px;
            left: 15%;
            bottom: 33%;
            background-color: #333;
            }
            ul {
            list-style-type: none;
            margin: 0;
            padding: 0;
            height: 100%;
            text-align: center;
            line-height: 50px;
            li {
                height: 50px;
            }
            }
        }
        }
        .footer {
        margin-top: 20px;
        display: flex;
        justify-content: space-between;
        button {
            background-color: cadetblue;
            color: white;
            border: none;
            height: 42px;
            font-size: 15px;
            border-radius: 3px;
            padding: 8px 20px;
            &.btn-clear {
            background-color: #c1c1c1;

            }
            &.btn-cancel {
            background-color: burlywood;
            margin-right: 10px;
            }
        }
        }
    }
    }
</style>
