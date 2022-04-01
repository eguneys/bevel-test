import * as PIXI from 'pixi.js'

export function load_image(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    let res = new Image()
    res.onload = function(e) {
      resolve(res)
    }
    res.onerror = function(e) {
      reject(e)
    }
    res.src = src
  })
}
export function Assets(on_progress?: (progress: number) => void): Promise<AssetMap> {
 if (!on_progress) {
   const splash_loader = new PIXI.Loader()
   splash_loader.add('splash', 'assets/sprites.png')
   return new Promise(resolve =>
                      splash_loader.load((loader, resources) => {
                        resolve(resources)
                      }))
 }
 const loader = PIXI.Loader.shared;


  loader.add('splash', 'assets/sprites.png')

 loader.onProgress.add(() =>  {
   on_progress(loader.progress/100)
 })
 return new Promise(resolve =>
                    loader.load((loader, resources) => resolve(resources)))
}
export type AssetMap = Record<string, any>
