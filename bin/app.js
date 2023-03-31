import fs from 'fs';
import files from './files.js'
import forawait from "./forawait.js";




const plugins = {
    db: {},
    services: {},
    controllers: {},
    middlewares: {},
    routers: [],
    https: {},
    libs: {},
    entities: {},
    dbs: {},
    events: {},
    jobs: {},
    ejobs: {},
    cron: {},
    rabbitmq: {},
    sockets: {},
    esockets: {},
    commands: {}
}


const events = {
    'app::service': (name, event) => {
        plugins.services[name].rx.subscribe({
            next: event.handler,
        });
    },
    'app::command': (name, event) => {
        plugins.commands[name].rx.subscribe({
            next: event.handler,
        });
    },
    'app::cron': (name, event) => {
        plugins.cron[name] = plugins.libs.cron({
            name,
            time: event.ops.time,
            state: event.ops.state,
            execute: event.handler
        })
    },
    'app::rabbitmq': (name, event) => {
        plugins.rabbitmq[name] = event
    },
    'app::socket': (name, event) => {
        plugins.esockets[name] = event
    },
    'app::job': (name, event) => {
        plugins.ejobs[name] = event
    }
}


export default ({ service, command, http, lib, job, event, db, entity, controller, middleware, auth, router }) => ({
    config: async(files) => {

        return {
            command: fs.readdirSync(files.commands),
            db: fs.readdirSync(files.dbs),
            lib: fs.readdirSync(files.libs),
            event: fs.readdirSync(files.events),
            entity: fs.readdirSync(files.entities),
            http: fs.readdirSync(files.https),
            router: fs.readdirSync(files.routers),
            middleware: fs.readdirSync(files.middlewares),
            controller: fs.readdirSync(files.controllers),
            service: fs.readdirSync(files.services),
            job: fs.readdirSync(files.jobs)
        }

    },

    plugins: {
        db: {},
        services: {
            service: function(name) {
                return plugins.services[name]
            }
        },
        middlewares: {
            middleware: function(name) {
                return plugins.middlewares[name]
            }
        },

        controllers: {
            controller: function(name) {
                return plugins.controllers[name]
            }
        },
        commands: {
            command: function(name) {
                return plugins.commands[name]
            }
        },
        https: {
            http: function(name) {
                return plugins.https[name]
            }
        },
        libs: {
            lib: function(name) {
                return plugins.libs[name]
            }
        },
        entities: {
            entity: function(name) {
                return plugins.entities[name]
            }
        },
        dbs: {
            db: function(name) {
                return plugins.dbs[name]
            }
        },
        events: {
            event: function(name) {
                return plugins.events[name]
            },
            list: function(name) {
                if (name)
                    return Object.entries(plugins.events).filter(e => e[0] == name)
                else
                    return Object.values(plugins.events)
            }
        },
        crons: {
            cron: function(name) {
                return plugins.cron[name]
            }
        },
        routers: () => plugins.routers
    },
    start: async function(init) {

        const paths = await this.config(files)


        await forawait.generate(paths.lib, async(file) => {
            const { obs, name } = await lib({
                file,
                fileLib: files.libs
            })


            plugins.libs[name] = obs


        }, {})

        await forawait.generate(paths.entity, async(path) => {
            await forawait.generate(fs.readdirSync(files.entities + '/' + path), async(file) => {
                const { name, fn } = await entity({ path, z: plugins.libs.z, libs: plugins.libs, file, fileEntity: files.entities })
                plugins.entities[name] = fn

            }, {})
        }, {})


        await forawait.generate(paths.db, async(path) => {
            await forawait.generate(fs.readdirSync(files.dbs + '/' + path), async(file) => {
                const { name, db: db_ } = await db({ path, libs: (name) => plugins.libs[name], file, fileDb: files.dbs })
                plugins.dbs[name] = db_

            }, {})
        }, {})




        await forawait.generate(paths.service, async(path) => {
            await forawait.generate(fs.readdirSync(files.services + '/' + path), async(file) => {
                const { Subject } = plugins.libs.rxjs
                const rx = new Subject()

                const { name, fn } = await service({
                    path,
                    file,
                    rx,
                    services: {
                        service: function(name) {
                            return plugins.services[name]
                        }
                    },
                    commands: {
                        command: function(name) {
                            return plugins.commands[name]
                        }
                    },
                    forawait,
                    libs: plugins.libs,
                    dbs: {
                        db: function(name) {
                            return plugins.dbs[name]
                        }
                    },
                    entities: {
                        entity: function(name) {
                            return plugins.entities[name]
                        }
                    },
                    fileService: files.services
                })
                plugins.services[name] = fn
                plugins.services[name].rx = rx

            }, {})
        }, {})


        await forawait.generate(paths.command, async(path) => {
            await forawait.generate(fs.readdirSync(files.commands + '/' + path), async(file) => {
                const { Subject } = plugins.libs.rxjs
                const rx = new Subject()

                const { name, fn } = await command({
                    path,
                    file,
                    rx,

                    forawait,
                    libs: plugins.libs,
                    services: {
                        service: function(name) {
                            return plugins.services[name]
                        }
                    },
                    dbs: {
                        db: function(name) {
                            return plugins.dbs[name]
                        }
                    },
                    entities: {
                        entity: function(name) {
                            return plugins.entities[name]
                        }
                    },
                    fileCommand: files.commands
                })
                plugins.commands[name] = fn
                plugins.commands[name].rx = rx

            }, {})
        }, {})


        await forawait.generate(paths.job, async(path) => {
            await forawait.generate(fs.readdirSync(files.jobs + '/' + path), async(file) => {

                const { name, job: job_ } = await job({
                    path,
                    file,
                    events: Object.entries(plugins.events).filter(e => e[0] == 'app::job'),
                    dbs: {
                        db: function(name) {
                            return plugins.dbs[name]
                        }
                    },
                    forawait,
                    services: {
                        service: function(name) {
                            return plugins.services[name]
                        }
                    },
                    fileJob: files.jobs
                })
                plugins.jobs[name] = job_

                if (path == 'socket') {
                    plugins.sockets[name] = job_
                }


            }, {})
        }, {})

        await forawait.generate(paths.event, async(path) => {
            await forawait.generate(fs.readdirSync(files.events + '/' + path), async(file) => {
                const { name, event: event_ } = await event({
                    path,
                    libs: plugins.libs,
                    services: {
                        service: function(name) {
                            return plugins.services[name]
                        }
                    },
                    commands: {
                        command: function(name) {
                            return plugins.commands[name]
                        }
                    },
                    file,
                    fileEvent: files.events
                })
                plugins.events[name] = event_
                plugins.events[name].ops.name = name
                if (events[event_.type]) {
                    events[event_.type](name, event_)
                }


            }, {})
        }, {})


        await forawait.generate(paths.middleware, async(path) => {
            await forawait.generate(fs.readdirSync(files.middlewares + '/' + path), async(file) => {
                const { name, fn } = await middleware({ z: plugins.libs.zod, path, file, fileMiddleware: files.middlewares })
                plugins.middlewares[name] = fn

            }, {})
        }, {})

        await forawait.generate(paths.controller, async(path) => {
            await forawait.generate(fs.readdirSync(files.controllers + '/' + path), async(file) => {
                const { name, fn } = await controller({
                    path,

                    services: {
                        service: function(name) {
                            return plugins.services[name]
                        }
                    },

                    file,
                    fileController: files.controllers
                })
                plugins.controllers[name] = fn

            }, {})
        }, {})


        await forawait.generate(paths.router, async(path) => {
            await forawait.generate(fs.readdirSync(files.routers + '/' + path), async(file) => {
                const { route } = await router({
                    path,
                    file,
                    z: plugins.libs.z,
                    auth: auth(),
                    controllers: {
                        controller: function(name) {
                            return plugins.controllers[name]
                        }
                    },
                    middlewares: (list) => {
                        const middlewares = []
                        list.forEach(e => {
                            if (plugins.middlewares['app::' + e]) {
                                middlewares.push(plugins.middlewares['app::' + e].execute)
                            }
                        })

                        return middlewares
                    },
                    fileRouter: files.routers
                })

                plugins.routers.push(route)

            }, {})
        }, {})


        await forawait.generate(paths.http, async(path) => {
            const { server, name } = await http({
                path,
                forawait,
                auth,
                services: {
                    service: function(name) {
                        return plugins.services[name]
                    }
                },
                events: Object.values(plugins.esockets),
                sockets: Object.values(plugins.sockets),
                z: plugins.libs.zod,
                routers: [...plugins.routers],
                fileHttp: files.https
            })

            plugins.https[name] = server
        }, {})

        await init.register({
            plugins: (name) => {
                return this.plugins[name]
            },
        })

        await forawait.generate(Object.values(plugins.rabbitmq), async(event) => {
            const ch = await plugins.libs.rabbitmq
            ch.consume(event.ops.queue, event.handler)
        }, {}, console.log)
    },
    db: async function(name) {
        await forawait.generate(Object.entries(plugins.dbs), async(params) => {
            if (params[0].includes(name || process.env.DB_NAME)) {
                plugins.db['infra::' + params[0].split('.')[1]] = params[1]
            }
        }, {})

        this.plugins.db = {
            name: name || process.env.DB_NAME,
            model: (name) => {
                return plugins.db[name]
            }
        }

    },
    async server() {

        await plugins.https[process.env.HTTP_SERVER].start()
        plugins.libs['io'] = plugins.https[process.env.HTTP_SERVER].io
    },
    async close() {
        await plugins.https[process.env.HTTP_SERVER].close()
        await plugins.dbs['infra::' + this.plugins.db.name + '.close'].execute()
    }


})