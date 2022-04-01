import * as PIXI from 'pixi.js'

export type PixiApp = PIXI.Application
export type PixiContainer = PIXI.Container
export type PixiTexture = PIXI.Texture
export type PixiRenderer = PIXI.Renderer
export type PixiSprite = PIXI.Sprite
export type PixiPolygon = PIXI.Polygon

export const { ColorMatrixFilter } = PIXI.filters

export type ClickHandler = (...args: any[]) => void

export function Application(resizeTo: HTMLElement) {

  PIXI.settings.RESOLUTION = window.devicePixelRatio
  PIXI.settings.ROUND_PIXELS = true
  PIXI.settings.FILTER_MULTISAMPLE = PIXI.MSAA_QUALITY.HIGH
  //PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.LINEAR

  let res = new PIXI.Application({
    resizeTo,
    antialias: true
  })

  return res
}


export function Container() {
  return new PIXI.Container()
}

export function Rectangle(x: number, y: number, w: number, h: number) {
  return new PIXI.Rectangle(x, y, w, h)
}

type StrokeOptions = {
  stroke: Color,
  strokeStyle: number
}


export function Line(color: Color, x: number, y: number, x2: number, y2: number) {

  return new PIXI.Graphics().beginFill(color)
  .moveTo(x, y)
  .lineTo(x2, y2)
  .endFill()

}
export function RectangleStroke(color: Color, opts: StrokeOptions, x: number, y: number, w: number, h: number) {
  let res = new PIXI.Graphics()

  res.lineStyle(opts.strokeStyle,opts.stroke)

  res.beginFill(color).drawRect(x, y, w, h).endFill()

  return res
}


export function Polygon(color: Color, path: Array<number>) {
  return new PIXI.Graphics().beginFill(color).drawPolygon(path).endFill()
}

export function GraphicsRectangle(color: Color, x: number, y: number, w: number, h: number) {
  return new PIXI.Graphics().beginFill(color).drawRect(x, y, w, h).endFill()
}

export function GraphicsRectangleStroked(color: Color, x: number, y: number, w: number, h: number) {
  return new PIXI.Graphics().lineStyle(2, color, 1)
  .beginFill(color).drawRect(x, y, w, h).endFill()
}


export function GraphicsRoundedRectangle(color: Color, x: number, y: number, w: number, h: number) {
  return new PIXI.Graphics().beginFill(color).drawRoundedRect(x, y, w, h, 5).endFill()
}

export function SpriteFrom(src: HTMLImageElement) {
  return PIXI.Sprite.from(src)
}

export function TextureFrom(src: HTMLImageElement) {
  let res = PIXI.Texture.from(src)
  res.baseTexture.mipmap = PIXI.MIPMAP_MODES.ON
  return res
}


export function Sprite(texture: PIXI.Texture, x: number, y: number, scale: number = 1) : PIXI.Sprite {
  let res = new PIXI.Sprite(texture)

  res.pivot.set(res.width * 0.5, res.height * 0.5)
  res.x = x
  res.y = y

  return res
}

export type Color = number
