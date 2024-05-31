fetch("http://localhost:3000/api/prestadorServico");

const modal = document.querySelector(".modal-container");
const tbody = document.querySelector("tbody");
const sNome = document.querySelector("#m-medico");
const sCpf = document.querySelector("#m-cpf");
const sRg = document.querySelector("#m-rg");
const sCro = document.querySelector("#m-cro");
const sRazao_social = document.querySelector("#m-razao_social");
const sCnpj = document.querySelector("#m-cnpj");
const sTelefone = document.querySelector("#m-telefone");
const sEndereco = document.querySelector("#m-endereco");
const btnSalvar = document.querySelector("#btnSalvar");

let prestadorServicos = [];
let id = null;

function openModal(edit = false, index = 0) {
  modal.classList.add("active");

  modal.onclick = (e) => {
    if (e.target.className.indexOf("modal-container") !== -1) {
      modal.classList.remove("active");
    }
  };

  if (edit) {
    sNome.value = prestadorServicos[index].nome;
    sCpf.value = prestadorServicos[index].cpf;
    sRg.value = prestadorServicos[index].rg;
    sCro.value = prestadorServicos[index].cro;
    sRazao_social.value = prestadorServicos[index].razao_social;
    sCnpj.value = prestadorServicos[index].cnpj;
    sTelefone.value = prestadorServicos[index].telefone;
    sEndereco.value = prestadorServicos[index].endereco;
    id = index;
  } else {
    sNome.value = "";
    sCpf.value = "";
    sRg.value = "";
    sCro.value = "";
    sRazao_social.value = "";
    sCnpj.value = "";
    sTelefone.value = "";
    sEndereco.value = "";
    id = null;
  }
}

function editItem(index) {
  openModal(true, index);
}

async function deleteItem(index) {
  const prestadorServico = prestadorServicos[index];
  const response = await fetch(
    `http://localhost:3000/api/prestadorServico/${prestadorServico.id}`,
    {
      method: "DELETE",
    }
  );
  if (response.ok) {
    prestadorServicos.splice(index, 1);
    loardPrestadorServico();
  } else {
    console.error("Erro ao deletar prestadorServico");
  }
}

function insertItem(prestadorServico, index) {
  let tr = document.createElement("tr");

  tr.innerHTML = `
    <td>${prestadorServico.nome}</td>
    <td>${prestadorServico.cpf}</td>
    <td>${prestadorServico.rg}</td>
    <td>${prestadorServico.cro}</td>
    <td>${prestadorServico.razao_social}</td>
    <td>${prestadorServico.cnpj}</td>
    <td>${prestadorServico.telefone}</td>
    <td>${prestadorServico.endereco}</td>
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

  const prestadorServicoData = {
    nome: sNome.value,
    cpf: sCpf.value,
    rg: sRg.value,
    cro: sCro.value,
    razao_social: sRazao_social.value,
    cnpj: sCnpj.value,
    telefone: sTelefone.value,
    endereco: sEndereco.value,
  };

  let method = "POST";
  let url = "http://localhost:3000/api/prestadorServico";
  if (id !== null) {
    method = "PUT";
    url = `http://localhost:3000/api/prestadorServico/${prestadorServicos[id].id}`;
  }

  const response = await fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(prestadorServicoData),
  });

  if (response.ok) {
    modal.classList.remove("active");
    loardPrestadorServico();
  } else {
    console.error("Erro ao salvar prestadorServico");
  }
};

async function loardPrestadorServico() {
  const response = await fetch("http://localhost:3000/api/prestadorServico");
  prestadorServicos = await response.json();
  tbody.innerHTML = "";
  prestadorServicos.forEach((prestadorServico, index) => {
    insertItem(prestadorServico, index);
  });
}

loardPrestadorServico();
