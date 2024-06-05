const url = "https://odonto-clinic.azurewebsites.net"

// Variável que referencia o elemento de mensagem
const alerta = document.querySelector(".alerta");

// Variáveis que referencia as seções
const secaoHomeConsultas = document.querySelector("#sec_home_consultas");
const secaoHomePrestadores = document.querySelector("#sec_home_prestadores");
const secaoPacientes = document.querySelector("#sec_pacientes");
const secaoConsultas = document.querySelector("#sec_consultas");
const secaoCadastroConsulta = document.querySelector("#sec_ca_consulta");
const secaoDetalheConsulta = document.querySelector("#sec_det_consulta");
const secaoPrestadores = document.querySelector("#sec_prestadores");
const secaoFornecedores = document.querySelector("#sec_fornecedores");

// Variáveis que referencia os botões 'Cadastrar', 'Salvar' e 'Fechar' da seções
const btnCadastrarPac = document.querySelector("#bt_cadastrar_p");
const btnSalvarPac = document.querySelector("#bt_salvar_p");
const btnFecharPac = document.querySelector("#bt_fechar_p");

const btnCadastrarCons = document.querySelector("#bt_cadastar_c");
const btnSalvarCons = document.querySelector("#bt_salvar_c");
const btnFecharCons = document.querySelector("#bt_fechar_dc");

const btnCadastrarPre = document.querySelector("#bt_cadastrar_ps");
const btnSalvarPre = document.querySelector("#bt_salvar_ps");
const btnFecharPre = document.querySelector("#bt_fechar_ps");

const btnCadastrarFor = document.querySelector("#bt_cadastrar_fr");
const btnSalvarFor = document.querySelector("#bt_salvar_fr");
const btnFecharFor = document.querySelector("#bt_fechar_fr");

// Formulário de cadastro de paciente
const inpNomePac = document.querySelector("#p_nome");
const inpTelefonePac = document.querySelector("#p_telefone");
const inpCpfPac = document.querySelector("#p_cpf");
const inpEnderecoPac = document.querySelector("#p_endereco");
const inpRgPac = document.querySelector("#p_rg");
const inpFichaPac = document.querySelector("#p_anamnese");
const inpFormPac = document.querySelectorAll("#sec_cae_paciente input");

// Formulário de cadastro de consulta
const inpCpfPacCons = document.querySelector("#cpf_pac");
const inpProcedimento = document.querySelector("#c_procedimento");
const inpCroPresCons = document.querySelector("#con_pr_cro");
const inpDataCons = document.querySelector("#c_data");
const inpHoraCons = document.querySelector("#c_hora");

// Formulário de cadastro de prestador de serviço
const inpNomePre = document.querySelector("#pr_nome");
const inpCpfPre = document.querySelector("#pr_cpf");
const inpRgPre = document.querySelector("#pr_rg");
const inpCroPre = document.querySelector("#pr_cro");
const inpTelefonePre = document.querySelector("#pr_telefone");
const inpRazaoSocPre = document.querySelector("#pr_razao");
const inpCnpjPre = document.querySelector("#pr_cnpj");
const inpEnderecoPre = document.querySelector("#pr_endereco");
const inpFormPre = document.querySelectorAll("#sec_cae_prestador input");

// Formulário de cadastro de fornecedor
const inpRazaoFor = document.querySelector("#fr_razao");
const inpCnpjFor = document.querySelector("#fr_cnpj");
const inpTelefoneFor = document.querySelector("#fr_telefone");
const inpEnderecoFor = document.querySelector("#fr_endereco");
const inpFormFor = document.querySelectorAll("#sec_cae_fornecedor input");

// Variáveis auxiliares
let idPrestador;
let idPaciente;
let idConsulta;
let idFornecedor;

// Verifica se a seção em questão foi carregada (load)
secaoHomeConsultas.addEventListener("load", exibirConsultas("home"));
secaoHomePrestadores.addEventListener("load", exibirPrestadores("home"));
secaoPacientes.addEventListener("load", exibirPacientes());
secaoConsultas.addEventListener("load", exibirConsultas("consultas"));
secaoPrestadores.addEventListener("load", exibirPrestadores("prestadores"));
secaoFornecedores.addEventListener("load", exibirFornecedores());

// Função que executa após 'mudanças' na página
window.addEventListener("change", () => {
    secaoHomeConsultas.addEventListener("load", exibirConsultas("home"));
    secaoHomePrestadores.addEventListener("load", exibirPrestadores("home"));
})


/*   # # #   CONSULTAS   # # #   */

// Função que busca todas as consultas cadastradas no banco de dados
async function buscarConsultas() {
    const response = await fetch(`${url}/consulta`);
    let todasConsultas = await response.json();

    todasConsultas.forEach(consulta => {
        if (consulta.PacienteId == null || consulta.PrestadorServicoId == null) {
            fetch(`${url}/consulta/${consulta.id}`,
                {
                    method: 'DELETE',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        "id": consulta.id
                    })
                })
        }
    });

    return todasConsultas;
}

