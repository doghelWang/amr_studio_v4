import blackboxprotobuf
import pprint

with open('/Users/wangfeifei/code/amr_studio_v4/backend/templates/CompDesc.model', 'rb') as f:
    msg, _ = blackboxprotobuf.decode_message(f.read())

# Inspect the FIRST module entry which is usually a sensor in this template
# Tag 5 is the module list
entry = msg["5"][0]
pprint.pprint(entry)
