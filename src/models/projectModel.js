const mongoose = require('mongoose')

class Register {
    constructor(body) {
        this.body = body,
        this.errors = [],
        this.user = null,
        this.projectIndex = 0
    }
    async newProject() {
        this.validate()
        if (this.errors.length > 0) return this.errors

        this.user = this.body.user
        const mongooseDb = mongoose.connection.db.collection('react-apps')
        const projects = []
        await mongooseDb.find({email: this.user}).forEach((userData) => {
            if (userData.projects) {
                projects.push(...userData.projects)
            }
        })
        
        const newProjectData = {
            area: this.body.area,
            name: this.body.name,
            client: this.body.client,
            valor: this.body.valor,
            tasks: [],
            desc: '',
            start: '',
            finish: '',
            status: "ativo"
        }

        projects.unshift(newProjectData)

        await mongooseDb.findOneAndUpdate({email: this.user}, {
            $set: {
                "projects": projects
            }
        })

        this.projectIndex = projects.indexOf(newProjectData)+1
    }

    async validate() {
        if (this.body.name === 'undefined') return this.errors.push('Digite um nome para o seu projeto')
        if (this.body.valor === 'undefined') return this.errors.push('Insira um valor para o seu projeto')
        if (this.body.area === 'work' && this.body.client === 'undefined') this.body.client = ''
    }

    async readProjects(user, id) {
        const mongooseDb = mongoose.connection.db.collection('react-apps')
        const projects = []

        await mongooseDb.find({ email: user }).forEach((userData) => {
            if (userData.projects ) {
                projects.push(...userData.projects)
            }
        })
        return projects
    }

    async newTask(user, id, body) {
        const mongooseDb = mongoose.connection.db.collection('react-apps')
        const projects = []

        await mongooseDb.find({ email: user }).forEach((userData) => {
            if (userData.projects) {
                projects.push(...userData.projects)
            }
        })

        if (body.name.length == 0) return this.errors.push('Nome da tarefa inválido')
        if (body.deadline.length < 10) return this.errors.push('Prazo inválido')

        if (this.errors.length > 0) return this.errors

        projects[id-1].tasks.unshift({
            name: body.name,
            deadline: body.deadline,
            situacao: false
        })
        
        await mongooseDb.findOneAndUpdate({email: user}, {
            $set: {
                "projects": projects
            }
        })
        return this.errors
    }

    async updateTask(body, id) {
        const mongooseDb = mongoose.connection.db.collection('react-apps')
        const user = body.user
        const projectId = parseInt(body.id)
        const taskUpdated = (body.tasksUpdated).trim()
        
        const str = taskUpdated.split(',')

        const projects = []
        await mongooseDb.find({ email: user }).forEach((userData) => {
            if (userData.projects) {
                projects.push(...userData.projects)
            }
        })

        for (let p of str) {
            if (projects[projectId-1].tasks[p].situacao) {
                projects[projectId-1].tasks[p].situacao = false
            } else {
                projects[projectId-1].tasks[p].situacao = true
            }
        }
        
        await mongooseDb.findOneAndUpdate({email: user}, {
            $set: {
                "projects": projects
            }
        })
    }

    async updateProject(body) {
        const mongooseDb = mongoose.connection.db.collection('react-apps')
        const projects = []
        const user = body.user
        const projectId = parseInt(body.projectId)
        const taskUpdated = (body.tasks).trim()
        
        const str = taskUpdated.split(',')

        await mongooseDb.find({ email: user }).forEach((userData) => {
            if (userData.projects) {
                projects.push(...userData.projects)
            }
        })
        // console.log(projects[projectId].tasks.)
        for (let p of str) {
            if (!isNaN(parseInt(p))) {
                projects[projectId].tasks.splice(p, 1)
            }
        }

        const updatedProject = {
            name: body.name,
            status: body.status,
            area: body.area,
            client: body.client,
            valor: parseInt(body.valor),
            tasks: projects[projectId].tasks,
            desc: body.desc,
            start: body.start,
            finish: body.finish
        }

        projects[projectId] = updatedProject

        await mongooseDb.findOneAndUpdate({email: user}, {
            $set: {
                "projects": projects
            }
        })
    }

    async excludeProject({ user, projectId }) {
        const mongooseDb = mongoose.connection.db.collection('react-apps')
        const projects = []

        await mongooseDb.find({ email: user }).forEach((userData) => {
            if (userData.projects ) {
                projects.push(...userData.projects)
            }
        })

        projects.splice(projectId, 1)

        await mongooseDb.findOneAndUpdate({email: user}, {
            $set: {
                "projects": projects
            }
        })

        return projects
    }
}

module.exports = Register