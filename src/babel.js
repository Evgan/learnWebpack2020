async function start() {
    return await Promise.resolve('async is work');
}

start().then(console.log);