// Função que exibe todas as consultas cadastradas no banco de dados
async function exibirConsultas(section) {
    const consultas = await buscarConsultas();

    if (section == "home") {
        const tabelaHomeConsultasBody = document.querySelector("#tb_home_consultas tbody");
        tabelaHomeConsultasBody.innerHTML = "";

        consultas.forEach(consulta => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${consulta.Paciente["nome"]}</td>
                <td>${consulta.Paciente["telefone"]}</td>
                <td>${consulta.data}</td>
                <td>${consulta.hora}</td>
                <td>${consulta.procedimento}</td>
                <td>${consulta.PrestadorServico["nome"]}</td>
            `;
            tabelaHomeConsultasBody.appendChild(tr);
        });
    } else {
        const tabelaConsultasBody = document.querySelector("#tb_consultas tbody");
        tabelaConsultasBody.innerHTML = "";

        consultas.forEach(consulta => {
            const tr = document.createElement("tr");
            const id = consulta.id;

            tr.innerHTML = `
                <td>${consulta.Paciente["nome"]}</td>                
                <td>${consulta.data}</td>
                <td>${consulta.hora}</td>
                <td>${consulta.procedimento}</td>
                <td>${consulta.PrestadorServico["nome"]}</td>
                <td>
                    <button class="btn-acoes bg-green" onclick="exibirConsulta(${id})" title="Exibir">
                        <span class="material-symbols-outlined">
                            plagiarism
                        </span>
                    </button>
                    <button class="btn-acoes bg-primary" onclick="editarConsulta(${id})" title="Editar">
                        <span class="material-symbols-outlined">
                            edit_document
                        </span>
                    </button>
                    <button class="btn-acoes bg-danger" onclick="deletarConsulta(${id})" title="Excluir">
                        <span class="material-symbols-outlined">
                            scan_delete
                        </span>
                    </button>
                </td>
            `;
            tabelaConsultasBody.appendChild(tr);
        });
    }
}

// Função que exibe os dados da consulta de acordo com o id
async function exibirConsulta(id) {
    exibirBotaoFechar("consulta");

    const response = await fetch(`${url}/consulta/${id}`);
    const consulta = await response.json();

    secaoCadastroConsulta.style.display = "none";
    secaoDetalheConsulta.style.display = "block";

    document.querySelector("#dc_nome_pac").value = consulta.Paciente["nome"];
    document.querySelector("#dc_telefone_pac").value = consulta.Paciente["telefone"];
    document.querySelector("#dc_data").value = consulta.data;
    document.querySelector("#dc_hora").value = consulta.hora;
    document.querySelector("#dc_procedimento").value = consulta.procedimento;
    document.querySelector("#dc_pr_nome").value = consulta.PrestadorServico["nome"];
    document.querySelector("#dc_pr_cro").value = consulta.PrestadorServico["cro"];
}

// Fução que verifica o preenchimento do cadastro de consulta
btnCadastrarCons.addEventListener("click", async () => {
    if (
        inpCpfPacCons.value !== "" &&
        inpProcedimento.value !== "" &&
        inpDataCons.value !== "" &&
        inpHoraCons.value !== "" &&
        inpCroPresCons.value !== ""
    ) {
        resetarAlerta();

        await cadastrarConsulta();
    } else {
        configurarMensagem("erro");
        mostrarAlerta("Preencha todos os campos do formulário");
    }
});

// Máscara para o campo cpf paciente -> 000.000.000-00
inpCpfPacCons.addEventListener("input", () => {
    inpCpfPacCons.value = inpCpfPacCons.value.replace(/\D/g, "")                    //Remove tudo o que não é dígito
    inpCpfPacCons.value = inpCpfPacCons.value.replace(/(\d{3})(\d)/, "$1.$2")       //Coloca um ponto entre o terceiro e o quarto dígitos
    inpCpfPacCons.value = inpCpfPacCons.value.replace(/(\d{3})(\d)/, "$1.$2")       //Coloca um ponto entre o terceiro e o quarto dígitos
    //de novo (para o segundo bloco de números)
    inpCpfPacCons.value = inpCpfPacCons.value.replace(/(\d{3})(\d{1,2})$/, "$1-$2") //Coloca um hífen entre o terceiro e o quarto dígitos
});

// Máscara para o campo data (padrão americano) -> 0000-00-00
inpDataCons.addEventListener("input", () => {
    inpDataCons.value = inpDataCons.value.replace(/\D/g, "");
    inpDataCons.value = inpDataCons.value.replace(/^(\d{4})(\d)/,"$1-$2");
    inpDataCons.value = inpDataCons.value.replace(/^(\d{4})\-(\d{2})(\d)/,"$1-$2-$3");
});

// Máscara para o campo hora -> 00:00
inpHoraCons.addEventListener("input", () => {
    inpHoraCons.value = inpHoraCons.value.replace(/\D/g, "");
    inpHoraCons.value = inpHoraCons.value.replace(/^(\d{2})(\d)/,"$1:$2");
});

// Função para cadastrar uma consulta
async function cadastrarConsulta() {

    try {
        const response = await fetch(`${url}/consulta`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "cpfID": inpCpfPacCons.value,
                "procedimento": inpProcedimento.value,
                "croID": inpCroPresCons.value,
                "data": inpDataCons.value,
                "hora": inpHoraCons.value
            })
        });

        resetarFormulario("consulta");
        secaoConsultas.addEventListener("load", exibirConsultas("consultas"));

        if (response.ok) {
            configurarMensagem("sucesso");
            mostrarAlerta("Cadastro realizado com sucesso");
        } else {
            configurarMensagem("erro");
            mostrarAlerta("Ocorreu um erro ao cadastrar");
        }
    } catch (error) {
        console.error('Erro ao cadastrar consulta:', error);
        mostrarAlerta("Ocorreu um erro ao cadastrar");
    }
}

// Função para editar uma consulta de acordo com o id
async function editarConsulta(id) {
    idConsulta = id;

    const response = await fetch(`${url}/consulta/${id}`);
    const consulta = await response.json();

    secaoDetalheConsulta.style.display = "none";
    secaoCadastroConsulta.style.display = "block";
    btnCadastrarCons.style.display = "none";
    btnFecharCons.style.display = "none";
    btnSalvarCons.style.display = "block";

    document.querySelector("#sec_ca_consulta h3").textContent = "Editar Consulta";
    document.querySelector("#lbl_cpf_pac").textContent = "Nome Paciente";
    inpCpfPacCons.disabled = true;
    inpCpfPacCons.value = consulta.Paciente["nome"];
    inpProcedimento.value = consulta.procedimento;
    inpDataCons.value = consulta.data;
    inpHoraCons.value = consulta.hora;
    inpCroPresCons.disabled = true;
    inpCroPresCons.value = consulta.PrestadorServico["cro"];
}

// Função que salva os dados editados de uma consulta
btnSalvarCons.addEventListener("click", async () => {
    const response = await fetch(`${url}/consulta/${idConsulta}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "procedimento": inpProcedimento.value,
            "croID": inpCroPresCons.value,
            "data": inpDataCons.value,
            "hora": inpHoraCons.value
        })
    });

    if (response.status == 201) {
        configurarMensagem("sucesso");
        mostrarAlerta("Consulta alterada com sucesso");
    } else {
        configurarMensagem("erro");
        mostrarAlerta("Ocorreu um erro ao alterar consulta");
    }

    resetarFormulario("consulta");
    secaoConsultas.addEventListener("load", exibirConsultas("consultas"));
});

