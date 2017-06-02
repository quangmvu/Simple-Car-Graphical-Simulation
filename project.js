'use strict';

Physijs.scripts.worker = 'physijs_worker.js';
Physijs.scripts.ammo = 'js/ammo.js';

var init,
    canvas,
    render,
    renderer,
    loader,
    scene,
    ground,
    ground_material,
    wheel_material,
    wheel_geometry,
    light1,
    light2,
    light3,
    camera,
    box_material,
    sphere_material,
    cone_material,
    car_material,
    car_part,
    car = {};

init = function() {
    canvas = document.getElementById("glCanvas");

    //create the renderer and attach it to the canvas
    renderer = new THREE.WebGLRenderer( {canvas: canvas, antialias: true} );

    //set the viewport size
    renderer.setSize(canvas.width, canvas.height);

    scene = new Physijs.Scene;
    scene.setGravity(new THREE.Vector3( 0, -10, 0 ));
    scene.addEventListener("update", function() {
        scene.simulate( undefined, 2 );
        }
    );

    camera = new THREE.PerspectiveCamera(
        45,
        canvas.width / canvas.height,
        1,
        4000
    );

    camera.position.set( 90, 80, 0 );
    camera.lookAt( scene.position );
    scene.add( camera );

    //Light Source 1
    light1 = new THREE.DirectionalLight( 0xFFFFFF );
    light1.position.set( 20, 40, -15 );
    scene.add( light1 );

    // Light source 2
    light2 = new THREE.PointLight( 0xff0000, 1, 100 ); // red light
    light2.position.set( 0, 50, 0 );
    scene.add( light2 );

    // Light source 3
    light3 = new THREE.AmbientLight( 0x070707 ); // black light
    scene.add( light3 );

    // Loader
    loader = new THREE.TextureLoader();

    // Materials
    ground_material = Physijs.createMaterial(
        new THREE.MeshLambertMaterial({ map: loader.load( "texture/sand.jpg" ) }),
        .8, // high friction
        .4 // low restitution
    );

    // Ground
    ground = new Physijs.BoxMesh(
        new THREE.BoxGeometry(100, 1, 100),
        ground_material,
        0 // mass
    );
    scene.add( ground );
    
    // Car
    car_material = Physijs.createMaterial(
        new THREE.MeshLambertMaterial({ color: 0x4152C2 }),
        .8, // high friction
        .2 // low restitution
    );

    wheel_material = Physijs.createMaterial(
        new THREE.MeshLambertMaterial({ color: 0x444444 }),
        .8, // high friction
        .5 // medium restitution
    );
    wheel_geometry = new THREE.CylinderGeometry( 2, 2, 1, 8 );

    car_part = new Physijs.BoxMesh(
        new THREE.BoxGeometry( 7, 5, 7 ),
        car_material,
        1000
    );
    car_part.position.y = 5;

    car.body = new Physijs.BoxMesh(
        new THREE.BoxGeometry( 15, 5, 7 ),
        car_material,
        1000
    );
    car.body.add(car_part);
    car.body.position.y = 9;
    scene.add( car.body );

    //front left wheel
    car.wheel_fl = new Physijs.CylinderMesh(
        wheel_geometry,
        wheel_material,
        500
    );

    car.wheel_fl.rotation.x = Math.PI / 2;
    car.wheel_fl.position.set( -4.5, 6.5, 5 );
    scene.add( car.wheel_fl );
    car.wheel_fl_constraint = new Physijs.DOFConstraint( car.wheel_fl, car.body, new THREE.Vector3( -4.5, 6.5, 5 ) );
    scene.addConstraint( car.wheel_fl_constraint );
    car.wheel_fl_constraint.setAngularLowerLimit({ x: 0, y: -Math.PI / 8, z: 1 });
    car.wheel_fl_constraint.setAngularUpperLimit({ x: 0, y: Math.PI / 8, z: 0 });

    //front right wheel
    car.wheel_fr = new Physijs.CylinderMesh(
        wheel_geometry,
        wheel_material,
        500
    );
    car.wheel_fr.rotation.x = Math.PI / 2;
    car.wheel_fr.position.set( -4.5, 6.5, -5 );
    scene.add( car.wheel_fr );
    car.wheel_fr_constraint = new Physijs.DOFConstraint( car.wheel_fr, car.body, new THREE.Vector3( -4.5, 6.5, -5 ) );
    scene.addConstraint( car.wheel_fr_constraint );
    car.wheel_fr_constraint.setAngularLowerLimit({ x: 0, y: -Math.PI / 8, z: 1 });
    car.wheel_fr_constraint.setAngularUpperLimit({ x: 0, y: Math.PI / 8, z: 0 });

    //back left wheel
    car.wheel_bl = new Physijs.CylinderMesh(
        wheel_geometry,
        wheel_material,
        500
    );
    car.wheel_bl.rotation.x = Math.PI / 2;
    car.wheel_bl.position.set( 4.5, 6.5, 5 );
    scene.add( car.wheel_bl );
    car.wheel_bl_constraint = new Physijs.DOFConstraint( car.wheel_bl, car.body, new THREE.Vector3( 4.5, 6.5, 5 ) );
    scene.addConstraint( car.wheel_bl_constraint );
    car.wheel_bl_constraint.setAngularLowerLimit({ x: 0, y: 0, z: 0 });
    car.wheel_bl_constraint.setAngularUpperLimit({ x: 0, y: 0, z: 0 });

    //back right wheel
    car.wheel_br = new Physijs.CylinderMesh(
        wheel_geometry,
        wheel_material,
        500
    );
    car.wheel_br.rotation.x = Math.PI / 2;
    car.wheel_br.position.set( 4.5, 6.5, -5 );
    scene.add( car.wheel_br );
    car.wheel_br_constraint = new Physijs.DOFConstraint( car.wheel_br, car.body, new THREE.Vector3( 4.5, 6.5, -5 ) );
    scene.addConstraint( car.wheel_br_constraint );
    car.wheel_br_constraint.setAngularLowerLimit({ x: 0, y: 0, z: 0 });
    car.wheel_br_constraint.setAngularUpperLimit({ x: 0, y: 0, z: 0 });

    //box
    box_material = Physijs.createMaterial(
        new THREE.MeshLambertMaterial({ map: loader.load( "texture/box.jpg" ) }),
        .4, // low friction
        .6 // high restitution
    );

    //shpere
    sphere_material = Physijs.createMaterial(
        new THREE.MeshPhongMaterial({ map: loader.load( "texture/sphere.jpg" ) }),
        .4, // low friction
        .8 // high restitution
    );

    //cone
    cone_material = Physijs.createMaterial(
        new THREE.MeshPhongMaterial({ map: loader.load( "texture/cone.jpg" ) }),
        .4, // low friction
        .8 // high restitution
    );

    document.addEventListener("keydown", function( event ) {
            switch( event.code ) {
                case "KeyW":
                    car.wheel_bl_constraint.configureAngularMotor( 2, 1, 0, 5, 2000 );
                    car.wheel_br_constraint.configureAngularMotor( 2, 1, 0, 5, 2000 );
                    car.wheel_fl_constraint.configureAngularMotor( 2, 1, 0, 2, 2000 );
                    car.wheel_fr_constraint.configureAngularMotor( 2, 1, 0, 2, 2000 );
                    car.wheel_bl_constraint.enableAngularMotor( 2 );
                    car.wheel_br_constraint.enableAngularMotor( 2 );
                    car.wheel_fl_constraint.enableAngularMotor( 2 );
                    car.wheel_fr_constraint.enableAngularMotor( 2 );
                    break;

                case "KeyS":
                    car.wheel_bl_constraint.configureAngularMotor( 2, 1, 0, -5, 2000 );
                    car.wheel_br_constraint.configureAngularMotor( 2, 1, 0, -5, 2000 );
                    car.wheel_fl_constraint.configureAngularMotor( 2, 1, 0, -2, 2000 );
                    car.wheel_fr_constraint.configureAngularMotor( 2, 1, 0, -2, 2000 );
                    car.wheel_bl_constraint.enableAngularMotor( 2 );
                    car.wheel_br_constraint.enableAngularMotor( 2 );
                    car.wheel_fl_constraint.enableAngularMotor( 2 );
                    car.wheel_fr_constraint.enableAngularMotor( 2 );
                    break;

                case "KeyA":
                    car.wheel_fl_constraint.configureAngularMotor( 1, -Math.PI / 2, Math.PI / 2, 1, 200 );
                    car.wheel_fr_constraint.configureAngularMotor( 1, -Math.PI / 2, Math.PI / 2, 1, 200 );
                    car.wheel_fl_constraint.enableAngularMotor( 1 );
                    car.wheel_fr_constraint.enableAngularMotor( 1 );
                    break;

                case "KeyD":
                    car.wheel_fl_constraint.configureAngularMotor( 1, -Math.PI / 2, Math.PI / 2, -1, 200 );
                    car.wheel_fr_constraint.configureAngularMotor( 1, -Math.PI / 2, Math.PI / 2, -1, 200 );
                    car.wheel_fl_constraint.enableAngularMotor( 1 );
                    car.wheel_fr_constraint.enableAngularMotor( 1 );
                    break;

                //S: spawn objects
                case "KeyQ":
                    for (var i = 0; i < 3; i++ ) {
                        //random sizes
                        var radius = Math.floor((Math.random() * 10) + 1);
                        var height = Math.floor((Math.random() * 15) + 5);
                        var size = Math.floor((Math.random() * 8) + 1);

                        //sphere
                        var sphere = new Physijs.SphereMesh(
                            new THREE.SphereGeometry( radius, 32, 32 ),
                            sphere_material
                        );
                        sphere.position.set(
                            Math.floor((Math.random() * 100) - 50),
                            30,
                            Math.floor((Math.random() * 100) - 50)
                        );
                        scene.add( sphere );

                        //cone
                        var cone = new Physijs.ConeMesh(
                            new THREE.CylinderGeometry( 0, radius, height, 32 ),
                            cone_material
                        );
                        cone.position.set(
                            Math.floor((Math.random() * 100) - 50),
                            30,
                            Math.floor((Math.random() * 100) - 50)
                        );
                        scene.add( cone );

                        //box
                        var box = new Physijs.BoxMesh(
                            new THREE.BoxGeometry( size, size, size ),
                            box_material
                        );
                        box.position.set(
                            Math.floor((Math.random() * 100) - 50),
                            30,
                            Math.floor((Math.random() * 100) - 50)
                        );
                        scene.add( box )
                    };
            }
        }
    );


    document.addEventListener("keyup", function( event ) {
            switch( event.code ) {
                case "KeyW":
                    car.wheel_bl_constraint.disableAngularMotor( 2 );
                    car.wheel_br_constraint.disableAngularMotor( 2 );
                    car.wheel_fl_constraint.disableAngularMotor( 2 );
                    car.wheel_fr_constraint.disableAngularMotor( 2 );
                    break;

                case "KeyS":
                    car.wheel_bl_constraint.disableAngularMotor( 2 );
                    car.wheel_br_constraint.disableAngularMotor( 2 );
                    car.wheel_fl_constraint.disableAngularMotor( 2 );
                    car.wheel_fr_constraint.disableAngularMotor( 2 );
                    break;

                case "KeyA":
                    car.wheel_fl_constraint.disableAngularMotor( 1 );
                    car.wheel_fr_constraint.disableAngularMotor( 1 );
                    break;

                case "KeyD":
                    car.wheel_fl_constraint.disableAngularMotor( 1 );
                    car.wheel_fr_constraint.disableAngularMotor( 1 );
                    break;
            }
        }
    );

    requestAnimationFrame( render );
    scene.simulate();
};

render = function() {
    requestAnimationFrame( render );
    renderer.render( scene, camera );
};

