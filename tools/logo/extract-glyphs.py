from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.misc.transform import Transform
import json, os

ROMAN = '/tmp/fonts/Fraunces[SOFT,WONK,opsz,wght].ttf'
ITALIC = '/tmp/fonts/Fraunces-Italic[SOFT,WONK,opsz,wght].ttf'

def inst(path, **axes):
    f = TTFont(path)
    return instancer.instantiateVariableFont(f, axes, inplace=False)

def glyph_data(font, ch):
    cmap = font.getBestCmap()
    gname = cmap[ord(ch)]
    gs = font.getGlyphSet()
    g = gs[gname]
    pen = SVGPathPen(gs, ntos=lambda v: f"{v:.1f}")
    g.draw(pen)
    return {'name': gname, 'adv': g.width, 'd': pen.getCommands()}

upem = 2000
out = {'upem': upem}

# Roman for arc text — 500 weight, display optical size
roman = inst(ROMAN, opsz=48, wght=560, SOFT=0, WONK=0)
out['roman'] = {c: glyph_data(roman, c) for c in 'ALEKOMTPRIJ'}

# Italic A variants for the monogram
for label, axes in {
    'italic_wonk0': dict(opsz=144, wght=500, SOFT=0, WONK=0),
    'italic_wonk1': dict(opsz=144, wght=500, SOFT=0, WONK=1),
    'italic_w600':  dict(opsz=144, wght=600, SOFT=0, WONK=1),
}.items():
    f = inst(ITALIC, **axes)
    out[label] = {'A': glyph_data(f, 'A')}

os.makedirs('/tmp/logo', exist_ok=True)
json.dump(out, open('/tmp/logo/glyphs.json','w'))
print('upem', upem)
for k in ['roman','italic_wonk0','italic_wonk1','italic_w600']:
    sample = out[k].get('A')
    print(k, 'A adv', sample['adv'], 'path len', len(sample['d']))
print('roman advances:', {c: out['roman'][c]['adv'] for c in 'ALEKOMTPRIJ'})