// Função que deleta uma consulta de acordo com o id
async function deletarConsulta(id) {
    const response = await fetch(`${url}/consulta/${id}`,
        {
            method: "DELETE",
        }
    );
    if (response.ok) {
        configurarMensagem("sucesso");
        mostrarAlerta("Consulta excluída com sucesso");
    } else {
        configurarMensagem("erro");
        mostrarAlerta("Ocorreu um erro ao excluir consulta");
    }

    secaoConsultas.addEventListener("load", exibirConsultas("consultas"));
}

// Fução que captura clique do botão 'Fechar' da consulta
btnFecharCons.addEventListener("click", () => {
    btnCadastrarCons.style.display = "block";
    btnFecharCons.style.display = "none";
    secaoDetalheConsulta.style.display = "none";
    secaoCadastroConsulta.style.display = "block";

    resetarFormulario("consulta");
});

inpCpfPacCons.addEventListener("change", consultarCpfPaciente);
inpCroPresCons.addEventListener("change", consultarCroPrestador);


/*   # # #   PACIENTES   # # #   */

// Função que busca todos os pacientes cadastrados no banco de dados
async function buscarPacientes() {
    const response = await fetch(`${url}/paciente`);
    let todosPacientes = await response.json();

    return todosPacientes;
}

// Função que verifica se o cpf do cliente digitado no cadastro de consulta existe no banco de dados
async function consultarCpfPaciente() {
    let cpfPac = inpCpfPacCons.value;
    const dados = await buscarPacientes();    
    let existeCpf = dados.find(paciente => paciente.cpf === cpfPac);

    if (existeCpf) {
        removerAlerta();
        resetarAlerta();
    } else {
        configurarMensagem("erro");
        mostrarAlerta("CPF não cadastrado");
    }
}

// Função que exibe todos os pacientes cadastrados no banco de dados
async function exibirPacientes() {
    const pacientes = await buscarPacientes();

    const tabelaPacientesBody = document.querySelector("#tb_pacientes tbody");
    tabelaPacientesBody.innerHTML = "";

    pacientes.forEach(paciente => {
        const tr = document.createElement("tr");
        const id = paciente.id

        tr.innerHTML = `            
                <td>${paciente.cpf}</td>            
                <td>${paciente.nome}</td>
                <td>${paciente.telefone}</td>
                <td>
                    <button class="btn-acoes bg-green" onclick="exibirPaciente(${id})" title="Exibir">
                        <span class="material-symbols-outlined">
                            person_search
                        </span>
                    </button>
                    <button class="btn-acoes bg-primary" onclick="editarPaciente(${id})" title="Editar">
                        <span class="material-symbols-outlined">
                            person_edit
                        </span>
                    </button>
                    <button class="btn-acoes bg-danger" onclick="deletarPaciente(${id})" title="Excluir">
                        <span class="material-symbols-outlined">
                            person_remove
                        </span>
                    </button>
                </td>
            `;
        tabelaPacientesBody.appendChild(tr);
    });
}

