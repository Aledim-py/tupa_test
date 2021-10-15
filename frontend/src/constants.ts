
let domain = "http://127.0.0.1:8000";

if (process.env.NODE_ENV !== 'production') {
  domain = "frostgem.ru"
}

console.log(process.env.NODE_ENV);

export {domain};
