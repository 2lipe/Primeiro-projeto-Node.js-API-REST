const express = require("express");

const server = express();
server.use(express.json());

/*
   Variável const como array [], pois mesmo como const uma var declarada
    como array pode receber, modificar ou excluir informações.
*/
const projects = [];

/*
   Middleware que checa se o projeto selecionado realmente existe.
 */
function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id == id);

  if (!project) {
    return res.status(400).json({ Error: "Project not found" });
  }

  return next();
}

/*
   Middleware que dá log no número de requisições feitas pelo usuário.
*/
function logRequests(req, res, next) {
  console.count("Número de requisições: ");

  return next();
}

server.use(logRequests);

/*
  Rota que retorna todos os projetos.
*/
server.get("/projects", (req, res) => {
  return res.json(projects);
});

/*
 Rota que retorna um projeto.
*/
server.get("/projects/:index", (req, res) => {
  const { index } = req.params;

  return res.json(projects[index]);
});

/*
  Rota que cadastra um novo projeto.
*/
server.post("/projects", (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: [] //Array que receberá as tarefas add pelo usuário
  };

  projects.push(project);

  return res.json(project);
});

/*
  Rota que altera o título do projeto com o id informado no parâmetro da rota.
*/
server.put("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id); //p = arrow function de parametro de busca de ID.

  project.title = title;

  return res.json(project);
});

/*
  Rota que deleta o projeto associado ao id informado no parâmetro da rota.
*/
server.delete("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(p => p.id == id);

  projects.splice(projectIndex, 1);

  return res.send();
});

/*
 Rota que adiciona uma nova tarefa no projeto escolhido através do ID selecionado.
*/
server.post("/projects/:id/tasks", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.tasks.push(title);

  return res.json(project);
});

server.listen(3000);
