<template>
  <div>
    <h3 class="mt-5 mb-3" v-if="estaEditando">Editar Projeto</h3>
    <h3 class="mt-5 mb-3" v-else>Cadastrar Projeto</h3>
    <form>
      <div class="row">
        <div class="col">
          <label for="name" class="form-label">Nome</label>
          <input v-model="formProjeto.nome" type="text" class="form-control" id="nomeProjeto" placeholder="Fulano Ciclano do Beltrano" />
        </div>
      </div>
      <div class="row">
        <div class="col-12 col-md-6">
          <label for="date" class="form-label">Data de Inicio</label>
          <input v-model="formProjeto.data_inicio" type="date" class="form-control" id="dataInicio" />
        </div>
        <div class="col-12 col-md-6">
          <label for="date" class="form-label">Data de Término</label>
          <input v-model="formProjeto.data_termino" type="date" class="form-control" id="dataTermino" />
        </div>
      </div>

      <div class="row">
        <div class="col-12 col-md-6">
          <label for="Valor" class="form-label">Valor do Projeto</label>
          <input v-model="formProjeto.valor" type="number" class="form-control" id="valorInvestido" placeholder="1000,00"/>
        </div>
        <div class="col-12 col-md-6">
          <label for="risk" class="form-label">Risco</label>
          <select v-model="formProjeto.risco" id="risco" class="form-control">
            <option :value="null">Escolha uma opção</option>
            <option value="0">0 - Risco baixo</option>
            <option value="1">1 - Risco médio</option>
            <option value="2">2 - Risco alto</option>
          </select>
        </div>
      </div>

      <div class="row">
        <div class="col">
          <label for="Participantes" class="form-label">Participantes do investimento</label>
          <input v-model="formProjeto.participantes" type="text" class="form-control" id="Participantes" placeholder="Fulano, cliclano, beltrano" />
        </div>
      </div>

      <div class="row mt-4 justify-content-between">
        <div class="col-auto">
          <button @click="$router.push('/home')" type="button" class="btn btn-secondary mr-3">
            Retonar
          </button>
        </div>
        <div class="col-auto">
          <button @click="enviar()" type="button" class="btn btn-primary" v-if="estaEditando">
            Atualizar
          </button>
          <button @click="enviar()" type="button" class="btn btn-primary" v-else>
            Cadastrar
          </button>
        </div>
      </div>

    </form>
  </div>
</template>

<script>
import axios from "axios";
import toastr from "toastr";

export default {
  name: "Formulario",
  data() {
    return {
      formProjeto: {
        nome: '',
        data_inicio: this.formatarData(new Date()),
        data_termino: this.formatarData(new Date()),
        valor: '',
        tipo: null,
        risco: null,
        retorno_esperado: 0,
        participantes: null,
      },
      estaEditando: false,
    };
  },
  created() {
    if (this.$route.params.projetoEditado) {
      this.estaEditando = true;
      this.formProjeto = this.$route.params.projetoEditado;
    }
    window["toastr"] = toastr;
  },
  methods: {
    enviar() {
      if (this.estaEditando) {
        axios
          .put("http://127.0.0.1:8000/projeto/"+this.formProjeto.id+"/", this.formProjeto)
          .then(() => {
            toastr.success("Projeto salvo");
            this.$router.push("/home");
          })
          .catch(() => toastr.error("Ocorreu um erro."));
      } else {
        axios
          .post("http://127.0.0.1:8000/projeto/", this.formProjeto)
          .then(() => {
            toastr.success("Projeto salvo");
            this.$router.push("/home");
          })
          .catch(() => toastr.error("Ocorreu um erro."));
      }
    },

    formataDia(number) {
      if (number < 10) {
        return "0" + number;
      } else {
        return number;
      }
    },
    formatarData(date) {
      return (
        date.getFullYear() +
        "-" +
        this.formataDia(date.getMonth() + 1) +
        "-" +
        this.formataDia(date.getDate())
      );
    },
  },
};
</script>

<style scoped></style>
