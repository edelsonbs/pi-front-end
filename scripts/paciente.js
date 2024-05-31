fetch("http://localhost:3000/api/paciente");

const modal = document.querySelector(".modal-container");
const tbody = document.querySelector("tbody");
const sNome = document.querySelector("#m-paciente");
const sCpf = document.querySelector("#m-cpf");
const sRg = document.querySelector("#m-rg");
const sTelefone = document.querySelector("#m-telefone");
const sEndereco = document.querySelector("#m-endereco");
const sFicha_Anamnese = document.querySelector("#m-ficha_anamnese");
const btnSalvar = document.querySelector("#btnSalvar");

let pacientes = [];
let id = null;

function openModal(edit = false, index = 0) {
  modal.classList.add("active");

  modal.onclick = (e) => {
    if (e.target.className.indexOf("modal-container") !== -1) {
      modal.classList.remove("active");
    }
  };

  if (edit) {
    sNome.value = pacientes[index].nome;
    sCpf.value = pacientes[index].cpf;
    sRg.value = pacientes[index].rg;
    sTelefone.value = pacientes[index].telefone;
    sEndereco.value = pacientes[index].endereco;
    sFicha_Anamnese.value = pacientes[index].ficha_anamnese;
    id = index;
  } else {
    sNome.value = "";
    sCpf.value = "";
    sRg.value = "";
    sTelefone.value = "";
    sEndereco.value = "";
    sFicha_Anamnese.value = "";
    id = null;
  }
}

function editItem(index) {
  openModal(true, index);
}

async function deleteItem(index) {
  const paciente = pacientes[index];
  const response = await fetch(
    `http://localhost:3000/api/paciente/${paciente.id}`,
    {
      method: "DELETE",
    }
  );
  if (response.ok) {
    pacientes.splice(index, 1);
    loadPacientes();
  } else {
    console.error("Erro ao deletar paciente");
  }
}

function insertItem(paciente, index) {
  let tr = document.createElement("tr");

  tr.innerHTML = `
    <td>${paciente.nome}</td>
    <td>${paciente.cpf}</td>
    <td>${paciente.rg}</td>
    <td>${paciente.telefone}</td>
    <td>${paciente.endereco}</td>
    <td>${paciente.ficha_anamnese}</td>
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
    ficha_anamnese: sFicha_Anamnese.value, 
  };

  let method = "POST";
  let url = "http://localhost:3000/api/paciente";
  if (id !== null) {
    method = "PUT";
    url = `http://localhost:3000/api/paciente/${pacientes[id].id}`;
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
    console.error("Erro ao salvar paciente");
  }
};

async function loadPacientes() {
  const response = await fetch("http://localhost:3000/api/paciente");
  pacientes = await response.json();
  tbody.innerHTML = "";
  pacientes.forEach((paciente, index) => {
    insertItem(paciente, index);
  });
}

loadPacientes();
