const mongoose = require('mongoose')

const RegisterSchema = {
    taskName: { type: String, required: true },
    situacao: { type: String, required: false }
}

const RegisterModel = mongoose.model('react-app-task', RegisterSchema)

class Register {
    constructor(body) {
        this.body = body,
        this.errors = [],
        this.user = null
    }
    async newTask() {
        console.log(this.body)
        await RegisterModel.create(this.body)
    }

    async completeTask() {
        const mongooseDb = mongoose.connection.db.collection('react-app-tasks')
        
        let taskList = []
        await mongooseDb.find({}, {}).forEach(task => taskList.push(task))

        let task = taskList[Object.keys(this.body)]
        
        if (task.situacao) {
            await mongooseDb.findOneAndUpdate({_id: task._id}, {
                $set: {
                    "situacao": false
                }
            })
        } else {
            await mongooseDb.findOneAndUpdate({_id: task._id}, {
                $set: {
                    "situacao": true
                }
            })
        }
    }
    async readTask() {
        const mongooseDb = mongoose.connection.db.collection('react-app-tasks')
        const find = mongooseDb.find({}, {})
        
        let tasksList = []
        await find.forEach(task => {
            tasksList.push(task)
        })
        return tasksList
    }
}

module.exports = Register