#!/usr/bin/env python3
"""Own the browser watcher and existing Java server; shut down both on Ctrl+C."""
import os,signal,subprocess,sys,time,threading,urllib.request,webbrowser,socket
from pathlib import Path
root=Path(__file__).resolve().parents[2]
os.chdir(root)
port=int(os.environ.get('PORT','8080'))
if not 1<=port<=65535:sys.exit('PORT must be 1..65535')
# Fail before opening any browser or launching a watcher if another process owns this port.
with socket.socket() as probe:
    try:probe.bind(('0.0.0.0',port))
    except OSError:sys.exit(f'Port {port} is in use. Stop the previous server or use PORT={port+1} ./THE_LAST_COMMAND_DEV')
if not (root/'web3d/node_modules').is_dir():subprocess.run(['npm','ci','--prefix','web3d','--no-audit','--no-fund'],check=True)
subprocess.run(['npm','run','build','--prefix','web3d'],check=True)
children=[];stopping=threading.Event()
def stop():
    stopping.set()
    for process in reversed(children):
        try:os.killpg(process.pid,signal.SIGINT)
        except ProcessLookupError:pass
    for process in reversed(children):
        try:process.wait(timeout=8)
        except subprocess.TimeoutExpired:
            try:os.killpg(process.pid,signal.SIGTERM)
            except ProcessLookupError:pass
            try:process.wait(timeout=4)
            except subprocess.TimeoutExpired:os.killpg(process.pid,signal.SIGKILL)
def interrupted(signum,frame):raise KeyboardInterrupt
signal.signal(signal.SIGINT,interrupted);signal.signal(signal.SIGTERM,interrupted)
def open_when_ready(server):
    url=f'http://localhost:{port}/last-command-3d/?autostart=1'
    for _ in range(240):
        if stopping.is_set() or server.poll() is not None:return
        try:
            with urllib.request.urlopen(url,timeout=1) as response:
                if response.status==200:break
        except Exception:stopping.wait(.5)
    else:return
    print('\nTHE_LAST_COMMAND_DEV: '+url,flush=True)
    try:
        with urllib.request.urlopen(f'http://localhost:{port}/last-command-dev/info') as r:
            import json
            for ip in json.load(r)['addresses']:print(f'Wi-Fi: http://{ip}:{port}/last-command-3d/',flush=True)
    except Exception:pass
    if os.environ.get('NO_OPEN')!='1':webbrowser.open(url)
try:
    with open('/tmp/finalanswer-web3d-watch.log','w') as log:
        children.append(subprocess.Popen(['npm','run','watch','--prefix','web3d'],stdout=log,stderr=subprocess.STDOUT,start_new_session=True))
        server=subprocess.Popen(['./gradlew',':server:lastCommandDev',f'-Plc.port={port}','--console=plain','--no-daemon'],start_new_session=True);children.append(server)
        threading.Thread(target=open_when_ready,args=(server,),daemon=True).start()
        code=server.wait()
except KeyboardInterrupt:code=0
finally:stop()
sys.exit(code)
