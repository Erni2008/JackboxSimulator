#!/bin/zsh
# 3 looks per character, all closed (voxel-remeshed) shells: a = crisp natural, b = smooth toon, c = gothic contrast
cd "$(dirname $0)/../../.."; B=/Applications/Blender.app/Contents/MacOS/Blender; PY=/Volumes/WindowsVM/AI_MODELS/triposr/.venv/bin/python
if [ $# -gt 0 ]; then NAMES=($@); else NAMES=(skeleton dracula pumpkin voodoo ghost zombie plague_doctor puppeteer); fi
for v in a b c; do
  case $v in a) R=.011; S=1; G=a; RO=.7;; b) R=.016; S=5; G=b; RO=.85;; c) R=.0095; S=0; G=c; RO=.55;; esac
  P=source_assets/characters3d/prep_$v; O=web/race/chars/$v; mkdir -p $P $O
  PREP=$P REMESH=$R SMOOTH=$S $B -b -P tools/assets/characters3d/prep.py -- $NAMES >/dev/null 2>&1
  PREP=$P GRADE=$G PROJ=0 $PY tools/assets/characters3d/bake.py $PWD $NAMES 2>&1 | grep -c BAKED
  PREP=$P OUT=$O ROUGH=$RO TEXSZ=512 $B -b -P tools/assets/characters3d/rig.py -- $NAMES 2>&1 | grep -c DONE
  echo "variant $v done"
done
