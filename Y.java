const Y = (f) => {
    return (x => f(v => x(x)(v))) (x => f(v => x(x)(v)));
};

const factorial = Y(f => n => (n === 0 ? 1 : n * f(n - 1)));

console.log(factorial(5)); // Outputs: 120