<template>
  <div id="sidebar">
    <div id="librarybar" class="bar"><img src="/img/library_bar.png"/></div>
    <div id="favoritebar" class="bar"><img src="/img/favorite_bar.png"/></div>
    <div id="albumsbar" class="bar"><img src="/img/albums_bar.png"/></div>
    <div id="sharedbar" class="bar"><img src="/img/shared_bar.png"/></div>
    <div id="accountbar" class="bar"><img src="/img/account_bar.png"/></div>
  </div>
</template>

<script>
export default {};
</script>

<style>
#sidebar {
    position: absolute;
    height: 85%;
    width: 20%;
    bottom: 3%;
    background-color: gainsboro;
    border-radius: 25px;
}
#librarybar {
    border-top-left-radius: 25px;
    border-top-right-radius: 25px;
}
#accountbar {
    position: absolute;
    width: 100%;
    bottom: 0%;
    border-bottom-left-radius: 25px;
    border-bottom-right-radius: 25px;
}
.bar {
    padding-left: 15px;
    padding-right: 15px;
    padding-top: 15px;
}
.bar:hover {
    background-color: gray;
}
</style>
