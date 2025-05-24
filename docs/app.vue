<template>
  <NuxtLayout>
    <NuxtPage />
    <footer>
      <p>
        Made with 💛 by <a href="https://github.com/gugustinette/" target="_blank">Gugustinette</a>.
      </p>
    </footer>
  </NuxtLayout>
</template>

<style>
body {
  padding: 0;
  margin: 0;
  font-family: "Nunito Sans", sans-serif;
  background-color: #0F0F0F;
  color: #FFFFFF;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow-x: hidden;
}
a {
  color: #ee711e;
  text-decoration: none;
}
p {
  color: #CCCCCC;
}
ul {
  color: #CCCCCC;
}
footer {
  bottom: 0;
  width: 100%;
  text-align: center;
  margin-top: 4rem;
  padding: 1rem;
}
</style>
