import json, sys, urllib.request, urllib.parse, urllib.error
BASE=sys.argv[1].rstrip('/') if len(sys.argv)>1 else 'http://127.0.0.1:8080'
def call(path,data=None,status=200):
    request=urllib.request.Request(BASE+path,data=None if data is None else urllib.parse.urlencode(data).encode())
    try:
        with urllib.request.urlopen(request,timeout=5) as response:
            actual=response.status;body=json.load(response)
    except urllib.error.HTTPError as error:
        actual=error.code;body=json.load(error)
    assert actual==status,(actual,body,status)
    return body
room=call('/rooms',dict(name='Хоррор QA',maxPlayers=2,gameMode='trust_no_one',password='test',code='TEST'),201)
code=room['code'];token=room['token']
assert len(code)==6 and room['gameMode']=='trust_no_one' and room['maxPlayers']==2
assert 'password' not in room and room['host'] and not room['players']
call('/rooms/'+code+'/join',dict(name='Guest',password='wrong'),403)
guest=call('/rooms/'+code+'/join',dict(name='Guest',password='test'))
assert len(guest['players'])==1 and not guest['host']
guest2=call('/rooms/'+code+'/join',dict(name='Guest2',password='test'))
call('/rooms/'+code+'/join',dict(name='Guest3',password='test'),409)
public=call('/rooms/'+code)
assert len(public['players'])==2 and 'token' not in public
call('/rooms/'+code+'/leave',dict(token='wrong'),403)
call('/rooms/'+code+'/leave',dict(token=guest['token']))
call('/rooms/'+code+'/leave',dict(token=guest2['token']))
assert len(call('/rooms/'+code+'/heartbeat',dict(token=token))['players'])==0
other=call('/rooms',dict(name='Collision',maxPlayers=4,gameMode='standard',code=code),201)
assert other['code']!=code
call('/rooms/'+code+'/leave',dict(token=other['token']),403)
call('/rooms/'+other['code']+'/leave',dict(token=other['token']))
call('/rooms',dict(name='Invalid',maxPlayers=99),400)
call('/rooms',dict(name='Invalid',maxPlayers=4,gameMode='missing'),400)
call('/rooms/'+code+'/leave',dict(token=token))
call('/rooms/'+code,status=404)
print('PASS: create/settings, unique codes, password, capacity, joins, heartbeat, private tokens, leave/close, validation')
