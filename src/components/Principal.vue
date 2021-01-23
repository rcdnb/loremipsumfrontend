<template>
  <div class="hello">
    <h3 class="mt-5 mb-3">Projetos</h3>

    <table class="table table-striped table-hover table-bordered table-reponsive">
      <thead class="bg-primary text-white">
        <tr>
          <th>Nome</th>
          <th>Valor</th>
          <th>Risco</th>
          <th>Data de inicio</th>
          <th>Data de término</th>
          <!-- <th>Participantes</th> -->
          <th class="fit text-center">Acões</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="projeto in projetos" :key="projeto.id">
          <td>{{ projeto.nome }}</td>
          <td class="text-nowrap">{{ formataDinheiro(projeto.valor) }}</td>
          <td>{{ formataRisco(projeto.risco) }}</td>
          <td>{{ formataData(projeto.data_inicio) }}</td>
          <td>{{ formataData(projeto.data_termino) }}</td>
          <!-- <td>
            <ul v-for="participante in formataParticipantes(projeto.participantes)" :key="participante">
              <li>{{ participante }}</li>
            </ul>
          </td> -->
          <td class="fit">
            <div class="btn-group" role="group">
              <button
                @click="editRow(projeto)"
                class="btn btn-secondary"
                data-toggle="tooltip"
                data-placement="top"
                title="Editar"
              >
                <img src="../assets/logoedit.png" />
              </button>
              <button
                @click="deleteRow(projeto.id)"
                type="submit"
                class="btn btn-secondary"
                data-toggle="tooltip"
                data-placement="top"
                title="Apagar"
              >
                <img src="../assets/logodelete.png" />
              </button>
              <button
                class="btn btn-secondary"
                data-toggle="tooltip"
                data-placement="top"
                title="Simulação"
                @click="viewRow(projeto)"
              >
                <img src="../assets/logoshow.png" />
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <br />
    <router-link class="btn btn-primary align-text-bottom float-right" to="/formulario">
      Cadastrar Projeto
    </router-link>

    <div id="modalProjeto" class="modal" tabindex="-1">
      <div class="modal-dialog" v-if="selecionado != null">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Simular Investimento</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <p><b>Projeto:</b> {{ selecionado.nome }}</p>
            <!-- <p><b>Data Início:</b> {{ formataData(selecionado.data_inicio) }}</p>
            <p><b>Data Termino:</b> {{ formataData(selecionado.data_termino) }}</p> -->
            <p><b>Valor:</b> {{ formataDinheiro(selecionado.valor) }}</p>
            <p><b>Risco:</b> {{ formataRisco(selecionado.risco) }}</p>
            <!-- <p><b>Tipo:</b> {{ selecionado.tipo }}</p>
            <p><b>Retorno Esperado:</b> {{ formataDinheiro(selecionado.retorno_esperado) }}</p> -->
            <p>
              <b>Participantes:</b>
              <ul
                class="mt-2"
                v-for="participante in formataParticipantes(selecionado.participantes)"
                :key="participante"
              >
                <li>{{ participante }}</li>
              </ul>
            </p>
            <hr>

            <label for="investimento">Valor do investimento:</label>

            <div class="row">
              <div class="col">
                  <input id="investimento" type="number" class="form-control" v-model="valorInvestimento">
              </div>
              <div class="col">
                <button type="button" class="btn btn-primary" @click="calcular()">Calcular</button>
              </div>
            </div>

            <p class="mt-3" v-if="retornoInvestimento">
              <b>Retorno do investimento:</b>
              {{formataDinheiro(retornoInvestimento)}}
            </p>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Fechar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import $ from "jquery";
import toastr from "toastr";

export default {
  name: "Principal",
  data() {
    return {
      projetos: [],
      selecionado: null,
      valorInvestimento: null,
      retornoInvestimento: 0,
    };
  },

  methods: {
    formataDia(number) {
      if (number < 10) {
        return "0" + number;
      } else {
        return number;
      }
    },
    formataData(data) {
      const date = new Date(data);
      return (
        this.formataDia(date.getDate()) +
        "/" +
        this.formataDia(date.getMonth() + 1) +
        "/" +
        date.getFullYear()
      );
    },
    formataDinheiro(valor) {
      return (
        "R$ " +
        parseFloat(valor)
          .toFixed(2)
          .toString()
          .replace(".", ",")
      );
    },
    formataRisco(risco) {
      switch (risco) {
        case 0:
          return "Baixo";
        case 1:
          return "Médio";
        case 2:
          return "Alto";
      }
    },
    formataParticipantes(participantes) {
      return participantes.split(",");
    },
    deleteRow(id) {
      if (confirm("Deseja deletar essa linha da tabela?")) {
        axios.delete("http://127.0.0.1:8000/projeto/" + id).then(() => {
          const arrayIndex = this.projetos.findIndex(
            (id) => id == this.projetos.id
          );
          this.projetos.splice(arrayIndex, 1);
          toastr.warning("Deletado com Sucesso")
        });
      } else {
        console.log("apertou não");
      }
    },
    editRow(projeto) {
      this.$router.push({
        name: "formulario",
        params: { projetoEditado: projeto },
      });
    },
    viewRow(projeto) {
      this.selecionado = projeto;
      this.valorInvestimento = null;
      this.retornoInvestimento = null;
      $("#modalProjeto").modal('show');
    },
    calcular() {
      const valorProj = parseFloat(this.selecionado.valor);
      const valorInv = parseFloat(this.valorInvestimento)

      if(valorInv < valorProj) {
        toastr.error("Investimento menor que o valor do projeto!", "Erro")
      } else {
        let porcentagem;
        switch(this.selecionado.risco) {
          case 0:
            porcentagem = 5/100;
            break;
          case 1:
            porcentagem = 10/100;
            break;
          case 2:
            porcentagem = 20/100;
            break;
        }
        this.retornoInvestimento = (valorInv * porcentagem) + valorInv
      }
    }
  },

  created() {
    axios.get("http://127.0.0.1:8000/projeto/").then((response) => {
      this.projetos = response.data;
    });
  },
};
</script>

<style scoped>
.table td.fit,
.table th.fit {
  white-space: nowrap;
  width: 1%;
}
</style>