// Função que exibe os dados do paciente de acordo com o id
async function exibirPaciente(id) {
    exibirBotaoFechar("paciente");

    document.querySelector("#sec_cae_paciente h3").textContent = "Dados do Paciente";
    btnSalvarPac.style.display = "none";

    desabilitarInputs("paciente");

    const response = await fetch(`${url}/paciente/${id}`);
    const paciente = await response.json();

    inpNomePac.value = paciente.nome;
    inpCpfPac.value = paciente.cpf;
    inpRgPac.value = paciente.rg;
    inpEnderecoPac.value = paciente.endereco;
    inpTelefonePac.value = paciente.telefone;
    inpFichaPac.value = paciente.ficha_anamnese;
}

// Função que verifica preenchimento do formulário de cadastro de paciente
btnCadastrarPac.addEventListener("click", async () => {
    if (
        inpNomePac.value !== "" &&
        inpCpfPac.value !== "" &&
        inpRgPac.value !== "" &&
        inpEnderecoPac.value !== "" &&
        inpTelefonePac.value !== "" &&
        inpFichaPac.value !== ""

    ) {
        resetarAlerta();

        await cadastrarPaciente();
    } else {
        configurarMensagem("erro");
        mostrarAlerta("Preencha todos os campos do formulário");
    }
});

// Máscara para o campo cpf paciente -> 000.000.000-00
inpCpfPac.addEventListener("input", () => {
    inpCpfPac.value = inpCpfPac.value.replace(/\D/g, "");
    inpCpfPac.value = inpCpfPac.value.replace(/(\d{3})(\d)/, "$1.$2");
    inpCpfPac.value = inpCpfPac.value.replace(/(\d{3})(\d)/, "$1.$2");
    inpCpfPac.value = inpCpfPac.value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
});

// Máscara para o campo telefone paciente -> (00) 00000-0000 
inpTelefonePac.addEventListener("input", () => {
    inpTelefonePac.value = inpTelefonePac.value.replace(/\D/g, "");

    inpTelefonePac.value = inpTelefonePac.value.replace(
        /^(\d{2})(\d{5})(\d{4})(\d+)/,
        "($1) $2-$3"
    );
    inpTelefonePac.value = inpTelefonePac.value.replace(
        /^(\d{2})(\d{5})(\d)/,
        "($1) $2-$3"
    );
    inpTelefonePac.value = inpTelefonePac.value.replace(/^(\d{2})(\d)/, "($1) $2");
    inpTelefonePac.value = inpTelefonePac.value.replace(/^(\d)/, "($1");
});

// Função para cadastrar um paciente
async function cadastrarPaciente() {

    try {
        const response = await fetch(`${url}/paciente`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "nome": inpNomePac.value,
                "cpf": inpCpfPac.value,
                "rg": inpRgPac.value,
                "telefone": inpTelefonePac.value,
                "endereco": inpEnderecoPac.value,
                "ficha_anamnese": inpFichaPac.value
            })
        });

        resetarFormulario("paciente");
        secaoPacientes.addEventListener("load", exibirPacientes());

        if (response.ok) {
            configurarMensagem("sucesso");
            mostrarAlerta("Cadastro realizado com sucesso");
        } else {
            configurarMensagem("erro");
            mostrarAlerta("Ocorreu um erro ao cadastrar");
        }
    } catch (error) {
        console.error('Erro ao cadastrar paciente:', error);
        mostrarAlerta("Ocorreu um erro ao cadastrar");
    }
}

// Função para editar um paciente de acordo com id
async function editarPaciente(id) {
    idPaciente = id;

    const response = await exibirPaciente(id);

    habilitarInputs("paciente");

    document.querySelector("#sec_cae_paciente h3").textContent = "Editar Paciente";
    btnCadastrarPac.style.display = "none";
    btnFecharPac.style.display = "none";
    btnSalvarPac.style.display = "block";
}

