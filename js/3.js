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
      // ライト
      this.light = new THREE.DirectionalLight('#0060ff', 1);
      // 環境光
      this.ambient = new THREE.AmbientLight('#ffffff');
      this.scene.add(this.light);
      // XYZ軸を表示する
      this.axis = new THREE.AxisHelper(1000);

      // パネルを作成
      this.geometry1 = new THREE.PlaneGeometry(1, 1);
      // ボックスを作成
      this.geometry2 = new THREE.BoxGeometry(1, 1, 1);

      this.material1 = new THREE.MeshLambertMaterial({color: 0xffffff});
      this.material2 = new THREE.MeshLambertMaterial({color: 0xcccccc});
      // 回転軸をずらす
      this.object1 = new THREE.Mesh(this.geometry1.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0.5, 0)), this.material1);
      this.object2 = new THREE.Mesh(this.geometry1, this.material2);

      this.cube = new THREE.Mesh(this.geometry2, this.material2);

      this.controls = new THREE.OrbitControls(this.camera);

      window.addEventListener('load', function() {
        _this.init.call(_this);
      });
    }

    TEST.prototype.render = function() {
      var _this = this;

      // 180度開く
      _this.object1.rotation.x = 180 * Math.PI / 180;

      function animation() {
        requestAnimationFrame(animation);
        if(_this.object1.rotation.x > 0) {
          _this.object1.rotation.x -= 0.02;
        } else {
          _this.object1.rotation.x = 0;
        }
        //_this.object1.rotation.z += 0.01;
        _this.controls.update();
        _this.renderer.render(_this.scene, _this.camera);
      }

      animation();
    }

    TEST.prototype.init = function() {
      this.material1.side = THREE.DoubleSide;
      this.material2.side = THREE.DoubleSide;
      this.light.position.set(0, 100, 30);
      this.cube.position.set(-1, 0.5, -2);
      this.camera.position.set(9, 2, 1);

      this.renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(this.renderer.domElement);

      this.scene.add(this.ambient, this.light, this.cube, this.object1, this.object2, this.axis);
      this.camera.position.z = 5;

      this.render();
    };

    return TEST;
  }());
  WebGL.TEST = TEST;
})(WebGL || (WebGL = {}));