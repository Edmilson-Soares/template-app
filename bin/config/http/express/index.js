import express from "express"
import cookieParser from 'cookie-parser';
import { Server } from "socket.io"
import route from './route.js'
import auth from "./auth.js"



import cors from 'cors'
import http from 'node:http';



const app = express()


app.use(cookieParser());

app.use(express.static('./public'))

app.use(express.json())


app.set('view engine', 'ejs');
app.set('views', './src/infra/views');

const server = http.createServer(app);
const io = new Server(server);
const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
}


app.use(cors(corsOptions))




export default async({ routers, sockets, events, fn, services, forawait }) => {
    const router = await route({ routers, io, auth: auth({ fn: fn(), services }), forawait })

    await forawait.generate(sockets, async(socket) => {
        io.of(socket.path).use(socket.auth)
        io.of(socket.path).on('connection', socket.connection(events.filter(e => socket.path.includes(e.ops.path))))

    }, {})





    return {
        io,
        start: async() => {
            app.use(router)
            app.use('/api/*', (req, res) => {
                res.status(404).send({
                    error: 404,
                    message: 'não encontrado'
                })
            })


            app.use('*', (req, res) => {
                res.render('errors/404')
            })


            server.listen(process.env.PORT || 3000, () => {
                console.log(`Example app listening on port ${process.env.HTTP_SERVER_PORT || 3000}`)
            })
        },
        close: () => {
            server.close()
        }
    }
}