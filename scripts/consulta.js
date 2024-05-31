// Removendo a linha de requisição fetch desnecessária
// fetch("http://localhost:3000/api/consulta");

const modal = document.querySelector(".modal-container");
const tbody = document.querySelector("tbody");
const sPaciente = document.querySelector(".select-container #m-paciente");
const sMedico = document.querySelector(".select-container #m-medico");
const sData = document.querySelector("#m-data");
const sHora = document.querySelector("#m-hora");
const sProcedimento = document.querySelector("#m-procedimento");
const btnSalvar = document.querySelector("#btnSalvar");

let consultas = [];
let id = null;

function openModal(edit = false, index = 0) {
  modal.classList.add("active");

  modal.onclick = (e) => {
    if (e.target.className.indexOf("modal-container") !== -1) {
      modal.classList.remove("active");
    }
  };

  // Verificando se consultas foi carregado antes de acessá-lo
  if (edit && consultas.length > index) {
    sPaciente.value = consultas[index].Paciente.id;
    sMedico.value = consultas[index].PrestadorServico.id;
    sData.value = consultas[index].data;
    sHora.value = consultas[index].hora;
    sProcedimento.value = consultas[index].procedimento;
    id = index;
  } else {
    sPaciente.value = "";
    sMedico.value = "";
    sData.value = "";
    sHora.value = "";
    sProcedimento.value = "";
    id = null;
  }
}

function editItem(index) {
  openModal(true, index);
}

async function deleteItem(index) {
  const consulta = consultas[index];
  const response = await fetch(
    `http://localhost:3000/api/consulta/${consulta.id}`,
    {
      method: "DELETE",
    }
  );
  if (response.ok) {
    consultas.splice(index, 1);
    loadConsultas();
  } else {
    console.error("Erro ao deletar consulta");
  }
}

function insertItem(consulta, index) {
  let tr = document.createElement("tr");

  tr.innerHTML = `
    <td>${consulta.Paciente.nome}</td>
    <td>${consulta.PrestadorServico.nome}</td>
    <td>${consulta.data}</td>
    <td>${consulta.hora}</td>
    <td>${consulta.procedimento}</td>
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

  // Verificação dos valores dos campos
  console.log("Valor de sPaciente:", sPaciente.value);
  console.log("Valor de sMedico:", sMedico.value);
  console.log("Valor de sData:", sData.value);
  console.log("Valor de sHora:", sHora.value);
  console.log("Valor de sProcedimento:", sProcedimento.value);

  
  const consultaData = {
    nomePaciente: sPaciente.value, // Altere para o nome do paciente selecionado
    nomeMedico: sMedico.value, // Altere para o nome do médico selecionado
    data: sData.value,
    hora: sHora.value,
    procedimento: sProcedimento.value,
  };

  let method = "POST";
  let url = "http://localhost:3000/api/consulta";
  if (id !== null) {
    method = "PUT";
    url = `http://localhost:3000/api/consulta/${consultas[id].id}`;
  }

  const response = await fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(consultaData),
  });

  if (response.ok) {
    modal.classList.remove("active");
    loadConsultas();
  } else {
    console.error("Erro ao salvar consulta");
  }
};

async function loadConsultas() {
  try {
    const [responseConsultas, responsePacientes, responsePrestadores] =
      await Promise.all([
        fetch("http://localhost:3000/api/consulta"),
        fetch("http://localhost:3000/api/paciente"),
        fetch("http://localhost:3000/api/prestadorServico"),
      ]);

    if (
      !responseConsultas.ok ||
      !responsePacientes.ok ||
      !responsePrestadores.ok
    ) {
      throw new Error("Erro ao carregar os dados");
    }

    consultas = await responseConsultas.json();
    const pacientes = await responsePacientes.json();
    const prestadores = await responsePrestadores.json();

    // Preenchendo os campos do formulário com os dados dos pacientes e prestadores de serviço
    const pacientesSelect = document.querySelector("#m-paciente");
    pacientesSelect.innerHTML = ""; // Limpa opções anteriores
    pacientes.forEach((paciente) => {
      const option = document.createElement("option");
      option.value = paciente.id;
      option.textContent = paciente.nome;
      pacientesSelect.appendChild(option);
    });

    const prestadoresSelect = document.querySelector("#m-medico");
    prestadoresSelect.innerHTML = ""; // Limpa opções anteriores
    prestadores.forEach((prestador) => {
      const option = document.createElement("option");
      option.value = prestador.id;
      option.textContent = prestador.nome;
      prestadoresSelect.appendChild(option);
    });

    tbody.innerHTML = "";
    consultas.forEach((consulta, index) => {
      insertItem(consulta, index);
    });
  } catch (error) {
    console.error("Erro ao carregar os dados:", error.message);
  }
}

loadConsultas();
