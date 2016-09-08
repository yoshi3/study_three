var WebGL;
(function(WebGL) {
  'use strict';
  var TEST = (function() {
    function TEST() {
      var _this = this;

      // 空間をつくる
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 1, 10000);
      this.renderer = new THREE.WebGLRenderer;

      this.renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(this.renderer.domElement);

      // ライト
      this.light = new THREE.DirectionalLight(0xffffff, 1);

      // 環境光
      this.ambient = new THREE.AmbientLight(0x999999);

      // XYZ軸を表示する
      this.axis = new THREE.AxisHelper(1000);

      this.controls = new THREE.OrbitControls(this.camera);

      this.light.position.set(0, 100, 30);
      this.camera.position.set(9, 2, 1);

      // 円柱を作る作る
      var mesh = new THREE.MeshPhongMaterial({                                      
          color: 0xffffff
      })
      mesh.castShadow = true;
      this.cylinder = new THREE.Mesh(                                     
       new THREE.CylinderGeometry(1, 1, 0.1, 50), mesh);

      this.scene.add(this.light, this.ambients, this.axis ,this.cylinder);

      this.render();
    };

    TEST.prototype.render = function() {
      var _this = this;
      var diff = 0.1;

      function animation() {
        requestAnimationFrame(animation);

        _this.cylinder.rotation.x -= diff;
        console.log(_this.cylinder.rotation.x);
        if (diff > 0.0001) {
          diff -= 0.001;
        }
        if (diff < 0) {
          diff = 0;
        }

        _this.controls.update();
        _this.renderer.render(_this.scene, _this.camera);
      }

      animation();
    };

    return TEST;
  }());
  WebGL.TEST = TEST;
})(WebGL || (WebGL = {}));