const Task =  require('../models/taskModel')

exports.taskPost = (req, res) => {
    const task = new Task(req.body)

    task.newTask()
}

exports.taskGet = async (req, res) => {
    const task = new Task()

    const list = await task.readTask()
    res.json(list)
}
exports.taskCompleted = async (req, res) => {
    const task = new Task(req.body)

    task.completeTask()
}