"""Extract two miniature previews from real renders of the existing crate models; no replacement art."""
from pathlib import Path
from PIL import Image
import json
root=Path(__file__).resolve().parents[1]
frames=root/'generated/cursed-boxes/characters'
output=root/'assets/cursed_boxes/phone'
output.mkdir(exist_ok=True)
def extract(source,cx,cy,target):
    image=Image.open(source);w,h=image.size
    # Exact front face in the calibrated gameplay composition; UI adds its own accessible number.
    image=image.crop((round((cx-.0465)*w),round((cy-.049)*h),round((cx+.0465)*w),round((cy+.049)*h)))
    image.thumbnail((320,224),Image.Resampling.LANCZOS)
    image.save(output/target,optimize=True)
extract(frames/'normal-regression/01-intact.png',.3395,.200,'crate-intact.png')
empty=json.loads((frames/'placement.json').read_text())[8]
extract(frames/'all-eight-with-nicknames.png',empty['x'],empty['y'],'crate-destroyed.png')