// Função que salva os dados editados de um paciente
btnSalvarPac.addEventListener("click", async function () {
    const response = await fetch(`${url}/paciente/${idPaciente}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "nome": inpNomePac.value,
            "cpf": inpCpfPac.value,
            "rg": inpRgPac.value,
            "telefone": inpTelefonePac.value,
            "endereco": inpEnderecoPac.value,
            "ficha_anamnese": inpFichaPac.value
        })
    });

    if (response.status == 201) {
        configurarMensagem("sucesso");
        mostrarAlerta("Cadastro alterado com sucesso");
    } else {
        configurarMensagem("erro");
        mostrarAlerta("Ocorreu um erro ao alterar cadastro");
    }

    resetarFormulario("paciente");
    secaoPacientes.addEventListener("load", exibirPacientes());
});

// Função para deletar um paciente de acordo com o id
async function deletarPaciente(id) {
    const response = await fetch(`${url}/paciente/${id}`,
        {
            method: "DELETE",
        }
    );
    if (response.ok) {
        configurarMensagem("sucesso");
        mostrarAlerta("Cadastro excluído com sucesso");
    } else {
        configurarMensagem("erro");
        mostrarAlerta("Ocorreu um erro ao excluir registro");
    }

    await buscarConsultas();
    secaoConsultas.addEventListener("load", exibirConsultas("consultas"));
    secaoPacientes.addEventListener("load", exibirPacientes());
}

// Função que captura evento de clique do botão 'Fechar' do formulário de paciente
btnFecharPac.addEventListener("click", () => {
    btnFecharPac.style.display = "none";
    habilitarInputs("paciente");
    resetarFormulario("paciente");
});



/*   # # #   PRESTADORES   # # #   */

// Função que busca todos os prestadores cadastrados no banco de dados
async function buscarPrestadores() {
    const response = await fetch(`${url}/prestadorServico`);
    const todosPrestadores = await response.json();

    return todosPrestadores;
}

// Função que verifica se o cro do prestador digitado no cadastro de consulta existe no banco de dados
async function consultarCroPrestador() {
    let croPre = inpCroPresCons.value;    
    const dados = await buscarPrestadores();
    const existeCro = dados.find(prestador => prestador.cro === croPre);
   
    if (existeCro) {
        removerAlerta();
        resetarAlerta();
    } else {
        configurarMensagem("erro");
        mostrarAlerta("CRO não cadastrado");
    }
}

// Função que exibe todos os prestadores cadastrados no banco de dados
async function exibirPrestadores(section) {
    const prestadores = await buscarPrestadores();

    if (section == "home") {
        const tabelaHomePrestadoresBody = document.querySelector("#tb_home_prestadores tbody");
        tabelaHomePrestadoresBody.innerHTML = "";

        prestadores.forEach(prestador => {
            const tr = document.createElement("tr");
            tr.innerHTML = `            
                <td>${prestador.nome}</td>
                <td>${prestador.cro}</td>            
            `;
            tabelaHomePrestadoresBody.appendChild(tr);
        });
    } else {
        const tabelaPrestadoresBody = document.querySelector("#tb_prestadores tbody");
        tabelaPrestadoresBody.innerHTML = "";

        prestadores.forEach(prestador => {
            const tr = document.createElement("tr");
            const id = prestador.id;

            tr.innerHTML = `            
                <td>${prestador.cpf}</td>
                <td>${prestador.nome}</td>                
                <td>${prestador.cro}</td>            
                <td>${prestador.telefone}</td>
                <td>
                    <button class="btn-acoes bg-green" onclick="exibirPrestador(${id})" title="Exibir">
                        <span class="material-symbols-outlined">
                            person_search
                        </span>
                    </button>
                    <button class="btn-acoes bg-primary" onclick="editarPrestador(${id})" title="Editar">
                        <span class="material-symbols-outlined">
                            person_edit
                        </span>
                    </button>
                    <button class="btn-acoes bg-danger" onclick="deletarPrestador(${id})" title="Excluir">
                        <span class="material-symbols-outlined">
                            person_remove
                        </span>
                    </button>
                </td>
            `;
            tabelaPrestadoresBody.appendChild(tr);
        });
    }
}

// Função que exibe os dados do prestador de acordo com o id
async function exibirPrestador(id) {
    exibirBotaoFechar("prestador");
    document.querySelector("#sec_cae_prestador h3").textContent = "Dados do Prestador";
    btnSalvarPre.style.display = "none";

    desabilitarInputs("prestador");

    const response = await fetch(`${url}/prestadorServico/${id}`);
    const prestador = await response.json();

    inpNomePre.value = prestador.nome;
    inpCpfPre.value = prestador.cpf;
    inpRgPre.value = prestador.rg;
    inpCroPre.value = prestador.cro;
    inpTelefonePre.value = prestador.telefone;
    inpRazaoSocPre.value = prestador.razao_social;
    inpCnpjPre.value = prestador.cnpj;
    inpEnderecoPre.value = prestador.endereco;
}

// Fução que verifica preenchimento do cadastro de prestador
btnCadastrarPre.addEventListener("click", async () => {
    if (
        inpNomePre.value !== "" &&
        inpCpfPre.value !== "" &&
        inpRgPre.value !== "" &&
        inpCroPre.value !== "" &&
        inpTelefonePre.value !== "" &&
        inpRazaoSocPre.value !== "" &&
        inpCnpjPre.value !== "" &&
        inpEnderecoPre.value !== ""
    ) {
        resetarAlerta();

        await cadastarPrestador();
    } else {
        configurarMensagem("erro");
        mostrarAlerta("Preencha todos os campos do formulário");
    }
});

// Máscara para o campo cpf prestador -> 000.000.000-00
inpCpfPre.addEventListener("input", () => {
    inpCpfPre.value = inpCpfPre.value.replace(/\D/g, "");
    inpCpfPre.value = inpCpfPre.value.replace(/(\d{3})(\d)/, "$1.$2");
    inpCpfPre.value = inpCpfPre.value.replace(/(\d{3})(\d)/, "$1.$2");
    inpCpfPre.value = inpCpfPre.value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
});

// Máscara para o campo telefone prestador -> (00) 00000-0000 
inpTelefonePre.addEventListener("input", () => {
    inpTelefonePre.value = inpTelefonePre.value.replace(/\D/g, "");

    inpTelefonePre.value = inpTelefonePre.value.replace(
        /^(\d{2})(\d{5})(\d{4})(\d+)/,
        "($1) $2-$3"
    );
    inpTelefonePre.value = inpTelefonePre.value.replace(
        /^(\d{2})(\d{5})(\d)/,
        "($1) $2-$3"
    );
    inpTelefonePre.value = inpTelefonePre.value.replace(/^(\d{2})(\d)/, "($1) $2");
    inpTelefonePre.value = inpTelefonePre.value.replace(/^(\d)/, "($1");
});

// Máscara para o campo cnpj prestador -> 00.000.000/0000-00 
inpCnpjPre.addEventListener("input", () => {
    inpCnpjPre.value = inpCnpjPre.value.replace(/\D/g, "")                           //Remove tudo o que não é dígito
    inpCnpjPre.value = inpCnpjPre.value.replace(/^(\d{2})(\d)/, "$1.$2")             //Coloca ponto entre o segundo e o terceiro dígitos
    inpCnpjPre.value = inpCnpjPre.value.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3") //Coloca ponto entre o quinto e o sexto dígitos
    inpCnpjPre.value = inpCnpjPre.value.replace(/\.(\d{3})(\d)/, ".$1/$2")           //Coloca uma barra entre o oitavo e o nono dígitos
    inpCnpjPre.value = inpCnpjPre.value.replace(/(\d{4})(\d)/, "$1-$2")              //Coloca um hífen depois do bloco de quatro dígitos
});

// Função para cadastrar um prestador
async function cadastarPrestador() {
    try {
        const response = await fetch(`${url}/prestadorServico`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "nome": inpNomePre.value,
                "cpf": inpCpfPre.value,
                "rg": inpRgPre.value,
                "cro": inpCroPre.value,
                "razao_social": inpRazaoSocPre.value,
                "cnpj": inpCnpjPre.value,
                "telefone": inpTelefonePre.value,
                "endereco": inpEnderecoPre.value
            })
        });

        resetarFormulario("prestador");
        secaoPrestadores.addEventListener("load", exibirPrestadores("prestadores"));

        if (response.ok) {
            configurarMensagem("sucesso");
            mostrarAlerta("Cadastro realizado com sucesso");
        } else {
            configurarMensagem("erro");
            mostrarAlerta("Ocorreu um erro ao cadastrar");
        }
    } catch (error) {
        console.error('Erro ao cadastrar paciente:', error);
        alert("Ocorreu um erro ao cadastar");
    }
}

// Função para editar um prestador de acordo com o id
async function editarPrestador(id) {
    idPrestador = id;

    const response = await exibirPrestador(id);

    habilitarInputs("prestador");

    document.querySelector("#sec_cae_prestador h3").textContent = "Editar Prestador";
    btnCadastrarPre.style.display = "none";
    btnFecharPre.style.display = "none";
    btnSalvarPre.style.display = "block";
}

// Função que salva os dados editados de um cliente
btnSalvarPre.addEventListener("click", async () => {
    const response = await fetch(`${url}/prestadorServico/${idPrestador}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "nome": inpNomePre.value,
            "cpf": inpCpfPre.value,
            "rg": inpRgPre.value,
            "cro": inpCroPre.value,
            "razao_social": inpRazaoSocPre.value,
            "cnpj": inpCnpjPre.value,
            "telefone": inpTelefonePre.value,
            "endereco": inpEnderecoPre.value
        })
    });

    if (response.status == 201) {
        configurarMensagem("sucesso");
        mostrarAlerta("Cadastro alterado com sucesso");
    } else {
        configurarMensagem("erro");
        mostrarAlerta("Ocorreu um erro ao alterar cadastro");
    }

    resetarFormulario("prestador");
    secaoPrestadores.addEventListener("load", exibirPrestadores("prestadores"));
});

