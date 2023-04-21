const Projects = require('../models/projectModel')

exports.newProject = async (req, res) => {
        const project = new Projects(req.body)
    
        await project.newProject()
        if (project.errors.length > 0) return res.send(project.errors)
        
        return res.send(`${project.projectIndex}`)
    
}
exports.projectsData = async (req, res) => {
    try {
        const user = Object.keys(req.body)[0]
        const project = new Projects()
        const projects = await project.readProjects(user)

        return res.send(projects)     
    }catch(e) {
        console.log(e)
    }
}
exports.specProject = async (req, res) => {
    try {
        const project = new Projects()
        const id = (req.params.id).replace(':', '')
        const user = Object.keys(req.body)[0]
        
        const projects = await project.readProjects(user, id)
        return res.send(projects)   
    }catch(e) {
        console.log(e)
    }
}
exports.newTask = async (req, res) => {
    try {
        const id = (req.params.id).replace(':', '')
        const user = req.body.user
        
        const project = new Projects()

        await project.newTask(user, id, req.body)

        return res.send(project.errors)
    }catch(e) {
        console.log(e)
    }
}
exports.updateTask = async (req, res) => {
    try {
        const project = new Projects()

        project.updateTask(req.body)

    }catch(e) {
        console.log(e)
    }
}
exports.updateProject = async (req, res) => {
    try {
        const project = new Projects()

        project.updateProject(req.body)
    }catch(e) { 
        console.log(e)
    }
}
exports.excludeProject = async (req, res) => {
    try {
        const project = new Projects()

        project.excludeProject(req.body)

        return res.sendStatus(200)
    }catch(e) { 
        console.log(e)
    }
}