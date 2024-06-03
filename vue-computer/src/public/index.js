export function formatDate(date) {
    if (!date) return '';
    if (typeof date === 'string') {
        date = new Date(date.replace(/T/g, ' ').replace(/-/g, '/').slice(0, 10));
    }
    return date.getFullYear() + '-' + (date.getMonth() + 1 + '').padStart(2, 0) + '-' + (date.getDate() + '').padStart(2, 0);
}

export function formatDateTime(date){
    if (!date) return '';
    if (typeof date === 'string') {
        date = new Date(date.replace(/T/g, ' ').replace(/-/g, '/').slice(0, 16));
    }
    return date.getFullYear() + '-' + (date.getMonth() + 1 + '').padStart(2, 0) + '-' + (date.getDate() + '').padStart(2, 0) + ' ' + (date.getHours()+'').padStart(2, 0) + ':' + (date.getMinutes()+'').padStart(2, 0);
}

export function formatYear(date){
    if(!data){
        return "";
    }
    if (typeof date === 'string') {
        date = new Date(date.replace(/T/g, ' ').replace(/-/g, '/').slice(0, 16));
    }
    return date.getFullYear();
}

export function formatMonth(date){
    if(!data){
        return "";
    }
    if (typeof date === 'string') {
        date = new Date(date.replace(/T/g, ' ').replace(/-/g, '/').slice(0, 16));
    }
    return date.getFullYear() + '-' + (date.getMonth() + 1 + '').padStart(2, 0);
}

export function formatDateByType(date,type){
    if(type=="datetime"){
        return formatDateTime(date);
    }else if(type=="date"){
        return formatDate(date);
    }else if(type=="month"){
        return formatMonth(date);
    }else if(type=="year"){
        return formatYear(date);
    }
    return "";
}

export function getTarget(target, curr, parent) {
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

window.tempTimer = 0;
export function debounce(fn){
    return function(){
        let args = arguments;
        clearTimeout(tempTimer);
        timer = setTimeout(() => {
            fn.apply(this, args);
        }, 300);
    }
}

export function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}