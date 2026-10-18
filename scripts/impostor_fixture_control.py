"""Local-file control of the test-classpath Impostor fixture. Never a production admin API."""
import argparse
import json
import pathlib
import time
import urllib.request
import uuid

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('command', choices=['info', 'players', 'start', 'advance', 'new', 'stop'])
parser.add_argument('--players', nargs='+', help='Exactly 3 or 4 explicit stable player IDs')
parser.add_argument('--millis', type=int, default=10000)
args = parser.parse_args()
directory = pathlib.Path(__file__).resolve().parents[1] / 'server/build/impostor-browser'
ready = json.loads((directory / 'ready.json').read_text())
if args.command == 'info':
    print(f"Controller URL: {ready['url']}\nRoom: {ready['code']}")
elif args.command == 'players':
    with urllib.request.urlopen(f"{ready['url']}/rooms/{ready['code']}", timeout=5) as response:
        room = json.load(response)
    for player in room['players']:
        print(f"{player['id']}  {player['name']}  {player['connectionStatus']}")
else:
    if args.command == 'start' and (not args.players or len(args.players) not in (3, 4) or len(set(args.players)) != len(args.players)):
        parser.error('--players requires exactly 3 or 4 distinct stable IDs from the players command')
    if not 0 <= args.millis <= 60000:
        parser.error('--millis must be between 0 and 60000')
    request_id = uuid.uuid4().hex
    command = {'id': request_id, 'command': 'start-game' if args.command == 'start' else args.command}
    if args.command == 'start':
        command['activeIds'] = args.players
    if args.command == 'advance':
        command['millis'] = args.millis
    temporary = directory / 'control.json.tmp'
    temporary.write_text(json.dumps(command))
    temporary.replace(directory / 'control.json')
    if args.command != 'stop':
        for _ in range(200):
            try:
                if json.loads((directory / 'processed.json').read_text())['id'] == request_id:
                    print('Accepted by local fixture.')
                    break
            except (FileNotFoundError, json.JSONDecodeError):
                pass
            time.sleep(.025)
        else:
            raise SystemExit('Fixture did not acknowledge the command; check its terminal.')
