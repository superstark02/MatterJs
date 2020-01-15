import React,{Component} from "react";
import ReactDOM from "react-dom";
import logo from './_img/logo.png'
import Matter from "matter-js";
import Team from './Team'

var count = 0;
var score = 0;

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    }
    
  
  componentDidMount() {

    var Engine = Matter.Engine,
      Render = Matter.Render,
      World = Matter.World,
      Bodies = Matter.Bodies,
      Runner = Matter.Runner,
      Mouse = Matter.Mouse,
      Constraint = Matter.Constraint,
      Body = Matter.Body,
      Composites = Matter.Composites,
      Events = Matter.Events,
      MouseConstraint = Matter.MouseConstraint;

    var engine = Engine.create({

      // positionIterations: 20

    });

    var render = Render.create({
      element: this.refs.scene,
      engine: engine,
      options: {
        width: 800,
        height: 600,
        wireframes: false, 
      }

    });

    Render.run(render);
    var runner = Runner.create();
    Runner.run(runner, engine);

    //Bodies
    var rim = Bodies.rectangle(630,246,100,20, { isStatic: true,isSensor:true ,render:{fillStyle:'white'}});

    var group = Body.nextGroup(true),
        particleOptions = { friction: 0.00001, collisionFilter: { group: group }, render: { visible: false}},
        constraintOptions = { stiffness: 0.2 },
        cloth = Composites.softBody(580, 229, 5, 5, 5, 5, false, 8, particleOptions, constraintOptions);
        cloth.bodies[0].isStatic = true; cloth.bodies[4].isStatic = true;

    var ground = Bodies.rectangle(395, 600, 815, 50, { isStatic: true }),
    rock = Bodies.circle(170, 450, 25 ),
    anchor = { x: 170, y: 450 },
    elastic = Constraint.create({ 
        pointA: anchor, 
        bodyB: rock, 
        stiffness: 0.02
    });
    rock.restitution = 0.8;
    Matter.Body.setMass(rock,1000);

    World.add(engine.world, [
      cloth,rim,
      Bodies.rectangle(800, 0, 20, 1700, { isStatic: true }),rock,
      ground,elastic
    ]);

    Events.on(engine, 'afterUpdate', function() {
        if (mouseConstraint.mouse.button === -1 && (rock.position.x > 190 || rock.position.y < 430)) {
            rock = Bodies.circle(170, 450,25);
            World.add(engine.world, rock);
            elastic.bodyB = rock;
            rock.restitution = 0.8;
            Matter.Body.setMass(rock,400);
            score++;
        }
    });

    // add mouse control

    var mouse = Mouse.create(render.canvas),
      mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
          stiffness: 0.2,
          render: {
            visible: false
          }
        }
      });


    World.add(engine.world, mouseConstraint,rock);
    render.mouse = mouse;  
    Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: 800, y: 600 }
    });

    Engine.run(engine);
    Render.run(render);
  }

  render() {
    return( 
    <div>
      <div ref="scene">
      <div style={{
        float:'left',
        background:'#04B2D9',
        position:'absolute',
        width:'20vh',
        height:'10vh',
        textAlign:"center",
        paddingTop:'1%',
      }}>
        SCORE: {score}
      </div>
      </div>
    </div>
    )
  }
}

export default Game;