// Função para deletar um prestador
async function deletarPrestador(id) {
    const response = await fetch(`${url}/prestadorServico/${id}`,
        {
            method: "DELETE",
        }
    );
    if (response.ok) {
        configurarMensagem("sucesso");
        mostrarAlerta("Cadastro excluído com sucesso");
    } else {
        configurarMensagem("erro");
        mostrarAlerta("Ocorreu um erro ao excluir registro");
    }

    await buscarConsultas();
    secaoConsultas.addEventListener("load", exibirConsultas("consultas"));
    secaoPrestadores.addEventListener("load", exibirPrestadores("prestadores"));
}

btnFecharPre.addEventListener("click", () => {
    btnFecharPre.style.display = "none";
    habilitarInputs("prestador");
    resetarFormulario("prestador");
});



/*   # # #   FORNECEDORES   # # #   */

// Função que busca todos os prestadores cadastrados no banco de dados
async function buscarFornecedores() {
    const response = await fetch(`${url}/fornecedor`);
    const todosFornecedores = await response.json();

    return todosFornecedores;
}

// Função que exibe todos os fornecedores cadastrados no banco de dados
async function exibirFornecedores() {
    const fornecedores = await buscarFornecedores();

    const tabelaFornecedoresBody = document.querySelector("#tb_fornecedores tbody");
    tabelaFornecedoresBody.innerHTML = "";

    fornecedores.forEach(fornecedor => {
        const tr = document.createElement("tr");
        const id = fornecedor.id

        tr.innerHTML = `            
                <td>${fornecedor.cnpj}</td>            
                <td>${fornecedor.razao_social}</td>
                <td>${fornecedor.endereco}</td>
                <td>${fornecedor.telefone}</td>
                <td>
                    <button class="btn-acoes bg-green" onclick="exibirFornecedor(${id})" title="Exibir">
                        <span class="material-symbols-outlined">
                            person_search
                        </span>
                    </button>
                    <button class="btn-acoes bg-primary" onclick="editarFornecedor(${id})" title="Editar">
                        <span class="material-symbols-outlined">
                            person_edit
                        </span>
                    </button>
                    <button class="btn-acoes bg-danger" onclick="deletarFornecedor(${id})" title="Excluir">
                        <span class="material-symbols-outlined">
                            person_remove
                        </span>
                    </button>
                </td>
            `;
        tabelaFornecedoresBody.appendChild(tr);
    });
}

