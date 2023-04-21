const express = require('express')
const route = express.Router()
const register = require('./src/controllers/registerController')
const login = require('./src/controllers/loginController')
const task = require('./src/controllers/taskController')
const projetos = require('./src/controllers/projectController')
const financas = require('./src/controllers/financasController')
const logout = require('./src/controllers/logoutController')

route.get('/dados', register.registerGet)
route.post('/projetos', projetos.projectsData)
route.post('/registrar', register.registerPost)
route.post('/entrar', login.loginPost)
route.post('/sair', logout.saveNotifications)

route.post('/projetos/criar', projetos.newProject)
route.post('/projetos/excluir', projetos.excludeProject)
route.post('/projetos/:id', projetos.specProject)

route.post('/projetos/:id/tarefa', projetos.newTask)
route.post('/projetos/:id/atualizar', projetos.updateTask)
route.post('/projetos/:id/dados', projetos.updateProject)

route.post('/financas', financas.financasRead)
route.post('/financas/registrar', financas.financasRegister)
route.post('/financas/excluir', financas.financasExclude)

route.post('/tarefas/addtarefa', task.taskPost)
route.get('/tarefas', task.taskGet)
route.post('/tarefas/completar', task.taskCompleted)

module.exports = route