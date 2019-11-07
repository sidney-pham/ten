const TEN = 10.0;

const OPERATORS = [
    {
        eval: (x, y) => x + y,
        show: (x, y) => `(${x} + ${y})`
    },
    {
        eval: (x, y) => x - y,
        show: (x, y) => `(${x} - ${y})`
    },
    {
        eval: (x, y) => x * y,
        show: (x, y) => `(${x} × ${y})`
    },
    {
        eval: (x, y) => x / y,
        show: (x, y) => `(${x} ÷ ${y})`
    }
];

const perms = xs => {
    let res = [];
    const f = (xs, acc = []) => {
        if (xs.length === 0) {
            res.push(acc);
        } else {
            for (let i = 0; i < xs.length; i++) {
                let ys = xs.slice()
                let x = ys.splice(i, 1);
                f(ys.slice(), acc.concat(x));
            }
        }
    };
    f(xs);
    return res;
}

const makeTen = (w, x, y, z) => {
    let res = new Set();
    for (let [a, b, c, d] of perms([w, x, y, z])) {
        for (let op1 of OPERATORS) {
            for (let op2 of OPERATORS) {
                for (let op3 of OPERATORS) {
                    // Advanced handling of zero division.
                    try {
                        if (op3.eval(op1.eval(a, b), op2.eval(c, d)) == TEN) {
                            res.add(op3.show(op1.show(a, b), op2.show(c, d)));
                        }
                    } catch {
                        // Do literally nothing.
                    }
                }
            }
        }
    }
    return Array.from(res);
};

// Great beauty.
document.addEventListener('DOMContentLoaded', () => {
    const textbox = document.getElementById('numbers');
    const result = document.getElementById('result');
    const loading = document.createElement('li');
    loading.id = 'loading';
    loading.textContent = 'Loading…';
    const empty = document.createElement('li');
    empty.id = 'empty';
    empty.textContent = 'Can\'t make ten!';
    const invalid = document.createElement('li');
    invalid.id = 'invalid';
    invalid.textContent = 'Those aren\'t four digits…';
    textbox.addEventListener('keyup', e => {
        let numbers = e.target.value.trim();
        if (/^\d{4}$/.test(numbers) && numbers.length === 4) {
            numbers = numbers.split('').map(n => parseInt(n, 10));
            while (result.firstChild) {
                result.removeChild(result.firstChild);
            }
            result.appendChild(loading);
            let nodes = [];
            for (let solution of makeTen(...numbers)) {
                let node = document.createElement('li');
                node.textContent = solution.slice(1, solution.length - 1);
                nodes.push(node);
            }
            result.removeChild(loading);
            for (let node of nodes) {
                result.appendChild(node);
            }
            if (nodes.length === 0) {
                result.appendChild(empty);
            }
        } else {
            while (result.firstChild) {
                result.removeChild(result.firstChild);
            }
            if (numbers !== "") {
                result.appendChild(invalid);
            }
        }
    });
});