// Função que exibe os dados do fornecedor de acordo com o id
async function exibirFornecedor(id) {
    exibirBotaoFechar("fornecedor");
    document.querySelector("#sec_cae_fornecedor h3").textContent = "Dados do Fornecedor";
    btnSalvarFor.style.display = "none";

    desabilitarInputs("fornecedor");

    const response = await fetch(`${url}/fornecedor/${id}`);
    const fornecedor = await response.json();

    inpRazaoFor.value = fornecedor.razao_social;
    inpCnpjFor.value = fornecedor.cnpj;
    inpTelefoneFor.value = fornecedor.telefone;
    inpEnderecoFor.value = fornecedor.endereco;
}

// Fução que verifica preenchimento do cadastro de fornecedor
btnCadastrarFor.addEventListener("click", async () => {
    if (
        inpRazaoFor.value !== "" &&
        inpCnpjFor.value !== "" &&
        inpTelefoneFor.value !== "" &&
        inpEnderecoFor.value !== ""
    ) {
        resetarAlerta();

        await cadastarFornecedor();
    } else {
        configurarMensagem("erro");
        mostrarAlerta("Preencha todos os campos do formulário");
    }
});

// Máscara para o campo telefone fornecedor -> (00) 00000-0000 
inpTelefoneFor.addEventListener("input", () => {
    inpTelefoneFor.value = inpTelefoneFor.value.replace(/\D/g, "");

    inpTelefoneFor.value = inpTelefoneFor.value.replace(
        /^(\d{2})(\d{5})(\d{4})(\d+)/,
        "($1) $2-$3"
    );
    inpTelefoneFor.value = inpTelefoneFor.value.replace(
        /^(\d{2})(\d{5})(\d)/,
        "($1) $2-$3"
    );
    inpTelefoneFor.value = inpTelefoneFor.value.replace(/^(\d{2})(\d)/, "($1) $2");
    inpTelefoneFor.value = inpTelefoneFor.value.replace(/^(\d)/, "($1");
});

// Máscara para o campo cnpj fornecedor -> 00.000.000/0000-00 
inpCnpjFor.addEventListener("input", () => {
    inpCnpjFor.value = inpCnpjFor.value.replace(/\D/g, "")                           //Remove tudo o que não é dígito
    inpCnpjFor.value = inpCnpjFor.value.replace(/^(\d{2})(\d)/, "$1.$2")             //Coloca ponto entre o segundo e o terceiro dígitos
    inpCnpjFor.value = inpCnpjFor.value.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3") //Coloca ponto entre o quinto e o sexto dígitos
    inpCnpjFor.value = inpCnpjFor.value.replace(/\.(\d{3})(\d)/, ".$1/$2")           //Coloca uma barra entre o oitavo e o nono dígitos
    inpCnpjFor.value = inpCnpjFor.value.replace(/(\d{4})(\d)/, "$1-$2")              //Coloca um hífen depois do bloco de quatro dígitos
});

// Função para cadastrar um fornecedor
async function cadastarFornecedor() {
    try {
        const response = await fetch(`${url}/fornecedor`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "razao_social": inpRazaoFor.value,
                "cnpj": inpCnpjFor.value,
                "telefone": inpTelefoneFor.value,
                "endereco": inpEnderecoFor.value
            })
        });

        resetarFormulario("fornecedor");
        secaoFornecedores.addEventListener("load", exibirFornecedores());

        if (response.ok) {
            configurarMensagem("sucesso");
            mostrarAlerta("Cadastro realizado com sucesso");
        } else {
            configurarMensagem("erro");
            mostrarAlerta("Ocorreu um erro ao cadastrar");
        }
    } catch (error) {
        console.error('Erro ao cadastrar paciente:', error);
        alert("Ocorreu um erro ao cadastar");
    }
}

// Função para editar um fornecedor de acordo com o id
async function editarFornecedor(id) {
    idFornecedor = id;

    const response = await exibirFornecedor(id);

    habilitarInputs("fornecedor");

    document.querySelector("#sec_cae_fornecedor h3").textContent = "Editar Fornecedor";
    btnCadastrarFor.style.display = "none";
    btnFecharFor.style.display = "none";
    btnSalvarFor.style.display = "block";
}

