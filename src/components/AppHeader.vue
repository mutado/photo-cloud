<template>
  <div id="header">
    <img id="logo" class="headerChild" src="/img/logo.png" />
    <input id="searchBar" class="headerChild" type="text" placeholder="🔍 Search..." />
    <img id="uploadIcon" class="headerChild" src="/img/upload_icon.png" />
    <img id="shareIcon" class="headerChild" src="/img/share_icon.png"/>
    <img id="accountIcon" class="headerChild" src="/img/account_icon.png"/>
  </div>
</template>

<script>
export default {};
</script>

<style>
#header {
  height: 50px;
  background-color: gainsboro;
  position: relative;
  border-radius: 25px;
}
#logo {
  height: 70px;
  left: 1%;
}
#searchBar {
  height: 35px;
  width: 65%;
  right: 15%;
  border-radius: 25px;
}
#uploadIcon {
  padding-top: 2.5px;
  padding-bottom: 2.5px;
  right: 9%;
}
#shareIcon {
  padding-top: 3px;
  padding-bottom: 3px;
  right: 5%;
}
#accountIcon {
  right: 0%;
  border-top-right-radius: 25px;
  border-bottom-right-radius: 25px;
  padding-right: 5px;
}
.headerChild {
  position: absolute;
  top: 50%;
  transform: translate(0, -50%);
}
#searchBar:focus::placeholder {
  color: transparent;
}
#uploadIcon:hover {
  background-color: gray;
}
#shareIcon:hover {
  background-color: gray;
}
#accountIcon:hover {
  background-color: gray;
}
</style>
