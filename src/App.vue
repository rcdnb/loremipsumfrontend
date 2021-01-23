<template>
  <div id="app"> 
    <nav class="navbar navbar-dark bg-dark">
      <a class="navbar-brand" href="#">
        Lorem Ipsum Inc.
      </a>
    </nav>  
    <div class="container">
        <router-view></router-view>
    </div>
  </div>
</template>

<script>

export default {
  name: 'App',
  created() {
    document.title = "Lorem Ipsum - Projetos"
  }
}
</script>

<style scoped>

</style>
