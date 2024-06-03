export function formatDate(date) {
    if (!date) return '';
    if (typeof date === 'string') {
        date = new Date(date.replace(/T/g, ' ').replace(/-/g, '/').slice(0, 10));
    }
    return date.getFullYear() + '-' + (date.getMonth() + 1 + '').padStart(2, 0) + '-' + (date.getDate() + '').padStart(2, 0);
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

