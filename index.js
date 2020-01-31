const express = require('express');

const server = express();

server.use(express.json());

const projects = [];
let totalRequests = 0;

server.use((req, res, next) => {
  console.log(`Total of requests: ${++totalRequests}`);

  return next();
});

function checkProjectExists(req, res, next) {
  const { id } = req.params;

  const project = projects.find(p => p.id === id);
  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  return next();

}

server.post('/projects', (req, res) => {
  const { id, title } = req.body;

  if(!id || !title) {
    return res.status(400).json({ message: "id and title are required!"});
  }

  projects.push({
    id,
    title,
    tasks: []
  });

  return res.json(projects);

});

server.get('/projects', (req, res) => {
  return res.json(projects);
});

server.put('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  if(!title) {
    return res.status(400).json({ message: "title is required!"});
  }

  const project = projects.find(p => p.id === id);

  project.title = title;

  return res.json(project);

});

server.delete('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;

  const index = projects.findIndex(p => p.id === id);

  projects.splice(index, 1);

  res.send();
});

server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  if(!title) {
    return res.status(400).json({ message: "title is required!"});
  }

  const project = projects.find(p => p.id === id);

  project.tasks.push(title);

  return res.json(project);
})

server.listen(3000);