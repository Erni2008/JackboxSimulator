"""Import the supplied gallery frames unchanged; derive tiny illumination maps, not replacement art."""
from pathlib import Path
from shutil import copyfile
from PIL import Image, ImageFilter
root = Path(__file__).resolve().parents[1]
out = root / 'assets/cursed_boxes/backgrounds'
out.mkdir(parents=True, exist_ok=True)
for i in range(1, 4):
    source = root / f'background{i}.png'
    copyfile(source, out / source.name)
    # Remove architectural detail from the lighting signal. Rendering always retains frame 1's geometry.
    light = Image.open(source).convert('RGB').resize((209, 118), Image.Resampling.LANCZOS)
    light.filter(ImageFilter.GaussianBlur(7)).save(out / f'lighting{i}.png')
print('Imported gallery 1/2/3 unchanged and derived 209x118 lighting maps.')