// Função que salva os dados editados de um fornecedor
btnSalvarFor.addEventListener("click", async () => {
    const response = await fetch(`${url}/fornecedor/${idFornecedor}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "razao_social": inpRazaoFor.value,
            "cnpj": inpCnpjFor.value,
            "telefone": inpTelefoneFor.value,
            "endereco": inpEnderecoFor.value
        })
    });

    if (response.status == 201) {
        configurarMensagem("sucesso");
        mostrarAlerta("Cadastro alterado com sucesso");
    } else {
        configurarMensagem("erro");
        mostrarAlerta("Ocorreu um erro ao alterar cadastro");
    }

    resetarFormulario("fornecedor");
    secaoFornecedores.addEventListener("load", exibirFornecedores());
});

// Função para deletar um prestador
async function deletarFornecedor(id) {
    const response = await fetch(`${url}/fornecedor/${id}`,
        {
            method: "DELETE",
        }
    );
    if (response.ok) {
        configurarMensagem("sucesso");
        mostrarAlerta("Cadastro excluído com sucesso");
    } else {
        configurarMensagem("erro");
        mostrarAlerta("Ocorreu um erro ao excluir registro");
    }

    secaoFornecedores.addEventListener("load", exibirFornecedores());
}

// Função que captura evento de clique do botão 'Fechar' do formulário de paciente
btnFecharFor.addEventListener("click", () => {
    btnFecharFor.style.display = "none";
    habilitarInputs("fornecedor");
    resetarFormulario("fornecedor");
});



/*   # # #   Funções do sistema   # # #   */

// Função que habilita o botão 'Fechar'
function exibirBotaoFechar(section) {
    if (section == "paciente") {
        btnCadastrarPac.style.display = "none";
        btnFecharPac.style.display = "block";
    } else if (section == "consulta") {
        btnCadastrarCons.style.display = "none";
        btnFecharCons.style.display = "block";
    } else if (section == "prestador") {
        btnCadastrarPre.style.display = "none";
        btnFecharPre.style.display = "block";
    } else if (section == "fornecedor") {
        btnCadastrarFor.style.display = "none";
        btnFecharFor.style.display = "block";
    }
}

// Função que reseta (limpa) os campos do formulário
function resetarFormulario(form) {
    if (form == "paciente") {
        document.querySelector("#sec_cae_paciente h3").textContent = "Cadastrar Paciente";
        btnCadastrarPac.style.display = "block";
        btnSalvarPac.style.display = "none";
        document.querySelector("#form_paciente").reset();
    } else if (form == "consulta") {
        document.querySelector("#sec_ca_consulta h3").textContent = "Cadastrar Consulta";
        document.querySelector("#lbl_cpf_pac").textContent = "CPF Paciente";
        inpCpfPacCons.disabled = false
        inpCroPresCons.disabled = false
        btnCadastrarCons.style.display = "block";
        btnSalvarCons.style.display = "none";
        document.querySelector("#form_consulta").reset();
    } else if (form == "prestador") {
        document.querySelector("#sec_cae_prestador h3").textContent = "Cadastrar Prestador";
        btnCadastrarPre.style.display = "block";
        btnSalvarPre.style.display = "none";
        document.querySelector("#form_prestador").reset();
    } else if (form == "fornecedor") {
        document.querySelector("#sec_cae_fornecedor h3").textContent = "Cadastrar Fornecedor";
        btnCadastrarFor.style.display = "block";
        btnSalvarFor.style.display = "none";
        document.querySelector("#form_fornecedor").reset();
    }
    resetarAlerta();
}

// Função que habilita as inputs do formulário
function habilitarInputs(form) {
    if (form == "paciente") {
        inpFormPac.forEach((input) => {
            input.disabled = false
        });
    }
    if (form == "prestador") {
        inpFormPre.forEach((input) => {
            input.disabled = false
        });
    }
    if (form == "fornecedor") {
        inpFormFor.forEach((input) => {
            input.disabled = false
        });
    }
}

// Função que desabilita as inputs do formulário
function desabilitarInputs(form) {
    if (form == "paciente") {
        inpFormPac.forEach((input) => {
            input.disabled = true
        });
    }
    if (form == "prestador") {
        inpFormPre.forEach((input) => {
            input.disabled = true
        });
    }
    if (form == "fornecedor") {
        inpFormFor.forEach((input) => {
            input.disabled = true
        });
    }
}

// Função que personaliza a mensagem de alerta
function configurarMensagem(status) {
    if (status == "sucesso") {
        alerta.classList.add("success");
    }
    if (status == "erro") {
        alerta.classList.add("danger");
    }
}

// Função para exibir uma mensagem de alerta
function mostrarAlerta(msg) {
    alerta.style.display = "block";
    alerta.style.top = "0";
    alerta.innerHTML = `${msg}`;

    setTimeout(() => {
        removerAlerta();
    }, 3000);
}

// Função para remover mensagem de alerta
function removerAlerta() {
    alerta.style.display = "none";
    alerta.style.top = "-100%";
}

// Função para resetar estilos da mensagem de alerta
function resetarAlerta() {
    alerta.classList.remove("sucsess");
    alerta.classList.remove("danger");
}
