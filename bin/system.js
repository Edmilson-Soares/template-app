import app from './app.js'
import service from './app/service.js'
import controller from './app/controller.js'
import http from './infra/http.js'
import db from './infra/db.js'
import command from './app/command.js'
import middleware from './app/middleware.js'
import lib from './core/lib.js'
import entity from './core/entity.js'
import router from './app/router.js'
import event from './app/event.js'
import auth from './auth.js'
import job from './infra/job.js'
import init from '../src/index.js'
import * as dotenv from 'dotenv'
dotenv.config



const system = (app) => ({
    ops: {},
    start: async function(ops = {}) {
        this.ops = ops
        await app.start(init)
        await app.db(ops.db_name)
        await app.server()
        await init.bootstrap({
            plugins: (name) => {
                return app.plugins[name]
            },
        })
    },
    plugins: (name) => {
        return app.plugins[name]
    },
    close: async() => {
        await init.distroy({
            plugins: (name) => {
                return app.plugins[name]
            },
        })
        await app.close()
    },
    error: async(error) => {
        console.log('ddd', error)
    }
})
export default system(app({
    service,
    router,
    auth,
    middleware,
    http,
    lib,
    entity,
    event,
    job,
    db,
    command,
    controller
}))