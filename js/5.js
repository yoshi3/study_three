var WebGL;
(function(WebGL) {
  'use strict';
  var TEST = (function() {
    function TEST() {
      var _this = this;

      var coin_sides_geo = new THREE.CylinderGeometry(10.0, 10.0, 1.0, 100.0, 10.0, true);
      var coin_cap_geo = new THREE.CircleGeometry (10.0, 100.0, 0);

      // テクスチャーの読み込み
      var texloader = new THREE.TextureLoader();
      var coin_sides_texture = texloader.load("/img/coin_side.jpg"); // side.jpg
      var coin_cap_texture_top = texloader.load("/img/coin_top.jpg"); // top.jpg
      var coin_cap_texture_bottom = texloader.load("/img/coin_bottom.jpg"); // bottom.jpg


      var coin_sides_mat = new THREE.MeshLambertMaterial({ map: coin_sides_texture });
      var coin_sides = new THREE.Mesh(coin_sides_geo, coin_sides_mat);

      var coin_cap_top_mat = new THREE.MeshLambertMaterial({ map: coin_cap_texture_top });
      var coin_cap_top = new THREE.Mesh(coin_cap_geo, coin_cap_top_mat);
      coin_cap_top.rotation.x -= Math.PI/2;
      coin_cap_top.position.y += 0.5;

      var coin_cap_bottom_mat = new THREE.MeshLambertMaterial({ map: coin_cap_texture_bottom });
      var coin_cap_bottom = new THREE.Mesh(coin_cap_geo, coin_cap_bottom_mat);
      coin_cap_bottom.rotation.x -= Math.PI/2;
      coin_cap_bottom.rotation.y += Math.PI;
      coin_cap_bottom.position.y -= 0.5;

      // 空間をつくる
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 1, 10000);
      this.renderer = new THREE.WebGLRenderer;

      this.renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(this.renderer.domElement);

      // ライト
      this.light = new THREE.DirectionalLight(0xffffff, 1);

      // 環境光
      this.ambient = new THREE.AmbientLight(0x666666);

      // XYZ軸を表示する
      this.axis = new THREE.AxisHelper(1000);

      this.controls = new THREE.OrbitControls(this.camera);

      this.light.position.set(0, 100, 30);
      this.camera.position.set(0, 0, 60);

      this.scene.add(this.light, this.ambient, this.axis);

      var coin = new THREE.Object3D();
      coin.add(coin_sides);
      coin.add(coin_cap_top);
      coin.add(coin_cap_bottom);

      this.scene.add(coin);

      coin.rotation.x = Math.PI * 0.5;

      this.render();
    };

    TEST.prototype.render = function() {
      var _this = this;

      function animation() {
        requestAnimationFrame(animation);
        _this.renderer.render(_this.scene, _this.camera);
      }

      animation();
    };

    return TEST;
  }());
  WebGL.TEST = TEST;
})(WebGL || (WebGL = {}));