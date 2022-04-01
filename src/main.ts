import sprites_png from '../assets/sprites.png'

import Input from './input'
import { ticks } from './shared'
import { Assets, AssetMap } from './assets'
import { BevelFilter } from './filters'

import { 
  PixiApp, 
  PixiContainer,
  Application, 
  Container, 
  Sprite } from './pixi'

function load_image(path: string): Promise<HTMLImageElement> {
  return new Promise(resolve => {
    let res = new Image()
    res.onload = () => resolve(res)
    res.src = path
  })
}


type Context = {
  app: PixiApp,
  input: Input,
  assets: AssetMap
}

abstract class IMetro {
  get app(): PixiApp { return this.ctx.app }
	get a(): AssetMap { return this.ctx.assets }

	constructor(readonly ctx: Context) {}

  init(): this {
    this._init()
    return this
  }

  update(dt: number, dt0: number) {
    this._update(dt, dt0)
  }

  draw() {
    this._draw()
  }
  abstract _init(): void;
  abstract _update(dt: number, dt0: number): void;
  abstract _draw(): void;
}


class AllMetro extends IMetro {

  container!: PixiContainer

  data!: any

  filter!: BevelFilter

  _set_data(data: any) {
    this.data = data
    return this
  }

  _init() {
    this.container = Container()

    let res = Sprite(this.a['splash'].texture, 200, 200, 2)
    res.filters = [this.filter = new BevelFilter(this.data)]
    this.container.addChild(res)


    let r2 = Sprite(this.a['splash'].texture, 300, 300, 2)
    r2.filters = [this.filter]
    this.container.addChild(r2)
  }

  _update(dt: number, dt0: number) {
  
    this.filter.uniforms.lightPos[0] = this.data.lightPos.x
    this.filter.uniforms.lightPos[1] = this.data.lightPos.y
    this.filter.uniforms.lightPos[2] = this.data.lightPos.z

    this.filter.uniforms.vertZ = this.data.vPos

    this.filter.uniforms.shininessVal = this.data.shininess
  }

  _draw() {
  }

}

export default function app(element: HTMLElement, props: any) {

  let app = Application(element)
  element.appendChild(app.view)
  let input: Input = new Input()

  app.ticker.autoStart = false

  Assets().then(assets => {

    let ctx: Context = {
      app,
      input,
      assets
    }

    let metro = new AllMetro(ctx)._set_data(props).init()

    app.stage.addChild(metro.container)

    let fixed_dt = 1000/60
    let timestamp0: number | undefined,
      min_dt = fixed_dt,
      max_dt = fixed_dt * 2,
      dt0 = fixed_dt

    let elapsed = 0
    function step(timestamp: number) {

      let dt = timestamp0 ? timestamp - timestamp0 : fixed_dt

      dt = Math.max(min_dt, dt)
      dt = Math.min(max_dt, dt)

      input.update(dt, dt0)

      if (input.btn('z') > 0) {
        metro.init()
      }
      if (input.btn('e') > 0) {
        if (elapsed++ % 24 === 0) {
          metro.update(dt, dt0)
        }
      } else {
        metro.update(dt, dt0)
      }

    metro.draw()
    dt0 = dt 
    requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  })
}

