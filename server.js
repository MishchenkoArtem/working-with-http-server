const http = require('http');
const Koa = require('koa');
const { koaBody } = require('koa-body');
const app = new Koa();

let tickets = [];

app.use(koaBody({
    urlencoded: true,
    multipart: true,
}));

app.use((ctx, next) => {
    if (ctx.request.method !== 'OPTIONS')
    {
        next();
        return;
    }
    ctx.response.set('Access-Control-Allow-Origin', '*');
    ctx.response.set('Access-Control-Allow-Headers', '*');
    ctx.response.set('Access-Control-Allow-Methods', 'DELETE, PUT, PATCH, GET, POST');
    ctx.response.status = 204;
});

app.use((ctx, next) => {
    ctx.response.set('Access-Control-Allow-Origin', '*');
    ctx.response.body = 'server response';
    next();
});

app.use((ctx, next) => {
    if (ctx.request.method !== 'POST')
    {
      next();
      return;
    }

    console.log(ctx.request.body);
    const { name, description } = ctx.request.body;
    ctx.response.set('Access-Control-Allow-Origin', '*');
  
    if (tickets.some(sub => sub.name === name))
    {
        ctx.response.status = 400;
        ctx.response.body = 'subscription exists';
    
        return;
    }
  
    tickets.push({ name, description });
    ctx.response.body = 'OK';
    next();
});

const server = http.createServer(app.callback());
const port = 3000;

server.listen(port, (error) => {
    if (error)
    {
        console.log(error);
        return;
    }

    console.log(`Server listening to ${port}`);
});
