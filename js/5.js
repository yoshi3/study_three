var GPF_STAMP_RALLY;
(function(GPF_STAMP_RALLY) {
  'use strict';
  var coinAnime = (function() {
    function coinAnime() {
      var _this = this;

      // 空間をつくる
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(20, 600 / 600, 1, 10000);

      var renderer_options = {alpha: true};
      if ( this.webglAvailable() && false ) {
        this.renderer = new THREE.WebGLRenderer(renderer_options);
      } else {
        this.renderer = new THREE.CanvasRenderer(renderer_options);
      }
      this.renderer.setPixelRatio(window.devicePixelRatio || 1)
      this.renderer.setSize(600, 600);
      document.body.appendChild(this.renderer.domElement);

      // ライト
      this.light = new THREE.DirectionalLight(0xffffff, 1);

      // 環境光
      this.ambient = new THREE.AmbientLight(0x999999);

      // XYZ軸を表示する
      /*
      this.axis = new THREE.AxisHelper(1000);
      this.controls = new THREE.OrbitControls(this.camera);
      */

      this.light.position.set(0, 100, 30);
      this.camera.position.set(0, 0, 200);

      this.scene.add(this.light, this.ambient);

      // コインをつくる
      var coin_sides_geo = new THREE.CylinderGeometry(10.0, 10.0, 1.0, 100.0, 10.0, true);
      var coin_cap_geo = new THREE.CircleGeometry (10.0, 100, 0);

      // テクスチャーの読み込み
      var texloader = new THREE.TextureLoader();
      var coin_sides_texture = texloader.load("./img/coin_side.jpg"); // side.jpg
      var coin_cap_texture_top = texloader.load("./img/coin_top.png"); // top.jpg
      var coin_cap_texture_bottom = texloader.load("./img/coin_bottom.jpg"); // bottom.jpg


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

      this.coin = new THREE.Object3D();
      this.coin.add(coin_sides);
      this.coin.add(coin_cap_top);
      this.coin.add(coin_cap_bottom);

      this.scene.add(this.coin);

      this.coin.rotation.x = Math.PI * 0.2;
      this.coin.rotation.y -= Math.PI * 0.3;

      // グロー効果の追加
      var coin_grow_texture = texloader.load("./img/glow.png");
      var coin_grow_mat = new THREE.MeshBasicMaterial( 
      { 
        map: coin_grow_texture,
        color: 0x007eff,        // 色
        transparent: true,      // 透明の表示許可
        blending: THREE.AdditiveBlending, // ブレンドモード
        side: THREE.DoubleSide, // 表裏の表示設定
        depthWrite: false
      });
      var coin_grow_geo = new THREE.CircleGeometry (50, 100, 0);
      this.coin_grow = new THREE.Mesh(coin_grow_geo, coin_grow_mat);
      /*
      this.coin_grow = new THREE.Sprite( coin_grow_mat );
      this.coin_grow.scale.set(100, 100, 1.0);
      */
      this.coin_grow.position.z = -30;
      this.scene.add(this.coin_grow);

      /*
      var customMaterial = new THREE.ShaderMaterial( 
      {
          uniforms: 
        { 
          'c':   { type: 'f', value: 1.0 },
          'p':   { type: 'f', value: 1.4 },
          glowColor: { type: 'c', value: new THREE.Color(0xffff00) },
          viewVector: { type: 'v3', value: this.camera.position }
        },
        vertexShader:   document.getElementById( 'vertexShader'   ).textContent,
        fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true
      }   );
      var ballGeometry = new THREE.SphereGeometry( 25, 25, 16 );
      var ball = new THREE.Mesh( ballGeometry, customMaterial );
      this.scene.add( ball );
      */

      this.sparks = [];
      var spark_num = 3;
      function set_random_spark_pos (pos) {
        var radian = (360 * Math.random()) * Math.PI / 180;
        var radius = 10;
        pos.x = Math.cos(radian) * radius + 0.3 * Math.random();
        pos.y = Math.sin(radian) * radius + 0.3 * Math.random();
      };

      for (var i = 0; i < spark_num; i++) {

        var spark_texture = texloader.load("img/spark.png");
        var spark_mat = new THREE.MeshBasicMaterial( { 
          map: spark_texture,
          color: 0xffffff,
          blending: THREE.AdditiveBlending,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0
        } );
        var spark_geo = new THREE.CircleGeometry (2.5, 2.5, 0);
        this.sparks.push( new THREE.Mesh(spark_geo, spark_mat) );
        set_random_spark_pos(this.sparks[i].position);
        this.sparks[i].position.z = -40;
        this.scene.add( this.sparks[i] );

        TweenMax
          .to(this.sparks[i].material, 0.4, {
            //delay: Math.random()*(2-0.3)+0.6,
            opacity: Math.random()*(1-0.3)+0.3,
            startAt: { opacity: 0 },
            repeat: -1,
            yoyo: true,
            onUpdate: function(mesh) {
              if (mesh.material.opacity < 0.09) {

                set_random_spark_pos(mesh.position);

                var scale = Math.random()*(1-0.3)+0.3;
                mesh.scale.x = scale;
                mesh.scale.y = scale;
              }
            },
            onUpdateParams: [ this.sparks[i] ],
          }, 0.4 + Math.random());

        TweenMax
          .to(this.sparks[i].material, 0.4, {
            delay: Math.random()*(2-0.3)+0.6,
            opacity: Math.random()*(1-0.3)+0.3,
            startAt: { opacity: 0 },
            repeat: -1,
            yoyo: true,
            onUpdate: function(mesh) {
              if (mesh.material.opacity < 0.09) {

                set_random_spark_pos(mesh.position);

                var scale = Math.random()*(1-0.3)+0.3;
                mesh.scale.x = scale;
                mesh.scale.y = scale;
              }
            },
            onUpdateParams: [ this.sparks[i] ],
          }, 0.4 + Math.random());

      }

      TweenMax
        .to(this.coin.rotation, 1.6, {
          ease: Expo.Power1,
          x: this.coin.rotation.x + Math.PI * 0.3,
          y: this.coin.rotation.y + Math.PI * 0.3
        });

      TweenMax
        .to(this.coin.position, 0.6, { 
          ease: Expo.Power1,
          delay: 0.2,
          z: this.coin.position.z-60
        });

      TweenMax
        .to(this.coin_grow.position, 0.6, { 
          delay: 0.2,
          z: this.coin_grow.position.z-40
        });


      this.render();
    };

    coinAnime.prototype.render = function() {
      var _this = this;

      function animation(time) {
        requestAnimationFrame(animation);

        _this.coin_grow.rotation.z += 0.01;

        _this.renderer.render(_this.scene, _this.camera);
      };
      animation();
    };

    coinAnime.prototype.webglAvailable = function() {
      try {
        var canvas = document.createElement( 'canvas' );
        return !!( window.WebGLRenderingContext && (
          canvas.getContext( 'webgl' ) ||
          canvas.getContext( 'experimental-webgl' ) )
        );
      } catch ( e ) {
        return false;
      }
    };

    return coinAnime;
  }());
  GPF_STAMP_RALLY.coinAnime = coinAnime;
})(GPF_STAMP_RALLY || (GPF_STAMP_RALLY = {}));