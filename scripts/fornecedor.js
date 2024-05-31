fetch("http://localhost:3000/api/fornecedor");

const modal = document.querySelector(".modal-container");
const tbody = document.querySelector("tbody");
const sRazao_social = document.querySelector("#m-razao_social");
const sCnpj = document.querySelector("#m-cnpj");
const sTelefone = document.querySelector("#m-telefone");
const sEndereco = document.querySelector("#m-endereco");
const btnSalvar = document.querySelector("#btnSalvar");

let fornecedores = [];
let id = null;

function openModal(edit = false, index = 0) {
  modal.classList.add("active");

  modal.onclick = (e) => {
    if (e.target.className.indexOf("modal-container") !== -1) {
      modal.classList.remove("active");
    }
  };

  if (edit) {
    sRazao_social.value = fornecedores[index].razao_social;
    sCnpj.value = fornecedores[index].cnpj;
    sTelefone.value = fornecedores[index].telefone;
    sEndereco.value = fornecedores[index].endereco;
    id = index;
  } else {
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
  const fornecedor = fornecedores[index];
  const response = await fetch(
    `http://localhost:3000/api/fornecedor/${fornecedor.id}`,
    {
      method: "DELETE",
    }
  );
  if (response.ok) {
    fornecedores.splice(index, 1);
    loardFornecedor();
  } else {
    console.error("Erro ao deletar fornecedor");
  }
}

function insertItem(fornecedor, index) {
  let tr = document.createElement("tr");

  tr.innerHTML = `
    <td>${fornecedor.razao_social}</td>
    <td>${fornecedor.cnpj}</td>
    <td>${fornecedor.telefone}</td>
    <td>${fornecedor.endereco}</td>
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

  const fornecedorData = {
    razao_social: sRazao_social.value,
    cnpj: sCnpj.value,
    telefone: sTelefone.value,
    endereco: sEndereco.value,
  };

  let method = "POST";
  let url = "http://localhost:3000/api/fornecedor";
  if (id !== null) {
    method = "PUT";
    url = `http://localhost:3000/api/fornecedor/${fornecedores[id].id}`;
  }

  const response = await fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(fornecedorData),
  });

  if (response.ok) {
    modal.classList.remove("active");
    loardFornecedor();
  } else {
    console.error("Erro ao salvar fornecedor");
  }
};

async function loardFornecedor() {
  const response = await fetch("http://localhost:3000/api/fornecedor");
  fornecedores = await response.json();
  tbody.innerHTML = "";
  fornecedores.forEach((fornecedor, index) => {
    insertItem(fornecedor, index);
  });
}

loardFornecedor();
