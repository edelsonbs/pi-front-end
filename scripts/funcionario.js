fetch("http://localhost:3000/api/funcionario");

const modal = document.querySelector(".modal-container");
const tbody = document.querySelector("tbody");
const sNome = document.querySelector("#m-nome");
const sCpf = document.querySelector("#m-cpf");
const sRg = document.querySelector("#m-rg");
const sTelefone = document.querySelector("#m-telefone");
const sEndereco = document.querySelector("#m-endereco");
const btnSalvar = document.querySelector("#btnSalvar");

let funcionarios = [];
let id = null;

function openModal(edit = false, index = 0) {
  modal.classList.add("active");

  modal.onclick = (e) => {
    if (e.target.className.indexOf("modal-container") !== -1) {
      modal.classList.remove("active");
    }
  };

  if (edit) {
    sNome.value = funcionarios[index].nome;
    sCpf.value = funcionarios[index].cpf;
    sRg.value = funcionarios[index].rg;
    sTelefone.value = funcionarios[index].telefone;
    sEndereco.value = funcionarios[index].endereco;
    id = index;
  } else {
    sNome.value = "";
    sCpf.value = "";
    sRg.value = "";
    sTelefone.value = "";
    sEndereco.value = "";
    id = null;
  }
}

function editItem(index) {
  openModal(true, index);
}

async function deleteItem(index) {
  const funcionario = funcionarios[index];
  const response = await fetch(
    `http://localhost:3000/api/funcionario/${funcionario.id}`,
    {
      method: "DELETE",
    }
  );
  if (response.ok) {
    funcionarios.splice(index, 1);
    loadPacientes();
  } else {
    console.error("Erro ao deletar funcionario");
  }
}

function insertItem(funcionario, index) {
  let tr = document.createElement("tr");

  tr.innerHTML = `
    <td>${funcionario.nome}</td>
    <td>${funcionario.cpf}</td>
    <td>${funcionario.rg}</td>
    <td>${funcionario.telefone}</td>
    <td>${funcionario.endereco}</td>
    <td class="acao">
      <button onclick="editItem(${index})"><i class='bx bx-edit bx-tada' style='color:#fb0000'></i></button>
    </td>
    <td class="acao">
      <button onclick="deleteItem(${index})"><i class='bx bx-trash bx-tada' style='color:#080808' ></i></button>
    </td>
  `;
  tbody.appendChild(tr);
}

btnSalvar.onclick = async (e) => {
  e.preventDefault();

  const pacienteData = {
    nome: sNome.value,
    cpf: sCpf.value,
    rg: sRg.value,
    telefone: sTelefone.value,
    endereco: sEndereco.value,
  };

  let method = "POST";
  let url = "http://localhost:3000/api/funcionario";
  if (id !== null) {
    method = "PUT";
    url = `http://localhost:3000/api/funcionario/${funcionarios[id].id}`;
  }

  const response = await fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pacienteData),
  });

  if (response.ok) {
    modal.classList.remove("active");
    loadPacientes();
  } else {
    console.error("Erro ao salvar funcionario");
  }
};

async function loadPacientes() {
  const response = await fetch("http://localhost:3000/api/funcionario");
  funcionarios = await response.json();
  tbody.innerHTML = "";
  funcionarios.forEach((funcionario, index) => {
    insertItem(funcionario, index);
  });
}

loadPacientes();
