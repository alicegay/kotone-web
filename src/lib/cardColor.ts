import tinycolor, { ColorInput } from 'tinycolor2'

const cardColor = (color: ColorInput, dark: boolean) => {
  if (dark) {
    const base = tinycolor(color)
    const light = base.lighten((1.0 - base.getLuminance()) * 40)
    const final = light.darken(light.getLuminance() > 0.4 ? 40 : 0)
    return final.toHex8String()
  } else {
    return tinycolor(color).toHex8String().slice(0, 7) + '66'
  }
}

export default cardColor
